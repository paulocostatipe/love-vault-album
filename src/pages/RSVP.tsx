import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Heart, Users, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simulated guest data - in production this would come from a database
const guestDatabase: Record<string, { name: string; companions: number; confirmed?: boolean }> = {
  "ABC123": { name: "Maria Silva", companions: 2 },
  "DEF456": { name: "Carlos Santos", companions: 1 },
  "GHI789": { name: "Ana Oliveira", companions: 3 },
  "JKL012": { name: "Pedro Costa", companions: 0 },
};

export default function RSVP() {
  const [code, setCode] = useState("");
  const [guest, setGuest] = useState<{ name: string; companions: number; confirmed?: boolean } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const { toast } = useToast();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundGuest = guestDatabase[code.toUpperCase()];
    
    if (foundGuest) {
      setGuest(foundGuest);
      setIsConfirmed(foundGuest.confirmed ?? null);
    } else {
      toast({
        title: "Código não encontrado",
        description: "Por favor, verifique o código do seu convite e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmation = (attending: boolean) => {
    setIsConfirmed(attending);
    toast({
      title: attending ? "Presença confirmada!" : "Resposta registrada",
      description: attending 
        ? "Estamos ansiosos para celebrar com você!" 
        : "Sentiremos sua falta, mas agradecemos por nos avisar.",
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
            RSVP
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Confirme sua Presença
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Use o código presente no seu convite para confirmar sua presença em nosso casamento
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {!guest ? (
            /* Code Entry Form */
            <Card variant="wedding">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-wedding-sage" />
                  Digite seu Código
                </CardTitle>
                <CardDescription>
                  O código está localizado no seu convite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <Input
                    placeholder="Ex: ABC123"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="text-center text-lg tracking-widest uppercase"
                    maxLength={6}
                  />
                  <Button type="submit" variant="wedding" className="w-full" size="lg">
                    Buscar Convite
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Códigos de teste:</strong> ABC123, DEF456, GHI789, JKL012
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Guest Confirmation */
            <Card variant="wedding">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Olá, {guest.name}!</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  {guest.companions > 0 
                    ? `Você + ${guest.companions} acompanhante${guest.companions > 1 ? 's' : ''}`
                    : "Convite individual"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isConfirmed === null ? (
                  <>
                    <p className="text-center text-muted-foreground">
                      Você poderá comparecer ao nosso casamento?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="wedding"
                        size="lg"
                        onClick={() => handleConfirmation(true)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Sim, irei!
                      </Button>
                      <Button
                        variant="wedding-outline"
                        size="lg"
                        onClick={() => handleConfirmation(false)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Não poderei
                      </Button>
                    </div>
                  </>
                ) : isConfirmed ? (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-wedding-sage-light rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-wedding-sage" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-foreground mb-2">
                        Presença Confirmada!
                      </h3>
                      <p className="text-muted-foreground">
                        Estamos muito felizes que você poderá celebrar conosco!
                      </p>
                    </div>

                    {/* Dietary Restrictions */}
                    <div className="text-left space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Utensils className="w-4 h-4 text-wedding-sage" />
                        Restrições alimentares (opcional)
                      </label>
                      <Input
                        placeholder="Ex: Vegetariano, sem glúten..."
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                      />
                      <Button variant="wedding-outline" size="sm" className="w-full">
                        Salvar
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => setIsConfirmed(null)}
                      className="text-muted-foreground"
                    >
                      Alterar resposta
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-wedding-rose-light rounded-full flex items-center justify-center">
                      <Heart className="w-10 h-10 text-wedding-rose" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-foreground mb-2">
                        Sentiremos sua falta!
                      </h3>
                      <p className="text-muted-foreground">
                        Agradecemos por nos avisar. Você estará em nossos corações.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setIsConfirmed(null)}
                      className="text-muted-foreground"
                    >
                      Alterar resposta
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  onClick={() => {
                    setGuest(null);
                    setCode("");
                    setIsConfirmed(null);
                  }}
                  className="w-full text-muted-foreground"
                >
                  Usar outro código
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
