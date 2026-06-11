/**
 * config.example.js — template for Supabase credentials.
 *
 * HOW TO USE:
 *   1. Copy this file to config.js in the same directory.
 *   2. Fill in your real project URL and anon key from
 *      Supabase Dashboard → Project Settings → API.
 *   3. config.js is listed in .gitignore and will never be committed.
 *
 * SECURITY NOTE:
 *   The anon key is safe to expose in browser code.
 *   Row Level Security enforces all data access rules.
 *   Never put your service_role key in any frontend file.
 */

var SUPABASE_CONFIG = {
  url:     'https://your-project-id.supabase.co',
  anonKey: 'your-anon-key-here',
};
