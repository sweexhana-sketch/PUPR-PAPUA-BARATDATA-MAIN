import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNews } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

const BeritaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState<any>(null);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        const news = getNews();
        const item = news.find((n: any) => n.id === Number(id));

        if (item) {
            setNewsItem(item);
        } else {
            // Redirect to news page if item not found
            navigate("/berita");
        }
    }, [id, navigate]);

    if (!newsItem) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-16">
                {/* Hero Image Section */}
                <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="container mx-auto px-4 text-center">
                            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-white bg-primary/90 rounded-full backdrop-blur-sm">
                                {newsItem.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight shadow-sm">
                                {newsItem.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 -mt-10 relative z-30">
                    <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                        <div className="p-6 md:p-10">
                            {/* Meta Data */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    {newsItem.date}
                                </div>
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-primary" />
                                    {newsItem.author}
                                </div>
                                <div className="flex items-center">
                                    <Tag className="h-4 w-4 mr-2 text-primary" />
                                    {newsItem.category}
                                </div>
                            </div>

                            {/* Article Content */}
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: newsItem.content || newsItem.excerpt }}
                            />

                            {/* Back Button */}
                            <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
                                <Button variant="outline" onClick={() => navigate("/berita")} className="group">
                                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                    Kembali ke Berita
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BeritaDetail;
