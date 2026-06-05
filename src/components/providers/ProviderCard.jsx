import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star } from "lucide-react";
import LazyImage from "@/components/ui/LazyImage";
import VerificacaoBadge from "@/components/verificacao/VerificacaoBadge";
import BadgeEmVerificacao from "@/components/verificacao/BadgeEmVerificacao";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { DEMO_PROFILE_WARNING } from "@/lib/mockProviderImages";

export default function ProviderCard({ provider }) {
    return (
    <div style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: '#1a1a2e',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }}>
        {/* Imagem de capa reduzida */}
        <div style={{
            height: 80,
            backgroundImage: provider.cover_photo_url ? `url(${provider.cover_photo_url})` : 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            flexShrink: 0
        }}>
            {provider.cover_photo_url && (
                <LazyImage
                    src={provider.cover_photo_url}
                    alt={`Foto de capa de ${provider.full_name}`}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                />
            )}
        </div>

        {/* Corpo do card - avatar e info ABAIXO da capa */}
        <div style={{ padding: '0 16px 16px', marginTop: -32 }}>

            {/* Avatar com borda branca para separar da capa */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 8 }}>
                <div style={{
                    width: 64, height: 64,
                    borderRadius: '50%',
                    border: '3px solid #fff',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#374151'
                }}>
                    <LazyImage
                        src={provider.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.full_name)}&size=200`}
                        alt={`Foto de perfil de ${provider.full_name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Nome e profissão ao lado do avatar */}
                <div style={{ paddingBottom: 4, minWidth: 0, flex: 1 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 15, fontWeight: 700, color: '#fff',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                        {provider.full_name}
                        {provider.verified && <span style={{color:'#3b82f6', fontSize:14}}>✔</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>
                        {provider.occupation}
                    </div>
                </div>

                {/* Botão de favorito alinhado à direita */}
                <div style={{ paddingBottom: 4 }}>
                    <FavoriteButton 
                        id={provider.id} 
                        type="provider" 
                        name={provider.full_name}
                        category={provider.occupation}
                    />
                </div>
            </div>

            {/* Avaliação */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{color:'#f59e0b'}}>★</span>
                <span style={{color:'#fff', fontWeight:600, fontSize:14}}>{provider.rating ? provider.rating.toFixed(1) : 'Novo'}</span>
                {provider.total_reviews > 0 && (
                    <span style={{color:'#6b7280', fontSize:13}}>({provider.total_reviews} avaliações)</span>
                )}
            </div>

            {/* Descrição com truncate */}
            {provider.bio && (
                <p style={{
                    fontSize: 13, color: '#d1d5db', lineHeight: 1.5,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: 12
                }}>
                    {provider.bio}
                </p>
            )}

            {/* Localização e preço */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 10
            }}>
                {provider.location?.city && (
                    <span style={{fontSize:12, color:'#9ca3af'}}>📍 {provider.location.city}</span>
                )}
                {provider.price_range && (
                    <span style={{fontSize:13, color:'#d1d5db', fontWeight:600}}>{provider.price_range}</span>
                )}
            </div>

            {/* Badge de disponibilidade */}
            {provider.availability && (
                <div style={{ marginBottom: 12 }}>
                    <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: provider.availability === 'Disponível' ? '#dcfce7' : '#fee2e2',
                        color: provider.availability === 'Disponível' ? '#15803d' : '#dc2626'
                    }}>
                        {provider.availability}
                    </span>
                </div>
            )}

            {/* Badge Em Verificação - com fundo mais escuro */}
            {provider.status_verificacao && provider.status_verificacao !== 'aprovado' && provider.status_verificacao !== 'reprovado' && (
                <div style={{ marginBottom: 12 }}>
                    <BadgeEmVerificacao />
                </div>
            )}

            {/* Botão CTA */}
            <Link to={createPageUrl("PrestadorPerfil", `?id=${provider.id}`)}>
                <button style={{
                    width: '100%', padding: '11px 0',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                    border: 'none', borderRadius: 10, cursor: 'pointer',
                    transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}
                >
                    Ver Perfil Completo
                </button>
            </Link>

            {/* Nota de rodapé */}
            <p style={{
                textAlign: 'center', fontSize: 11,
                color: '#6b7280', marginTop: 8
            }}>
                {DEMO_PROFILE_WARNING}
            </p>
        </div>
    </div>
    );
};