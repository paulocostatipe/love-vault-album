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
    name: "Jogo de Panelas",
    description: "Conjunto de panelas antiaderentes premium",
    price: 899,
    image: "🍳",
    category: "Cozinha",
    reserved: false,
  },
  {
    id: 2,
    name: "Jogo de Cama King",
    description: "Lençóis de algodão egípcio 400 fios",
    price: 650,
    image: "🛏️",
    category: "Quarto",
    reserved: true,
    reservedBy: "Maria",
  },
  {
    id: 3,
    name: "Cafeteira Expresso",
    description: "Máquina de café automática com moedor",
    price: 1200,
    image: "☕",
    category: "Cozinha",
    reserved: false,
  },
  {
    id: 4,
    name: "Aspirador Robô",
    description: "Aspirador inteligente com mapeamento",
    price: 1500,
    image: "🤖",
    category: "Casa",
    reserved: false,
  },
  {
    id: 5,
    name: "Jogo de Toalhas",
    description: "Kit completo de toalhas de banho",
    price: 350,
    image: "🛁",
    category: "Banheiro",
    reserved: true,
    reservedBy: "Carlos",
  },
  {
    id: 6,
    name: "Air Fryer",
    description: "Fritadeira elétrica digital 5L",
    price: 450,
    image: "🍟",
    category: "Cozinha",
    reserved: false,
  },
  {
    id: 7,
    name: "Jogo de Taças",
    description: "Conjunto de taças de cristal para vinho",
    price: 280,
    image: "🍷",
    category: "Cozinha",
    reserved: false,
  },
  {
    id: 8,
    name: "Smart TV 55\"",
    description: "Televisão 4K com sistema smart",
    price: 2800,
    image: "📺",
    category: "Sala",
    reserved: false,
  },
];

const categories = ["Todos", "Cozinha", "Quarto", "Banheiro", "Casa", "Sala"];

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
              <p className="font-mono text-lg text-foreground">casamento@marinajoao.com</p>
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
