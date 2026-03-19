import { Fuel, Truck, ArrowRight } from "lucide-react";
import heroTanker from "@/assets/hero-tanker.jpg";
import heroTruck from "@/assets/hero-truck.jpg";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="min-h-screen pt-20">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
        {/* Diesel Section */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => scrollToSection('diesel')}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${heroTanker})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/80 to-navy-dark/60" />
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
            <div className="max-w-lg animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                <Fuel className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Diesel Supply</span>
              </div>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                Diesel Supply
              </h2>

              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Premium grade 50ppm diesel delivered directly to your site.
              </p>

              <span className="btn-gold inline-flex items-center gap-3 text-lg">
                Explore Diesel <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        {/* Transport Section */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => scrollToSection('transport')}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${heroTruck})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-navy-dark/95 via-navy-dark/80 to-navy-dark/60" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10" />

          <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
            <div className="max-w-lg ml-auto animate-fade-up-delay-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold/30 mb-6">
                <Truck className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Logistics</span>
              </div>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                Logistics
              </h2>

              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Reliable transportation and logistics solutions across the region.
              </p>

              <span className="btn-navy inline-flex items-center gap-3 text-lg">
                Explore Logistics <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
