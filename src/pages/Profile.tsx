import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phoneNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine(
      (v) => /^(?:0\d{9}|\+27\d{9})$/.test(v),
      "Enter a valid SA number: 0XX XXX XXXX or +27XX XXX XXXX"
    ),
  defaultAddress: z.string().trim().min(5, "Enter your delivery address").max(200),
});

const Profile = () => {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhoneNumber(profile.phone_number ?? "");
      setDefaultAddress(profile.default_address ?? "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const parsedProfile = profileSchema.safeParse({
      fullName,
      phoneNumber,
      defaultAddress,
    });

    if (!parsedProfile.success) {
      toast({
        title: "Profile update failed",
        description: parsedProfile.error.issues[0]?.message,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsedProfile.data.fullName,
        phone_number: parsedProfile.data.phoneNumber,
        default_address: parsedProfile.data.defaultAddress,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  if (authLoading) return null;

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="glass-card p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Thabo Mokoena"
                className="input-premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 068 634 7810"
                className="input-premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Default Delivery Address</label>
              <input
                type="text"
                required
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="e.g. 123 Main Rd, Sandton, Gauteng"
                className="input-premium"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-gold w-full flex items-center justify-center gap-3 text-lg mt-4 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-6">
            Your details will auto-fill quote forms for faster ordering.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Profile;
