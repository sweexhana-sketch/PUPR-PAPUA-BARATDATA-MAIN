import { useState, useEffect } from "react";
import { getGallery, getSOP, getLegalDocs } from "@/lib/storage";
import { X, ZoomIn, FolderArchive, Download, FileText, Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



const Galeri = () => {
    const [galleryItems, setGalleryItems] = useState<any[]>([]);
    const [portalItems, setPortalItems] = useState<any[]>([]);
    const [legalItems, setLegalItems] = useState<any[]>([]);

    useEffect(() => {
        setGalleryItems(getGallery());
        setPortalItems(getSOP());
        setLegalItems(getLegalDocs());

        // Listen for storage updates
        const handleStorageUpdate = () => {
            setGalleryItems(getGallery());
            setPortalItems(getSOP());
            setLegalItems(getLegalDocs());
        };

        window.addEventListener("storage-update", handleStorageUpdate);
        return () => window.removeEventListener("storage-update", handleStorageUpdate);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20">
                {/* Header */}
                <div className="bg-gradient-ocean py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground text-center">
                            Galeri Kegiatan & Data
                        </h1>
                        <p className="text-center text-primary-foreground/90 mt-4 text-lg">
                            Dokumentasi visual, Portal SOP, dan Produk Hukum Dinas PUPR Papua Barat Daya
                        </p>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="container mx-auto px-4 py-12">
                    <Tabs defaultValue="kegiatan" className="w-full">
                        <div className="flex justify-center mb-12">
                            <TabsList className="grid w-full max-w-2xl grid-cols-3">
                                <TabsTrigger value="kegiatan">Dokumentasi</TabsTrigger>
                                <TabsTrigger value="portal">Portal Data SOP</TabsTrigger>
                                <TabsTrigger value="hukum">Produk Hukum</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="kegiatan" className="space-y-6">
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {galleryItems.map((item) => (
                                    <Dialog key={item.id}>
                                        <DialogTrigger asChild>
                                            <div className="break-inside-avoid group relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                                {item.type === 'video' ? (
                                                    <div className="w-full h-64 bg-black flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={item.image}
                                                        alt={item.caption}
                                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <ZoomIn className="text-white h-10 w-10" />
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <p className="text-white font-semibold">{item.caption}</p>
                                                    <span className="text-white/80 text-xs">{item.category}</span>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                                            <div className="relative">
                                                {item.type === 'video' ? (
                                                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl bg-black">
                                                        <iframe
                                                            src={item.image}
                                                            className="w-full h-full"
                                                            allowFullScreen
                                                            title={item.caption}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={item.image}
                                                        alt={item.caption}
                                                        className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                                    />
                                                )}
                                                <DialogClose className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
                                                    <X className="h-4 w-4 text-black" />
                                                </DialogClose>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm rounded-b-lg">
                                                    <p className="text-white font-bold text-lg">{item.caption}</p>
                                                    <p className="text-white/80">{item.category}</p>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="portal">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portalItems.map((item) => (
                                    <div key={item.id} className="bg-card hover:bg-accent/50 transition-colors border rounded-xl p-6 shadow-sm hover:shadow-md group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <FolderArchive className="h-8 w-8" />
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                                {item.size}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                            <FileText className="h-4 w-4" />
                                            <span>{item.code}</span>
                                        </div>

                                        <a
                                            href={item.file}
                                            download
                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download RAR
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="hukum">
                            <div className="grid grid-cols-1 gap-4">
                                {legalItems.map((item) => (
                                    <div key={item.id} className="bg-card hover:bg-accent/30 transition-colors border rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg text-white shrink-0 
                                                ${item.type === 'Peraturan Daerah' ? 'bg-blue-600' :
                                                    item.type === 'Peraturan Gubernur' ? 'bg-green-600' :
                                                        'bg-purple-600'}`}>
                                                <Scale className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                                                        ${item.type === 'Peraturan Daerah' ? 'bg-blue-100 text-blue-700' :
                                                            item.type === 'Peraturan Gubernur' ? 'bg-green-100 text-green-700' :
                                                                'bg-purple-100 text-purple-700'}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">Tahun {item.year}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-foreground mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground font-mono">
                                                    {item.number}
                                                </p>
                                            </div>
                                        </div>

                                        <a
                                            href={item.file || '#'}
                                            download={
                                                item.file?.startsWith('data:')
                                                    ? `${item.title.replace(/[^a-z0-9]/gi, '_')}.${item.size?.toLowerCase() || 'pdf'}`
                                                    : item.file?.startsWith('/')
                                                        ? item.file.split('/').pop()
                                                        : undefined
                                            }
                                            target={item.file?.startsWith('http') ? "_blank" : undefined}
                                            rel={item.file?.startsWith('http') ? "noopener noreferrer" : undefined}
                                            onClick={(e) => {
                                                if (!item.file || item.file === '#') {
                                                    e.preventDefault();
                                                    alert('File tidak tersedia');
                                                }
                                            }}
                                            className="shrink-0 w-full md:w-auto bg-outline border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download {item.size || 'PDF'}
                                        </a>
                                    </div>
                                ))}
                                {legalItems.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                        <Scale className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>Belum ada produk hukum yang tersedia.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Galeri;
