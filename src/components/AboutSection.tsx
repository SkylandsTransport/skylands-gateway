import { motion } from "framer-motion";
import { Shield, Target, Truck } from "lucide-react";

const pillars = [
  { icon: Target, title: "Precision", desc: "Exact volumes, on-time delivery, every single load." },
  { icon: Shield, title: "Safety", desc: "SABS-compliant fleet, fully insured operations." },
  { icon: Truck, title: "Customer-First", desc: "Dedicated account managers, 24/7 support." },
];

const AboutSection = () => (
  <section id="about" className="py-24 bg-navy-dark relative overflow-hidden">
    <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
          About Skylands
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" style={{ lineHeight: "1.15" }}>
          Powering South Africa's Supply Chain
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty">
          Skylands Transport is a premier logistics and fuel supply partner based in Gauteng. We specialize in reliable bulk diesel delivery and high-efficiency transport solutions across South Africa. Built on the pillars of precision, safety, and customer-first service, we keep your business moving—no matter the load.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors duration-300">
              <p.icon className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-foreground font-semibold text-lg mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
