// WebGIS Map Viewer Component - v3.0.0 - Enhanced with Basemaps and Dynamic Styling
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GIS_LAYERS, GisLayer } from '@/config/gis_layers';
import { BASEMAPS } from '@/config/basemaps';
import { highlightStyle } from '@/config/layerStyles';
import { WebGISNavbar } from './WebGISNavbar';
import { WebGISSidebar } from './WebGISSidebar';
import { InfoBar } from './InfoBar';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map events
interface MapEventsHandlerProps {
    onMouseMove: (coords: { lat: number; lng: number }) => void;
    onZoomChange: (zoom: number) => void;
}

const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ onMouseMove, onZoomChange }) => {
    const map = useMapEvents({
        mousemove: (e) => {
            onMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
        zoomend: () => {
            onZoomChange(map.getZoom());
        }
    });

    useEffect(() => {
        // Set initial center
        map.setView([-1.0, 131.5], 9);
    }, [map]);

    return null;
};

export const MapViewer: React.FC = () => {
    const [layers, setLayers] = useState<GisLayer[]>(GIS_LAYERS);
    const [geoJsonData, setGeoJsonData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [zoom, setZoom] = useState(9);
    const [selectedBasemap, setSelectedBasemap] = useState('osm');
    const [highlightedFeature, setHighlightedFeature] = useState<{ layerId: string; featureId: any } | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const toggleLayer = (id: string) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    };

    const handleOpacityChange = (id: string, opacity: number) => {
        setLayerOpacity(prev => ({ ...prev, [id]: opacity }));
    };

    const handleFullscreenToggle = () => {
        if (!document.fullscreenElement) {
            mapContainerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleBasemapChange = (basemapId: string) => {
        setSelectedBasemap(basemapId);
    };

    useEffect(() => {
        const fetchLayerData = async (layer: GisLayer) => {
            if (geoJsonData[layer.id] || loading[layer.id]) return;

            console.log(`Fetching data for: ${layer.name}`);
            setLoading(prev => ({ ...prev, [layer.id]: true }));
            try {
                const response = await fetch(layer.url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                console.log(`Data fetched for ${layer.name}. Size: ${text.length} chars`);

                // Check if it's a .json file (pure JSON) or .js file (variable assignment)
                let data;
                if (layer.file.endsWith('.json')) {
                    // Pure JSON file
                    data = JSON.parse(text);
                } else {
                    // .js file with variable assignment
                    const firstBrace = text.indexOf('{');
                    const lastBrace = text.lastIndexOf('}');

                    if (firstBrace !== -1 && lastBrace !== -1) {
                        const jsonString = text.substring(firstBrace, lastBrace + 1);
                        data = JSON.parse(jsonString);
                    } else {
                        throw new Error('Could not find JSON object structure');
                    }
                }

                console.log(`Parsed ${layer.name}. Type: ${data.type}, Keys: ${Object.keys(data).join(', ')}`);

                // Handle different GeoJSON formats
                let featureCollection;

                if (data.type === 'FeatureCollection') {
                    // Standard FeatureCollection
                    featureCollection = data;
                } else if (data.type === 'Feature') {
                    // Single Feature - wrap in FeatureCollection
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: [data]
                    };
                } else if (data.type === 'GeometryCollection') {
                    // GeometryCollection - convert to FeatureCollection
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: data.geometries.map((geom: any, idx: number) => ({
                            type: 'Feature',
                            id: idx,
                            geometry: geom,
                            properties: {}
                        }))
                    };
                } else if (Array.isArray(data)) {
                    // Array of features
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: data
                    };
                } else if (data.features && Array.isArray(data.features)) {
                    // Has features array but missing type
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: data.features
                    };
                } else {
                    console.error(`Unsupported format for ${layer.name}:`, data);
                    throw new Error(`Unsupported GeoJSON format. Type: ${data.type || 'unknown'}`);
                }

                console.log(`Success: Converted ${layer.name} to FeatureCollection. Features: ${featureCollection.features?.length || 0}`);
                setGeoJsonData(prev => ({ ...prev, [layer.id]: featureCollection }));

            } catch (error) {
                console.error(`Error loading ${layer.name}:`, error);
                alert(`Gagal memuat layer ${layer.name}: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(prev => ({ ...prev, [layer.id]: false }));
            }
        };

        layers.forEach(layer => {
            if (layer.visible && !geoJsonData[layer.id]) {
                fetchLayerData(layer);
            }
        });
    }, [layers, geoJsonData, loading]);

    const onEachFeature = (layerId: string, layer: GisLayer) => (feature: any, leafletLayer: any) => {
        if (feature.properties) {
            const props = feature.properties;
            let popupContent = '';

            // Helper to generate full attribute table
            const generateAttributesTable = (properties: any) => {
                const entries = Object.entries(properties);
                const tableRows = entries
                    .filter(([_, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => `
                        <tr class="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                            <td class="font-semibold p-2 text-xs text-gray-700 bg-gray-50 break-words w-1/3">${key}</td>
                            <td class="p-2 text-xs text-gray-900 break-all">${value}</td>
                        </tr>
                    `).join('');

                return `
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <h4 class="font-bold text-xs text-gray-500 mb-2 uppercase tracking-wider">Detail Atribut</h4>
                        <div class="max-h-[200px] overflow-y-auto border border-gray-200 rounded">
                            <table class="w-full border-collapse">
                                <tbody>${tableRows}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            };

            // Layer-specific popup content
            if (layerId === 'bts_desa') {
                // Batas Desa - Show administrative hierarchy
                const kelurahan = props.DESA || props.NAMOBJ || props.NAMA_DESA || props.KELURAHAN || props.KAMPUNG || '-';
                const distrik = props.KECAMATAN || props.DISTRIK || props.NAMA_KEC || '-';
                const kabupaten = props.KABUPATEN || props.KAB_KOTA || props.NAMA_KAB || '-';

                popupContent = `
                    <div class="min-w-[280px]">
                        <h3 class="font-bold text-base mb-3 text-teal-700 border-b-2 border-teal-700 pb-2">Informasi Wilayah Administratif</h3>
                        <div class="space-y-2">
                            <div class="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-600">
                                <div class="text-xs text-gray-600 font-semibold mb-1">KELURAHAN/KAMPUNG</div>
                                <div class="text-base font-bold text-teal-800">${kelurahan}</div>
                            </div>
                            <div class="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600">
                                <div class="text-xs text-gray-600 font-semibold mb-1">DISTRIK</div>
                                <div class="text-sm font-bold text-blue-800">${distrik}</div>
                            </div>
                            <div class="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-600">
                                <div class="text-xs text-gray-600 font-semibold mb-1">KABUPATEN</div>
                                <div class="text-sm font-bold text-purple-800">${kabupaten}</div>
                            </div>
                        </div>
                        ${generateAttributesTable(props)}
                    </div>
                `;
            } else if (layerId === 'sk_hutan') {
                // SK Hutan - Show forest zone with color indicator
                const namaKawasan = props.NAMOBJ || props.NAMA_KAWASAN || props.NAMA || '-';
                const fungsi = props.FUNGSI_KWS || props.FUNGSI || props.JENIS || '-';
                const luas = props.LUAS || props.SHAPE_AREA || props.AREA || '-';

                // Determine color based on function
                let colorClass = 'bg-green-600';
                let colorBg = 'bg-green-50';
                if (fungsi.includes('LINDUNG') || fungsi.includes('Lindung')) {
                    colorClass = 'bg-green-800';
                    colorBg = 'bg-green-50';
                } else if (fungsi.includes('PRODUKSI TERBATAS')) {
                    colorClass = 'bg-green-400';
                    colorBg = 'bg-green-50';
                } else if (fungsi.includes('PRODUKSI')) {
                    colorClass = 'bg-green-500';
                    colorBg = 'bg-green-50';
                } else if (fungsi.includes('KONSERVASI')) {
                    colorClass = 'bg-green-900';
                    colorBg = 'bg-green-50';
                } else if (fungsi.includes('APL')) {
                    colorClass = 'bg-yellow-400';
                    colorBg = 'bg-yellow-50';
                }

                popupContent = `
                    <div class="min-w-[280px]">
                        <h3 class="font-bold text-base mb-3 text-green-700 border-b-2 border-green-700 pb-2">SK Kawasan Hutan</h3>
                        <div class="space-y-2">
                            <div class="${colorBg} p-3 rounded-lg border-l-4 ${colorClass}">
                                <div class="text-xs text-gray-600 font-semibold mb-1">NAMA KAWASAN</div>
                                <div class="text-base font-bold text-gray-800">${namaKawasan}</div>
                            </div>
                            <div class="${colorBg} p-3 rounded-lg">
                                <div class="flex items-center gap-2 mb-1">
                                    <div class="w-4 h-4 rounded ${colorClass}"></div>
                                    <div class="text-xs text-gray-600 font-semibold">FUNGSI KAWASAN</div>
                                </div>
                                <div class="text-sm font-bold text-gray-800">${fungsi}</div>
                            </div>
                            ${luas !== '-' ? `
                            <div class="bg-gray-50 p-2 rounded">
                                <div class="text-xs text-gray-600">Luas: <span class="font-semibold">${luas}</span></div>
                            </div>
                            ` : ''}
                        </div>
                        ${generateAttributesTable(props)}
                    </div>
                `;
            } else if (layerId === 'dis_banjir') {
                // Flood Risk - Show risk level with color
                const riskLevel = props.RESIKO || props.TINGKAT || props.LEVEL || props.KELAS || '-';
                const lokasi = props.LOKASI || props.DESA || props.NAMOBJ || '-';

                let riskColor = 'bg-green-600';
                let riskBg = 'bg-green-50';
                let riskText = 'text-green-800';

                if (typeof riskLevel === 'string') {
                    const level = riskLevel.toUpperCase();
                    if (level.includes('SANGAT TINGGI')) {
                        riskColor = 'bg-red-900';
                        riskBg = 'bg-red-50';
                        riskText = 'text-red-900';
                    } else if (level.includes('TINGGI')) {
                        riskColor = 'bg-red-600';
                        riskBg = 'bg-red-50';
                        riskText = 'text-red-800';
                    } else if (level.includes('SEDANG')) {
                        riskColor = 'bg-yellow-500';
                        riskBg = 'bg-yellow-50';
                        riskText = 'text-yellow-800';
                    }
                }

                popupContent = `
                    <div class="min-w-[280px]">
                        <h3 class="font-bold text-base mb-3 text-orange-700 border-b-2 border-orange-700 pb-2">Daerah Rawan Banjir</h3>
                        <div class="space-y-2">
                            <div class="${riskBg} p-3 rounded-lg border-l-4 ${riskColor}">
                                <div class="flex items-center gap-2 mb-1">
                                    <div class="w-4 h-4 rounded ${riskColor}"></div>
                                    <div class="text-xs text-gray-600 font-semibold">TINGKAT RESIKO</div>
                                </div>
                                <div class="text-base font-bold ${riskText}">${riskLevel}</div>
                            </div>
                            ${lokasi !== '-' ? `
                            <div class="bg-gray-50 p-3 rounded-lg">
                                <div class="text-xs text-gray-600 font-semibold mb-1">LOKASI</div>
                                <div class="text-sm font-semibold text-gray-800">${lokasi}</div>
                            </div>
                            ` : ''}
                        </div>
                        ${generateAttributesTable(props)}
                    </div>
                `;
            } else if (layerId === 'jln_provinsi') {
                // Roads - Show road information
                const namaJalan = props.NAMRJL || props.NAMA_JALAN || props.NAMOBJ || '-';
                const statusJalan = props.STATUS || props.FUNGSI || props.KELAS || '-';
                const panjang = props.PANJANG || props.LENGTH || props.SHAPE_LEN || '-';

                popupContent = `
                    <div class="min-w-[280px]">
                        <h3 class="font-bold text-base mb-3 text-red-700 border-b-2 border-red-700 pb-2">Jalan Provinsi</h3>
                        <div class="space-y-2">
                            <div class="bg-red-50 p-3 rounded-lg border-l-4 border-red-600">
                                <div class="text-xs text-gray-600 font-semibold mb-1">NAMA JALAN</div>
                                <div class="text-base font-bold text-red-800">${namaJalan}</div>
                            </div>
                            ${statusJalan !== '-' ? `
                            <div class="bg-gray-50 p-2 rounded">
                                <div class="text-xs text-gray-600">Status: <span class="font-semibold">${statusJalan}</span></div>
                            </div>
                            ` : ''}
                            ${panjang !== '-' ? `
                            <div class="bg-gray-50 p-2 rounded">
                                <div class="text-xs text-gray-600">Panjang: <span class="font-semibold">${panjang}</span></div>
                            </div>
                            ` : ''}
                        </div>
                        ${generateAttributesTable(props)}
                    </div>
                `;
            } else {
                // Default popup for other layers
                const entries = Object.entries(props);
                const tableRows = entries
                    .filter(([_, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => `
                        <tr class="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                            <td class="font-semibold p-2 text-xs text-gray-700 bg-gray-50 break-words w-1/3">${key}</td>
                            <td class="p-2 text-xs text-gray-900 break-all">${value}</td>
                        </tr>
                    `).join('');

                popupContent = `
                    <div class="min-w-[250px] max-h-[400px] overflow-y-auto">
                        <h3 class="font-bold text-sm mb-2 text-teal-700 border-b pb-1 overflow-hidden text-ellipsis whitespace-nowrap" title="${layer.name}">${layer.name}</h3>
                        <table class="w-full border-collapse">
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                `;
            }

            leafletLayer.bindPopup(popupContent, { maxWidth: 400 });

            // Add click handler for highlighting
            if (layer.highlightable) {
                leafletLayer.on('click', () => {
                    setHighlightedFeature({
                        layerId: layerId,
                        featureId: feature.id || feature.properties.id || Math.random()
                    });
                });
            }
        }
    };

    // Get style for a feature
    const getFeatureStyle = (layer: GisLayer, feature: any) => {
        const opacity = (layerOpacity[layer.id] || 100) / 100;
        const isHighlighted = highlightedFeature?.layerId === layer.id &&
            (highlightedFeature?.featureId === feature.id ||
                highlightedFeature?.featureId === feature.properties?.id);

        // If highlighted, use highlight style
        if (isHighlighted) {
            return highlightStyle;
        }

        // If layer has custom style function, use it
        if (layer.styleFunction) {
            const customStyle = layer.styleFunction(feature);
            return {
                color: layer.color, // Default to layer color if not in customStyle
                ...customStyle,
                opacity: (customStyle.opacity !== undefined ? customStyle.opacity : 1) * opacity,
                fillOpacity: (customStyle.fillOpacity !== undefined ? customStyle.fillOpacity : 0.3) * opacity
            };
        }

        // Default style
        return {
            color: layer.color,
            weight: 2,
            opacity: opacity,
            fillOpacity: opacity * 0.3
        };
    };

    // Get current basemap
    const currentBasemap = BASEMAPS.find(b => b.id === selectedBasemap) || BASEMAPS[0];

    return (
        <div ref={mapContainerRef} className="relative w-full h-screen flex flex-col" style={{ height: '100vh', minHeight: '600px' }}>
            <WebGISNavbar onFullscreenToggle={handleFullscreenToggle} />

            <div className="flex-1 relative">
                <MapContainer
                    center={[-1.0, 131.5]}
                    zoom={9}
                    scrollWheelZoom={true}
                    className="w-full h-full z-0"
                    zoomControl={false}
                >
                    {/* Basemap Layer */}
                    <TileLayer
                        attribution={currentBasemap.attribution}
                        url={currentBasemap.url}
                        maxZoom={currentBasemap.maxZoom}
                    />

                    <MapEventsHandler
                        onMouseMove={setCoordinates}
                        onZoomChange={setZoom}
                    />

                    {/* Zoom Control */}
                    <div className="leaflet-top leaflet-left">
                        <div className="leaflet-control leaflet-bar">
                            {/* Leaflet will add zoom controls here */}
                        </div>
                    </div>

                    {/* GeoJSON Layers */}
                    {layers.map(layer => {
                        if (!layer.visible || !geoJsonData[layer.id]) return null;

                        return (
                            <GeoJSON
                                key={`${layer.id}-${highlightedFeature?.featureId || 'none'}`}
                                data={geoJsonData[layer.id]}
                                style={(feature) => getFeatureStyle(layer, feature)}
                                onEachFeature={onEachFeature(layer.id, layer)}
                            />
                        );
                    })}
                </MapContainer>

                <WebGISSidebar
                    layers={layers}
                    onToggleLayer={toggleLayer}
                    onOpacityChange={handleOpacityChange}
                    layerOpacity={layerOpacity}
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    selectedBasemap={selectedBasemap}
                    onBasemapChange={handleBasemapChange}
                />

                {/* Loading Indicator */}
                {Object.values(loading).some(Boolean) && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent"></div>
                        <span className="text-sm text-gray-700">Loading layers...</span>
                    </div>
                )}
            </div>

            <InfoBar coordinates={coordinates} zoom={zoom} />
        </div>
    );
};
