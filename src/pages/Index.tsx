import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [heroView, setHeroView] = useState<"main" | "diesel" | "transport">("main");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onViewChange={setHeroView} />
      </main>
      {heroView === "main" && <Footer />}
    </div>
  );
};

export default Index;
