import type { ComponentProps } from "react";

const control =
  "w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-base text-text aria-invalid:border-danger";

type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  errors?: string[];
};

function FieldShell({
  label,
  name,
  hint,
  errors,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-medium">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-soft">
          {hint}
        </p>
      ) : null}
      {errors?.length ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}

const described = (name: string, hint?: string, errors?: string[]) => ({
  id: name,
  name,
  "aria-invalid": errors?.length ? true : undefined,
  "aria-describedby":
    [errors?.length ? `${name}-error` : "", hint ? `${name}-hint` : ""].filter(Boolean).join(" ") ||
    undefined,
});

export function TextField({
  label,
  name,
  hint,
  errors,
  className = "",
  ...props
}: FieldProps & ComponentProps<"input">) {
  return (
    <FieldShell label={label} name={name} hint={hint} errors={errors}>
      <input className={`${control} ${className}`} {...described(name, hint, errors)} {...props} />
    </FieldShell>
  );
}

export function TextArea({
  label,
  name,
  hint,
  errors,
  className = "",
  ...props
}: FieldProps & ComponentProps<"textarea">) {
  return (
    <FieldShell label={label} name={name} hint={hint} errors={errors}>
      <textarea
        rows={4}
        className={`${control} ${className}`}
        {...described(name, hint, errors)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  hint,
  errors,
  children,
  ...props
}: FieldProps & ComponentProps<"select">) {
  return (
    <FieldShell label={label} name={name} hint={hint} errors={errors}>
      <select className={`${control} min-h-12`} {...described(name, hint, errors)} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}

export function Checkbox({
  label,
  name,
  ...props
}: { label: string; name: string } & ComponentProps<"input">) {
  return (
    <label className="flex min-h-11 items-center gap-3 font-medium">
      <input type="checkbox" name={name} className="size-5 accent-cobalt" {...props} />
      {label}
    </label>
  );
}
