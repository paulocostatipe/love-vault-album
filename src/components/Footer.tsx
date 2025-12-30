import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span className="font-sans text-sm">Feito com</span>
          <Heart className="w-4 h-4 text-wedding-rose fill-wedding-rose" />
          <span className="font-sans text-sm">para nosso grande dia</span>
        </div>
        <p className="mt-2 font-serif text-lg text-foreground">Marina & João</p>
      </div>
    </footer>
  );
}
