import { useState } from "react";
import { Fuel, Truck, ArrowRight } from "lucide-react";
import heroTanker from "@/assets/hero-tanker.jpg";
import heroTruck from "@/assets/hero-truck.jpg";

const PHONE_NUMBER = "27686347810";

const HeroSection = () => {
  // Diesel Quote Form State
  const [userName, setUserName] = useState("");
  const [dieselLiters, setDieselLiters] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [dieselError, setDieselError] = useState("");

  // Transport Quote Form State (separate userName for transport)
  const [userNameTransport, setUserNameTransport] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [loadWeight, setLoadWeight] = useState("");
  const [transportError, setTransportError] = useState("");

  // Helper functions to generate WhatsApp URLs
  const getDieselUrl = () => {
    const message = `Hello Skylands Transport, I need a diesel quote. Name: ${userName}, Liters: ${dieselLiters}, Method: ${deliveryMethod}`;
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const getTransportUrl = () => {
    const message = `Hello Skylands Transport, I need a logistics quote. Name: ${userNameTransport}, From: ${pickupLocation}, To: ${dropoffLocation}, Weight: ${loadWeight}`;
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // Validation handlers (prevent navigation if fields are empty)
  const handleDieselClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!userName.trim() || !dieselLiters.trim() || !deliveryMethod.trim()) {
      e.preventDefault();
      setDieselError("Please fill in all details");
    }
  };

  const handleTransportClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!userNameTransport.trim() || !pickupLocation.trim() || !dropoffLocation.trim() || !loadWeight.trim()) {
      e.preventDefault();
      setTransportError("Please fill in all details");
    }
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

              {/* Quick Quote Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
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
                    Delivery Method
                  </label>
                  <input
                    type="text"
                    value={deliveryMethod}
                    onChange={(e) => {
                      setDeliveryMethod(e.target.value);
                      setDieselError("");
                    }}
                    placeholder="e.g. On-site delivery, Depot pickup"
                    className="input-premium text-lg"
                  />
                </div>

                {dieselError && (
                  <p className="text-gold text-sm font-medium animate-fade-up">
                    {dieselError}
                  </p>
                )}

                {/* Direct WhatsApp Link */}
                <a
                  href={getDieselUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDieselClick}
                  className="btn-gold w-full flex items-center justify-center gap-3 text-lg"
                >
                  Get Fuel Quote
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

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

              {/* Quick Quote Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/50 text-sm mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userNameTransport}
                    onChange={(e) => {
                      setUserNameTransport(e.target.value);
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
                    placeholder="e.g. 10 Tons"
                    className="input-premium text-lg"
                  />
                </div>

                {transportError && (
                  <p className="text-gold text-sm font-medium animate-fade-up">
                    {transportError}
                  </p>
                )}

                {/* Direct WhatsApp Link */}
                <a
                  href={getTransportUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleTransportClick}
                  className="btn-navy w-full flex items-center justify-center gap-3 text-lg"
                >
                  Request Transport Quote
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

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
