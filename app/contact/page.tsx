import type { Metadata } from "next";
import { Instagram, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = { title: "Contact", description: "Enquire about photography commissions, collaborations, and licensing." };
export default function ContactPage() { return <div className="page-shell min-h-screen pb-24 pt-36 sm:pt-44"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><Reveal><p className="eyebrow">Get in touch</p><h1 className="display-title mt-5">Let’s create<br/><em className="text-white/45">something true.</em></h1><p className="mt-8 max-w-md text-sm leading-7 text-white/45">For commissions, collaborations, print enquiries, or just to say hello. Share a little about your idea and I’ll reply within two working days.</p><div className="mt-10 space-y-5 text-sm"><a href="mailto:hello@example.com" className="flex items-center gap-4 text-white/65 hover:text-gold"><Mail size={18}/> hello@example.com</a><span className="flex items-center gap-4 text-white/65"><MapPin size={18}/> Available worldwide</span><a href="https://instagram.com" className="flex items-center gap-4 text-white/65 hover:text-gold"><Instagram size={18}/> @lumen.photo</a></div></Reveal><Reveal delay={.12}><ContactForm/></Reveal></div></div>; }
