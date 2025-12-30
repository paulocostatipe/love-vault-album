-- Criar tabela para armazenar informações das fotos da galeria
CREATE TABLE IF NOT EXISTS public.gallery_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  author TEXT NOT NULL,
  caption TEXT,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Anyone can read gallery media" 
ON public.gallery_media 
FOR SELECT 
USING (true);

-- Política para permitir inserção pública (para upload de fotos)
CREATE POLICY "Anyone can insert gallery media" 
ON public.gallery_media 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir atualização pública (para likes)
CREATE POLICY "Anyone can update gallery media" 
ON public.gallery_media 
FOR UPDATE 
USING (true);

-- Política para permitir deleção pública (para remover fotos)
CREATE POLICY "Anyone can delete gallery media" 
ON public.gallery_media 
FOR DELETE 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_gallery_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_gallery_media_updated_at
BEFORE UPDATE ON public.gallery_media
FOR EACH ROW
EXECUTE FUNCTION public.update_gallery_media_updated_at();

