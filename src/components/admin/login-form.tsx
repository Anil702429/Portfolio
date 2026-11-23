"use client";

import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { FormStatus } from "@/components/ui/form-status";
import { useFormAction } from "@/components/ui/use-form-action";

export function LoginForm() {
  const { state, pending, onSubmit } = useFormAction(signIn);
  return (
    <form method="post" onSubmit={onSubmit} className="mt-6 space-y-5">
      <TextField label="Email" name="email" type="email" autoComplete="username" required errors={state.errors?.email} />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required errors={state.errors?.password} />
      <FormStatus state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
