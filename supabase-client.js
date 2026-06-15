'use strict';

/**
 * supabase-client.js — single point of contact with Supabase.
 *
 * window.supabaseReady  Promise<client|null>  resolves once init is done
 * window.SupabaseClient object                 the client (set when ready)
 *
 * Offline-first: every exported function silently returns null when
 * called without an authenticated user, or when Supabase is not configured.
 * Every network call is wrapped in try/catch — errors log to console
 * and never throw, never break the UI.
 *
 * Load order in HTML (before the inline page script):
 *   <script src="config.js"></script>
 *   <script src="supabase-client.js"></script>
 */
window.supabaseReady = (async function () {
  /* ── Config guard ── */
  var cfg = window.SUPABASE_CONFIG;
  if (!cfg || !cfg.url || !cfg.anonKey ||
      cfg.url.includes('your-project') || cfg.anonKey.includes('your-anon-key')) {
    console.info('[supabase-client] No credentials configured — running in offline mode.');
    return null;
  }

  /* ── Load Supabase JS via ESM CDN ── */
  var supabase;
  try {
    var mod = await import('https://esm.sh/@supabase/supabase-js@2');
    supabase = mod.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  } catch (err) {
    console.warn('[supabase-client] Failed to load Supabase library:', err);
    return null;
  }

  /* ── Internal helpers ── */

  function _warn(fn, err) {
    console.warn('[supabase-client] ' + fn + ':', err && err.message ? err.message : err);
  }

  function _stableStringify(val) {
    if (Array.isArray(val)) {
      return '[' + val.map(_stableStringify).join(',') + ']';
    }
    if (val !== null && typeof val === 'object') {
      return '{' + Object.keys(val).sort().map(function (k) {
        return JSON.stringify(k) + ':' + _stableStringify(val[k]);
      }).join(',') + '}';
    }
    return JSON.stringify(val);
  }

  /* ── Auth state cache (synchronous read) ── */
  var _currentUser = null;

  /* ── Auth ── */

  async function getUser() {
    try {
      var res = await supabase.auth.getUser();
      if (res.error) {
        /* AuthSessionMissingError is expected when not logged in — not a real error */
        if (res.error.name !== 'AuthSessionMissingError') _warn('getUser', res.error);
        _currentUser = null;
        return null;
      }
      _currentUser = res.data.user;
      return _currentUser;
    } catch (err) { _warn('getUser', err); _currentUser = null; return null; }
  }

  async function loginWithGoogle() {
    try {
      var res = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href },
      });
      if (res.error) throw res.error;
    } catch (err) { _warn('loginWithGoogle', err); }
  }

  async function logout() {
    try {
      var res = await supabase.auth.signOut();
      if (res.error) throw res.error;
    } catch (err) { _warn('logout', err); }
  }

  function onAuthChange(cb) {
    supabase.auth.onAuthStateChange(function (event, session) {
      _currentUser = session ? session.user : null;
      cb(event, _currentUser);
    });
  }

  function isLoggedIn() {
    return _currentUser !== null;
  }

  /* Seed _currentUser on load so isLoggedIn() works synchronously after init */
  getUser();

  /* ── Crypto ── */

  async function hashQuestion(obj) {
    try {
      var text = _stableStringify(obj);
      var buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    } catch (err) { _warn('hashQuestion', err); return null; }
  }

  /* ── Progress ── */

  async function loadProgress() {
    try {
      var user = await getUser();
      if (!user) return null;
      var res = await supabase
        .from('progress')
        .select('content_hash, correct_ids, failed_ids, updated_at')
        .eq('user_id', user.id);
      if (res.error) throw res.error;
      return res.data;
    } catch (err) { _warn('loadProgress', err); return null; }
  }

  async function deleteProgress() {
    try {
      var user = await getUser();
      if (!user) return null;
      var res = await supabase.from('progress').delete().eq('user_id', user.id);
      if (res.error) throw res.error;
      return true;
    } catch (err) { _warn('deleteProgress', err); return null; }
  }

  async function syncProgress(contentHash, payload) {
    try {
      var user = await getUser();
      if (!user) return null;
      var res = await supabase
        .from('progress')
        .upsert({
          user_id:      user.id,
          content_hash: contentHash,
          correct_ids:  payload.correctIds,
          failed_ids:   payload.failedIds,
          updated_at:   new Date().toISOString(),
        }, { onConflict: 'user_id,content_hash' })
        .select();
      if (res.error) throw res.error;
      return res.data;
    } catch (err) { _warn('syncProgress', err); return null; }
  }

  /* ── Sessions ── */

  async function startSession(unitId) {
    try {
      var user = await getUser();
      if (!user) return null;
      var res = await supabase
        .from('sessions')
        .insert({ user_id: user.id, unit_id: unitId, started_at: new Date().toISOString() })
        .select('id')
        .single();
      if (res.error) throw res.error;
      return res.data.id;
    } catch (err) { _warn('startSession', err); return null; }
  }

  async function endSession(sessionId) {
    try {
      if (!sessionId) return;
      var res = await supabase
        .from('sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId);
      if (res.error) throw res.error;
    } catch (err) { _warn('endSession', err); }
  }

  /* ── Answers ── */

  async function saveAnswer(sessionId, payload) {
    try {
      if (!sessionId) return;
      var user = await getUser();
      if (!user) return;
      var res = await supabase.from('answers').insert({
        session_id:    sessionId,
        user_id:       user.id,
        question_id:   payload.questionId,
        chosen_option: payload.chosenOption,
        is_correct:    payload.isCorrect,
        answered_at:   new Date().toISOString(),
      });
      if (res.error) throw res.error;
    } catch (err) { _warn('saveAnswer', err); }
  }

  /* ── Question versions ── */

  async function upsertQuestionVersion(questionObj, unitId) {
    try {
      var user = await getUser();
      if (!user) return null;
      var hash = await hashQuestion(questionObj);
      if (!hash) return null;
      var res = await supabase
        .from('question_versions')
        .upsert({
          content_hash: hash,
          question_id:  questionObj.id || null,
          unit_id:      unitId,
          snapshot:     questionObj,
        }, { onConflict: 'content_hash' });
      if (res.error) throw res.error;
      return hash;
    } catch (err) { _warn('upsertQuestionVersion', err); return null; }
  }

  /* ── Admin ── */

  async function checkIsAdmin() {
    try {
      var user = await getUser();
      if (!user) return false;
      var res = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      if (res.error) throw res.error;
      return res.data && res.data.is_admin === true;
    } catch (err) { _warn('checkIsAdmin', err); return false; }
  }

  async function getAdminStats() {
    try {
      var user = await getUser();
      if (!user) return null;
      var weekAgo  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString();
      var monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      var results = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo),
        supabase.from('sessions').select('*', { count: 'exact', head: true }),
        supabase.from('answers').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('display_name, email, created_at').order('created_at', { ascending: false }).limit(15),
      ]);
      return {
        totalUsers:    results[0].count  || 0,
        newUsers7d:    results[1].count  || 0,
        newUsers30d:   results[2].count  || 0,
        totalSessions: results[3].count  || 0,
        totalAnswers:  results[4].count  || 0,
        recentUsers:   results[5].data   || [],
      };
    } catch (err) { _warn('getAdminStats', err); return null; }
  }

  async function getAdminSessions() {
    try {
      var user = await getUser();
      if (!user) return null;
      var sessRes = await supabase
        .from('sessions')
        .select('id, unit_id, started_at, ended_at, user_id')
        .order('started_at', { ascending: false })
        .limit(25);
      if (sessRes.error) throw sessRes.error;
      var sessions = sessRes.data || [];

      var userIds = sessions
        .map(function (s) { return s.user_id; })
        .filter(function (id, i, arr) { return arr.indexOf(id) === i; });

      if (userIds.length > 0) {
        var profRes = await supabase.from('profiles').select('id, display_name, email').in('id', userIds);
        var profiles = {};
        (profRes.data || []).forEach(function (p) { profiles[p.id] = p; });
        sessions.forEach(function (s) { s._profile = profiles[s.user_id] || null; });
      }
      return sessions;
    } catch (err) { _warn('getAdminSessions', err); return null; }
  }

  async function getHardestQuestions() {
    try {
      var res = await supabase
        .from('question_stats')
        .select('question_id, difficulty, total_answers, correct_answers')
        .not('difficulty', 'is', null)
        .gte('total_answers', 2)
        .order('difficulty', { ascending: false })
        .limit(15);
      if (res.error) throw res.error;
      return res.data || [];
    } catch (err) { _warn('getHardestQuestions', err); return null; }
  }

  /* ── Export ── */

  var client = {
    loginWithGoogle:       loginWithGoogle,
    logout:                logout,
    getUser:               getUser,
    onAuthChange:          onAuthChange,
    isLoggedIn:            isLoggedIn,
    loadProgress:          loadProgress,
    syncProgress:          syncProgress,
    deleteProgress:        deleteProgress,
    startSession:          startSession,
    endSession:            endSession,
    saveAnswer:            saveAnswer,
    upsertQuestionVersion: upsertQuestionVersion,
    hashQuestion:          hashQuestion,
    checkIsAdmin:          checkIsAdmin,
    getAdminStats:         getAdminStats,
    getAdminSessions:      getAdminSessions,
    getHardestQuestions:   getHardestQuestions,
  };

  window.SupabaseClient = client;
  return client;
})();
