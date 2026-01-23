// WebGIS Map Viewer Component - v3.0.0 - Enhanced with Basemaps and Dynamic Styling
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GIS_LAYERS, GisLayer } from '@/config/gis_layers';
import { BASEMAPS } from '@/config/basemaps';
import { highlightStyle, batasDesaHighlightStyle, batasKabupatenHighlightStyle, floodRiskHighlightStyle } from '@/config/layerStyles';
import { findFeaturesAtPoint } from '@/lib/geoUtils';
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
    onMapClick?: (coords: { lat: number; lng: number }) => void;
}

const MapEventsHandler: React.FC<MapEventsHandlerProps> = ({ onMouseMove, onZoomChange, onMapClick }) => {
    const map = useMapEvents({
        mousemove: (e) => {
            onMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
        click: (e) => {
            if (onMapClick) {
                onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
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
    const [highlightedFeatures, setHighlightedFeatures] = useState<{ layerId: string; featureId: any }[]>([]);
    const [popupInfo, setPopupInfo] = useState<{ position: { lat: number; lng: number }; content: string } | null>(null);
    const [hoverInfo, setHoverInfo] = useState<string | null>(null);
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
                    featureCollection = data;
                } else if (data.type === 'Feature') {
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: [data]
                    };
                } else if (data.type === 'GeometryCollection') {
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: data.geometries.map((geom: any, idx: number) => ({
                            type: 'Feature',
                            geometry: geom,
                            properties: {}
                        }))
                    };
                } else if (Array.isArray(data)) {
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: data
                    };
                } else if (data.features && Array.isArray(data.features)) {
                    featureCollection = {
                        type: 'FeatureCollection',
                        features: data.features
                    };
                } else {
                    console.error(`Unsupported format for ${layer.name}:`, data);
                    throw new Error(`Unsupported GeoJSON format. Type: ${data.type || 'unknown'}`);
                }

                // Ensure every feature has a unique ID for React keys and Highlighting
                if (featureCollection.features) {
                    featureCollection.features.forEach((f: any, idx: number) => {
                        if (!f.id && !f.properties?.id) {
                            f.id = idx; // Assign index as fallback ID
                        }
                    });
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


    // Helper to generate popup content for a single feature
    const getPopupContent = (layer: GisLayer, feature: any) => {
        const props = feature.properties || {};
        const layerId = layer.id;
        let popupContent = '';

        // Helper to generate full attribute table
        const generateAttributesTable = (properties: any) => {
            if (!properties || Object.keys(properties).length === 0) {
                return '<div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 italic">Tidak ada data atribut tambahan.</div>';
            }

            const entries = Object.entries(properties);
            // Sort keys alphabetically
            entries.sort((a, b) => a[0].localeCompare(b[0]));

            const tableRows = entries
                .map(([key, value]) => {
                    // Handle potential object/array values by stringifying them for display
                    let displayValue = value;
                    if (value === null || value === undefined || value === '') {
                        displayValue = '-';
                    } else if (typeof value === 'object') {
                        displayValue = JSON.stringify(value);
                    } else {
                        displayValue = String(value);
                    }

                    return `
                    <tr class="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                        <td class="font-semibold p-2 text-xs text-gray-700 bg-gray-50 break-words w-1/3">${key}</td>
                        <td class="p-2 text-xs text-gray-900 break-all">${displayValue}</td>
                    </tr>
                `;
                }).join('');

            if (!tableRows) {
                return '<div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 italic">Data atribut kosong.</div>';
            }

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
            // Batas Desa - Show administrative hierarchy with unified property checks
            const desa = props.DESA || props.NAMOBJ || props.NAMA_DESA || props.KELURAHAN || props.KAMPUNG || '-';
            const kecamatan = props.KECAMATAN || props.WADMKC || props.DISTRIK || props.NAMA_KEC || '-';
            const kabupaten = props.KABUPATEN || props.WADMKK || props.KAB_KOTA || props.NAMA_KAB || '-';

            popupContent = `
                <div class="min-w-[280px] mb-4">
                     <div class="bg-orange-50 px-3 py-2 rounded-t-lg border-b border-orange-100 flex items-center justify-between">
                         <h3 class="font-bold text-sm text-orange-800">${layer.name}</h3>
                         <span class="text-xs text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200">Administrasi</span>
                    </div>
                    <div class="p-3 bg-white rounded-b-lg border border-orange-100 shadow-sm">
                        <div class="space-y-3">
                             <div>
                                <div class="text-xs text-gray-500 font-semibold">DESA / KELURAHAN</div>
                                <div class="text-lg font-bold text-gray-800">${desa}</div>
                             </div>
                             <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <div class="text-xs text-gray-500 font-semibold">KECAMATAN</div>
                                    <div class="text-sm font-medium text-gray-700">${kecamatan}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-500 font-semibold">KABUPATEN</div>
                                    <div class="text-sm font-medium text-gray-700">${kabupaten}</div>
                                </div>
                             </div>
                        </div>
                        ${generateAttributesTable(props)}
                    </div>
                </div>
                </div>
            `;
        } else if (layerId === 'bts_kab') {
            // Batas Kabupaten - Show only Name (Simplified)
            const kabupaten = props.NAMOBJ || props.KABUPATEN || props.NAMA_KAB || props.WADMKK || '-';

            popupContent = `
                <div class="min-w-[150px]">
                    <div class="bg-white px-3 py-2 rounded-lg border border-orange-200 shadow-sm text-center">
                         <div class="text-sm font-bold text-gray-800 uppercase tracking-wide">${kabupaten}</div>
                    </div>
                </div>
            `;
            // SK Hutan - Show forest zone with color indicator
            const namaKawasan = props.NAMOBJ || props.NAMA_KAWASAN || props.NAMA || '-';
            const fungsi = props.FUNGSI_KWS || props.FUNGSI || props.JENIS || '-';
            const luas = props.LUAS || props.SHAPE_AREA || props.AREA || '-';

            // Determine color based on function
            let colorClass = 'bg-green-600';
            const colorBg = 'bg-green-50';
            if (fungsi.includes('LINDUNG') || fungsi.includes('Lindung')) {
                colorClass = 'bg-green-800';
            } else if (fungsi.includes('PRODUKSI TERBATAS')) {
                colorClass = 'bg-green-400';
            } else if (fungsi.includes('PRODUKSI')) {
                colorClass = 'bg-green-500';
            } else if (fungsi.includes('KONSERVASI')) {
                colorClass = 'bg-green-900';
            } else if (fungsi.includes('APL')) {
                colorClass = 'bg-yellow-400';
            }

            popupContent = `
                <div class="min-w-[280px] mb-4">
                     <div class="${colorBg} px-3 py-2 rounded-t-lg border-b border-green-100 flex items-center justify-between">
                         <h3 class="font-bold text-sm text-green-800">${layer.name}</h3>
                         <div class="flex items-center gap-1">
                             <div class="w-3 h-3 rounded-full ${colorClass}"></div>
                             <span class="text-xs text-green-700 font-medium">Kawasan Hutan</span>
                         </div>
                    </div>
                    <div class="p-3 bg-white rounded-b-lg border border-green-100 shadow-sm">
                        <div class="space-y-3">
                            <div>
                                <div class="text-xs text-gray-500 font-semibold">NAMA KAWASAN</div>
                                <div class="text-sm font-bold text-gray-800">${namaKawasan}</div>
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 font-semibold">FUNGSI</div>
                                <div class="text-sm font-medium text-gray-800 bg-gray-50 px-2 py-1 rounded inline-block">${fungsi}</div>
                            </div>
                             ${luas !== '-' ? `
                            <div class="text-xs text-gray-500">
                                Luas: <span class="font-semibold text-gray-700">${luas}</span>
                            </div>
                            ` : ''}
                        </div>
                        ${generateAttributesTable(props)}
                    </div>
                </div>
            `;
        } else if (layerId === 'dis_banjir') {
            // Flood Risk - Show risk level with color
            const riskLevel = props.rwn_banjir || props.RESIKO || props.TINGKAT || props.LEVEL || props.KELAS || '-';
            const lokasi = props.LOKASI || props.DESA || props.NAMOBJ || '-';

            let riskColor = 'bg-green-600';
            let riskBg = 'bg-green-50';
            let riskText = 'text-green-800';

            if (typeof riskLevel === 'string') {
                const level = riskLevel.toUpperCase();
                if (level.includes('SANGAT TINGGI')) {
                    riskColor = 'bg-red-600';
                    riskBg = 'bg-red-50';
                    riskText = 'text-red-800';
                } else if (level.includes('TINGGI')) {
                    riskColor = 'bg-orange-600';
                    riskBg = 'bg-orange-50';
                    riskText = 'text-orange-800';
                } else if (level.includes('SEDANG')) {
                    riskColor = 'bg-yellow-500';
                    riskBg = 'bg-yellow-50';
                    riskText = 'text-yellow-800';
                }
            }

            popupContent = `
                 <div class="min-w-[280px] mb-4">
                     <div class="${riskBg} px-3 py-2 rounded-t-lg border-b border-red-100 flex items-center justify-between">
                         <h3 class="font-bold text-sm ${riskText}">${layer.name}</h3>
                         <span class="text-xs bg-white/80 px-2 py-0.5 rounded border border-red-200 ${riskText}">Rawan Bencana</span>
                    </div>
                    <div class="p-3 bg-white rounded-b-lg border border-red-100 shadow-sm">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-12 h-12 rounded-lg ${riskColor} flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-sm">
                                !
                            </div>
                            <div>
                                <div class="text-xs text-gray-500 font-semibold">TINGKAT RESIKO</div>
                                <div class="text-base font-bold ${riskText}">${riskLevel}</div>
                            </div>
                        </div>
                         ${lokasi !== '-' ? `
                        <div class="bg-gray-50 p-2 rounded text-sm">
                            <span class="text-gray-500 text-xs">Lokasi:</span> <span class="font-medium text-gray-800">${lokasi}</span>
                        </div>
                        ` : ''}
                        ${generateAttributesTable(props)}
                    </div>
                </div>
            `;
        } else if (layerId === 'jln_provinsi' || layerId === 'jln_prov_pbd' || layerId === 'jalan_nasional') {
            const namaJalan = props.NAMRJL || props.NAMA_JALAN || props.NAMOBJ || '-';
            const statusJalan = props.STATUS || props.FUNGSI || props.KELAS || '-';
            const panjang = props.PANJANG || props.LENGTH || props.SHAPE_LEN || '-';

            popupContent = `
                <div class="min-w-[280px] mb-4">
                     <div class="bg-gray-800 px-3 py-2 rounded-t-lg flex items-center justify-between">
                         <h3 class="font-bold text-sm text-white">${layer.name}</h3>
                         <span class="text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded">Infrastruktur</span>
                    </div>
                     <div class="p-3 bg-white rounded-b-lg border border-gray-200 shadow-sm">
                        <div class="space-y-2">
                             <div>
                                <div class="text-xs text-gray-500 font-semibold">NAMA JALAN</div>
                                <div class="text-sm font-bold text-gray-800">${namaJalan}</div>
                             </div>
                             <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <div class="text-xs text-gray-500 font-semibold">STATUS</div>
                                    <div class="text-sm font-medium text-gray-700">${statusJalan}</div>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-500 font-semibold">PANJANG</div>
                                    <div class="text-sm font-medium text-gray-700">${panjang}</div>
                                </div>
                             </div>
                        </div>
                        ${generateAttributesTable(props)}
                     </div>
                </div>
            `;
        } else if (layerId === 'kemampuan_lahan_pbd') {
            const kelas = props.KELAS || props.KEMAMPUAN || props.NAMOBJ || '-';
            const keterangan = props.KETERANGAN || props.ARAHAN || '-';

            popupContent = `
                 <div class="min-w-[280px] mb-4">
                      <div class="bg-lime-50 px-3 py-2 rounded-t-lg border-b border-lime-100 flex items-center justify-between">
                         <h3 class="font-bold text-sm text-lime-800">${layer.name}</h3>
                         <span class="text-xs text-lime-700 bg-white px-2 py-0.5 rounded border border-lime-200">Lingkungan</span>
                    </div>
                    <div class="p-3 bg-white rounded-b-lg border border-lime-100 shadow-sm">
                        <div class="mb-3">
                             <div class="text-xs text-gray-500 font-semibold mb-1">KELAS KEMAMPUAN</div>
                             <div class="text-lg font-bold text-lime-800">${kelas}</div>
                        </div>
                        ${keterangan !== '-' ? `
                        <div class="bg-lime-50/50 p-2 rounded text-sm text-gray-700 mb-2 italic">
                            "${keterangan}"
                        </div>
                        ` : ''}
                        ${generateAttributesTable(props)}
                    </div>
                 </div>
             `;
        } else {
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
                <div class="min-w-[280px] mb-4">
                    <div class="bg-gray-50 px-3 py-2 rounded-t-lg border-b border-gray-200">
                        <h3 class="font-bold text-sm text-gray-700">${layer.name}</h3>
                    </div>
                    <div class="p-3 bg-white rounded-b-lg border border-gray-200 shadow-sm">
                         <div class="max-h-[200px] overflow-y-auto">
                            <table class="w-full border-collapse">
                                <tbody>${tableRows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
             `;
        }

        return popupContent;
    };

    const handleMapClick = (coords: { lat: number, lng: number }) => {
        // Find all features at the clicked point
        const features = findFeaturesAtPoint(coords, layers, geoJsonData);

        if (features.length > 0) {
            console.log(`Found ${features.length} features at click`, coords);

            // Generate content for all found features
            const contentParts = features.map(({ layer, feature }) => getPopupContent(layer, feature));

            // Join with some spacing
            const combinedContent = contentParts.join('');

            // Wrap in a container
            const finalContent = `<div class="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 -mr-2">${combinedContent}</div>`;

            setPopupInfo({
                position: coords,
                content: finalContent
            });

            // Highlight ALL found features
            // IMPORTANT: Use the assigned ID if available
            setHighlightedFeatures(features.map(({ layer, feature }) => ({
                layerId: layer.id,
                featureId: feature.id !== undefined ? feature.id : feature.properties?.id // Use ID assigned during load
            })));
        } else {
            setPopupInfo(null);
            setHighlightedFeatures([]);
        }
    };

    const onEachFeature = (layerId: string, layer: GisLayer) => (feature: any, leafletLayer: any) => {
        if (feature.properties) {
            // Attach click handler to ALL features to ensure we catch the click
            leafletLayer.on('click', (e: any) => {
                // Prevent map click from firing (which would just duplicate this check)
                L.DomEvent.stopPropagation(e);

                // Trigger the unified lookup using the click coordinates
                handleMapClick(e.latlng);
            });

            // Hover effects for InfoBar and Highlight
            leafletLayer.on('mouseover', (e: any) => {
                const props = feature.properties;
                // Determine best label based on layer type
                let label = '';
                if (layerId === 'bts_desa') {
                    label = `Desa: ${props.NAMOBJ || props.DESA || props.NAMA_DESA || '-'}`;
                } else if (layerId.includes('hutan')) {
                    label = `${layer.name}: ${props.NAMOBJ || props.FUNGSI || '-'}`;
                } else if (layerId.includes('resiko')) {
                    label = `${layer.name}: ${props.RESIKO || props.NAMOBJ || '-'}`;
                } else {
                    label = props.NAMOBJ || props.NAMA || props.RESIKO || layer.name;
                }

                setHoverInfo(label);

                // Optional: Highlight on hover if not already selected
                if (layer.highlightable) {
                    leafletLayer.setStyle({ weight: (layer.styleFunction ? 3 : 4), fillOpacity: 0.2 });
                }
            });

            leafletLayer.on('mouseout', (e: any) => {
                setHoverInfo(null);

                // Reset style styling
                if (layer.highlightable) {
                    // Re-apply original style logic basically
                    const opacity = (layerOpacity[layerId] || 100) / 100;
                    leafletLayer.setStyle({
                        weight: layerId.includes('kontur') ? 1 : 2,
                        fillOpacity: (layerId.includes('kontur')) ? 0 : 0.3 * opacity
                    });
                }
            });
        }
    };

    // Get style for a feature
    const getFeatureStyle = (layer: GisLayer, feature: any) => {
        const opacity = (layerOpacity[layer.id] || 100) / 100;
        const isHighlighted = highlightedFeatures.some(h =>
            h.layerId === layer.id &&
            (h.featureId === feature.id || h.featureId === feature.properties?.id)
        );

        // If highlighted, use highlight style
        if (isHighlighted) {
            if (layer.id === 'bts_desa') {
                return batasDesaHighlightStyle;
            } else if (layer.id === 'bts_kab') {
                return batasKabupatenHighlightStyle;
            } else if (layer.id === 'dis_banjir' || layer.category === 'risk') {
                return floodRiskHighlightStyle;
            }
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
                        onMapClick={handleMapClick}
                    />

                    {popupInfo && (
                        <Popup
                            position={popupInfo.position}
                            eventHandlers={{
                                remove: () => setPopupInfo(null)
                            }}
                            maxWidth={400}
                        >
                            <div dangerouslySetInnerHTML={{ __html: popupInfo.content }} />
                        </Popup>
                    )}

                    {/* Zoom Control */}
                    <div className="leaflet-top leaflet-left">
                        <div className="leaflet-control leaflet-bar">
                            {/* Leaflet will add zoom controls here */}
                        </div>
                    </div>

                    {/* GeoJSON Layers */}
                    {layers.map(layer => {
                        if (!layer.visible || !geoJsonData[layer.id]) return null;

                        const layerHighlights = highlightedFeatures.filter(h => h.layerId === layer.id).map(h => h.featureId).join('-');

                        return (
                            <GeoJSON
                                key={`${layer.id}-${layerHighlights}`}
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

            <InfoBar coordinates={coordinates} zoom={zoom} hoverInfo={hoverInfo} />
        </div>
    );
};
