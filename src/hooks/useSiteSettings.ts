import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SiteSettings = {
  diesel_maintenance: boolean;
  logistics_maintenance: boolean;
  announcement: string;
};

const defaults: SiteSettings = {
  diesel_maintenance: false,
  logistics_maintenance: false,
  announcement: "",
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("site_settings").select("key, value");
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((r: { key: string; value: string }) => {
        map[r.key] = r.value;
      });
      setSettings({
        diesel_maintenance: map["diesel_maintenance"] === "true",
        logistics_maintenance: map["logistics_maintenance"] === "true",
        announcement: map["announcement"] || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { settings, loading, refetch: fetch };
};
