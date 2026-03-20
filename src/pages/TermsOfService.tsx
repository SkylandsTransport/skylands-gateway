import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroTransport from "@/assets/hero-transport.jpg";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="relative pt-24 pb-20">
      <img src={heroTransport} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(8px)" }} />
      <div className="absolute inset-0 bg-navy-dark/85" />
      <div className="relative z-10 container mx-auto px-6 max-w-3xl">
        <div className="glass-card p-8 lg:p-12 border border-gold/20">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: March 2026</p>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">1. Service Overview</h2>
              <p>Skylands Transport (Pty) Ltd provides bulk diesel delivery and logistics/transport services across South Africa. These terms govern the use of our website and services.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">2. Quotations</h2>
              <p>All quotations generated via this platform are estimates and are subject to final confirmation via WhatsApp or direct communication. Prices may vary based on delivery distance, volume, and market conditions.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">3. Fuel Pricing</h2>
              <p>Diesel and fuel prices are subject to fluctuation in accordance with the Republic of South Africa's regulated fuel pricing structure as determined by the Department of Mineral Resources and Energy.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">4. Transport Conditions</h2>
              <p>All transport services are subject to load-weight verification. Overloaded consignments that exceed legal road limits will not be dispatched until compliance is achieved. Additional charges may apply for re-weighing or load adjustments.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">5. Liability</h2>
              <p>Skylands Transport shall not be liable for delays caused by force majeure events, including but not limited to strikes, natural disasters, road closures, or government-imposed restrictions.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">6. Governing Law</h2>
              <p>These terms are governed by the laws of the Republic of South Africa, and any disputes shall be subject to the jurisdiction of the courts of Gauteng Province.</p>
            </section>

            <section>
              <h2 className="text-foreground font-semibold text-lg mb-2">7. Contact</h2>
              <p>For queries regarding these terms, contact us at info@skylandstransport.co.za or call 068 634 7810.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
