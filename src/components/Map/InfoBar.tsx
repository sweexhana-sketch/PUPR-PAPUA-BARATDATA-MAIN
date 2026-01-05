import React from 'react';
import { Crosshair, ZoomIn } from 'lucide-react';

interface InfoBarProps {
    coordinates: { lat: number; lng: number } | null;
    zoom: number;
}

export const InfoBar: React.FC<InfoBarProps> = ({ coordinates, zoom }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 shadow-lg z-40 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Crosshair className="w-3 h-3" />
                        <span>
                            {coordinates
                                ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
                                : 'Arahkan kursor ke peta'
                            }
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ZoomIn className="w-3 h-3" />
                        <span>Zoom: {zoom}</span>
                    </div>
                </div>
                <div className="text-gray-400">
                    © qgis2web | Leaflet | QGIS | Dinas PUPR Papua Barat Daya
                </div>
            </div>
        </div>
    );
};
