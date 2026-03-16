
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import TerminalCommand from "@/components/TerminalCommand";

const ContactSection = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast({
        title: "Email not configured",
        description:
          "Email sending is not configured. Please set EmailJS environment variables.",
      });
      return;
    }

    try {
      setIsSending(true);
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      // success
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      // Optionally reset the form
      formRef.current.reset();
    } catch (error: unknown) {
      console.error("Email send error:", error);
      // Try to get a useful message from the unknown error
      let message = "There was a problem sending your message. Please try again later.";
      if (typeof error === "object" && error !== null) {
        const e = error as Record<string, unknown>;
        if ("text" in e && typeof e["text"] === "string") {
          message = e["text"] as string;
        } else if ("message" in e && typeof e["message"] === "string") {
          message = e["message"] as string;
        }
      }

      toast({
        title: "Failed to send message",
        description: message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="px-5 pb-8 pt-4 md:px-8 md:pb-10">
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Direct communication channels for recruitment, collaboration, or system inquiries.
      </p>

      <div className="editorial-divider my-6 opacity-40" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 border-l-2 border-primary/20 pl-6 py-2">
            <h3 className="mb-6 text-xl font-semibold text-primary/90 uppercase tracking-widest glitch-text">09. Channels</h3>
            
            <div className="space-y-6">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Mailto</p>
                <a 
                  href="mailto:moloieric80@gmail.com" 
                  className="flex items-center gap-2 text-primary transition-colors hover:text-cyan-200"
                >
                  <Mail size={16} />
                  <span className="text-sm">moloieric80@gmail.com</span>
                </a>
              </div>
              
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Network</p>
                <div className="flex gap-4 mt-2">
                  <a 
                    href="https://github.com/WyvernPirate" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/phemelo-moloi-12aa41303" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Base Location</p>
                <p className="text-sm text-foreground">Palapye, Botswana / Remote</p>
              </div>

              <div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Status</p>
                <p className="text-sm text-foreground">Listening for opportunities</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-6 text-xl font-semibold text-primary/90 uppercase tracking-widest glitch-text">10. Push Message</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    ident: name
                  </label>
                  <Input 
                    id="name" 
                    name="from_name" 
                    placeholder="Enter identity..." 
                    required 
                    className="h-9 rounded-none border-primary/20 bg-primary/5 focus-visible:ring-primary/40"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    ident: email
                  </label>
                  <Input 
                    id="email" 
                    name="reply_to" 
                    type="email" 
                    placeholder="Enter return path..." 
                    required 
                    className="h-9 rounded-none border-primary/20 bg-primary/5 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ident: subject
                </label>
                <Input 
                  id="subject" 
                  name="subject" 
                  placeholder="Enter message header..." 
                  required 
                  className="h-9 rounded-none border-primary/20 bg-primary/5 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ident: buffer
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Write to buffer..."
                  rows={4}
                  required
                  className="rounded-none border-primary/20 bg-primary/5 focus-visible:ring-primary/40"
                />
              </div>

              <Button type="submit" disabled={isSending} className="w-full rounded-none border border-primary/30 bg-primary/10 font-mono text-primary transition-all hover:bg-primary/20">
                {isSending ? "transmitting..." : "sh ./send_message.sh"}
              </Button>
            </form>
          </div>
      </div>
    </section>
  );
};

export default ContactSection;