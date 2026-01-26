import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-navy-dark/90 backdrop-blur-xl border-b border-gold/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                <span className="text-navy-dark font-bold text-lg">S</span>
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-gold opacity-50 blur-md group-hover:opacity-75 transition-opacity" />
            </div>
            <div>
              <span className="text-gradient-gold font-bold text-xl tracking-tight">
                Skylands
              </span>
              <span className="text-white/90 font-light text-xl tracking-tight ml-1">
                Transport
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#services"
              className="text-white/70 hover:text-gold transition-colors duration-300 font-medium"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-white/70 hover:text-gold transition-colors duration-300 font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white/70 hover:text-gold transition-colors duration-300 font-medium"
            >
              Contact
            </a>
            <a
              href="#contact"
              className="btn-gold text-sm py-3 px-6"
            >
              Get Quote
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gold p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gold/10 pt-4 animate-fade-up">
            <div className="flex flex-col gap-4">
              <a
                href="#services"
                className="text-white/70 hover:text-gold transition-colors duration-300 font-medium py-2"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-white/70 hover:text-gold transition-colors duration-300 font-medium py-2"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white/70 hover:text-gold transition-colors duration-300 font-medium py-2"
              >
                Contact
              </a>
              <a
                href="#contact"
                className="btn-gold text-center py-4 mt-2"
              >
                Get Quote
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
