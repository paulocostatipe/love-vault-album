import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Heart, X, Trash2, QrCode } from "lucide-react";
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
    author: "Fernanda Silva",
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
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const handleLike = (id: number) => {
    setMedia(prev =>
      prev.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (photoToDelete !== null) {
      setMedia(prev => prev.filter(item => item.id !== photoToDelete));
      if (selectedMedia?.id === photoToDelete) {
        setSelectedMedia(null);
      }
      setDeleteDialogOpen(false);
      setPhotoToDelete(null);
      toast({
        title: "Foto removida",
        description: "A foto foi removida da galeria.",
      });
    }
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
            onClick={() => setShowQrCode(true)}
          >
            <QrCode className="w-5 h-5 mr-2" />
            Enviar Foto ou Vídeo
          </Button>
        </div>

        {/* QR Code Modal */}
        {showQrCode && (
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card variant="wedding" className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-2xl">Escaneie o QR Code</h3>
                  <button 
                    onClick={() => setShowQrCode(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="text-center space-y-4">
                  {/* QR Code Placeholder */}
                  <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://casamento-ana-paulo.com/upload"
                      alt="QR Code para upload"
                      className="w-48 h-48"
                    />
                  </div>
                  
                  <p className="text-muted-foreground">
                    Use a câmera do seu celular para escanear o QR Code e enviar suas fotos e vídeos do casamento.
                  </p>
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
              
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteClick(item.id, e)}
                className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                title="Excluir foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>

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
              <div className="absolute -top-12 right-0 flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(selectedMedia.id, e);
                  }}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  title="Excluir foto"
                >
                  <Trash2 className="w-7 h-7" />
                </button>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="text-primary-foreground hover:text-wedding-sage transition-colors"
                  title="Fechar"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

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
              <QrCode className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">
              Nenhuma foto ainda
            </h3>
            <p className="text-muted-foreground">
              Escaneie o QR Code para enviar suas fotos!
            </p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPhotoToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
