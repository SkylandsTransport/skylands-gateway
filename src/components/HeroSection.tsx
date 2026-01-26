import { useState } from "react";
import { Fuel, Truck, ArrowRight } from "lucide-react";
import heroTanker from "@/assets/hero-tanker.jpg";
import heroTruck from "@/assets/hero-truck.jpg";

const HeroSection = () => {
  // Diesel Quote Form State
  const [dieselName, setDieselName] = useState("");
  const [dieselLiters, setDieselLiters] = useState("");
  const [deliveryRequirements, setDeliveryRequirements] = useState("");
  const [dieselError, setDieselError] = useState("");

  // Transport Quote Form State
  const [transportName, setTransportName] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [loadWeight, setLoadWeight] = useState("");
  const [transportError, setTransportError] = useState("");

  const handleDieselQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!dieselName.trim() || !dieselLiters.trim() || !deliveryRequirements.trim()) {
      setDieselError("Please fill in all details");
      return;
    }
    
    setDieselError("");
    
    // Format the professional message
    const message = `Hello Skylands Transport, I would like a diesel quote. Name: ${dieselName.trim()}, Volume: ${dieselLiters.trim()}L, Delivery Info: ${deliveryRequirements.trim()}.`;
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp using official API URL
    window.open(`https://api.whatsapp.com/send?phone=27686347810&text=${encodedMessage}`, '_blank');
  };

  const handleTransportQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!transportName.trim() || !pickupLocation.trim() || !dropoffLocation.trim() || !loadWeight.trim()) {
      setTransportError("Please fill in all details");
      return;
    }
    
    setTransportError("");
    
    // Format the professional message
    const message = `Hello Skylands Transport, I need a logistics quote. Name: ${transportName.trim()}, From: ${pickupLocation.trim()}, To: ${dropoffLocation.trim()}, Weight: ${loadWeight.trim()}.`;
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp using official API URL
    window.open(`https://api.whatsapp.com/send?phone=27686347810&text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="services" className="min-h-screen pt-20">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
        {/* Diesel Supply Section */}
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroTanker})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/80 to-navy-dark/60" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
            <div className="max-w-lg animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                <Fuel className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Diesel Supply & Delivery</span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                Premium <span className="text-gradient-gold">Fuel</span>
                <br />
                Delivered
              </h2>

              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Reliable diesel supply for your fleet. Skylands Transport ensures your operations never stop.
              </p>

              {/* Quote Form */}
              <form onSubmit={handleDieselQuote} className="space-y-4">
                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={dieselName}
                    onChange={(e) => {
                      setDieselName(e.target.value);
                      setDieselError("");
                    }}
                    placeholder="Enter your name"
                    className="input-premium text-lg"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Liters Required
                  </label>
                  <input
                    type="text"
                    value={dieselLiters}
                    onChange={(e) => {
                      setDieselLiters(e.target.value);
                      setDieselError("");
                    }}
                    placeholder="e.g. 500"
                    className="input-premium text-lg"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Delivery Requirements
                  </label>
                  <textarea
                    value={deliveryRequirements}
                    onChange={(e) => {
                      setDeliveryRequirements(e.target.value);
                      setDieselError("");
                    }}
                    placeholder="How would you like it delivered? (e.g., On-site delivery, Depot pickup, Scheduled refueling)"
                    rows={3}
                    className="input-premium text-lg resize-none"
                  />
                </div>

                {dieselError && (
                  <p className="text-gold text-sm font-medium animate-fade-up">
                    {dieselError}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-gold w-full flex items-center justify-center gap-3 text-lg"
                >
                  Get Fuel Quote
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Trust Badge */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/40 text-sm">
                  <span className="text-gold font-semibold">Skylands</span> — Trusted by 500+ businesses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logistics Section */}
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroTruck})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-navy-dark/95 via-navy-dark/80 to-navy-dark/60" />
          </div>

          {/* Gold Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 xl:p-16">
            <div className="max-w-lg ml-auto animate-fade-up-delay-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold/30 mb-6">
                <Truck className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">Logistics & Transportation</span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                Seamless <span className="text-gradient-gold">Freight</span>
                <br />
                Solutions
              </h2>

              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                End-to-end logistics with Skylands' nationwide network. Your cargo, our commitment.
              </p>

              {/* Quote Form */}
              <form onSubmit={handleTransportQuote} className="space-y-4">
                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={transportName}
                    onChange={(e) => {
                      setTransportName(e.target.value);
                      setTransportError("");
                    }}
                    placeholder="Enter your name"
                    className="input-premium text-lg"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setTransportError("");
                    }}
                    placeholder="Enter pickup address"
                    className="input-premium text-lg"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Drop-off Location
                  </label>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => {
                      setDropoffLocation(e.target.value);
                      setTransportError("");
                    }}
                    placeholder="Enter destination address"
                    className="input-premium text-lg"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Estimated Load Weight
                  </label>
                  <input
                    type="text"
                    value={loadWeight}
                    onChange={(e) => {
                      setLoadWeight(e.target.value);
                      setTransportError("");
                    }}
                    placeholder="e.g., 10 Tons"
                    className="input-premium text-lg"
                  />
                </div>

                {transportError && (
                  <p className="text-gold text-sm font-medium animate-fade-up">
                    {transportError}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-navy w-full flex items-center justify-center gap-3 text-lg"
                >
                  Request Transport Quote
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Trust Badge */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/40 text-sm">
                  <span className="text-gold font-semibold">Skylands</span> — On-time delivery guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
