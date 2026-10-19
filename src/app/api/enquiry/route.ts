import { contact } from "@/lib/content";
import { validateFields, validatePlans, type EnquiryFields } from "@/lib/enquiry";

// Receives the enquiry form (multipart/form-data) and emails it to the
// practice via Resend's REST API. Configure with:
//   RESEND_API_KEY   — required to actually send
//   ENQUIRY_TO       — recipient, defaults to the public contact address
//   ENQUIRY_FROM     — verified sender, e.g. "Build Studio <website@buildstudio.ie>"

function text(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "The form could not be read. Please try again." }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots don't retry.
  if (text(form, "company")) return Response.json({ ok: true, delivered: true });

  const fields: EnquiryFields = {
    name: text(form, "name"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    location: text(form, "location"),
    projectType: text(form, "projectType"),
    message: text(form, "message"),
  };
  const plans = form.getAll("plans").filter((p): p is File => p instanceof File && p.size > 0);

  const fieldErrors = validateFields(fields);
  const plansError = validatePlans(plans);
  if (Object.keys(fieldErrors).length || plansError) {
    return Response.json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: { ...fieldErrors, ...(plansError ? { plans: plansError } : {}) } },
      { status: 422 },
    );
  }

  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone || "—"}`,
    `Location: ${fields.location || "—"}`,
    `Project type: ${fields.projectType}`,
    "",
    "About the project:",
    fields.message,
    "",
    plans.length ? `Plans attached: ${plans.map((p) => p.name).join(", ")}` : "No plans attached.",
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[enquiry] RESEND_API_KEY not set — enquiry logged only:\n" + body);
      return Response.json({ ok: true, delivered: false });
    }
    console.error("[enquiry] RESEND_API_KEY is not configured; enquiry could not be sent.");
    return Response.json(
      { ok: false, error: "Online enquiries are temporarily unavailable." },
      { status: 503 },
    );
  }

  const attachments = await Promise.all(
    plans.map(async (p) => ({ filename: p.name, content: Buffer.from(await p.arrayBuffer()).toString("base64") })),
  );

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM ?? "Build Studio Website <onboarding@resend.dev>",
      to: [process.env.ENQUIRY_TO ?? contact.email],
      reply_to: fields.email,
      subject: `New enquiry: ${fields.projectType} — ${fields.name}`,
      text: body,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] Resend error", res.status, await res.text().catch(() => ""));
    return Response.json({ ok: false, error: "Your enquiry couldn't be sent just now." }, { status: 502 });
  }

  return Response.json({ ok: true, delivered: true });
}
