import { useState, useEffect } from "react";
import { Fuel, Truck, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroTanker from "@/assets/hero-tanker.jpg";
import heroTruck from "@/assets/hero-truck.jpg";

const PHONE = "27686347810";

const DELIVERY_OPTIONS = [
  { value: "standard", label: "Standard Delivery (2–3 Business Days)" },
  { value: "express", label: "Express Delivery (Next Day)" },
  { value: "emergency", label: "Emergency Refuel (Same Day / Within 6 Hours)" },
  { value: "recurring", label: "Scheduled Recurring (Weekly/Monthly)" },
];

type View = "main" | "diesel" | "transport";

const HeroSection = () => {
  const { profile } = useAuth();
  const [view, setView] = useState<View>("main");

  // Diesel state
  const [dieselName, setDieselName] = useState("");
  const [dieselLiters, setDieselLiters] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Transport state
  const [transportName, setTransportName] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [kilometers, setKilometers] = useState("");

  // Auto-fill from profile
  useEffect(() => {
    if (profile) {
      setDieselName(profile.full_name ?? "");
      setTransportName(profile.full_name ?? "");
      if (profile.default_address) {
        setPickupLocation(profile.default_address);
      }
    }
  }, [profile]);

  const getDieselUrl = () => {
    const speedLabel = DELIVERY_OPTIONS.find(o => o.value === deliverySpeed)?.label ?? deliverySpeed;
    const location = profile?.default_address ?? "";
    const msg = `Hello Skylands Transport, I would like a diesel quote.\n\nName: ${dieselName}\nVolume: ${dieselLiters}L\nPriority: ${speedLabel}\nLocation: ${location}${specialInstructions ? `\nSpecial Instructions: ${specialInstructions}` : ""}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  const getTransportUrl = () => {
    const msg = `Hello Skylands Transport, I would like a logistics quote.\n\nName: ${transportName}\nCargo: ${cargoType}\nPickup: ${pickupLocation}\nDestination: ${destination}\nDistance: ${kilometers} km`;
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
                <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Thabo Mokoena"
                  value={dieselName}
                  onChange={(e) => setDieselName(e.target.value)}
                  className="input-premium"
                />
              </div>

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
                <label className="block text-sm font-medium text-muted-foreground mb-2">Delivery Speed</label>
                <select
                  value={deliverySpeed}
                  onChange={(e) => setDeliverySpeed(e.target.value)}
                  className="input-premium appearance-none"
                >
                  {DELIVERY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-navy text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Special Instructions</label>
                <textarea
                  placeholder="e.g. Gate code: 1234, Tank behind warehouse B"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                  className="input-premium resize-none"
                />
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
                <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Thabo Mokoena"
                  value={transportName}
                  onChange={(e) => setTransportName(e.target.value)}
                  className="input-premium"
                />
              </div>

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
    <section className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background split */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        <div
          className="bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroTanker})` }}
        >
          <div className="w-full h-full bg-[hsl(var(--navy-dark))]/90" />
        </div>
        <div
          className="bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroTruck})` }}
        >
          <div className="w-full h-full bg-[hsl(var(--navy-dark))]/90" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-5rem)] px-4">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 text-center">
          Skylands Transport
        </h1>
        <p className="text-muted-foreground text-lg mb-12 text-center max-w-lg">
          Premium diesel supply and logistics solutions across the region.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch w-full max-w-2xl mx-auto px-4">
          <button
            onClick={() => setView("diesel")}
            className="flex-1 flex items-center justify-center gap-3 bg-foreground text-primary-foreground hover:bg-foreground/90 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl h-16"
          >
            <Fuel className="w-6 h-6" />
            Diesel Deliveries
          </button>

          <button
            onClick={() => setView("transport")}
            className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground border-2 border-foreground/20 hover:bg-primary/90 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl h-16"
          >
            <Truck className="w-6 h-6" />
            Logistics & Transport
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
