import React from 'react';
import { Map, Layers } from 'lucide-react';
import { BASEMAPS, Basemap } from '@/config/basemaps';

interface BasemapSelectorProps {
    selectedBasemap: string;
    onBasemapChange: (basemapId: string) => void;
}

export const BasemapSelector: React.FC<BasemapSelectorProps> = ({
    selectedBasemap,
    onBasemapChange
}) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                <Map className="w-4 h-4" />
                Peta Dasar
            </h2>
            <div className="space-y-2">
                {BASEMAPS.map((basemap) => (
                    <button
                        key={basemap.id}
                        onClick={() => onBasemapChange(basemap.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${selectedBasemap === basemap.id
                                ? 'bg-teal-600 text-white font-semibold'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            <span>{basemap.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
