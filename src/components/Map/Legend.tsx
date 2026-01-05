
import React from 'react';
import { GisLayer } from '@/config/gis_layers';

interface LegendProps {
    layers: GisLayer[];
}

export const Legend: React.FC<LegendProps> = ({ layers }) => {
    const visibleLayers = layers.filter(layer => layer.visible);

    if (visibleLayers.length === 0) return null;

    return (
        <div className="absolute bottom-8 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-[200px]">
            <h4 className="text-xs font-bold mb-2 uppercase text-gray-500 tracking-wider">Legenda</h4>
            <div className="space-y-2">
                {visibleLayers.map(layer => (
                    <div key={layer.id} className="flex items-center gap-2">
                        <span
                            className="w-4 h-1 rounded-full block"
                            style={{ backgroundColor: layer.color }}
                        ></span>
                        <span className="text-xs font-medium text-gray-700">{layer.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
