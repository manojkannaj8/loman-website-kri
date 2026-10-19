"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from "react";
import { contact, contactSection, projectTypes } from "@/lib/content";
import {
  PLAN_LIMITS,
  formatBytes,
  validateFields,
  validatePlans,
  type EnquiryFields,
  type FieldErrors,
} from "@/lib/enquiry";
import { ButtonArrow, buttonClass } from "./button";
import { ArrowRight, Check, Close, FileDoc, Upload } from "./icons";
import { EASE } from "./motion";
import { ENQUIRY_FIRST_FIELD, ENQUIRY_ID } from "./start-project-link";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; delivered: boolean } | { kind: "error"; message: string };

const empty: EnquiryFields = { name: "", email: "", phone: "", location: "", projectType: "", message: "" };

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <label htmlFor={id} className="label flex items-center gap-1 text-muted">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-timber">*</span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[0.8rem] text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-[0.85rem] text-timber">{error}</p>
      ) : null}
    </div>
  );
}

const inputClass =
  "h-12 w-full border border-line-strong bg-paper px-4 text-[1rem] text-ink placeholder:text-muted/70 transition-colors duration-200 hover:border-ink focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 aria-[invalid=true]:border-timber";

export function EnquiryForm() {
  const uid = useId();
  const [fields, setFields] = useState<EnquiryFields>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryFields, boolean>>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const id = (name: string) => (name === "name" ? ENQUIRY_FIRST_FIELD : `${uid}-${name}`);

  function update(name: keyof EnquiryFields) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...fields, [name]: e.target.value };
      setFields(next);
      if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateFields(next)[name] }));
    };
  }

  function blur(name: keyof EnquiryFields) {
    return () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((prev) => ({ ...prev, [name]: validateFields(fields)[name] }));
    };
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const merged = [...files];
    for (const f of Array.from(list)) {
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
    }
    const problem = validatePlans(merged);
    setErrors((prev) => ({ ...prev, plans: problem }));
    if (!problem) setFiles(merged);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setErrors((prev) => ({ ...prev, plans: validatePlans(next) }));
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = validateFields(fields);
    const plansError = validatePlans(files);
    const all = { ...fieldErrors, ...(plansError ? { plans: plansError } : {}) };
    setErrors(all);
    setTouched({ name: true, email: true, phone: true, location: true, projectType: true, message: true });
    const firstInvalid = (Object.keys(all) as (keyof FieldErrors)[]).find((k) => all[k]);
    if (firstInvalid) {
      const target = firstInvalid === "plans" ? `${uid}-plans` : id(firstInvalid);
      document.getElementById(target)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const body = new FormData(formRef.current!);
    body.delete("plans");
    files.forEach((f) => body.append("plans", f));

    try {
      const res = await fetch("/api/enquiry", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; delivered?: boolean; error?: string; fieldErrors?: FieldErrors };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent", delivered: data.delivered !== false });
        setFields(empty);
        setFiles([]);
        setTouched({});
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setStatus({ kind: "error", message: data.error ?? "Something went wrong sending your enquiry." });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  }

  const mailtoFallback = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Project enquiry${fields.name ? ` from ${fields.name}` : ""}`,
  )}&body=${encodeURIComponent(
    [
      fields.projectType && `Project type: ${fields.projectType}`,
      fields.location && `Location: ${fields.location}`,
      fields.phone && `Phone: ${fields.phone}`,
      "",
      fields.message,
    ]
      .filter((l) => l !== "" && l !== undefined)
      .join("\n"),
  )}`;

  const describedBy = (name: keyof FieldErrors, hint = false) =>
    errors[name] ? `${id(name)}-error` : hint ? `${id(name)}-hint` : undefined;

  return (
    <div id={ENQUIRY_ID} className="scroll-mt-[calc(var(--header-h)+1rem)] bg-paper shadow-[0_30px_60px_-30px_rgb(29_26_23/0.35)]">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-8">
        <span className="h-px w-8 bg-timber" aria-hidden="true" />
        <p className="label text-timber">{contactSection.formEyebrow}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status.kind === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid gap-6 p-6 sm:p-10"
            role="status"
          >
            <span className="grid h-14 w-14 place-items-center bg-dusk text-glow">
              <Check size={26} />
            </span>
            <h3 className="font-display text-[2rem] font-medium leading-tight">Thanks, your enquiry is in.</h3>
            <p className="max-w-[46ch] leading-relaxed text-muted">
              {status.delivered
                ? "Loman will be in touch. If it's urgent, call or WhatsApp on " + contact.phoneDisplay + "."
                : "This preview isn't connected to email yet, so the enquiry was only logged on the server. Please also email " +
                  contact.email +
                  "."}
            </p>
            <button type="button" onClick={() => setStatus({ kind: "idle" })} className={buttonClass("outline", "w-fit")}>
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 p-5 sm:p-8"
            aria-labelledby={`${uid}-title`}
          >
            <div>
              <h3 id={`${uid}-title`} className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium leading-tight">
                {contactSection.formHeading}
              </h3>
              <p className="mt-2 text-muted">{contactSection.formIntro}</p>
            </div>

            {/* Honeypot: hidden from people, tempting to bots. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id={id("name")} label="Name" required error={errors.name}>
                <input
                  id={id("name")}
                  name="name"
                  autoComplete="name"
                  className={inputClass}
                  value={fields.name}
                  onChange={update("name")}
                  onBlur={blur("name")}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy("name")}
                />
              </Field>
              <Field id={id("email")} label="Email" required error={errors.email}>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  className={inputClass}
                  value={fields.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy("email")}
                />
              </Field>
              <Field id={id("phone")} label="Phone" error={errors.phone}>
                <input
                  id={id("phone")}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputClass}
                  value={fields.phone}
                  onChange={update("phone")}
                  onBlur={blur("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy("phone")}
                />
              </Field>
              <Field id={id("location")} label="Location" error={errors.location}>
                <input
                  id={id("location")}
                  name="location"
                  autoComplete="address-level2"
                  placeholder="e.g. Enfield"
                  className={inputClass}
                  value={fields.location}
                  onChange={update("location")}
                  onBlur={blur("location")}
                  aria-invalid={!!errors.location}
                  aria-describedby={describedBy("location")}
                />
              </Field>
              <Field id={id("projectType")} label="Project type" required error={errors.projectType} className="sm:col-span-2">
                <div className="relative">
                  <select
                    id={id("projectType")}
                    name="projectType"
                    className={`${inputClass} cursor-pointer pr-10 ${fields.projectType ? "" : "text-muted"}`}
                    value={fields.projectType}
                    onChange={update("projectType")}
                    onBlur={blur("projectType")}
                    aria-required="true"
                    aria-invalid={!!errors.projectType}
                    aria-describedby={describedBy("projectType")}
                  >
                    <option value="" disabled>
                      Choose one
                    </option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="text-ink">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ArrowRight size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-muted" />
                </div>
              </Field>
              <Field id={id("message")} label="About the project" required error={errors.message} className="sm:col-span-2">
                <textarea
                  id={id("message")}
                  name="message"
                  rows={5}
                  className={`${inputClass} h-auto resize-y py-3 leading-relaxed`}
                  value={fields.message}
                  onChange={update("message")}
                  onBlur={blur("message")}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={describedBy("message")}
                />
              </Field>
            </div>

            <div className="grid gap-3">
              <p id={`${uid}-plans-label`} className="label text-muted">
                Plans <span className="normal-case tracking-normal">(optional)</span>
              </p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`relative grid place-items-center gap-2 border border-dashed px-6 py-8 text-center transition-colors duration-300 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-timber ${
                  dragging ? "border-timber bg-timber/5" : errors.plans ? "border-timber" : "border-line-strong hover:border-ink"
                }`}
              >
                <Upload size={22} className={dragging ? "text-timber" : "text-muted"} />
                <p className="text-[0.95rem]">
                  <span className="font-medium">Drag &amp; drop your plans here</span> or{" "}
                  <label htmlFor={`${uid}-plans`} className="cursor-pointer text-timber underline underline-offset-4">
                    browse files
                  </label>
                </p>
                <p className="label text-muted">
                  PDF only · up to {PLAN_LIMITS.maxFiles} files · max 20 MB each
                </p>
                <input
                  ref={fileInput}
                  id={`${uid}-plans`}
                  type="file"
                  name="plans"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={(e) => addFiles(e.target.files)}
                  aria-describedby={errors.plans ? `${uid}-plans-error` : undefined}
                  aria-labelledby={`${uid}-plans-label`}
                  className="sr-only"
                />
              </div>
              {errors.plans ? (
                <p id={`${uid}-plans-error`} className="text-[0.85rem] text-timber" role="alert">
                  {errors.plans}
                </p>
              ) : null}
              {files.length ? (
                <ul className="grid gap-2" aria-label="Attached plans">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${f.size}`} className="flex items-center gap-3 border border-line px-3 py-2 text-[0.9rem]">
                      <FileDoc size={18} className="shrink-0 text-timber" />
                      <span className="min-w-0 flex-1 truncate">{f.name}</span>
                      <span className="text-[0.8rem] tabular-nums text-muted">{formatBytes(f.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="grid h-8 w-8 place-items-center text-muted hover:text-ink"
                        aria-label={`Remove ${f.name}`}
                      >
                        <Close size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div aria-live="polite" className="empty:hidden">
              {status.kind === "error" ? (
                <div className="grid gap-2 border-l-2 border-timber bg-timber/5 px-4 py-3 text-[0.95rem]" role="alert">
                  <p>{status.message}</p>
                  <p className="text-muted">
                    You can also{" "}
                    <a href={mailtoFallback} className="text-timber underline underline-offset-4">
                      email {contact.email}
                    </a>{" "}
                    or{" "}
                    <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-timber underline underline-offset-4">
                      message on WhatsApp
                    </a>
                    .
                  </p>
                </div>
              ) : null}
            </div>

            <button type="submit" disabled={status.kind === "sending"} className={buttonClass("solid", "h-14 w-full disabled:cursor-progress disabled:opacity-70")}>
              {status.kind === "sending" ? (
                <>
                  <span className="h-3 w-3 animate-spin border border-paper border-t-transparent" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  Send enquiry
                  <ButtonArrow>
                    <ArrowRight size={16} />
                  </ButtonArrow>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
