import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fuel, Truck, ChevronRight } from "lucide-react";
import heroDiesel from "@/assets/hero-diesel.jpg";
import heroTransport from "@/assets/hero-transport.jpg";
import DieselForm from "./hero/DieselForm";
import TransportForm from "./hero/TransportForm";

type View = "main" | "diesel" | "transport";

/* ── animation helpers ── */
const panelLeft = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const panelRight = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

const springy = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

const takeoverFromLeft = {
  initial: { clipPath: "inset(0 50% 0 0)" },
  animate: { clipPath: "inset(0 0% 0 0)" },
  exit: { clipPath: "inset(0 50% 0 0)", opacity: 0 },
};

const takeoverFromRight = {
  initial: { clipPath: "inset(0 0 0 50%)" },
  animate: { clipPath: "inset(0 0 0 0%)" },
  exit: { clipPath: "inset(0 0 0 50%)", opacity: 0 },
};

const formReveal = {
  initial: { opacity: 0, y: 50, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
};

const HeroSection = () => {
  const [view, setView] = useState<View>("main");
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-20 relative overflow-hidden bg-background"
    >
      <AnimatePresence mode="wait">
        {/* ═══════════════════ MAIN SPLIT SCREEN ═══════════════════ */}
        {view === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-5rem)] flex flex-col"
          >
            {/* Floating title */}
            <div className="absolute inset-x-0 top-20 z-30 flex flex-col items-center pt-10 sm:pt-14 pointer-events-none">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-foreground text-center text-balance drop-shadow-lg"
                style={{ lineHeight: "1.05" }}
              >
                Skylands Transport
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-muted-foreground text-sm sm:text-base mt-3 text-center max-w-md text-pretty px-6"
              >
                Premium diesel supply &amp; logistics across the region.
              </motion.p>
            </div>

            {/* Split panels */}
            <div className="flex-1 flex flex-col md:flex-row relative">
              {/* ── LEFT: Diesel ── */}
              <motion.button
                {...panelLeft}
                transition={springy}
                onClick={() => setView("diesel")}
                onMouseEnter={() => setHovered("left")}
                onMouseLeave={() => setHovered(null)}
                className="relative flex-1 flex items-center justify-center cursor-pointer group overflow-hidden focus-visible:outline-none"
                style={{ minHeight: "50vh" }}
              >
                {/* Photo */}
                <img
                  src={heroDiesel}
                  alt="Diesel fuel tanker"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.06]"
                />

                {/* Navy + gold colour-grade overlay */}
                <div
                  className="absolute inset-0 transition-all duration-600 ease-out"
                  style={{
                    background: `
                      linear-gradient(to top,   hsl(220 60% 6% / 0.94) 0%, transparent 55%),
                      linear-gradient(to right,  hsl(220 60% 6% / 0.35) 0%, transparent 100%),
                      linear-gradient(180deg,    hsl(43 80% 55% / 0.08) 0%, transparent 40%)
                    `,
                    opacity: hovered === "right" ? 1 : hovered === "left" ? 0.55 : 0.82,
                  }}
                />

                {/* Gold edge fade (right side) */}
                <div className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gold/10 to-transparent z-10 pointer-events-none" />

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center gap-5 mt-24">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center backdrop-blur-md group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:shadow-[0_0_30px_hsl(43_80%_55%/0.25)] transition-all duration-500"
                  >
                    <Fuel className="w-8 h-8 text-gold" />
                  </motion.div>

                  <div className="btn-gold text-xl sm:text-2xl py-5 px-8 sm:px-10 flex items-center gap-3 group-hover:shadow-[0_0_40px_hsl(43_80%_55%/0.35)] transition-shadow duration-500">
                    Diesel Deliveries
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                  <span className="text-xs text-muted-foreground/70 tracking-wide uppercase">
                    Bulk &middot; Bowser &middot; Direct
                  </span>
                </div>
              </motion.button>

              {/* ── Gold centre divider ── */}
              <div className="hidden md:flex relative z-20 items-center">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
              </div>
              <div className="block md:hidden relative z-20">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </div>

              {/* ── RIGHT: Transport ── */}
              <motion.button
                {...panelRight}
                transition={springy}
                onClick={() => setView("transport")}
                onMouseEnter={() => setHovered("right")}
                onMouseLeave={() => setHovered(null)}
                className="relative flex-1 flex items-center justify-center cursor-pointer group overflow-hidden focus-visible:outline-none"
                style={{ minHeight: "50vh" }}
              >
                <img
                  src={heroTransport}
                  alt="Logistics transport truck"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.06]"
                />

                <div
                  className="absolute inset-0 transition-all duration-600 ease-out"
                  style={{
                    background: `
                      linear-gradient(to top,  hsl(220 60% 6% / 0.94) 0%, transparent 55%),
                      linear-gradient(to left, hsl(220 60% 6% / 0.35) 0%, transparent 100%),
                      linear-gradient(180deg,  hsl(43 80% 55% / 0.06) 0%, transparent 40%)
                    `,
                    opacity: hovered === "left" ? 1 : hovered === "right" ? 0.55 : 0.82,
                  }}
                />

                {/* Gold edge fade (left side) */}
                <div className="hidden md:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gold/10 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 flex flex-col items-center gap-5 mt-24">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center backdrop-blur-md group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:shadow-[0_0_30px_hsl(43_80%_55%/0.25)] transition-all duration-500"
                  >
                    <Truck className="w-8 h-8 text-gold" />
                  </motion.div>

                  <div className="btn-navy text-xl sm:text-2xl py-5 px-8 sm:px-10 flex items-center gap-3 group-hover:shadow-[0_0_40px_hsl(43_80%_55%/0.2)] transition-shadow duration-500">
                    Logistics &amp; Transport
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                  <span className="text-xs text-muted-foreground/70 tracking-wide uppercase">
                    FTL &middot; LTL &middot; Express
                  </span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ DIESEL TAKEOVER ═══════════════════ */}
        {view === "diesel" && (
          <motion.div
            key="diesel"
            {...takeoverFromLeft}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative"
          >
            <img
              src={heroDiesel}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/96 via-navy-dark/90 to-navy-dark/96" />
            <motion.div {...formReveal} className="relative z-10 w-full py-10">
              <DieselForm onBack={() => setView("main")} />
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════ TRANSPORT TAKEOVER ═══════════════════ */}
        {view === "transport" && (
          <motion.div
            key="transport"
            {...takeoverFromRight}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative"
          >
            <img
              src={heroTransport}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/96 via-navy-dark/90 to-navy-dark/96" />
            <motion.div {...formReveal} className="relative z-10 w-full py-10">
              <TransportForm onBack={() => setView("main")} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
