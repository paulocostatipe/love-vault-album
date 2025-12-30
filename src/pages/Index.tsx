import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, MapPin, Clock } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

const Index = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Ana e Paulo"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
              Celebrando nosso amor
            </p>
          </div>
          
          <h1 
            className="font-serif text-6xl md:text-8xl lg:text-9xl text-foreground mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Ana <span className="text-wedding-sage">&</span> Paulo
          </h1>
          
          <div 
            className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="h-px w-16 bg-wedding-gold/50" />
            <Heart className="w-5 h-5 text-wedding-gold" />
            <div className="h-px w-16 bg-wedding-gold/50" />
          </div>

          <p 
            className="font-serif text-2xl md:text-3xl text-muted-foreground mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            Convidamos você para celebrar conosco
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <Button asChild variant="wedding" size="xl">
              <Link to="/rsvp">Confirmar Presença</Link>
            </Button>
            <Button asChild variant="wedding-outline" size="xl">
              <Link to="/presentes">Lista de Presentes</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-wedding-sage/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-wedding-sage rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
              Detalhes do Evento
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Quando & Onde
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Date */}
            <div className="text-center p-8 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wedding-sage-light flex items-center justify-center">
                <Calendar className="w-7 h-7 text-wedding-sage" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">Data</h3>
              <p className="font-sans text-muted-foreground">30 de Abril, 2025</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">Quarta-feira</p>
            </div>

            {/* Time */}
            <div className="text-center p-8 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wedding-rose-light flex items-center justify-center">
                <Clock className="w-7 h-7 text-wedding-rose" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">Horário</h3>
              <p className="font-sans text-muted-foreground">Cerimônia às 16h</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">Recepção às 18h</p>
            </div>

            {/* Location */}
            <div className="text-center p-8 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wedding-gold-light flex items-center justify-center">
                <MapPin className="w-7 h-7 text-wedding-gold" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">Local</h3>
              <p className="font-sans text-muted-foreground">Gravatá</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">Pernambuco</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-wedding-sage-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
            Compartilhe esse momento conosco
          </h2>
          <p className="font-sans text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Capture e compartilhe os melhores momentos do nosso casamento na galeria de fotos
          </p>
          <Button asChild variant="wedding" size="xl">
            <Link to="/galeria">Ver Galeria</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;
