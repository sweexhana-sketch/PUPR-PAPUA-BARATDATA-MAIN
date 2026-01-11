import { Mail, MapPin, Phone, Facebook, Instagram, Youtube } from "lucide-react";
import logoPupr from "@/assets/logo-pupr.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <img src={logoPupr} alt="Logo PUPR Papua Barat Daya" className="h-20 w-auto" />
            <p className="text-primary-foreground/90 text-sm font-semibold italic">
              "Masyarakat Papua Barat Daya yang Maju, Mandiri, dan Sejahtera Berbasis Pertumbuhan Ekonomi Lokal dalam Pembangunan yang Berkesinambungan"
            </p>
            <p className="text-primary-foreground/80 text-sm">
              Provinsi Papua Barat Daya
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Kontak Kami</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Sorong, Papua Barat Daya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>-</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>-</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Tautan Penting</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="https://papuabaratdayaprov.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Website Provinsi Papua Barat Daya
                </a>
              </li>
              <li>
                <a href="/webgis" className="hover:text-accent transition-colors">
                  Web GIS PUPR
                </a>
              </li>
              <li>
                <a href="/admin/login" className="hover:text-accent transition-colors">
                  Login Admin
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="pt-4">
              <h3 className="font-bold text-lg mb-4">Sosial Media</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all" aria-label="TikTok">
                  {/* TikTok Icon using SVG since it's not in Lucide */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="mailto:pupr.papuabaratdaya@gmail.com" className="bg-white/10 p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-all" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Dinas Pekerjaan Umum dan Perumahan Rakyat Provinsi Papua Barat Daya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
