import React from 'react';
import { Layers, BarChart3, Info, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import { GisLayer } from '@/config/gis_layers';
import { EnhancedLayerControl } from './EnhancedLayerControl';
import { BasemapSelector } from './BasemapSelector';

interface WebGISSidebarProps {
    layers: GisLayer[];
    onToggleLayer: (id: string) => void;
    onOpacityChange: (id: string, opacity: number) => void;
    layerOpacity: Record<string, number>;
    isOpen: boolean;
    onToggle: () => void;
    selectedBasemap: string;
    onBasemapChange: (basemapId: string) => void;
}

export const WebGISSidebar: React.FC<WebGISSidebarProps> = ({
    layers,
    onToggleLayer,
    onOpacityChange,
    layerOpacity,
    isOpen,
    onToggle,
    selectedBasemap,
    onBasemapChange
}) => {
    const visibleLayersCount = layers.filter(l => l.visible).length;

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 bottom-0 w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transform transition-transform duration-300 z-40 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 space-y-4">
                    {/* Basemap Selector */}
                    <BasemapSelector
                        selectedBasemap={selectedBasemap}
                        onBasemapChange={onBasemapChange}
                    />

                    {/* Map Statistics */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                            <BarChart3 className="w-4 h-4" />
                            Statistik Peta
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-teal-400">{layers.length}</div>
                                <div className="text-xs text-gray-400">Total Layer</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-teal-400">{visibleLayersCount}</div>
                                <div className="text-xs text-gray-400">Layer Aktif</div>
                            </div>
                        </div>
                    </div>

                    {/* Layer Control */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                            <Layers className="w-4 h-4" />
                            Kontrol Layer
                        </h2>
                        <EnhancedLayerControl
                            layers={layers}
                            onToggleLayer={onToggleLayer}
                            onOpacityChange={onOpacityChange}
                            layerOpacity={layerOpacity}
                        />
                    </div>

                    {/* Map Information */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                            <Info className="w-4 h-4" />
                            Informasi Peta
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div>
                                <div className="text-xs text-gray-400">Wilayah Coverage</div>
                                <div className="font-semibold">Papua Barat Daya</div>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                Peta interaktif menampilkan berbagai layer tematik untuk wilayah Papua Barat Daya,
                                termasuk informasi topografi, kelerengan, kawasan hutan, dan infrastruktur jalan.
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Legend */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <h2 className="flex items-center gap-2 text-sm font-bold mb-3">
                            <Palette className="w-4 h-4" />
                            Legenda
                        </h2>
                        <div className="space-y-3">
                            {layers.filter(l => l.visible).map(layer => (
                                <div key={layer.id} className="space-y-1">
                                    <div className="text-xs font-semibold text-teal-300">{layer.name}</div>
                                    {layer.legendItems && layer.legendItems.length > 0 ? (
                                        // Layer with custom legend items
                                        <div className="space-y-1 pl-2">
                                            {layer.legendItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-xs text-gray-300">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Layer with single color
                                        <div className="flex items-center gap-2 pl-2">
                                            <div
                                                className="w-4 h-4 rounded border border-gray-300"
                                                style={{ backgroundColor: layer.color }}
                                            />
                                            <span className="text-xs text-gray-300">Layer {layer.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {visibleLayersCount === 0 && (
                                <p className="text-xs text-gray-500 italic">Tidak ada layer aktif</p>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-700 to-teal-600 text-white p-2 rounded-r-lg shadow-lg z-50 hover:from-teal-600 hover:to-teal-500 transition-all"
                style={{ left: isOpen ? '320px' : '0' }}
            >
                {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
        </>
    );
};
