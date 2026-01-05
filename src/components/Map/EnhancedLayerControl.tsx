import React from 'react';
import { GisLayer } from '@/config/gis_layers';
import { Check } from 'lucide-react';

interface EnhancedLayerControlProps {
    layers: GisLayer[];
    onToggleLayer: (id: string) => void;
    onOpacityChange: (id: string, opacity: number) => void;
    layerOpacity: Record<string, number>;
}

export const EnhancedLayerControl: React.FC<EnhancedLayerControlProps> = ({
    layers,
    onToggleLayer,
    onOpacityChange,
    layerOpacity
}) => {
    return (
        <div className="space-y-2">
            {layers.map(layer => (
                <div key={layer.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    {/* Layer Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={layer.visible}
                                    onChange={() => onToggleLayer(layer.id)}
                                    className="sr-only peer"
                                />
                                <div className="w-5 h-5 border-2 border-gray-400 rounded peer-checked:bg-teal-600 peer-checked:border-teal-600 flex items-center justify-center transition-all">
                                    {layer.visible && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: layer.color }}
                            />
                            <span className="text-sm font-medium text-gray-200">{layer.name}</span>
                        </label>
                    </div>

                    {/* Opacity Slider */}
                    {layer.visible && (
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={layerOpacity[layer.id] || 100}
                                onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value))}
                                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, ${layer.color} 0%, ${layer.color} ${layerOpacity[layer.id] || 100}%, #4b5563 ${layerOpacity[layer.id] || 100}%, #4b5563 100%)`
                                }}
                            />
                            <span className="text-xs text-gray-400 w-10 text-right">
                                {layerOpacity[layer.id] || 100}%
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
