import { useState } from "react";
import { Fuel, Truck, ArrowRight } from "lucide-react";
import heroTanker from "@/assets/hero-tanker.jpg";
import heroTruck from "@/assets/hero-truck.jpg";

const PHONE = "27686347810";

const HeroSection = () => {
  // Diesel form state
  const [dieselLiters, setDieselLiters] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  // Transport form state
  const [cargoType, setCargoType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedDistance, setEstimatedDistance] = useState("");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const getDieselUrl = () => {
    const msg = `Hello Skylands Transport, I need a diesel quote.\n\nLiters: ${dieselLiters}\nMethod: ${deliveryMethod === "delivery" ? "Delivery" : "Pumped into Vehicles"}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  const getTransportUrl = () => {
    const msg = `Hello Skylands Transport, I need a logistics quote.\n\nCargo: ${cargoType}\nPickup: ${pickupLocation}\nDestination: ${destination}\nEst. Distance: ${estimatedDistance}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* ── HERO PANELS ── */}
      <section id="services" className="min-h-screen pt-20">
        <div className="grid md:grid-cols-2 min-h-[calc(100vh-5rem)]">
          {/* Diesel Panel */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => scrollTo("diesel-form")}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${heroTanker})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/80 to-navy-dark/60" />
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
              <div className="max-w-lg animate-fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                  <Fuel className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">Diesel Supply</span>
                </div>

                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 leading-tight">
                  Diesel Supply
                </h2>

                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Order fuel delivery or on-site pumping services.
                </p>

                <span className="btn-gold inline-flex items-center gap-3 text-lg">
                  GET A DIESEL QUOTE <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          {/* Transport Panel */}
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => scrollTo("transport-form")}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${heroTruck})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-navy-dark/95 via-navy-dark/80 to-navy-dark/60" />
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
              <div className="max-w-lg ml-auto animate-fade-up-delay-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold/30 mb-6">
                  <Truck className="w-4 h-4 text-gold" />
                  <span className="text-gold text-sm font-medium">Logistics</span>
                </div>

                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 leading-tight">
                  Logistics &amp; Transport
                </h2>

                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Freight and transportation solutions across the region.
                </p>

                <span className="btn-navy inline-flex items-center gap-3 text-lg">
                  BOOK TRANSPORT <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIESEL QUOTE FORM ── */}
      <section id="diesel-form" className="py-20 bg-background">
        <div className="container max-w-xl mx-auto px-6">
          <div className="glass-card p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Fuel className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-foreground">Diesel Quote</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Quantity in Liters</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 5000"
                  value={dieselLiters}
                  onChange={(e) => setDieselLiters(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Delivery Method</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="input-premium appearance-none"
                >
                  <option value="delivery">Delivery to Site</option>
                  <option value="pumped">Pumped into Vehicles</option>
                </select>
              </div>

              <a
                href={getDieselUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-3 text-lg mt-4"
              >
                Get Fuel Quote <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-muted-foreground text-center">Opens WhatsApp in a new tab</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPORT QUOTE FORM ── */}
      <section id="transport-form" className="py-20 bg-navy-dark">
        <div className="container max-w-xl mx-auto px-6">
          <div className="glass-card p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Truck className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-foreground">Logistics Quote</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Cargo Type</label>
                <input
                  type="text"
                  placeholder="e.g. Building Materials, Fuel, Machinery"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g. Johannesburg CBD"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Durban Harbour"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Estimated Distance (km)</label>
                <input
                  type="text"
                  placeholder="e.g. 600 km"
                  value={estimatedDistance}
                  onChange={(e) => setEstimatedDistance(e.target.value)}
                  className="input-premium"
                />
              </div>

              <a
                href={getTransportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy w-full flex items-center justify-center gap-3 text-lg mt-4"
              >
                Book Transport <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-muted-foreground text-center">Opens WhatsApp in a new tab</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
