import type { ActionState } from "@/types";

export function FormStatus({ state }: { state: ActionState }) {
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`font-medium empty:hidden ${state.ok ? "text-accent" : "text-danger"}`}
    >
      {state.message}
    </p>
  );
}
