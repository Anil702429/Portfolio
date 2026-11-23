-- Row Level Security and access grants.
--
-- The application reads and writes only through server-side Prisma, connecting
-- as the role that owns these tables (owners are not subject to RLS). These
-- rules protect Supabase's auto-generated REST/GraphQL API, which connects as
-- "anon" or "authenticated". Supabase-only roles are checked for existence so
-- the migration also runs on plain PostgreSQL.

ALTER TABLE "SiteSettings" ADD CONSTRAINT "SiteSettings_single_row" CHECK ("id" = 1);

ALTER TABLE "Project"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectImage"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Technology"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SocialLink"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SkillGroup"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Education"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_ProjectToTechnology" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_PostToTag"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Used by the Storage policies in supabase/storage.sql. It lives outside the
-- exposed "public" schema so it cannot be called through the REST API.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;

CREATE OR REPLACE FUNCTION private.is_admin() RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public."AdminUser" WHERE "userId" = auth.uid()
  );
END;
$$;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;

DO $$
DECLARE
  api_role text;
  tbl text;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      CONTINUE;
    END IF;

    -- Start from nothing: no API access unless granted below.
    FOREACH tbl IN ARRAY ARRAY[
      'Project', 'ProjectImage', 'Technology', 'Post', 'Category', 'Tag',
      'ContactMessage', 'SiteSettings', 'SocialLink', 'SkillGroup',
      'Education', 'AdminUser', '_ProjectToTechnology', '_PostToTag'
    ] LOOP
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM %I', tbl, api_role);
    END LOOP;
    IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
      EXECUTE format('REVOKE ALL ON TABLE public._prisma_migrations FROM %I', api_role);
    END IF;

    -- Read-only access to published content.
    EXECUTE format('GRANT SELECT ON public."Project", public."ProjectImage", public."Post" TO %I', api_role);
    EXECUTE format(
      'CREATE POLICY %I ON public."Project" FOR SELECT TO %I USING ("published")',
      'published_read_' || api_role, api_role);
    EXECUTE format(
      'CREATE POLICY %I ON public."ProjectImage" FOR SELECT TO %I USING (EXISTS (SELECT 1 FROM public."Project" p WHERE p."id" = "projectId" AND p."published"))',
      'published_read_' || api_role, api_role);
    EXECUTE format(
      'CREATE POLICY %I ON public."Post" FOR SELECT TO %I USING ("status" = ''PUBLISHED'' AND "publishedAt" <= (now() AT TIME ZONE ''utc''))',
      'published_read_' || api_role, api_role);
  END LOOP;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT USAGE ON SCHEMA private TO authenticated;
    GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
  END IF;
END
$$;
