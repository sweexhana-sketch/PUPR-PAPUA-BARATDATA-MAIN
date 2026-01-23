import { toast } from "sonner";

// Keys for localStorage
export const STORAGE_KEYS = {
    NEWS: "site_news",
    GALLERY: "site_gallery",
    PROFILE: "site_profile",
    HERO: "site_hero",
    CONTACT: "site_contact",
    SOP: "site_sop",
    LEGAL: "site_legal",
};

// Default Data

const DEFAULT_NEWS = [
    {
        id: 7,
        title: "Finalisasi RAD dan Ranpergub Penyandang Disabilitas Papua Barat Daya",
        date: "25 November 2025",
        author: "Admin PUPR",
        excerpt: "Dinas PUPR Papua Barat Daya berperan dalam penyediaan fasilitas dan layanan publik yang ramah disabilitas melalui penyusunan buku saku panduan teknis.",
        content: `
            <p>Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR) Provinsi Papua Barat Daya terus berkomitmen untuk menghadirkan infrastruktur yang inklusif bagi seluruh lapisan masyarakat, termasuk penyandang disabilitas. Hal ini diwujudkan melalui partisipasi aktif dalam finalisasi Rencana Aksi Daerah (RAD) dan Rancangan Peraturan Gubernur (Ranpergub) tentang Penyandang Disabilitas.</p>
            <p>Dalam kegiatan yang berlangsung baru-baru ini, Dinas PUPR menekankan pentingnya standar teknis bangunan dan fasilitas umum yang aksesibel. "Kami ingin memastikan bahwa setiap pembangunan infrastruktur di Papua Barat Daya, mulai dari kantor pemerintahan, jalan trotoar, hingga taman kota, dapat diakses dengan mudah dan aman oleh saudara-saudara kita yang berkebutuhan khusus," ujar perwakilan Dinas PUPR.</p>
            <p>Salah satu langkah konkret yang sedang disiapkan adalah penyusunan buku saku panduan teknis. Buku ini nantinya akan menjadi acuan bagi para perencana, kontraktor, dan pengawas di lapangan dalam menerapkan prinsip-prinsip desain universal. Panduan ini mencakup spesifikasi teknis untuk ramp, toilet difabel, jalur pemandu (guiding block), dan fasilitas pendukung lainnya.</p>
            <p>Diharapkan dengan adanya payung hukum berupa Pergub dan panduan teknis yang jelas, pemenuhan hak-hak penyandang disabilitas di sektor infrastruktur dapat terjamin dan terimplementasi dengan baik di seluruh wilayah Provinsi Papua Barat Daya.</p>
        `,
        image: "/images/news-disabilitas.jpg",
        category: "Cipta Karya"
    },
    {
        id: 1,
        title: "PUPR Papua Barat Daya Percepat Pembangunan Jalan Trans Papua",
        date: "04 Desember 2025",
        author: "Admin PUPR",
        excerpt: "Dinas PUPR Provinsi Papua Barat Daya terus menggenjot pembangunan ruas jalan Trans Papua untuk meningkatkan konektivitas antar daerah.",
        content: `
            <p>Pemerintah Provinsi Papua Barat Daya melalui Dinas Pekerjaan Umum dan Perumahan Rakyat (PUPR) terus memprioritaskan pembangunan infrastruktur jalan sebagai urat nadi perekonomian daerah. Fokus utama saat ini adalah percepatan penyelesaian ruas Jalan Trans Papua yang menghubungkan berbagai kabupaten dan kota di wilayah ini.</p>
            <p>Kepala Dinas PUPR Papua Barat Daya menyatakan bahwa pembangunan jalan ini sangat strategis untuk membuka isolasi daerah-daerah terpencil. "Dengan akses jalan yang baik, biaya logistik dapat ditekan, harga barang kebutuhan pokok menjadi lebih terjangkau, dan mobilitas masyarakat untuk mendapatkan layanan kesehatan maupun pendidikan akan semakin mudah," ungkapnya.</p>
            <p>Tantangan geografis yang cukup berat tidak menyurutkan semangat tim di lapangan. Pengerjaan dilakukan secara bertahap dengan memprioritaskan titik-titik rawan dan jalur utama distribusi. Selain pengaspalan, pekerjaan juga meliputi pembangunan jembatan-jembatan penghubung dan perbaikan drainase untuk mencegah kerusakan jalan akibat air.</p>
            <p>Targetnya, persentase kemantapan jalan provinsi akan terus ditingkatkan setiap tahunnya, sehingga visi untuk mewujudkan konektivitas wilayah yang handal di Papua Barat Daya dapat segera tercapai.</p>
        `,
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
        category: "Bina Marga"
    },
    {
        id: 2,
        title: "Normalisasi Sungai Remu Sorong untuk Cegah Banjir",
        date: "02 Desember 2025",
        author: "Humas",
        excerpt: "Program normalisasi Sungai Remu terus dilakukan sebagai upaya mitigasi banjir di wilayah Kota Sorong dan sekitarnya.",
        content: `
            <p>Sebagai langkah antisipasi menghadapi musim penghujan, Dinas PUPR Papua Barat Daya gencar melakukan normalisasi Sungai Remu di Kota Sorong. Sungai ini merupakan salah satu saluran drainase utama kota yang seringkali meluap saat curah hujan tinggi, menyebabkan banjir di beberapa titik pemukiman warga.</p>
            <p>Pekerjaan normalisasi meliputi pengerukan sedimen lumpur yang telah mendangkalkan sungai, pembersihan sampah, serta penguatan tebing sungai dengan tanggul (sheet pile) di titik-titik kritis. "Kami mengerahkan alat berat ekskavator untuk mempercepat proses pengerukan dan pengangkutan material sedimen," jelas Kepala Bidang Sumber Daya Air.</p>
            <p>Selain upaya fisik, Dinas PUPR juga menghimbau masyarakat untuk turut serta menjaga kebersihan sungai dengan tidak membuang sampah sembarangan. Kesadaran masyarakat dinilai sangat penting untuk menjaga keberlanjutan fungsi sungai sebagai pengendali banjir.</p>
            <p>Diharapkan dengan normalisasi ini, kapasitas tampung Sungai Remu akan meningkat signifikan sehingga risiko banjir di Kota Sorong dapat diminimalisir.</p>
        `,
        image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=2070&auto=format&fit=crop",
        category: "Sumber Daya Air"
    },
    {
        id: 3,
        title: "Peresmian Perumahan Subsidi bagi Masyarakat Berpenghasilan Rendah",
        date: "28 November 2025",
        author: "Admin PUPR",
        excerpt: "Pemerintah Provinsi melalui Dinas PUPR meresmikan 100 unit rumah subsidi yang diperuntukkan bagi MBR di Kabupaten Sorong.",
        content: `
            <p>Kabar gembira bagi Masyarakat Berpenghasilan Rendah (MBR) di Kabupaten Sorong. Dinas PUPR Provinsi Papua Barat Daya baru saja meresmikan kompleks perumahan subsidi baru yang terdiri dari 100 unit rumah layak huni. Program ini merupakan wujud nyata kepedulian pemerintah dalam menyediakan kebutuhan papan yang terjangkau bagi masyarakat.</p>
            <p>Setiap unit rumah dibangun dengan standar kualitas yang baik, dilengkapi dengan fasilitas dasar seperti listrik, air bersih, dan sanitasi yang memadai. Lokasi perumahan juga dipilih yang strategis dan dekat dengan fasilitas umum. "Kami ingin memastikan bahwa masyarakat tidak hanya mendapatkan rumah yang murah, tetapi juga lingkungan tempat tinggal yang sehat, aman, dan nyaman," ujar Kepala Bidang Perumahan.</p>
            <p>Skema pembiayaan yang ditawarkan juga sangat ringan, bekerja sama dengan bank penyalur KPR subsidi, sehingga cicilan bulanan tidak memberatkan penerima manfaat. Program ini diharapkan dapat mengurangi angka backlog perumahan di Papua Barat Daya secara bertahap.</p>
        `,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
        category: "Perumahan"
    },
    {
        id: 4,
        title: "Sosialisasi Tata Ruang Wilayah Provinsi Papua Barat Daya",
        date: "25 November 2025",
        author: "Bidang Tata Ruang",
        excerpt: "Kegiatan sosialisasi RTRW digelar untuk menyamakan persepsi pembangunan berkelanjutan di seluruh kabupaten/kota.",
        content: `
            <p>Tata ruang yang terencana adalah kunci pembangunan berkelanjutan. Dinas PUPR Papua Barat Daya menggelar sosialisasi Rencana Tata Ruang Wilayah (RTRW) Provinsi yang dihadiri oleh perwakilan pemerintah kabupaten/kota, akademisi, dan pemangku kepentingan lainnya.</p>
            <p>Kegiatan ini bertujuan untuk menyamakan persepsi dan mensinergikan rencana pembangunan daerah dengan tata ruang provinsi. Isu-isu strategis seperti kawasan lindung, kawasan budidaya, mitigasi bencana, dan pengembangan wilayah pesisir menjadi topik pembahasan utama.</p>
            <p>"Keselarasan antara RTRW Provinsi dengan RTRW Kabupaten/Kota sangat krusial untuk menghindari konflik pemanfaatan lahan di kemudian hari," tegas narasumber dalam acara tersebut. Dokumen RTRW ini nantinya akan menjadi panglima dalam setiap perizinan pemanfaatan ruang dan pelaksanaan pembangunan infrastruktur.</p>
        `,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        category: "Tata Ruang"
    },
    {
        id: 5,
        title: "Pelatihan Tenaga Kerja Konstruksi Bersertifikat",
        date: "20 November 2025",
        author: "Bina Konstruksi",
        excerpt: "Meningkatkan kompetensi SDM lokal, Dinas PUPR mengadakan pelatihan dan sertifikasi bagi tenaga kerja konstruksi.",
        content: `
            <p>Peningkatan kualitas Sumber Daya Manusia (SDM) konstruksi terus didorong oleh Dinas PUPR Papua Barat Daya. Bidang Bina Konstruksi menyelenggarakan pelatihan dan uji kompetensi bagi para tukang dan pekerja bangunan asli Papua.</p>
            <p>Para peserta dibekali dengan pengetahuan tentang teknik konstruksi yang benar, keselamatan dan kesehatan kerja (K3), serta penggunaan peralatan modern. Setelah lulus uji kompetensi, mereka akan mendapatkan Sertifikat Kompetensi Kerja (SKK) Konstruksi yang diakui secara nasional.</p>
            <p>Dengan sertifikasi ini, diharapkan tenaga kerja lokal dapat bersaing dan lebih banyak terserap dalam proyek-proyek pembangunan infrastruktur di daerah sendiri, serta menghasilkan kualitas bangunan yang lebih baik dan aman.</p>
        `,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
        category: "Bina Konstruksi"
    },
    {
        id: 6,
        title: "Monitoring Proyek Air Bersih di Raja Ampat",
        date: "15 November 2025",
        author: "Cipta Karya",
        excerpt: "Tim Dinas PUPR melakukan monitoring progres pembangunan fasilitas air bersih untuk mendukung pariwisata Raja Ampat.",
        content: `
            <p>Raja Ampat sebagai destinasi wisata dunia membutuhkan dukungan infrastruktur dasar yang prima, terutama ketersediaan air bersih. Dinas PUPR Papua Barat Daya melakukan kunjungan lapangan untuk memonitoring progres pembangunan Sistem Penyediaan Air Minum (SPAM) di beberapa pulau wisata.</p>
            <p>Tim memastikan bahwa pekerjaan fisik berjalan sesuai jadwal dan spesifikasi teknis. Jaringan pipa distribusi hingga sambungan rumah ke masyarakat diperiksa dengan teliti. "Air bersih adalah kebutuhan vital, baik bagi warga lokal maupun wisatawan. Kami tidak ingin ada kendala dalam suplai air di kawasan strategis ini," ujar pimpinan tim monitoring.</p>
            <p>Selain infrastruktur fisik, pengelolaan SPAM berbasis masyarakat juga diperkuat agar keberlanjutan layanan air bersih dapat terjaga dalam jangka panjang.</p>
        `,
        image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?q=80&w=1974&auto=format&fit=crop",
        category: "Cipta Karya"
    }
];

const DEFAULT_SOP = [
    { id: 1, title: "SOP Bidang Sumber Daya Air", file: "/documents/SOP-SDA.rar", size: "RAR", code: "SOP-SDA-001" },
    { id: 2, title: "SOP Bidang Bina Marga", file: "/documents/SOP-BM.rar", size: "RAR", code: "SOP-BM-001" },
    { id: 3, title: "SOP Bidang Cipta Karya", file: "/documents/SOP-CK.rar", size: "RAR", code: "SOP-CK-001" },
    { id: 4, title: "SOP Bidang Perumahan", file: "/documents/SOP-PR.rar", size: "RAR", code: "SOP-PR-001" },
    { id: 5, title: "SOP Bina Konstruksi", file: "/documents/SOP-BK.rar", size: "RAR", code: "SOP-BK-001" },
    { id: 6, title: "SOP Sekretariat", file: "/documents/SOP-SEK.rar", size: "RAR", code: "SOP-SEK-001" },
];

const DEFAULT_LEGAL = [
    { id: 1, title: "Perda RTRW Provinsi Papua Barat Daya", number: "No. 1 Tahun 2024", type: "Peraturan Daerah", year: "2024", file: "/documents/PERDA-RTRW.pdf", size: "PDF" },
    { id: 2, title: "Pergub tentang Tugas dan Fungsi Dinas PUPR", number: "No. 05 Tahun 2023", type: "Peraturan Gubernur", year: "2023", file: "/documents/PERGUB-TUSI.pdf", size: "PDF" },
    { id: 3, title: "SK Gubernur tentang Pembentukan Tim Teknis", number: "No. 100.3.3/15/2024", type: "SK Gubernur", year: "2024", file: "/documents/SK-TIM.pdf", size: "PDF" },
];

const DEFAULT_GALLERY = [
    {
        id: 1,
        image: "/images/gallery-1.jpg",
        caption: "Perayaan Budaya Papua Barat Daya",
        category: "Kegiatan"
    },
    {
        id: 2,
        image: "/images/gallery-2.jpg",
        caption: "Foto Bersama Masyarakat Adat",
        category: "Kegiatan"
    },
    {
        id: 3,
        image: "/images/gallery-3.jpg",
        caption: "Upacara Adat Papua Barat Daya",
        category: "Kegiatan"
    },
    {
        id: 4,
        image: "/images/gallery-4.jpg",
        caption: "Kegiatan Masyarakat Papua",
        category: "Kegiatan"
    },
    {
        id: 5,
        image: "/images/gallery-5.jpg",
        caption: "Acara Budaya Lokal",
        category: "Kegiatan"
    },
    {
        id: 6,
        image: "/images/slide-1.jpg",
        caption: "Pemandangan Raja Ampat",
        category: "Pariwisata"
    },
    {
        id: 7,
        image: "/images/slide-2.jpg",
        caption: "Pembangunan Jalan Trans Papua",
        category: "Bina Marga"
    },
    {
        id: 8,
        image: "/images/slide-3.jpg",
        caption: "Perumahan Subsidi Sorong",
        category: "Perumahan"
    },
    {
        id: 9,
        image: "/images/slide-4.jpg",
        caption: "Kawasan Hutan Lindung",
        category: "Lingkungan"
    },
    {
        id: 10,
        image: "https://images.unsplash.com/photo-1590642916589-592bcaaa7e55?q=80&w=2070&auto=format&fit=crop",
        caption: "Jembatan Merah Putih (Ilustrasi)",
        category: "Bina Marga"
    },
    {
        id: 11,
        image: "https://images.unsplash.com/photo-1535401991798-27d2f20db17b?q=80&w=2070&auto=format&fit=crop",
        caption: "Bendungan Irigasi",
        category: "Sumber Daya Air"
    },
    {
        id: 12,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        caption: "Gedung Perkantoran Modern",
        category: "Cipta Karya"
    },
    {
        id: 13,
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop",
        caption: "Arsitektur Bangunan",
        category: "Tata Ruang"
    },
    {
        id: 14,
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
        caption: "Pekerjaan Konstruksi Jalan",
        category: "Bina Konstruksi"
    }
];

const DEFAULT_HERO = [
    {
        id: 1,
        image: "/images/slide-1.jpg",
        title: "Membangun Papua Barat Daya",
        subtitle: "Dengan keindahan alam Raja Ampat sebagai inspirasi pembangunan berkelanjutan",
    },
    {
        id: 2,
        image: "/images/slide-2.jpg",
        title: "Infrastruktur Berkualitas",
        subtitle: "Membangun jalan dan jembatan untuk konektivitas yang lebih baik",
    },
    {
        id: 3,
        image: "/images/slide-3.jpg",
        title: "Perumahan Rakyat",
        subtitle: "Mewujudkan hunian layak bagi masyarakat Papua Barat Daya",
    },
    {
        id: 4,
        image: "/images/slide-4.jpg",
        title: "Pembangunan Berkelanjutan",
        subtitle: "Menjaga keseimbangan antara pembangunan infrastruktur dan kelestarian alam",
    },
    {
        id: 5,
        image: "/images/slide-5.jpg",
        title: "Pembangunan infrastruktur adalah fondasi vital yang sangat efektif dalam mendukung dan mempercepat pertumbuhan ekonomi",
        subtitle: "Mewujudkan percepatan pertumbuhan ekonomi melalui pembangunan infrastruktur yang merata",
    },
];

const DEFAULT_PROFILE = {
    visi: "Terwujudnya Infrastruktur Pekerjaan Umum dan Perumahan Rakyat yang Berkelanjutan untuk Papua Barat Daya yang Maju dan Sejahtera",
    misi: [
        "Meningkatkan kualitas infrastruktur jalan dan jembatan untuk mendukung konektivitas wilayah",
        "Mengembangkan dan mengelola sumber daya air secara optimal dan berkelanjutan",
        "Mewujudkan penataan ruang dan bangunan yang terencana dan ramah lingkungan",
        "Menyediakan hunian layak dan terjangkau bagi masyarakat Papua Barat Daya",
        "Meningkatkan kapasitas dan profesionalisme SDM dalam bidang konstruksi"
    ],
    kepalaDinas: "YAKOBUS T. PABIMBIN, S.T., M.T.",
    sekretaris: "ISMAT HI MUHD NUR, SE",
    subBagian: {
        perencanaan: "SARATI KONJOL, S.T.",
        umum: "MESAK HOWAY, S.Sos.",
        data: "CALVIN ASMURUF, S.T."
    },
    kabid: {
        sda: "IZAKH KAMBUAYA, S.T., M.T.",
        binamarga: "ORIGENES ANTOH, S.T., M.T.",
        ciptakarya: "ELIEZER NELSON HOMER, S.T., M.T.",
        perumahan: "ALI PAUS PAUS, S.T., M.A.P"
    },
    seksiSda: {
        perencanaan: "HABEL, IEK, S.T.",
        pelaksanaan: "Ir. KORNELIUS F. SAGRIM, S.T",
        operasi: "NIKOLAS KEHEK, S.T., M.T."
    },
    seksiBinamarga: {
        perencanaan: "DEDY JUNAIDY ARIYANTO, S.T.",
        pembangunan: "-",
        reservasi: "ISHAK SAPAN RUMAPAK, S.T., M.T."
    },
    seksiCiptakarya: {
        penyehatan: "MAYKEL FILEMON FRASAWI, S.T.",
        penataan: "ZAINURI ICHWAN, S.T.",
        tataruang: "ELIEZER NELSON HOMER, S.T., M.T."
    },
    seksiPerumahan: {
        perumahan: "MARTHINUS IEK, S.T.",
        prasarana: "ANGKY J. MANUPUTTY, S.T., M.T.",
        binakonstruksi: "ANDI FAROLAND, S.T., M.T."
    }
};

const DEFAULT_CONTACT = {
    address: "Jalan Pendidikan Nomor 02, Kilometer 8, Kelurahan Klabulu, Distrik Malaimsimsa, Kota Sorong, Provinsi Papua Barat Daya",
    phone: "-",
    fax: "-",
    email: "-",
    hours: "Senin - Jumat: 08.00 - 16.00 WIT",
    mapUrl: ""
};

// Helper to get data
export const getStorageData = (key: string, defaultData: any) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultData;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return defaultData;
    }
};

// Helper to set data
export const setStorageData = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        // Dispatch a custom event so components can listen for updates
        window.dispatchEvent(new Event("storage-update"));
        toast.success("Data berhasil disimpan");
    } catch (error) {
        console.error(`Error writing ${key} to localStorage`, error);
        toast.error("Gagal menyimpan data");
    }
};

// Specific getters
export const getNews = () => getStorageData(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
export const getGallery = () => getStorageData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
export const getProfile = () => getStorageData(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
export const getHeroSlides = () => getStorageData(STORAGE_KEYS.HERO, DEFAULT_HERO);
export const getContact = () => getStorageData(STORAGE_KEYS.CONTACT, DEFAULT_CONTACT);
export const getSOP = () => getStorageData(STORAGE_KEYS.SOP, DEFAULT_SOP);
export const getLegalDocs = () => getStorageData(STORAGE_KEYS.LEGAL, DEFAULT_LEGAL);

// Specific setters
export const saveNews = (data: any) => setStorageData(STORAGE_KEYS.NEWS, data);
export const saveGallery = (data: any) => setStorageData(STORAGE_KEYS.GALLERY, data);
export const saveProfile = (data: any) => setStorageData(STORAGE_KEYS.PROFILE, data);
export const saveHeroSlides = (data: any) => setStorageData(STORAGE_KEYS.HERO, data);
export const saveContact = (data: any) => setStorageData(STORAGE_KEYS.CONTACT, data);
export const saveSOP = (data: any) => setStorageData(STORAGE_KEYS.SOP, data);
export const saveLegalDocs = (data: any) => setStorageData(STORAGE_KEYS.LEGAL, data);
