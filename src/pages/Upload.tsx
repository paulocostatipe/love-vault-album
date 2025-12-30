import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de arquivo
      if (!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/")) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione uma imagem ou vídeo.",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho (máximo 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "Arquivo necessário",
        description: "Por favor, selecione uma foto ou vídeo para enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!author.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // Se o bucket não existir, vamos criar uma mensagem mais clara
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Bucket "gallery" não encontrado. Por favor, crie o bucket no Supabase Storage.');
        }
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // Salvar metadados na tabela
      const { error: dbError } = await supabase
        .from('gallery_media')
        .insert({
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          author: author.trim(),
          caption: caption.trim() || null,
          likes: 0
        });

      if (dbError) {
        // Se a tabela não existir, tentar deletar o arquivo enviado
        await supabase.storage.from('gallery').remove([filePath]);
        throw dbError;
      }

      toast({
        title: "Upload realizado!",
        description: "Sua foto foi enviada com sucesso e já está na galeria.",
      });

      // Limpar formulário
      setFile(null);
      setPreview(null);
      setAuthor("");
      setCaption("");

      // Redirecionar para galeria
      setTimeout(() => {
        navigate("/galeria");
      }, 1500);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
            Compartilhe
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Enviar Foto ou Vídeo
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Compartilhe seus melhores momentos do nosso casamento
          </p>
        </div>

        {/* Upload Form */}
        <Card variant="wedding">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <Label htmlFor="file">Foto ou Vídeo</Label>
                {!preview ? (
                  <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-wedding-sage transition-colors">
                    <input
                      type="file"
                      id="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <UploadIcon className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Clique para selecionar ou arraste o arquivo aqui
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Imagens ou vídeos até 10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="mt-2 relative">
                    {file?.type.startsWith("image/") ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={preview}
                        className="w-full h-64 object-cover rounded-lg"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Author Name */}
              <div>
                <Label htmlFor="author">Seu Nome *</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Digite seu nome"
                  required
                  className="mt-2"
                />
              </div>

              {/* Caption */}
              <div>
                <Label htmlFor="caption">Legenda (opcional)</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Adicione uma legenda para sua foto..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/galeria")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="wedding"
                  disabled={!file || !author.trim() || isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Suas fotos serão revisadas antes de serem publicadas na galeria.
          </p>
        </div>
      </div>
    </main>
  );
}

