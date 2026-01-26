import { useState } from "react";
import { Phone, Mail, MapPin, Send, ArrowRight } from "lucide-react";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <footer id="contact" className="bg-navy-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Contact Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Info */}
          <div className="animate-fade-up-delay-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
              <Send className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">Get In Touch</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Contact <span className="text-gradient-gold">Skylands</span>
            </h2>

            <p className="text-white/60 text-lg mb-10 max-w-md">
              Ready to elevate your logistics? Our team is here to provide tailored solutions for your business needs.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Call Us</p>
                  <p className="text-white font-medium text-lg">+1 (800) SKYLANDS</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Email Us</p>
                  <p className="text-white font-medium text-lg">info@skylandstransport.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Headquarters</p>
                  <p className="text-white font-medium text-lg">1000 Skylands Boulevard, Suite 500</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-up-delay-3">
            <div className="glass-card p-8 lg:p-10 border-2 border-gold/20">
              <h3 className="text-2xl font-bold text-white mb-2">Send us a message</h3>
              <p className="text-white/50 mb-8">We'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/50 text-sm mb-2 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="input-premium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-sm mb-2 font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="input-premium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your transport needs..."
                    rows={4}
                    className="input-premium resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full flex items-center justify-center gap-3"
                >
                  Submit Inquiry
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                <span className="text-navy-dark font-bold text-lg">S</span>
              </div>
              <div>
                <span className="text-gradient-gold font-bold text-xl tracking-tight">
                  Skylands
                </span>
                <span className="text-white/90 font-light text-xl tracking-tight ml-1">
                  Transport
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-white/50">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gold transition-colors">Careers</a>
            </div>

            {/* Copyright */}
            <p className="text-white/30 text-sm">
              © 2026 Skylands Transport. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
