import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroDiesel from "@/assets/hero-diesel.jpg";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="relative pt-24 pb-20">
      <img src={heroDiesel} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(8px)" }} />
      <div className="absolute inset-0 bg-navy-dark/85" />
      <div className="relative z-10 container mx-auto px-6 max-w-3xl">
        <div className="glass-card p-8 lg:p-12 border border-gold/20">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: March 2026</p>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">1. Introduction</h2>
              <p>Skylands Transport (Pty) Ltd, based in Gauteng, South Africa, is committed to protecting your personal information in compliance with the Protection of Personal Information Act, 2013 (POPIA).</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">2. Information We Collect</h2>
              <p>We collect names, email addresses, phone numbers, and delivery locations solely for the purposes of providing diesel delivery and transport logistics quotations and services.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">3. How We Use Your Information</h2>
              <p>Your personal information is used exclusively for: processing quote requests, coordinating deliveries, communicating service updates, and improving our operations.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">4. Third-Party Sharing</h2>
              <p>Skylands Transport does not sell, trade, or otherwise transfer your personal information to third parties. Information may be shared only with logistics partners directly involved in fulfilling your service request.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">5. Data Security</h2>
              <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">6. Your Rights</h2>
              <p>Under POPIA, you have the right to access, correct, or request deletion of your personal information. Contact us at info@skylandstransport.co.za for any data-related requests.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">7. Contact</h2>
              <p>Information Officer: Skylands Transport (Pty) Ltd, Gauteng, South Africa. Email: info@skylandstransport.co.za | Tel: 068 634 7810</p>
            </section>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
