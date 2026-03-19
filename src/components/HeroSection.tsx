import { useState } from "react";
import { Fuel, Truck, ArrowRight, ArrowLeft } from "lucide-react";
import heroTanker from "@/assets/hero-tanker.jpg";
import heroTruck from "@/assets/hero-truck.jpg";

const PHONE = "27686347810";

type View = "main" | "diesel" | "transport";

const HeroSection = () => {
  const [view, setView] = useState<View>("main");

  // Diesel state
  const [dieselLiters, setDieselLiters] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  // Transport state
  const [cargoType, setCargoType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [kilometers, setKilometers] = useState("");

  const getDieselUrl = () => {
    const msg = `Hello Skylands Transport, I need a diesel quote.\n\nLiters: ${dieselLiters}\nMethod: ${deliveryMethod === "delivery" ? "Delivery" : "Pumped into Vehicles"}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  const getTransportUrl = () => {
    const msg = `Hello Skylands Transport, I need a logistics quote.\n\nCargo: ${cargoType}\nPickup: ${pickupLocation}\nDestination: ${destination}\nDistance: ${kilometers} km`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  /* ── DIESEL FORM VIEW ── */
  if (view === "diesel") {
    return (
      <section className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="w-full max-w-xl mx-auto px-6">
          <button
            onClick={() => setView("main")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Menu
          </button>

          <div className="glass-card p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Fuel className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-foreground">Diesel Order</h3>
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
                Send Quote via WhatsApp <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-muted-foreground text-center">Opens WhatsApp in a new tab</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── TRANSPORT FORM VIEW ── */
  if (view === "transport") {
    return (
      <section className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="w-full max-w-xl mx-auto px-6">
          <button
            onClick={() => setView("main")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Menu
          </button>

          <div className="glass-card p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Truck className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-foreground">Logistics Booking</h3>
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
                  placeholder="e.g. 600"
                  value={kilometers}
                  onChange={(e) => setKilometers(e.target.value)}
                  className="input-premium"
                />
              </div>

              <a
                href={getTransportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy w-full flex items-center justify-center gap-3 text-lg mt-4"
              >
                Send Quote via WhatsApp <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-muted-foreground text-center">Opens WhatsApp in a new tab</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── MAIN SPLIT-SCREEN VIEW ── */
  return (
    <section className="min-h-screen pt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-5rem)]">
        {/* Diesel Panel */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => setView("diesel")}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${heroTanker})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--navy-dark))]/95 via-[hsl(var(--navy-dark))]/80 to-[hsl(var(--navy-dark))]/60" />
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 lg:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Fuel className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Diesel Supply</span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">Diesel Supply</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Order fuel delivery or on-site pumping services.
            </p>
            <span className="btn-gold inline-flex items-center gap-3 text-lg">
              ORDER DIESEL <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Transport Panel */}
        <div
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => setView("transport")}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${heroTruck})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-[hsl(var(--navy-dark))]/95 via-[hsl(var(--navy-dark))]/80 to-[hsl(var(--navy-dark))]/60" />
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 lg:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 mb-6">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">Logistics</span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">Logistics &amp; Transport</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Freight and transportation solutions across the region.
            </p>
            <span className="btn-navy inline-flex items-center gap-3 text-lg">
              BOOK TRANSPORT <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
