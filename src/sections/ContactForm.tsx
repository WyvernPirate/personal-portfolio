import { useRef, useState } from "react";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

const COOLDOWN_MS = 60_000;
const MIN_FILL_MS = 3_000;
const COOLDOWN_KEY = "contact:last-sent";

const readLastSent = () => {
  try {
    return Number(localStorage.getItem(COOLDOWN_KEY) || 0);
  } catch {
    return 0;
  }
};

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || status.kind === "sending") return;

    const data = new FormData(form);

    // Honeypot: real people never see or fill this field. Pretend it worked.
    if (String(data.get("website") || "").trim() !== "") {
      setStatus({ kind: "ok", message: "Message sent. I will reply soon." });
      form.reset();
      return;
    }

    if (Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus({ kind: "error", message: "That was quick. Check your message and send it again." });
      return;
    }

    const wait = COOLDOWN_MS - (Date.now() - readLastSent());
    if (wait > 0) {
      setStatus({ kind: "error", message: `You just sent a message. Try again in ${Math.ceil(wait / 1000)} seconds.` });
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setStatus({ kind: "error", message: "The form is offline right now. Email me directly instead." });
      return;
    }

    // Validation and the mail client load only when someone actually sends a message.
    const [{ z }, { default: emailjs }] = await Promise.all([import("zod"), import("@emailjs/browser")]);
    const parsed = z
      .object({
        from_name: z.string().trim().min(1, "Enter your name.").max(80, "Name is too long."),
        reply_to: z.string().trim().email("Enter a valid email address.").max(120),
        subject: z.string().trim().min(1, "Enter a subject.").max(120, "Subject is too long."),
        message: z.string().trim().min(10, "Write at least a sentence.").max(3000, "Message is too long."),
      })
      .safeParse(Object.fromEntries(data));

    if (!parsed.success) {
      setStatus({ kind: "error", message: parsed.error.issues[0].message });
      return;
    }

    try {
      setStatus({ kind: "sending" });
      await emailjs.send(serviceId, templateId, parsed.data, { publicKey });
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        /* storage unavailable; cooldown simply won't persist */
      }
      setStatus({ kind: "ok", message: "Message sent. I will reply soon." });
      form.reset();
      openedAt.current = Date.now();
    } catch {
      // Provider errors can leak account details, so never show them.
      setStatus({ kind: "error", message: "Your message did not send. Try again, or email me directly." });
    }
  };

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <label>
          <span>Name</span>
          <input name="from_name" autoComplete="name" required maxLength={80} />
        </label>
        <label>
          <span>Email</span>
          <input name="reply_to" type="email" autoComplete="email" required maxLength={120} />
        </label>
      </div>
      <label>
        <span>Subject</span>
        <input name="subject" required maxLength={120} />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={3} required maxLength={3000} />
      </label>
      {/* Honeypot, hidden from people and assistive tech */}
      <div className="hp" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-foot">
        <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="form-status" role="status" data-kind={status.kind}>
          {status.message}
        </p>
      </div>
    </form>
  );
}
