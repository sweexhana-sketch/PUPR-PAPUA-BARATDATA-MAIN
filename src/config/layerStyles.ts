// Layer styling functions for specialized layers
import { PathOptions } from 'leaflet';

export interface LegendItem {
    color: string;
    label: string;
}

// SK Hutan (Forest Decree) styling
export const skHutanStyle = (feature: any): PathOptions => {
    const props = feature?.properties || {};
    const fungsi = props.FUNGSI_KWS || props.FUNGSI || props.NAMOBJ || '';

    let color = '#2E7D32'; // Default: dark green

    // Color mapping based on forest function
    if (fungsi.includes('LINDUNG') || fungsi.includes('Lindung')) {
        color = '#2E7D32'; // Dark green - Protected Forest
    } else if (fungsi.includes('PRODUKSI TERBATAS') || fungsi.includes('Produksi Terbatas')) {
        color = '#81C784'; // Light green - Limited Production Forest
    } else if (fungsi.includes('PRODUKSI') || fungsi.includes('Produksi')) {
        color = '#66BB6A'; // Medium green - Production Forest
    } else if (fungsi.includes('KONSERVASI') || fungsi.includes('Konservasi')) {
        color = '#1B5E20'; // Very dark green - Conservation Forest
    } else if (fungsi.includes('APL') || fungsi.includes('PENGGUNAAN LAIN')) {
        color = '#FFF9C4'; // Light yellow - Other Use Area
    }

    return {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0 // Transparent fill as requested
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
    // Try different possible field names for risk level
    const riskLevel = props.RESIKO || props.TINGKAT || props.LEVEL || props.KELAS || '';
    const riskValue = props.NILAI || props.VALUE || 0;

    let color = '#4CAF50'; // Default: green (low risk)

    // Color mapping based on risk level
    if (typeof riskLevel === 'string') {
        const level = riskLevel.toUpperCase();
        if (level.includes('SANGAT TINGGI') || level.includes('VERY HIGH')) {
            color = '#B71C1C'; // Dark red
        } else if (level.includes('TINGGI') || level.includes('HIGH')) {
            color = '#F44336'; // Red
        } else if (level.includes('SEDANG') || level.includes('MEDIUM') || level.includes('MODERATE')) {
            color = '#FFC107'; // Yellow/Orange
        } else if (level.includes('RENDAH') || level.includes('LOW')) {
            color = '#4CAF50'; // Green
        }
    } else if (typeof riskValue === 'number') {
        // Numeric risk value (assuming 1-4 scale)
        if (riskValue >= 4) {
            color = '#B71C1C'; // Very high
        } else if (riskValue >= 3) {
            color = '#F44336'; // High
        } else if (riskValue >= 2) {
            color = '#FFC107'; // Medium
        } else {
            color = '#4CAF50'; // Low
        }
    }

    return {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.5
    };
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
export const highlightStyle: PathOptions = {
    weight: 5,
    color: '#00FFFF',
    opacity: 1,
    fillOpacity: 0.7
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

