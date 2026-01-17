import { PathOptions } from 'leaflet';
import { skHutanStyle, skHutanLegend, floodRiskStyle, floodRiskLegend, contourStyle, contourLegend, kemampuanLahanStyle, kemampuanLahanLegend, longsorRiskStyle, longsorRiskLegend, banjirBandangRiskStyle, banjirBandangRiskLegend, dasStyle, dasLegend, LegendItem, transparentStyle, batasDesaHighlightStyle } from './layerStyles';

export interface GisLayer {
    id: string;
    name: string;
    file: string;
    url: string;
    visible: boolean;
    color: string;
    category?: string;
    highlightable?: boolean;
    styleFunction?: (feature: any) => PathOptions;
    legendItems?: LegendItem[];
}

export const GIS_LAYERS: GisLayer[] = [
    {
        id: 'das_pbd',
        name: 'Daerah Aliran Sungai (DAS)',
        file: 'DASPBD_2.js',
        url: 'https://qbvlqrjewdetjkvvszjq.supabase.co/storage/v1/object/public/webgis-data/DASPBD_2.js',
        visible: false,
        color: '#0000FF',
        category: 'environment',
        highlightable: true,
        styleFunction: dasStyle,
        legendItems: dasLegend
    },
    {
        id: 'dis_banjir',
        name: 'Daerah Rawan Banjir',
        file: 'dis_banjir_1.js',
        url: 'https://qbvlqrjewdetjkvvszjq.supabase.co/storage/v1/object/public/webgis-data/dis_banjir_1.js',
        visible: false,
        color: '#FFA500',
        category: 'risk',
        highlightable: true,
        styleFunction: floodRiskStyle,
        legendItems: floodRiskLegend
    },
    {
        id: 'kelerengan',
        name: 'Kelerengan Lahan',
        file: 'KELERENGANPBD_3.js',
        url: 'https://qbvlqrjewdetjkvvszjq.supabase.co/storage/v1/object/public/webgis-data/KELERENGANPBD_3.js',
        visible: false,
        color: '#008000',
        category: 'environment',
        highlightable: true
    },
    {
        id: 'kontur',
        name: 'Kontur Wilayah',
        file: 'topopbd_4.js',
        url: 'https://qbvlqrjewdetjkvvszjq.supabase.co/storage/v1/object/public/webgis-data/topopbd_4.js',
        visible: false,
        color: '#808080',
        category: 'topography',
        highlightable: false,
        styleFunction: contourStyle,
        legendItems: contourLegend
    },

    {
        id: 'bts_desa',
        name: 'Batas Desa',
        file: 'batasdesapbd_new.js',
        url: '/data/batasdesapbd_new.js',
        visible: true,
        color: '#FF6F00',
        category: 'administrative',
        highlightable: true,
        styleFunction: transparentStyle
    },
    {
        id: 'bts_kab',
        name: 'Batas Kabupaten',
        file: 'btskab_0.js',
        url: '/data/btskab_0.js',
        visible: true,
        color: '#FF6F00', // Matches admin color
        category: 'administrative', // Matches admin category
        highlightable: true,
        styleFunction: transparentStyle
    },
    {
        id: 'resiko_banjir_bandang',
        name: 'Indeks Resiko Banjir Bandang',
        file: 'INDEKS RESIKO BANJIR BANDANG.json',
        url: '/data/INDEKS%20RESIKO%20BANJIR%20BANDANG.json',
        visible: false,
        color: '#D32F2F',
        category: 'risk',
        highlightable: true,
        styleFunction: banjirBandangRiskStyle,
        legendItems: banjirBandangRiskLegend
    },
    {
        id: 'resiko_banjir_pbd',
        name: 'Indeks Resiko Banjir',
        file: 'INDEKS RESIKO BANJIR.json',
        url: '/data/INDEKS%20RESIKO%20BANJIR.json',
        visible: false,
        color: '#C62828',
        category: 'risk',
        highlightable: true,
        styleFunction: floodRiskStyle,
        legendItems: floodRiskLegend
    },
    {
        id: 'resiko_longsor',
        name: 'Indeks Resiko Longsor',
        file: 'INDEKS RESIKO LONGSOR.json',
        url: '/data/INDEKS%20RESIKO%20LONGSOR.json',
        visible: false,
        color: '#795548',
        category: 'risk',
        highlightable: true,
        styleFunction: longsorRiskStyle,
        legendItems: longsorRiskLegend
    },
    {
        id: 'lokasi_iplt',
        name: 'Lokasi IPLT',
        file: 'LOKASI IPLT.json',
        url: '/data/LOKASI%20IPLT.json',
        visible: false,
        color: '#8D6E63',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'lokasi_tpa',
        name: 'Lokasi TPA',
        file: 'LOKASI TPA.json',
        url: '/data/LOKASI%20TPA.json',
        visible: false,
        color: '#5D4037',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'lokasi_ipal',
        name: 'Lokasi IPAL',
        file: 'lokasi IPAL.json',
        url: '/data/lokasi%20IPAL.json',
        visible: false,
        color: '#4E342E',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'bendungan_pbd',
        name: 'Bendungan',
        file: 'bendungan pbd.json',
        url: '/data/bendungan%20pbd.json',
        visible: false,
        color: '#0288D1',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'jalan_nasional',
        name: 'Jalan Nasional',
        file: 'jalan nasional.json',
        url: '/data/jalan%20nasional.json',
        visible: false,
        color: '#F44336',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'jembatan_nasional',
        name: 'Jembatan Nasional',
        file: 'jembatan nasional.json',
        url: '/data/jembatan%20nasional.json',
        visible: false,
        color: '#FF5722',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'jln_prov_pbd',
        name: 'Jalan Provinsi (PBD)',
        file: 'jlnprov.json',
        url: '/data/jlnprov.json',
        visible: false,
        color: '#D50000',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'irigasi_pbd',
        name: 'Jaringan Irigasi',
        file: 'jaringan irigasi pbd.json',
        url: '/data/jaringan%20irigasi%20pbd.json',
        visible: false,
        color: '#03A9F4',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'pengendali_banjir',
        name: 'Pengendali Banjir',
        file: 'pengendali banjir pbd.json',
        url: '/data/pengendali%20banjir%20pbd.json',
        visible: false,
        color: '#0277BD',
        category: 'infrastructure',
        highlightable: true
    },
    {
        id: 'kemampuan_lahan_pbd',
        name: 'Kemampuan Lahan',
        file: 'kemampuan lahan.json',
        url: '/data/kemampuan%20lahan.json',
        visible: false,
        color: '#8BC34A',
        category: 'environment',
        highlightable: true,
        styleFunction: kemampuanLahanStyle,
        legendItems: kemampuanLahanLegend
    },
    {
        id: 'kwsn_hutan_new',
        name: 'Kawasan Hutan (Update)',
        file: 'kwsnhtn.json',
        url: '/data/kwsnhtn.json',
        visible: false,
        color: '#388E3C',
        category: 'environment',
        highlightable: true,
        styleFunction: skHutanStyle,
        legendItems: skHutanLegend
    }
];
