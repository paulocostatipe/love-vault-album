-- Criar tabela de convidados
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  companions INTEGER NOT NULL DEFAULT 0,
  confirmed BOOLEAN DEFAULT NULL,
  dietary_restrictions TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (para validar código RSVP)
CREATE POLICY "Anyone can read guests by code" 
ON public.guests 
FOR SELECT 
USING (true);

-- Política para permitir atualização pública (para confirmação RSVP)
CREATE POLICY "Anyone can update guests" 
ON public.guests 
FOR UPDATE 
USING (true);

-- Política para permitir inserção pública (para admin adicionar convidados)
CREATE POLICY "Anyone can insert guests" 
ON public.guests 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir deleção pública (para admin remover convidados)
CREATE POLICY "Anyone can delete guests" 
ON public.guests 
FOR DELETE 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_guests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_guests_updated_at();

-- Inserir dados de teste
INSERT INTO public.guests (name, code, companions) VALUES
  ('Fernanda Silva', 'ABC123', 2),
  ('Carlos Santos', 'DEF456', 1),
  ('Ana Oliveira', 'GHI789', 3),
  ('Pedro Costa', 'JKL012', 0);