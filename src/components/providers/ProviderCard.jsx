import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, MapPin } from "lucide-react";
import LazyImage from "@/components/ui/LazyImage";
import VerificacaoBadge from "@/components/verificacao/VerificacaoBadge";
import BadgeEmVerificacao from "@/components/verificacao/BadgeEmVerificacao";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { getProviderMockImages, DEMO_PROFILE_WARNING } from "@/lib/mockProviderImages";

export default function ProviderCard({ provider }) {
    const mockImages = getProviderMockImages(provider.occupation);
    
    return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all h-full flex flex-col overflow-hidden">
        {/* Foto de Capa */}
        <div className="relative h-32 bg-gradient-to-r from-amber-700 to-amber-600 shrink-0">
            {provider.cover_photo_url ? (
                <LazyImage
                    src={provider.cover_photo_url}
                    alt={`Foto de capa de ${provider.full_name}`}
                    className="w-full h-full object-cover"
                />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <CardContent className="p-6 flex flex-col flex-grow -mt-10 relative">
            <div className="flex items-start gap-4 mb-4">
                <LazyImage
                    src={provider.photo_url || `https://ui-avatars.com/api/?name=${provider.full_name}&size=200`}
                    alt={`Foto de perfil de ${provider.full_name}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                         <div>
                             <h3 className="font-bold text-lg text-slate-900">{provider.full_name}</h3>
                             <p className="text-sm text-slate-600">{provider.occupation}</p>
                         </div>
                         <div className="flex items-start gap-2">
                             {provider.verified && (
                                 <VerificacaoBadge verified showLabel size="sm" />
                             )}
                             {provider.status_verificacao && provider.status_verificacao !== 'aprovado' && provider.status_verificacao !== 'reprovado' && (
                                 <BadgeEmVerificacao />
                             )}
                             <FavoriteButton 
                                 id={provider.id} 
                                 type="provider" 
                                 name={provider.full_name}
                                 category={provider.occupation}
                             />
                         </div>
                     </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                        </div>
                        {provider.total_reviews > 0 && <span className="text-xs text-slate-500">({provider.total_reviews} avaliações)</span>}
                    </div>
                </div>
            </div>

            {provider.bio && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">{provider.bio}</p>
            )}

            <div className="flex items-center justify-between mb-4 mt-auto flex-wrap gap-1">
                {provider.location?.city && (
                    <div className="flex items-center gap-1 text-sm text-slate-600 shrink-0">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[120px]">{provider.location.city}</span>
                    </div>
                )}
                {provider.price_range && (
                    <Badge variant="outline" className="shrink-0">{provider.price_range}</Badge>
                )}
            </div>

            {provider.availability && (
                 <Badge className={`mb-4 self-start ${
                    provider.availability === 'Disponível' ? 'bg-green-100 text-green-800' :
                    provider.availability === 'Ocupado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {provider.availability}
                </Badge>
            )}

            <Link to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)}>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 min-h-[44px] transition-all duration-200 active:scale-95">
                    Ver Perfil Completo
                </Button>
            </Link>
            
            {/* Aviso de perfil ilustrativo */}
            <p className="text-xs text-slate-400 opacity-60 text-center mt-2 pt-2 border-t border-slate-100">
                {DEMO_PROFILE_WARNING}
            </p>
        </CardContent>
    </Card>
    );
};