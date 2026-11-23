import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <>
      <PageHeader title="Page not found">
        <p>The page may have moved, or the address may be mistyped.</p>
      </PageHeader>
      <div className="container-page flex flex-wrap gap-3 py-14">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/projects" variant="outline">
          See projects
        </ButtonLink>
      </div>
    </>
  );
}
