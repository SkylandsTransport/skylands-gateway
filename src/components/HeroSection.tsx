import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fuel, Truck } from "lucide-react";
import heroDiesel from "@/assets/hero-diesel.jpg";
import heroTransport from "@/assets/hero-transport.jpg";
import DieselForm from "./hero/DieselForm";
import TransportForm from "./hero/TransportForm";

type View = "main" | "diesel" | "transport";

const HeroSection = () => {
  const [view, setView] = useState<View>("main");
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);

  return (
    <section className="min-h-screen pt-20 relative overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {view === "main" ? (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[calc(100vh-5rem)] flex flex-col"
          >
            {/* Title overlay */}
            <div className="absolute inset-x-0 top-20 z-20 flex flex-col items-center pt-8 pointer-events-none">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center text-balance"
                style={{ lineHeight: "1.1" }}
              >
                Skylands Transport
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-3 text-center max-w-md text-pretty px-4">
                Premium diesel supply and logistics solutions across the region.
              </p>
            </div>

            {/* Split screen */}
            <div className="flex-1 flex flex-col md:flex-row relative">
              {/* LEFT — Diesel */}
              <button
                onClick={() => setView("diesel")}
                onMouseEnter={() => setHovered("left")}
                onMouseLeave={() => setHovered(null)}
                className="relative flex-1 flex items-end justify-center pb-16 md:pb-20 cursor-pointer group overflow-hidden active:scale-[0.99] transition-transform duration-300"
                style={{ minHeight: "50vh" }}
              >
                <img
                  src={heroDiesel}
                  alt="Diesel fuel tanker"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(220 60% 6% / 0.92) 0%, hsl(220 60% 8% / 0.7) 50%, hsl(220 60% 10% / 0.5) 100%)",
                    opacity: hovered === "right" ? 0.95 : hovered === "left" ? 0.6 : 0.78,
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-gold/25 transition-colors duration-300">
                    <Fuel className="w-7 h-7 text-gold" />
                  </div>
                  <span className="text-xl font-semibold text-foreground">Diesel Deliveries</span>
                  <span className="text-xs text-muted-foreground">Click to get a quote</span>
                </div>
              </button>

              {/* Divider */}
              <div className="hidden md:block w-px bg-border/40 relative z-10" />
              <div className="block md:hidden h-px bg-border/40 relative z-10" />

              {/* RIGHT — Transport */}
              <button
                onClick={() => setView("transport")}
                onMouseEnter={() => setHovered("right")}
                onMouseLeave={() => setHovered(null)}
                className="relative flex-1 flex items-end justify-center pb-16 md:pb-20 cursor-pointer group overflow-hidden active:scale-[0.99] transition-transform duration-300"
                style={{ minHeight: "50vh" }}
              >
                <img
                  src={heroTransport}
                  alt="Logistics transport truck"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(220 60% 6% / 0.92) 0%, hsl(220 60% 8% / 0.7) 50%, hsl(220 60% 10% / 0.5) 100%)",
                    opacity: hovered === "left" ? 0.95 : hovered === "right" ? 0.6 : 0.78,
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-gold/25 transition-colors duration-300">
                    <Truck className="w-7 h-7 text-gold" />
                  </div>
                  <span className="text-xl font-semibold text-foreground">Logistics & Transport</span>
                  <span className="text-xs text-muted-foreground">Click to get a quote</span>
                </div>
              </button>
            </div>
          </motion.div>
        ) : view === "diesel" ? (
          <motion.div
            key="diesel"
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative"
          >
            {/* Background */}
            <img src={heroDiesel} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/95 via-navy-dark/88 to-navy-dark/95" />
            <div className="relative z-10 w-full py-12">
              <DieselForm onBack={() => setView("main")} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="transport"
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative"
          >
            <img src={heroTransport} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/95 via-navy-dark/88 to-navy-dark/95" />
            <div className="relative z-10 w-full py-12">
              <TransportForm onBack={() => setView("main")} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
