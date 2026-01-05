import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoPupr from "@/assets/logo-pupr.png";
import logoPbd from "@/assets/logo-pbd.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Profil", path: "/profil" },
    { name: "Berita", path: "/berita" },
    { name: "Galeri", path: "/galeri" },
    { name: "Kontak", path: "/kontak" },
    { name: "Web GIS", path: "/webgis" },
    { name: "SIGAP", path: "http://localhost:8080/login", external: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-ocean">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src={logoPbd} alt="Logo Papua Barat Daya" className="h-16 w-auto" />
            <img src={logoPupr} alt="Logo PUPR Papua Barat Daya" className="h-16 w-auto" />
            <div className="hidden md:block">
              <p className="text-primary-foreground/90 text-xs font-semibold italic">"Masyarakat Papua Barat Daya yang Maju, Mandiri, dan Sejahtera Berbasis Pertumbuhan Ekonomi Lokal dalam Pembangunan yang Berkesinambungan"</p>
              <p className="text-primary-foreground/70 text-xs mt-0.5">Provinsi Papua Barat Daya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-all font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg transition-all font-medium ${isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
