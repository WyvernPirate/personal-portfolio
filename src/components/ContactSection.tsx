
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin, Mail, Send } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Get In Touch</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full border border-slate-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Contact Information</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a 
                    href="mailto:moloieric80@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <Mail size={18} />
                    moloieric80@gmail.com
                  </a>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Social Profiles</p>
                  <div className="flex gap-4 mt-2">
                    <a 
                      href="https://github.com/WyvernPirate" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Github size={24} />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/phemelo-moloi-12aa41303" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-700">Palapye, Botswana</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Availability</p>
                  <p className="text-gray-700">Open for part-time opportunities and internships</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Send a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input id="subject" placeholder="Subject of your message" required />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Write your message here..." 
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Send Message <Send size={16} className="ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;