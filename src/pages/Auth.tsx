import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, LogIn, Phone, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ADMIN_EMAIL, buildWhatsAppQuoteUrl, clearPendingQuote, readPendingQuote } from "@/lib/orders";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
const phoneSchema = z
  .string()
  .trim()
  .min(10, "Enter a valid SA phone number (e.g. 082 123 4567)")
  .max(16, "Phone number is too long")
  .regex(
    /^(?:0\d{9}|\+27\d{9})$/,
    "Enter a valid SA number: 0XX XXX XXXX or +27XX XXX XXXX"
  )
  .transform((v) => v.replace(/[\s()-]/g, ""));

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  address: z.string().trim().min(5, "Enter your delivery address").max(200),
  phoneNumber: phoneSchema,
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsPhoneCompletion, setNeedsPhoneCompletion] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const requestedRedirect = searchParams.get("redirect") || "/";
  const authMessage = searchParams.get("message");
  const [pendingRedirect, setPendingRedirect] = useState(requestedRedirect);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshProfile } = useAuth();

  const completePendingQuote = async (userId: string) => {
    const pendingQuote = readPendingQuote();
    if (!pendingQuote) return;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      toast({ title: "Profile check failed", description: profileError.message, variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("quotes").insert({
      order_id: "",
      user_id: userId,
      service: pendingQuote.service,
      details: pendingQuote.details,
      quantity: pendingQuote.quantity || undefined,
      location: pendingQuote.location || undefined,
    });

    if (error) {
      toast({ title: "Quote save failed", description: error.message, variant: "destructive" });
      return;
    }

    clearPendingQuote();
    const whatsAppUrl = buildWhatsAppQuoteUrl(pendingQuote.context, profileData?.full_name);
    const popup = window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.href = whatsAppUrl;
      return;
    }

    toast({
      title: "Quote request saved",
      description: "Your request has been logged and WhatsApp is ready.",
    });
  };

  const handlePhoneCompletion = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPhone = phoneSchema.safeParse(phoneNumber);
    if (!parsedPhone.success || !pendingUserId) {
      toast({
        title: "Phone number required",
        description: parsedPhone.success ? "Please sign in again." : parsedPhone.error.issues[0]?.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ phone_number: parsedPhone.data })
      .eq("user_id", pendingUserId);

    if (error) {
      toast({ title: "Could not save phone number", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    await refreshProfile();
    await completePendingQuote(pendingUserId);
    setLoading(false);
    setNeedsPhoneCompletion(false);
    navigate(pendingRedirect);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const parsedLogin = loginSchema.safeParse({ email, password });
      if (!parsedLogin.success) {
        toast({
          title: "Login failed",
          description: parsedLogin.error.issues[0]?.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email: parsedLogin.data.email,
        password: parsedLogin.data.password,
      });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const signedInUser = data.user;
      if (!signedInUser) {
        toast({ title: "Login failed", description: "No user session was returned.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const redirectTo = signedInUser.email === ADMIN_EMAIL ? "/admin-portal" : requestedRedirect;
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("phone_number")
        .eq("user_id", signedInUser.id)
        .maybeSingle();

      if (profileError) {
        toast({ title: "Profile check failed", description: profileError.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const hasPhone = phoneSchema.safeParse(existingProfile?.phone_number ?? "").success;
      if (!hasPhone) {
        setPendingUserId(signedInUser.id);
        setPendingRedirect(redirectTo);
        setPhoneNumber(existingProfile?.phone_number ?? "");
        setNeedsPhoneCompletion(true);
        setLoading(false);
        return;
      }

      await refreshProfile();
      await completePendingQuote(signedInUser.id);
      setLoading(false);
      navigate(redirectTo);
      return;
    }

    const parsedSignUp = signUpSchema.safeParse({
      fullName,
      address,
      phoneNumber,
      email,
      password,
    });

    if (!parsedSignUp.success) {
      toast({
        title: "Sign up failed",
        description: parsedSignUp.error.issues[0]?.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: parsedSignUp.data.email,
      password: parsedSignUp.data.password,
      options: {
        data: {
          full_name: parsedSignUp.data.fullName,
          default_address: parsedSignUp.data.address,
          phone_number: parsedSignUp.data.phoneNumber,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Account created!",
        description: "Check your email to verify your account, then sign in.",
      });
      setIsLogin(true);
    }

    setLoading(false);
  };

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
            {needsPhoneCompletion ? (
              <Phone className="w-6 h-6 text-gold" />
            ) : isLogin ? (
              <LogIn className="w-6 h-6 text-gold" />
            ) : (
              <UserPlus className="w-6 h-6 text-gold" />
            )}
            <h2 className="text-2xl font-bold text-foreground">
              {needsPhoneCompletion ? "Complete Your Profile" : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
          </div>

          {authMessage && !needsPhoneCompletion && (
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
              {authMessage}
            </div>
          )}

          {needsPhoneCompletion ? (
            <form onSubmit={handlePhoneCompletion} className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Add your phone number to continue and finish your request.
              </p>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                   placeholder="e.g. 082 123 4567 or +27 82 123 4567"
                  className="input-premium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-3 text-lg mt-4 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
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
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Primary Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 12 Main Rd, Sandton, Johannesburg"
                      className="input-premium"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.co.za"
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-3 text-lg mt-4 disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
          )}

          {!needsPhoneCompletion && (
            <p className="text-center text-muted-foreground text-sm mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold hover:text-gold-light transition-colors font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
