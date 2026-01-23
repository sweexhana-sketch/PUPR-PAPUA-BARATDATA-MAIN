import { useState, useEffect } from "react";
import { getLegalDocs, saveLegalDocs } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageLegalDocs = () => {
    const [legalItems, setLegalItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        number: "",
        type: "Peraturan Daerah",
        year: new Date().getFullYear().toString(),
        file: "",
        size: "PDF",
    });

    useEffect(() => {
        setLegalItems(getLegalDocs());
    }, []);

    const handleOpenDialog = (item?: any) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                title: item.title,
                number: item.number,
                type: item.type,
                year: item.year,
                file: item.file,
                size: item.size || "PDF",
            });
        } else {
            setCurrentItem(null);
            setFormData({
                title: "",
                number: "",
                type: "Peraturan Daerah",
                year: new Date().getFullYear().toString(),
                file: "",
                size: "PDF",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let updatedLegal;
        if (currentItem) {
            // Edit
            updatedLegal = legalItems.map((item) =>
                item.id === currentItem.id ? { ...item, ...formData } : item
            );
            toast.success("Dokumen berhasil diperbarui");
        } else {
            // Add
            const newId = Math.max(...legalItems.map((n) => n.id), 0) + 1;
            updatedLegal = [{ id: newId, ...formData }, ...legalItems];
            toast.success("Dokumen berhasil ditambahkan");
        }

        setLegalItems(updatedLegal);
        saveLegalDocs(updatedLegal);
        setIsDialogOpen(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
            const updatedLegal = legalItems.filter((item) => item.id !== id);
            setLegalItems(updatedLegal);
            saveLegalDocs(updatedLegal);
            toast.success("Dokumen berhasil dihapus");
        }
    };

    const filteredLegal = legalItems.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Kelola Produk Hukum</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Dokumen
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Perda/Pergub/SK</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari dokumen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Jenis</TableHead>
                                <TableHead>Nomor/Tahun</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLegal.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${item.type === 'Peraturan Daerah' ? 'bg-blue-100 text-blue-800' :
                                                item.type === 'Peraturan Gubernur' ? 'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'}`}>
                                            {item.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {item.number} <br />
                                        <span className="text-muted-foreground">Thn {item.year}</span>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[300px]">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary shrink-0" />
                                            <span className="truncate block">{item.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                                        {item.file ? (item.file.startsWith('data:') ? 'File Uploaded' : item.file) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleOpenDialog(item)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredLegal.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Tidak ada dokumen ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {currentItem ? "Edit Dokumen" : "Tambah Dokumen Baru"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jenis Dokumen</label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Peraturan Daerah">Peraturan Daerah (Perda)</SelectItem>
                                    <SelectItem value="Peraturan Gubernur">Peraturan Gubernur (Pergub)</SelectItem>
                                    <SelectItem value="SK Gubernur">Surat Keputusan (SK) Gubernur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nomor Dokumen</label>
                                <Input
                                    required
                                    value={formData.number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, number: e.target.value })
                                    }
                                    placeholder="Contoh: No. 12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tahun</label>
                                <Input
                                    required
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) =>
                                        setFormData({ ...formData, year: e.target.value })
                                    }
                                    placeholder="2024"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Judul Dokumen</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Contoh: Tentang Rencana Tata Ruang..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">File Dokumen</label>
                            <div className="space-y-3 p-4 border rounded-md bg-muted/50">
                                <div>
                                    <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                                        <Upload className="w-3 h-3" /> Upload PDF (Maks 2MB)
                                    </label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                                                    toast.error("File terlalu besar (Max 2MB). Silakan gunakan URL eksternal untuk file besar.");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, file: reader.result as string, size: "PDF" });
                                                    toast.success("File siap diupload");
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="cursor-pointer bg-white"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-muted px-2 text-muted-foreground">Atau URL Eksternal</span>
                                    </div>
                                </div>
                                <div>
                                    <Input
                                        value={formData.file}
                                        onChange={(e) =>
                                            setFormData({ ...formData, file: e.target.value })
                                        }
                                        placeholder="https://drive.google.com/..."
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageLegalDocs;
