import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AlertTriangle } from "lucide-react";

const AnnouncementBar = () => {
  const { settings, loading } = useSiteSettings();

  if (loading || !settings.announcement) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gold text-navy-dark py-2 px-4 text-center text-sm font-semibold flex items-center justify-center gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>{settings.announcement}</span>
    </div>
  );
};

export default AnnouncementBar;
