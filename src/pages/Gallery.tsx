import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Heart, MessageCircle, X, Image as ImageIcon, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  author: string;
  caption: string;
  likes: number;
  timestamp: Date;
}

const initialMedia: MediaItem[] = [
  {
    id: 1,
    type: "image",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
    author: "Maria Silva",
    caption: "Que dia lindo! 💕",
    likes: 12,
    timestamp: new Date(),
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop",
    author: "Carlos Santos",
    caption: "A decoração está maravilhosa!",
    likes: 8,
    timestamp: new Date(),
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop",
    author: "Ana Oliveira",
    caption: "Viva os noivos! 🎉",
    likes: 15,
    timestamp: new Date(),
  },
  {
    id: 4,
    type: "image",
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop",
    author: "Pedro Costa",
    caption: "Momento especial",
    likes: 6,
    timestamp: new Date(),
  },
];

export default function Gallery() {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [showUpload, setShowUpload] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { toast } = useToast();

  const handleLike = (id: number) => {
    setMedia(prev =>
      prev.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleUpload = () => {
    if (!authorName.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload - in production this would upload to storage
    const newItem: MediaItem = {
      id: Date.now(),
      type: "image",
      url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=400&fit=crop",
      author: authorName,
      caption: caption || "📸",
      likes: 0,
      timestamp: new Date(),
    };

    setMedia(prev => [newItem, ...prev]);
    setShowUpload(false);
    setAuthorName("");
    setCaption("");

    toast({
      title: "Foto enviada!",
      description: "Sua foto foi adicionada à galeria.",
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
            Memórias
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Galeria de Fotos
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto mb-8">
            Compartilhe os melhores momentos do nosso casamento
          </p>

          <Button 
            variant="wedding" 
            size="lg"
            onClick={() => setShowUpload(true)}
          >
            <Camera className="w-5 h-5 mr-2" />
            Enviar Foto ou Vídeo
          </Button>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card variant="wedding" className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-2xl">Enviar Mídia</h3>
                  <button 
                    onClick={() => setShowUpload(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-wedding-sage/30 rounded-lg p-8 text-center hover:border-wedding-sage/50 transition-colors cursor-pointer">
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-wedding-sage-light rounded-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-wedding-sage" />
                      </div>
                      <div className="w-12 h-12 bg-wedding-rose-light rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-wedding-rose" />
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      Clique para selecionar ou arraste aqui
                    </p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG ou MP4 (máx. 10MB)
                    </p>
                    <input type="file" className="hidden" accept="image/*,video/*" />
                  </div>

                  <Input
                    placeholder="Seu nome"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />

                  <Input
                    placeholder="Legenda (opcional)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />

                  <Button 
                    variant="wedding" 
                    className="w-full" 
                    size="lg"
                    onClick={handleUpload}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div 
              key={item.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-sans text-sm font-medium truncate">{item.author}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Heart className="w-3 h-3" />
                  <span>{item.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedMedia && (
          <div 
            className="fixed inset-0 bg-foreground/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <div 
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute -top-12 right-0 text-primary-foreground hover:text-wedding-sage transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <img
                src={selectedMedia.url}
                alt={selectedMedia.caption}
                className="w-full rounded-lg"
              />

              <div className="mt-4 flex items-center justify-between text-primary-foreground">
                <div>
                  <p className="font-serif text-xl">{selectedMedia.author}</p>
                  <p className="text-sm opacity-80">{selectedMedia.caption}</p>
                </div>
                <Button
                  variant="wedding-outline"
                  size="sm"
                  onClick={() => handleLike(selectedMedia.id)}
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {selectedMedia.likes}
                </Button>
              </div>
            </div>
          </div>
        )}

        {media.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Nenhuma foto ainda
            </h3>
            <p className="text-muted-foreground">
              Seja o primeiro a compartilhar um momento especial!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
