import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Check, X } from "lucide-react";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type AuthorizationDetails = {
  client?: { name?: string; client_id?: string; redirect_uris?: string[] };
  redirect_url?: string;
  redirect_to?: string;
  scope?: string;
  scopes?: string[];
};
type OauthResult = { data: AuthorizationDetails | null; error: { message: string } | null };
type OauthApi = {
  getAuthorizationDetails: (id: string) => Promise<OauthResult>;
  approveAuthorization: (id: string) => Promise<OauthResult>;
  denyAuthorization: (id: string) => Promise<OauthResult>;
};
const oauth = (supabase.auth as unknown as { oauth: OauthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        navigate(
          `/auth?message=${encodeURIComponent(
            "Please sign in to authorize this connection.",
          )}&redirect=${encodeURIComponent(next)}`,
          { replace: true },
        );
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId, navigate]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  return (
    <div className="min-h-screen bg-navy-dark text-white flex items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-gold">Authorize connection</h1>
            <p className="text-xs text-white/60">Skylands Transport</p>
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </p>
        ) : !details ? (
          <p className="text-white/70 text-sm">Loading authorization request…</p>
        ) : (
          <>
            <p className="text-white/80 text-sm mb-2">
              <strong className="text-gold">{details.client?.name ?? "An external app"}</strong>{" "}
              wants to connect to your Skylands Transport account.
            </p>
            <p className="text-white/60 text-xs mb-6">
              It will be able to call this app's tools while you are signed in. This does not
              bypass this app's permissions or backend policies.
            </p>

            <div className="flex flex-col gap-3">
              <button
                disabled={busy}
                onClick={() => decide(true)}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> Approve
              </button>
              <button
                disabled={busy}
                onClick={() => decide(false)}
                className="w-full py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
