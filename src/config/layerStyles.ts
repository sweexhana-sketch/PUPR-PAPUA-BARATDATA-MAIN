// Layer styling functions for specialized layers
import { PathOptions } from 'leaflet';

export interface LegendItem {
    color: string;
    label: string;
}

// SK Hutan (Forest Decree) styling
// Helper to generate a consistent color from a string
const stringToColor = (str: string): string => {
    if (!str) return '#2E7D32'; // Default green

    // Palette of distinct colors suitable for maps
    const palette = [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
        '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
        '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
        '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
        '#E65100', '#1B5E20', '#0D47A1', '#FF6F00', '#006064'
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return palette[Math.abs(hash) % palette.length];
};

// SK Hutan (Forest Decree) styling
export const skHutanStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};
    const namaKawasan = props.NAMOBJ || props.NAMA_KAWASAN || props.NAMA || '';
    const fungsi = props.FUNGSI_KWS || props.FUNGSI || '';

    // If we have a specific area name, use it to generate a unique color
    // This satisfies the request to "bedakan nama kawasan masing2"
    let color: string;

    if (namaKawasan && namaKawasan !== '-') {
        color = stringToColor(namaKawasan);
    } else {
        // Fallback to function-based coloring if no name
        color = '#2E7D32'; // Default: dark green
        if (fungsi.includes('LINDUNG') || fungsi.includes('Lindung')) {
            color = '#2E7D32';
        } else if (fungsi.includes('PRODUKSI TERBATAS') || fungsi.includes('Produksi Terbatas')) {
            color = '#81C784';
        } else if (fungsi.includes('PRODUKSI') || fungsi.includes('Produksi')) {
            color = '#66BB6A';
        } else if (fungsi.includes('KONSERVASI') || fungsi.includes('Konservasi')) {
            color = '#1B5E20';
        } else if (fungsi.includes('APL') || fungsi.includes('PENGGUNAAN LAIN')) {
            color = '#FFF9C4';
        }
    }

    return {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.5 // Increased opacity to show the color differentiation
    };
};

export const skHutanLegend: LegendItem[] = [
    { color: '#1B5E20', label: 'Hutan Konservasi' },
    { color: '#2E7D32', label: 'Hutan Lindung' },
    { color: '#66BB6A', label: 'Hutan Produksi' },
    { color: '#81C784', label: 'Hutan Produksi Terbatas' },
    { color: '#FFF9C4', label: 'APL (Area Penggunaan Lain)' }
];

// Flood Risk styling
export const floodRiskStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};

    // Apply categorical coloring based on distinct location/name attributes first
    // This gives the "variety" look requested by user, similar to Forest Area
    const uniqueKey = props.NAMOBJ || props.NAMA_KAWASAN || props.DESA || props.LOKASI || props.REMARK || '';

    // Only use categorical coloring if we have a valid unique key string
    if (uniqueKey && uniqueKey !== '-' && typeof uniqueKey === 'string' && uniqueKey.length > 1) {
        return {
            color: stringToColor(uniqueKey),
            weight: 1,
            opacity: 0.9,
            fillOpacity: 0.6
        };
    }

    // Fallback to Risk Level based coloring if no specific location name
    const riskLevel = props.rwn_banjir || props.RESIKO || props.TINGKAT || props.LEVEL || props.KELAS || '';
    const riskValue = props.NILAI || props.VALUE || 0;

    let color = '#00C853'; // Default: Green (Low Risk)

    if (typeof riskLevel === 'string') {
        const level = riskLevel.toUpperCase();
        if (level.includes('SANGAT TINGGI') || level.includes('VERY HIGH')) {
            color = '#D50000'; // Red
        } else if (level.includes('TINGGI') || level.includes('HIGH')) {
            color = '#D50000'; // Red
        } else if (level.includes('SEDANG') || level.includes('MEDIUM') || level.includes('MODERATE')) {
            color = '#FFD600'; // Yellow
        } else if (level.includes('RENDAH') || level.includes('LOW')) {
            color = '#00C853'; // Green
        }
    } else if (typeof riskValue === 'number') {
        // Numeric risk value (assuming 1-4 scale)
        if (riskValue >= 3) {
            color = '#D50000'; // High
        } else if (riskValue >= 2) {
            color = '#FFD600'; // Medium
        } else {
            color = '#00C853'; // Low
        }
    }

    return {
        color: color,
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.7
    };
};

// Highlight style specifically for Flood Risk (Glowing effect)
export const floodRiskHighlightStyle: PathOptions = {
    weight: 4,
    color: '#00FFFF', // Cyan neon glow
    opacity: 1,
    fillOpacity: 0.9, // Very bright fill
    dashArray: '10, 5' // Dashed line for "active" look
};

export const floodRiskLegend: LegendItem[] = [
    { color: '#4CAF50', label: 'Resiko Rendah' },
    { color: '#FFC107', label: 'Resiko Sedang' },
    { color: '#F44336', label: 'Resiko Tinggi' },
    { color: '#B71C1C', label: 'Resiko Sangat Tinggi' }
];

// Contour styling based on elevation intervals
export const contourStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};
    const elevation = props.ELEV || props.ELEVATION || props.CONTOUR || props.HEIGHT || 0;

    let weight = 1;
    let color = '#999999';

    // Style based on elevation intervals
    if (elevation % 500 === 0) {
        // Major contour lines (500m intervals)
        weight = 3;
        color = '#333333';
    } else if (elevation % 250 === 0) {
        // Intermediate major contour lines (250m intervals)
        weight = 2;
        color = '#555555';
    } else if (elevation % 100 === 0) {
        // Minor contour lines (100m intervals)
        weight = 1.5;
        color = '#777777';
    } else {
        // Fine contour lines (50m intervals)
        weight = 1;
        color = '#999999';
    }

    return {
        color: color,
        weight: weight,
        opacity: 0.7,
        fillOpacity: 0
    };
};

export const contourLegend: LegendItem[] = [
    { color: '#333333', label: 'Kontur 500m (Tebal)' },
    { color: '#555555', label: 'Kontur 250m' },
    { color: '#777777', label: 'Kontur 100m' },
    { color: '#999999', label: 'Kontur 50m (Tipis)' }
];

// Highlight style for clicked features
// Highlight style for clicked features
export const highlightStyle: PathOptions = {
    weight: 6,
    color: '#00FFFF', // Cyan for "glowing" effect
    opacity: 1,
    fillOpacity: 0.6 // Slightly lower fill opacity to blend
};

// Transparent style for polygon layers that need to show background
export const transparentStyle = (feature: any): PathOptions => {
    // Determine color based on layer ID or property (passed via closure if needed, but for now simple)
    // We can stick to the layer's default color which is usually handled in MapViewer if this returns partial options,
    // usually MapViewer handles defaults. However, styleFunction in MapViewer overrides defaults.
    // So we need to return specific colors or let MapViewer handle it. 
    // Actually, MapViewer calls: 
    // const customStyle = layer.styleFunction(feature);
    // return { ...customStyle, opacity: ... }

    // We will return standard weight/opacity but NO FILL.
    return {
        weight: 2,
        opacity: 1,
        fillOpacity: 0 // Transparent fill
    };
};

export const transparentFloodRiskStyle = (feature: any): PathOptions => {
    const baseStyle = floodRiskStyle(feature);
    return {
        ...baseStyle,
        fillOpacity: 0
    };
};


// Land Capability styling
export const kemampuanLahanStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};

    // Prioritize categorical coloring based on class/ability description
    // This ensures different capability classes get different colors
    const kelas = props.KELAS || props.KEMAMPUAN || props.NAMOBJ || props.KETERANGAN || '';

    if (kelas && kelas !== '-') {
        return {
            color: stringToColor(kelas),
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.6
        };
    }

    // Fallback logic (though the above covers most if KELAS exists)
    let color = '#8BC34A'; // Default: light green

    // Color mapping based on capability class
    if (kelas.includes('VIII') || kelas.includes('8')) {
        color = '#B71C1C'; // Red - Very limited
    } else if (kelas.includes('VII') || kelas.includes('7')) {
        color = '#E65100'; // Orange - Severe limitations
    } else if (kelas.includes('VI') || kelas.includes('6')) {
        color = '#FF9800'; // Deep Orange - Moderate/Severe
    } else if (kelas.includes('V') || kelas.includes('5')) {
        color = '#FFC107'; // Amber - Moderate
    } else if (kelas.includes('IV') || kelas.includes('4')) {
        color = '#FFEB3B'; // Yellow - Moderate/Good
    } else if (kelas.includes('III') || kelas.includes('3')) {
        color = '#CDDC39'; // Lime - Good
    } else if (kelas.includes('II') || kelas.includes('2')) {
        color = '#8BC34A'; // Light Green - Very Good
    } else if (kelas.includes('I') || kelas.includes(' 1') || kelas === 'I') {
        color = '#4CAF50'; // Green - Excellent
    }

    return {
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
    };
};

export const kemampuanLahanLegend: LegendItem[] = [
    { color: '#4CAF50', label: 'Kelas I - Sangat Baik' },
    { color: '#8BC34A', label: 'Kelas II - Baik' },
    { color: '#CDDC39', label: 'Kelas III - Sedang' },
    { color: '#FFEB3B', label: 'Kelas IV - Terbatas' },
    { color: '#FFC107', label: 'Kelas V - Agak Buruk' },
    { color: '#FF9800', label: 'Kelas VI - Buruk' },
    { color: '#E65100', label: 'Kelas VII - Sangat Buruk' },
    { color: '#B71C1C', label: 'Kelas VIII - Ekstrim' }
];

// Landslide Risk styling
export const longsorRiskStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};
    const riskLevel = props.RESIKO || props.TINGKAT || props.LEVEL || props.KELAS || props.NAMOBJ || '';

    let color = '#795548'; // Default: Brown

    if (typeof riskLevel === 'string') {
        const level = riskLevel.toUpperCase();
        if (level.includes('SANGAT TINGGI') || level.includes('VERY HIGH')) {
            color = '#B71C1C'; // Dark red
        } else if (level.includes('TINGGI') || level.includes('HIGH')) {
            color = '#D32F2F'; // Red
        } else if (level.includes('SEDANG') || level.includes('MEDIUM')) {
            color = '#F57C00'; // Orange
        } else if (level.includes('RENDAH') || level.includes('LOW')) {
            color = '#8BC34A'; // Light Green
        }
    }

    return {
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
    };
};

export const longsorRiskLegend: LegendItem[] = [
    { color: '#8BC34A', label: 'Resiko Rendah' },
    { color: '#F57C00', label: 'Resiko Sedang' },
    { color: '#D32F2F', label: 'Resiko Tinggi' },
    { color: '#B71C1C', label: 'Resiko Sangat Tinggi' }
];

// Flash Flood (Banjir Bandang) Risk styling
export const banjirBandangRiskStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};
    const riskLevel = props.RESIKO || props.TINGKAT || props.LEVEL || props.KELAS || props.NAMOBJ || '';

    let color = '#0D47A1'; // Default: Blue

    if (typeof riskLevel === 'string') {
        const level = riskLevel.toUpperCase();
        if (level.includes('SANGAT TINGGI') || level.includes('VERY HIGH')) {
            color = '#B71C1C'; // Dark red
        } else if (level.includes('TINGGI') || level.includes('HIGH')) {
            color = '#C62828'; // Red
        } else if (level.includes('SEDANG') || level.includes('MEDIUM')) {
            color = '#F9A825'; // Yellow Dark
        } else if (level.includes('RENDAH') || level.includes('LOW')) {
            color = '#2E7D32'; // Green
        }
    }

    return {
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
    };
};

export const banjirBandangRiskLegend: LegendItem[] = [
    { color: '#2E7D32', label: 'Resiko Rendah' },
    { color: '#F9A825', label: 'Resiko Sedang' },
    { color: '#C62828', label: 'Resiko Tinggi' },
    { color: '#B71C1C', label: 'Resiko Sangat Tinggi' }
];

// Highlight style for Batas Desa (Glowing Outline)
export const batasDesaHighlightStyle: PathOptions = {
    weight: 4,
    color: '#00FFFF', // Cyan / Electric Blue
    opacity: 1,
    fillOpacity: 0.5, // Semi-transparent fill for "light up" effect
    dashArray: '10, 5' // Dashed line for active look
};
// DAS (Watershed) styling
export const dasStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};
    const namaDas = props.nama_das || props.NAMA_DAS || props.DAS || props.NAMOBJ || '';

    // Color based on DAS name for distinct visualization
    if (namaDas && namaDas !== '-') {
        return {
            color: stringToColor(namaDas),
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.4
        };
    }

    return {
        color: '#2196F3', // Default Blue
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.4
    };
};

export const dasLegend: LegendItem[] = [
    { color: '#2196F3', label: 'Batas DAS' }
];
