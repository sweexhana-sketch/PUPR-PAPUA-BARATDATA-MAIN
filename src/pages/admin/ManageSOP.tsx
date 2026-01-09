import { useState, useEffect } from "react";
import { getSOP, saveSOP } from "@/lib/storage";
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
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManageSOP = () => {
    const [sopItems, setSopItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        code: "",
        file: "",
        size: "RAR",
    });

    useEffect(() => {
        setSopItems(getSOP());
    }, []);

    const handleOpenDialog = (item?: any) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                title: item.title,
                code: item.code,
                file: item.file,
                size: item.size || "RAR",
            });
        } else {
            setCurrentItem(null);
            setFormData({
                title: "",
                code: "SOP-XXX-001",
                file: "/documents/SOP-NAME.rar",
                size: "RAR",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let updatedSOP;
        if (currentItem) {
            // Edit
            updatedSOP = sopItems.map((item) =>
                item.id === currentItem.id ? { ...item, ...formData } : item
            );
            toast.success("SOP berhasil diperbarui");
        } else {
            // Add
            const newId = Math.max(...sopItems.map((n) => n.id), 0) + 1;
            updatedSOP = [{ id: newId, ...formData }, ...sopItems];
            toast.success("SOP berhasil ditambahkan");
        }

        setSopItems(updatedSOP);
        saveSOP(updatedSOP);
        setIsDialogOpen(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus SOP ini?")) {
            const updatedSOP = sopItems.filter((item) => item.id !== id);
            setSopItems(updatedSOP);
            saveSOP(updatedSOP);
            toast.success("SOP berhasil dihapus");
        }
    };

    const filteredSOP = sopItems.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Kelola SOP</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah SOP
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar SOP</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari SOP..."
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
                                <TableHead>Kode</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSOP.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs">{item.code}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {item.file}
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
                            {filteredSOP.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Tidak ada SOP ditemukan
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
                            {currentItem ? "Edit SOP" : "Tambah SOP Baru"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Judul SOP</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Contoh: SOP Bidang Bina Marga"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kode Dokumen</label>
                            <Input
                                required
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                placeholder="Contoh: SOP-BM-001"
                            />
                        </div>
                        <label className="text-sm font-medium">File SOP</label>
                        <div className="space-y-3 p-4 border rounded-md bg-muted/50">
                            <div>
                                <label className="text-xs font-medium mb-1 block">Upload File (Maks 1MB - Demo Local Storage)</label>
                                <Input
                                    type="file"
                                    accept=".rar,.zip,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 1024 * 1024) { // 1MB limit
                                                toast.error("File terlalu besar untuk demo admin (Max 1MB). Gunakan URL eksternal.");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, file: reader.result as string });
                                                toast.success("File berhasil dikonversi");
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
                                    <span className="bg-muted px-2 text-muted-foreground">Atau gunakan URL</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block">URL File Eksternal</label>
                                <Input
                                    required
                                    value={formData.file}
                                    onChange={(e) =>
                                        setFormData({ ...formData, file: e.target.value })
                                    }
                                    placeholder="/documents/nama-file.rar atau https://..."
                                    className="bg-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
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

export default ManageSOP;
