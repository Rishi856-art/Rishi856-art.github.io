"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending...");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");

    if (!isSupabaseConfigured()) {
      setStatus("Demo mode: connect Supabase to receive messages.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({ name, email, message });
    if (error) {
      setStatus(error.message);
      return;
    }

    try {
      await fetch("https://formsubmit.co/ajax/rishiexperiments@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New photography inquiry from ${name}`,
          _template: "table",
        }),
      });
      setStatus("Message received. Rishi will get an email notification.");
    } catch {
      setStatus("Message saved. Email notification may need one-time activation.");
    }

    formElement.reset();
  }

  return <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-9"><div className="grid gap-5 sm:grid-cols-2"><label className="text-xs uppercase tracking-[.18em] text-white/50">Your name<input required name="name" className="field mt-2" placeholder="Jane Smith"/></label><label className="text-xs uppercase tracking-[.18em] text-white/50">Email address<input required type="email" name="email" className="field mt-2" placeholder="jane@example.com"/></label></div><label className="mt-5 block text-xs uppercase tracking-[.18em] text-white/50">Tell me about your project<textarea required name="message" rows={7} className="field mt-2 resize-none" placeholder="A few details about what you have in mind..."/></label><div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-xs text-gold">{status}</p><button className="button-primary">Send inquiry <ArrowUpRight size={15}/></button></div></form>;
}
