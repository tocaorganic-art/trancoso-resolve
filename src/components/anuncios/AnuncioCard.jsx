import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/LazyImage";
import { ExternalLink, Megaphone } from "lucide-react";

export default function AnuncioCard({ anuncio }) {
  if (!anuncio) return null;

  const handleCardClick = () => {
    base44.entities.Anuncio.update(anuncio.id, { impressoes: (anuncio.impressoes || 0) + 1 });
  };

  const handleCtaClick = (e) => {
    e.stopPropagation();
    base44.entities.Anuncio.update(anuncio.id, { cliques: (anuncio.cliques || 0) + 1 });
    if (anuncio.cta_url) {
      window.open(anuncio.cta_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="rounded-xl border border-border bg-card shadow-warm-sm overflow-hidden cursor-pointer transition hover:shadow-warm-md"
    >
      {anuncio.imagem_url && (
        <LazyImage src={anuncio.imagem_url} alt={anuncio.titulo} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <Badge variant="secondary" className="gap-1 mb-2 bg-olive-500/15 text-olive-700 border-olive-500/30">
          <Megaphone className="w-3 h-3" />
          Parceiro Local
        </Badge>
        <h3 className="text-base font-bold text-foreground">{anuncio.titulo}</h3>
        {anuncio.descricao && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{anuncio.descricao}</p>
        )}
        {anuncio.cta_label && (
          <Button
            onClick={handleCtaClick}
            className="w-full mt-4 bg-brand-primary hover:bg-orange-700 rounded-pill"
          >
            {anuncio.cta_label}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
