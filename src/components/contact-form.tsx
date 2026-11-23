"use client";

import { useEffect, useRef } from "react";
import { sendMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { TextArea, TextField } from "@/components/ui/field";
import { FormStatus } from "@/components/ui/form-status";
import { useFormAction } from "@/components/ui/use-form-action";

export function ContactForm() {
  const { state, pending, onSubmit } = useFormAction(sendMessage);
  const form = useRef<HTMLFormElement>(null);
  const startedAt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) form.current?.reset();
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, [state]);

  return (
    <form ref={form} method="post" onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" autoComplete="name" required maxLength={100} errors={state.errors?.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required maxLength={254} errors={state.errors?.email} />
      </div>
      <TextField label="Subject" name="subject" required maxLength={150} errors={state.errors?.subject} />
      <TextArea label="Message" name="message" rows={7} required minLength={10} maxLength={5000} errors={state.errors?.message} />
      {/* Hidden from people; filled in by simple bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
        <FormStatus state={state} />
      </div>
    </form>
  );
}
