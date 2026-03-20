import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [heroView, setHeroView] = useState<"main" | "diesel" | "transport">("main");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onViewChange={setHeroView} />
        {heroView === "main" && <AboutSection />}
      </main>
      {heroView === "main" && <Footer />}
    </div>
  );
};

export default Index;
