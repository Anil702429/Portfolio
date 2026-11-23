"use client";

import { saveSettings } from "@/actions/settings";
import { MediaField } from "@/components/admin/media-field";
import { Button } from "@/components/ui/button";
import { TextArea, TextField } from "@/components/ui/field";
import { FormStatus } from "@/components/ui/form-status";
import { useFormAction } from "@/components/ui/use-form-action";
import type { SiteSettings } from "@/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { state, pending, onSubmit } = useFormAction(saveSettings);
  const errors = state.errors;
  const group = "space-y-6 border-t border-line pt-8";
  return (
    <form method="post" onSubmit={onSubmit} className="space-y-10">
      <section className={group}>
        <h2 className="text-xl font-bold">Identity</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Name" name="name" required maxLength={80} defaultValue={settings.name} errors={errors?.name} />
          <TextField label="Professional title" name="professionalTitle" required maxLength={120} defaultValue={settings.professionalTitle} errors={errors?.professionalTitle} />
          <TextField label="Location" name="location" maxLength={80} defaultValue={settings.location} errors={errors?.location} />
          <TextField label="Availability" name="availability" maxLength={160} defaultValue={settings.availability} errors={errors?.availability} />
        </div>
        <TextArea label="Introduction" name="introduction" required maxLength={500} defaultValue={settings.introduction} errors={errors?.introduction} />
        <TextArea label="About (Markdown)" name="about" rows={9} maxLength={6000} defaultValue={settings.about} hint="The first paragraph is shown on the home page." errors={errors?.about} />
        <MediaField label="Profile image" name="profileImage" bucket="profile" defaultValue={settings.profileImage} errors={errors?.profileImage} />
      </section>

      <section className={group}>
        <h2 className="text-xl font-bold">Contact and links</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Email address" name="email" type="email" defaultValue={settings.email ?? ""} errors={errors?.email} />
          <TextField label="GitHub URL" name="githubUrl" type="url" defaultValue={settings.githubUrl ?? ""} errors={errors?.githubUrl} />
          <TextField label="LinkedIn URL" name="linkedinUrl" type="url" defaultValue={settings.linkedinUrl ?? ""} errors={errors?.linkedinUrl} />
        </div>
        <TextArea
          label="Social links"
          name="socialLinks"
          defaultValue={settings.socialLinks.map((link) => `${link.label} | ${link.url}`).join("\n")}
          hint="One per line, as: Label | https://…"
          errors={errors?.socialLinks}
        />
        <MediaField label="Resume" name="resumeUrl" bucket="resume" defaultValue={settings.resumeUrl} errors={errors?.resumeUrl} allowUrl />
      </section>

      <section className={group}>
        <h2 className="text-xl font-bold">Skills and education</h2>
        <TextArea
          label="Skills"
          name="skillGroups"
          rows={6}
          defaultValue={settings.skillGroups.map((item) => `${item.name}: ${item.skills.join(", ")}`).join("\n")}
          hint="One group per line, as: Backend: Python, Django"
          errors={errors?.skillGroups}
        />
        <TextArea
          label="Education"
          name="education"
          defaultValue={settings.education.map((item) => [item.title, item.institution, item.period].join(" | ")).join("\n")}
          hint="One per line, as: Title | Institution | Period"
          errors={errors?.education}
        />
      </section>

      <section className={group}>
        <h2 className="text-xl font-bold">Home page code excerpt</h2>
        <TextArea label="Python code" name="heroSnippet" rows={12} maxLength={3000} className="font-mono text-sm" defaultValue={settings.heroSnippet} errors={errors?.heroSnippet} />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Caption" name="heroSnippetLabel" maxLength={120} defaultValue={settings.heroSnippetLabel} errors={errors?.heroSnippetLabel} />
          <TextField label="Source URL" name="heroSnippetUrl" type="url" defaultValue={settings.heroSnippetUrl ?? ""} errors={errors?.heroSnippetUrl} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
        <FormStatus state={state} />
      </div>
    </form>
  );
}
