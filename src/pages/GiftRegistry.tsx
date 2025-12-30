import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Heart, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GiftItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  reserved: boolean;
  reservedBy?: string;
}

const initialGifts: GiftItem[] = [
  {
    id: 1,
    name: "Copo de Cerveja do Noivo",
    description: "Caneco premium personalizado para o Paulo beber sua gelada em paz",
    price: 340,
    image: "🍺",
    category: "Bar",
    reserved: false,
  },
  {
    id: 2,
    name: "Rede de Casal Gigante",
    description: "Para os dois dormirem juntos sem cair (ou não)",
    price: 450,
    image: "🛏️",
    category: "Diversão",
    reserved: false,
  },
  {
    id: 3,
    name: "Kit Churrasco Master",
    description: "Porque todo casamento precisa de um churrasco memorável",
    price: 890,
    image: "🥩",
    category: "Cozinha",
    reserved: false,
  },
  {
    id: 4,
    name: "Máquina de Karaokê",
    description: "Para cantar (e desafinar) nas festas de família",
    price: 650,
    image: "🎤",
    category: "Diversão",
    reserved: true,
    reservedBy: "Tio Pedro",
  },
  {
    id: 5,
    name: "Piscina Inflável para Adultos",
    description: "Porque piscina de verdade é caro demais",
    price: 280,
    image: "🏊",
    category: "Diversão",
    reserved: false,
  },
  {
    id: 6,
    name: "Kit Ressaca Completo",
    description: "Engov, Gatorade e pizza congelada para o dia seguinte",
    price: 150,
    image: "💊",
    category: "Sobrevivência",
    reserved: false,
  },
  {
    id: 7,
    name: "Projetor para Maratonar Séries",
    description: "Porque a Netflix não vai se assistir sozinha",
    price: 1200,
    image: "📽️",
    category: "Diversão",
    reserved: false,
  },
  {
    id: 8,
    name: "Fritadeira Air Fryer XL",
    description: "Para a Ana fritar tudo sem culpa",
    price: 520,
    image: "🍟",
    category: "Cozinha",
    reserved: false,
  },
  {
    id: 9,
    name: "Cadeira Gamer para o Paulo",
    description: "Para ele jogar em paz enquanto a Ana assiste novela",
    price: 980,
    image: "🎮",
    category: "Diversão",
    reserved: false,
  },
  {
    id: 10,
    name: "Robô Aspirador",
    description: "Porque ninguém quer limpar a casa",
    price: 1500,
    image: "🤖",
    category: "Casa",
    reserved: true,
    reservedBy: "Vó Rosa",
  },
  {
    id: 11,
    name: "Cooler Térmico 50L",
    description: "Para manter as cervejas geladas no churrasco",
    price: 380,
    image: "🧊",
    category: "Bar",
    reserved: false,
  },
  {
    id: 12,
    name: "Kit Jardinagem para Iniciantes",
    description: "Para matar plantas juntos como casal",
    price: 220,
    image: "🌱",
    category: "Casa",
    reserved: false,
  },
];

const categories = ["Todos", "Bar", "Cozinha", "Diversão", "Casa", "Sobrevivência"];

export default function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { toast } = useToast();

  const filteredGifts = selectedCategory === "Todos" 
    ? gifts 
    : gifts.filter(gift => gift.category === selectedCategory);

  const handleReserve = (giftId: number) => {
    setGifts(prev => 
      prev.map(gift => 
        gift.id === giftId 
          ? { ...gift, reserved: true, reservedBy: "Você" }
          : gift
      )
    );
    toast({
      title: "Presente reservado!",
      description: "Obrigado por sua generosidade! O casal ficará muito feliz.",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
            Presentes
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Lista de Presentes
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Sua presença é o nosso maior presente, mas se desejar nos presentear, 
            preparamos uma lista especial
          </p>
        </div>

        {/* PIX Option */}
        <Card variant="wedding" className="max-w-lg mx-auto mb-12">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-wedding-gold" />
              Presente em Dinheiro
            </CardTitle>
            <CardDescription>
              Se preferir, você pode nos presentear via PIX
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="font-mono text-lg text-foreground">casamento@anaepaulo.com</p>
            </div>
            <Button variant="wedding-gold" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Copiar Chave PIX
            </Button>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "wedding" : "wedding-outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gift Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGifts.map((gift) => (
            <Card 
              key={gift.id} 
              variant="gift"
              className={gift.reserved ? "opacity-75" : ""}
            >
              <CardHeader className="text-center pb-2">
                <div className="text-5xl mb-3">{gift.image}</div>
                <CardTitle className="text-lg">{gift.name}</CardTitle>
                <CardDescription>{gift.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="font-serif text-2xl text-wedding-sage">
                  {formatPrice(gift.price)}
                </p>
                
                {gift.reserved ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Reservado por {gift.reservedBy}</span>
                  </div>
                ) : (
                  <Button 
                    variant="wedding-outline" 
                    className="w-full"
                    onClick={() => handleReserve(gift.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Reservar
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGifts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum presente encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
