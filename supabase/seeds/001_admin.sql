-- Grant admin access to the first user after they have signed in at least once.
-- Run this in Dashboard → SQL Editor after your first Google login.
-- Replace YOUR_EMAIL_HERE with your actual email address.

UPDATE public.profiles
SET    is_admin = true
WHERE  id = (
  SELECT id
  FROM   auth.users
  WHERE  email = 'YOUR_EMAIL_HERE'
);
