import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";

interface QuoteModalProps {
  open: boolean;
  onComplete: () => void;
}

const QuoteModal = ({ open, onComplete }: QuoteModalProps) => {
  const [phase, setPhase] = useState<"processing" | "done">("processing");

  useEffect(() => {
    if (!open) {
      setPhase("processing");
      return;
    }
    const t1 = setTimeout(() => setPhase("done"), 1800);
    const t2 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-8 max-w-sm mx-4 text-center border border-gold/20"
          >
            {phase === "processing" ? (
              <>
                <Loader2 className="w-10 h-10 text-gold animate-spin mx-auto mb-4" />
                <p className="text-foreground font-semibold text-lg">Generating your custom Skylands Quote...</p>
                <p className="text-muted-foreground text-sm mt-2">Opening WhatsApp now.</p>
              </>
            ) : (
              <>
                <CheckCircle className="w-10 h-10 text-gold mx-auto mb-4" />
                <p className="text-foreground font-semibold text-lg">Quote ready!</p>
                <p className="text-muted-foreground text-sm mt-2">Redirecting to WhatsApp...</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
