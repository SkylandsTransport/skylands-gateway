import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Fuel, Truck, ChevronRight } from "lucide-react";
import heroDiesel from "@/assets/hero-diesel.jpg";
import heroTransport from "@/assets/hero-transport.jpg";
import DieselForm from "./hero/DieselForm";
import TransportForm from "./hero/TransportForm";

type View = "main" | "diesel" | "transport";

const springy = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

const panelLeft = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-60%", opacity: 0 },
};

const panelRight = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "60%", opacity: 0 },
};

const takeoverFromLeft = {
  initial: { clipPath: "inset(0 100% 0 0)" },
  animate: { clipPath: "inset(0 0% 0 0)" },
  exit: { clipPath: "inset(0 100% 0 0)" },
};

const takeoverFromRight = {
  initial: { clipPath: "inset(0 0 0 100%)" },
  animate: { clipPath: "inset(0 0 0 0%)" },
  exit: { clipPath: "inset(0 0 0 100%)" },
};

const formReveal = {
  initial: { opacity: 0, y: 50, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
};

interface HeroSectionProps {
  onViewChange?: (view: View) => void;
  maintenanceFlags?: {
    diesel_maintenance: boolean;
    logistics_maintenance: boolean;
  };
}

const HeroSection = ({ onViewChange, maintenanceFlags }: HeroSectionProps) => {
  const [view, setView] = useState<View>("main");
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const changeView = (v: View) => {
    setView(v);
    onViewChange?.(v);
  };

  /* Vignette style shared across panels */
  const vignette =
    "shadow-[inset_0_0_120px_40px_hsl(220_60%_6%/0.7)]";

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
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-foreground text-center text-balance drop-shadow-lg"
                style={{ lineHeight: "1.05" }}
              >
                Skylands Transport
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
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
                onClick={() => !maintenanceFlags?.diesel_maintenance && changeView("diesel")}
                onMouseEnter={() => setHovered("left")}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex-1 flex items-center justify-center cursor-pointer group overflow-hidden focus-visible:outline-none ${maintenanceFlags?.diesel_maintenance ? "opacity-60 cursor-not-allowed" : ""}`}
                style={{ minHeight: "50vh" }}
              >
                {/* Branded tanker photo with seamless blend */}
                <div className="absolute inset-0" style={{ backgroundColor: '#0A1128' }} />
                <img
                  src={heroDiesel}
                  alt="Skylands Transport branded diesel fuel tanker"
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.06]"
                />
                {/* Radial blend: image fades into navy at edges */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 70% 60% at center, transparent 30%, #0A1128 85%)`,
                  }}
                />

                {/* Navy + gold colour-grade + vignette */}
                <div
                  className={`absolute inset-0 transition-all duration-600 ease-out ${vignette}`}
                  style={{
                    background: `
                      linear-gradient(to top,   #0A1128 0%, transparent 40%),
                      linear-gradient(to bottom, #0A1128 0%, transparent 40%),
                      linear-gradient(to right,  #0A1128cc 0%, transparent 50%),
                      linear-gradient(to left,   #0A1128cc 0%, transparent 50%),
                      linear-gradient(180deg,    hsl(43 80% 55% / 0.07) 0%, transparent 35%)
                    `,
                    opacity: hovered === "right" ? 1 : hovered === "left" ? 0.5 : 0.78,
                  }}
                />

                {/* Gold edge fade */}
                <div className="hidden md:block absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gold/12 to-transparent z-10 pointer-events-none" />

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center gap-5 mt-28">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center backdrop-blur-md group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:shadow-[0_0_35px_hsl(43_80%_55%/0.3)] transition-all duration-500"
                  >
                    <Fuel className="w-8 h-8 text-gold" />
                  </motion.div>

                  <div className="btn-gold text-xl sm:text-2xl py-5 px-8 sm:px-10 flex items-center gap-3 group-hover:shadow-[0_0_50px_hsl(43_80%_55%/0.4)] transition-shadow duration-500">
                    {maintenanceFlags?.diesel_maintenance ? "Temporarily Unavailable" : "Diesel Deliveries"}
                    {!maintenanceFlags?.diesel_maintenance && <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                  </div>

                  {!maintenanceFlags?.diesel_maintenance && (
                    <span className="text-xs text-muted-foreground/70 tracking-wide uppercase">
                      Bulk &middot; Bowser &middot; Direct
                    </span>
                  )}
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
                onClick={() => !maintenanceFlags?.logistics_maintenance && changeView("transport")}
                onMouseEnter={() => setHovered("right")}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex-1 flex items-center justify-center cursor-pointer group overflow-hidden focus-visible:outline-none ${maintenanceFlags?.logistics_maintenance ? "opacity-60 cursor-not-allowed" : ""}`}
                style={{ minHeight: "50vh" }}
              >
                {/* Branded logistics truck photo */}
                <div className="absolute inset-0 bg-navy-dark" />
                <img
                  src={heroTransport}
                  alt="Skylands Transport branded logistics truck"
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.06]"
                />

                <div
                  className={`absolute inset-0 transition-all duration-600 ease-out ${vignette}`}
                  style={{
                    background: `
                      linear-gradient(to top,  hsl(220 60% 6% / 0.92) 0%, transparent 50%),
                      linear-gradient(to left, hsl(220 60% 6% / 0.3) 0%, transparent 100%),
                      linear-gradient(180deg,  hsl(43 80% 55% / 0.05) 0%, transparent 35%)
                    `,
                    opacity: hovered === "left" ? 1 : hovered === "right" ? 0.5 : 0.78,
                  }}
                />

                {/* Gold edge fade */}
                <div className="hidden md:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gold/12 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 flex flex-col items-center gap-5 mt-28">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center backdrop-blur-md group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:shadow-[0_0_35px_hsl(43_80%_55%/0.3)] transition-all duration-500"
                  >
                    <Truck className="w-8 h-8 text-gold" />
                  </motion.div>

                  <div className="btn-navy text-xl sm:text-2xl py-5 px-8 sm:px-10 flex items-center gap-3 group-hover:shadow-[0_0_50px_hsl(43_80%_55%/0.25)] transition-shadow duration-500">
                    {maintenanceFlags?.logistics_maintenance ? "Temporarily Unavailable" : "Logistics & Transport"}
                    {!maintenanceFlags?.logistics_maintenance && <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                  </div>

                  {!maintenanceFlags?.logistics_maintenance && (
                    <span className="text-xs text-muted-foreground/70 tracking-wide uppercase">
                      FTL &middot; LTL &middot; Express
                    </span>
                  )}
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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative"
          >
            {/* Branded tanker background — subtly blurred */}
            <div className="absolute inset-0 bg-navy-dark" />
            <img
              src={heroDiesel}
              alt=""
              className="absolute inset-0 w-full h-full object-contain scale-105"
              style={{ filter: "blur(4px)" }}
            />
            {/* Translucent navy overlay */}
            <div className={`absolute inset-0 bg-navy-dark/70 ${vignette}`} />

            <motion.div {...formReveal} className="relative z-10 w-full py-10">
              <DieselForm onBack={() => changeView("main")} />
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════ TRANSPORT TAKEOVER ═══════════════════ */}
        {view === "transport" && (
          <motion.div
            key="transport"
            {...takeoverFromRight}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative"
          >
            {/* Branded truck background — subtly blurred */}
            <div className="absolute inset-0 bg-navy-dark" />
            <img
              src={heroTransport}
              alt=""
              className="absolute inset-0 w-full h-full object-contain scale-105"
              style={{ filter: "blur(4px)" }}
            />
            <div className={`absolute inset-0 bg-navy-dark/70 ${vignette}`} />
            <div className={`absolute inset-0 bg-navy-dark/92 ${vignette}`} />

            <motion.div {...formReveal} className="relative z-10 w-full py-10">
              <TransportForm onBack={() => changeView("main")} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
