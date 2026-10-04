"use client";
import { useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { personalInfo } from "@/lib/data";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const inFlight = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") || "").trim(),
      email: String(values.get("email") || "").trim(),
      subject: String(values.get("subject") || "").trim(),
      message: String(values.get("message") || "").trim(),
    };
    for (const [field, value] of Object.entries(payload)) {
      if (!value || (field === "message" && value.length < 10)) {
        const input = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
        input.setCustomValidity(field === "message" ? "Please write at least 10 characters of detail." : "Please fill in this field.");
        input.reportValidity();
        return;
      }
    }
    inFlight.current = true;
    setStatus("sending");
    try {
      await emailjs.send(
        "service_7pokdov",
        "template_hqcc2nl",
        payload,
        "-EzTsK1V2Dw-MkNfS",
      );
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      onInput={(event) => {
        const input = event.target;
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.setCustomValidity("");
      }}
      aria-busy={status === "sending"}
    >
      <div className="form-row">
        <label htmlFor="contact-name">
          Your name
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="How should I call you?"
            required
            maxLength={100}
            disabled={status === "sending"}
          />
        </label>
        <label htmlFor="contact-email">
          Email address
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            maxLength={254}
            disabled={status === "sending"}
          />
        </label>
      </div>
      <label htmlFor="contact-subject">
        What are you thinking?
        <input
          id="contact-subject"
          name="subject"
          placeholder="A project, a role, an idea…"
          required
          maxLength={200}
          disabled={status === "sending"}
        />
      </label>
      <label htmlFor="contact-message">
        Tell me a little more
        <textarea
          id="contact-message"
          name="message"
          placeholder="The details, the ambition, the possibilities."
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          disabled={status === "sending"}
        />
      </label>
      <div className="form-bottom">
        <p className="form-status" role="status" aria-live="polite">
          {status === "success" ? (
            "Message sent. Thank you for reaching out!"
          ) : status === "error" ? (
            <>
              Couldn’t send your message. Try again or{" "}
              <a href={`mailto:${personalInfo.email}`}>email me directly</a>.
            </>
          ) : (
            "Your next idea starts with a hello."
          )}
        </p>
        <button
          className="button button-primary"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              Sending <LoaderCircle className="sending-icon" size={18} />
            </>
          ) : status === "success" ? (
            <>
              Send another <Check size={18} />
            </>
          ) : (
            <>
              Send message <ArrowUpRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
