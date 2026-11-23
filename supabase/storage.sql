-- Run once in the Supabase SQL editor, after "npm run db:deploy".
-- Creates the buckets and allows writes by administrators only.
-- Public buckets serve files by URL; no SELECT policy is needed for that.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('project-images', 'project-images', true, 4194304, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('post-covers',    'post-covers',    true, 4194304, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('profile',        'profile',        true, 4194304, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('resume',         'resume',         true, 4194304, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS portfolio_admin_insert ON storage.objects;
DROP POLICY IF EXISTS portfolio_admin_select ON storage.objects;
DROP POLICY IF EXISTS portfolio_admin_delete ON storage.objects;

CREATE POLICY portfolio_admin_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('project-images','post-covers','profile','resume') AND (SELECT private.is_admin()));

-- Storage needs SELECT to look an object up before deleting it.
CREATE POLICY portfolio_admin_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('project-images','post-covers','profile','resume') AND (SELECT private.is_admin()));

CREATE POLICY portfolio_admin_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('project-images','post-covers','profile','resume') AND (SELECT private.is_admin()));
