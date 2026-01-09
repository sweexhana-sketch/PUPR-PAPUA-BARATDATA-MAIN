import { GisLayer } from '@/config/gis_layers';

// Helper to check if a point is in a polygon (Ray Casting algorithm)
export function isPointInPolygon(point: { lat: number, lng: number }, vs: { lat: number, lng: number }[][]): boolean {
    // vs is array of rings, usually we check the outer ring vs[0]
    // But GeoJSON polygons can be complex.
    // Simplifying to check against the first ring (outer boundary).
    // For MultiPolygon, this function should be called for each polygon.

    // Flatten logic handled by caller or we iterate all rings? 
    // Standard algorithms usually just check one ring.
    // Let's assume vs is an array of points for a single ring.

    // Changing signature to accept a single ring for simplicity first
    // usage: isPointInRing(point, ring)
    return false; // placeholder for the internal logic, see below for real implementation
}

function isPointInRing(point: { lat: number, lng: number }, vs: { lat: number, lng: number }[]) {
    const x = point.lng, y = point.lat;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].lng, yi = vs[i].lat;
        const xj = vs[j].lng, yj = vs[j].lat;

        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Check if point is near a line (basic distance check)
function isPointNearLine(point: { lat: number, lng: number }, line: { lat: number, lng: number }[], toleranceDeg: number = 0.0001): boolean {
    for (let i = 0; i < line.length - 1; i++) {
        const p1 = line[i];
        const p2 = line[i + 1];
        if (distToSegment(point, p1, p2) < toleranceDeg) return true;
    }
    return false;
}

function distToSegment(p: { lat: number, lng: number }, v: { lat: number, lng: number }, w: { lat: number, lng: number }) {
    const l2 = ((v.lng - w.lng) ** 2) + ((v.lat - w.lat) ** 2);
    if (l2 === 0) return ((p.lng - v.lng) ** 2) + ((p.lat - v.lat) ** 2);
    let t = ((p.lng - v.lng) * (w.lng - v.lng) + (p.lat - v.lat) * (w.lat - v.lat)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projection = { lng: v.lng + t * (w.lng - v.lng), lat: v.lat + t * (w.lat - v.lat) };
    return Math.sqrt(((p.lng - projection.lng) ** 2) + ((p.lat - projection.lat) ** 2));
}

export const findFeaturesAtPoint = (
    latlng: { lat: number, lng: number },
    layers: GisLayer[],
    geoJsonData: Record<string, any>
) => {
    const foundFeatures: { layer: GisLayer, feature: any }[] = [];

    layers.forEach(layer => {
        if (!layer.visible || !geoJsonData[layer.id]) return;

        const data = geoJsonData[layer.id];
        const features = data.features || (Array.isArray(data) ? data : [data]);

        features.forEach((feature: any) => {
            if (!feature.geometry) return;

            let isHit = false;
            const geom = feature.geometry;

            if (geom.type === 'Polygon') {
                // Handle Single Polygon
                // Coordinates in GeoJSON are [lng, lat]
                // Outer ring is coords[0]
                const ring = geom.coordinates[0].map((c: any) => ({ lng: c[0], lat: c[1] }));
                if (isPointInRing(latlng, ring)) isHit = true;
            } else if (geom.type === 'MultiPolygon') {
                // Handle MultiPolygon
                // Coords: [ [ [lng,lat], ... ], [ ... ] ]
                for (const polygon of geom.coordinates) {
                    const ring = polygon[0].map((c: any) => ({ lng: c[0], lat: c[1] }));
                    if (isPointInRing(latlng, ring)) {
                        isHit = true;
                        break;
                    }
                }
            } else if (geom.type === 'LineString') {
                const line = geom.coordinates.map((c: any) => ({ lng: c[0], lat: c[1] }));
                // Tolerance approx 50 meters ~ 0.0005 deg
                if (isPointNearLine(latlng, line, 0.0005)) isHit = true;
            } else if (geom.type === 'MultiLineString') {
                for (const lineCoords of geom.coordinates) {
                    const line = lineCoords.map((c: any) => ({ lng: c[0], lat: c[1] }));
                    if (isPointNearLine(latlng, line, 0.0005)) {
                        isHit = true;
                        break;
                    }
                }
            } else if (geom.type === 'Point') {
                const dist = Math.sqrt((latlng.lng - geom.coordinates[0]) ** 2 + (latlng.lat - geom.coordinates[1]) ** 2);
                if (dist < 0.0005) isHit = true;
            }

            if (isHit) {
                foundFeatures.push({ layer, feature });
            }
        });
    });

    return foundFeatures;
};
