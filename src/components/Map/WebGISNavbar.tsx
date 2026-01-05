import React from 'react';
import { Search, Maximize2 } from 'lucide-react';

interface WebGISNavbarProps {
    onFullscreenToggle: () => void;
}

export const WebGISNavbar: React.FC<WebGISNavbarProps> = ({ onFullscreenToggle }) => {
    return (
        <nav className="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg z-50">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <img
                        src="/images/logo-pupr-pbd.png"
                        alt="Logo PUPR Papua Barat Daya"
                        className="h-14 w-auto"
                    />
                    <div>
                        <h1 className="text-lg font-bold">Web GIS PUPR Papua Barat Daya</h1>
                        <p className="text-xs text-teal-100 italic">"Masyarakat Papua Barat Daya yang Maju, Mandiri, dan Sejahtera Berbasis Pertumbuhan Ekonomi Lokal dalam Pembangunan yang Berkesinambungan"</p>
                    </div>
                </div>

                {/* Search and Controls */}
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari lokasi..."
                            className="pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 w-64"
                        />
                    </div>
                    <button
                        onClick={onFullscreenToggle}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Fullscreen"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
