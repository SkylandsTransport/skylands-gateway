import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ClipboardList, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import skylandsLogo from "@/assets/skylands-logo.jpg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
              <img
                src={skylandsLogo}
                alt="Skylands Transport logo"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-gold opacity-0 group-hover:opacity-30 blur-md transition-opacity" />
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
              href="#about"
              className="text-white/70 hover:text-gold transition-colors duration-300 font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white/70 hover:text-gold transition-colors duration-300 font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact
            </a>

            {user ? (
              <div className="flex items-center gap-4">
                {user.email === "delarey.skylands@gmail.com" && (
                  <button
                    onClick={() => navigate("/admin-portal")}
                    className="flex items-center gap-2 bg-gradient-to-r from-[hsl(43,74%,49%)] to-[hsl(43,74%,42%)] text-navy-dark font-semibold py-2 px-4 rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 active:scale-[0.97]"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-300 font-medium"
                >
                  <ClipboardList className="w-4 h-4" />
                  My Orders
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors duration-300 font-medium"
                >
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-white/50 hover:text-white transition-colors duration-300"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="btn-gold text-sm py-3 px-6"
              >
                Sign In
              </button>
            )}
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
                href="#about"
                className="text-white/70 hover:text-gold transition-colors duration-300 font-medium py-2"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white/70 hover:text-gold transition-colors duration-300 font-medium py-2"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
              >
                Contact
              </a>

              {user ? (
                <>
                  {user.email === "delarey.skylands@gmail.com" && (
                    <button
                      onClick={() => { navigate("/admin-portal"); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-2 bg-gradient-to-r from-[hsl(43,74%,49%)] to-[hsl(43,74%,42%)] text-navy-dark font-semibold py-3 px-4 rounded-xl text-center"
                    >
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }}
                    className="text-white/70 hover:text-gold transition-colors duration-300 font-medium py-2 text-left flex items-center gap-2"
                  >
                    <ClipboardList className="w-4 h-4" /> My Orders
                  </button>
                  <button
                    onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                    className="text-gold hover:text-gold-light transition-colors duration-300 font-medium py-2 text-left flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button
                    onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                    className="text-white/50 hover:text-white transition-colors duration-300 font-medium py-2 text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}
                  className="btn-gold text-center py-4 mt-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
