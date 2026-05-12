import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ServiceGallery from '@/components/ServiceGallery';
import ReviewsList from '@/components/ReviewsList';
import BookingForm from '@/components/BookingForm';

// Mock data - substituir com dados reais da API
const MOCK_SERVICE = {
  id: '1',
  title: 'Limpeza Residencial Premium',
  category: 'Limpeza',
  price: 250,
  provider: {
    id: 'prov_1',
    name: 'Maria Silva',
    phone: '(11) 99999-9999',
    email: 'maria@exemplo.com',
    photo: 'https://ui-avatars.com/api/?name=Maria+Silva&size=200',
    bio: 'Profissional com 10 anos de experiência em limpeza residencial e comercial.',
    location: 'Zona Norte - São Paulo',
    verified: true,
  },
  images: [
    'https://images.unsplash.com/photo-1584567694244-14fbdf83bd30?w=800',
    'https://images.unsplash.com/photo-1583432495088-6acae5bc1234?w=800',
    'https://images.unsplash.com/photo-1585575889809-05e5411a4ad0?w=800',
  ],
  description: `Serviço completo de limpeza residencial com uso de produtos ecológicos de alta qualidade. 
  Inclui:
  • Limpeza de pisos (varrer, passar pano e encerar)
  • Limpeza de móveis e superfícies
  • Limpeza de cozinha (geladeira, fogão, bancada)
  • Limpeza de banheiros completa
  • Organização de ambientes
  
  Duração: 4-6 horas
  Material: fornecido pela profissional
  
  Agende sua limpeza e tenha uma casa impecável!`,
  averageRating: 4.8,
  totalReviews: 45,
  reviews: [
    {
      name: 'Ana Costa',
      rating: 5,
      comment: 'Excelente serviço! Maria foi muito atenciosa e deixou minha casa brilhando.',
      date: '2024-05-10',
    },
    {
      name: 'Roberto Santos',
      rating: 5,
      comment: 'Pontual, profissional e muito eficiente. Recomendo!',
      date: '2024-05-08',
    },
    {
      name: 'Juliana Oliveira',
      rating: 4,
      comment: 'Muito bom, apenas uma pequena observação sobre um detalhe.',
      date: '2024-05-05',
    },
  ],
  availability: {
    monday: { available: true, start: '08:00', end: '18:00' },
    tuesday: { available: true, start: '08:00', end: '18:00' },
    wednesday: { available: true, start: '08:00', end: '18:00' },
    thursday: { available: true, start: '08:00', end: '18:00' },
    friday: { available: true, start: '08:00', end: '18:00' },
    saturday: { available: true, start: '09:00', end: '14:00' },
    sunday: { available: false },
  },
};

export default function ServicoDetalhes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [service, setService] = React.useState(MOCK_SERVICE);

  useEffect(() => {
    document.title = `${service.title} - Trancoso Resolve`;
    window.scrollTo(0, 0);
  }, [service.title]);

  const handleBooking = async (formData) => {
    console.log('Booking submitted:', formData);
    // Integrar com API/backend aqui
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header com Voltar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <h1 className="font-bold text-slate-900 flex-1 truncate text-sm">{service.title}</h1>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 flex gap-2">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Início
          </button>
          <span>/</span>
          <button onClick={() => navigate('/search')} className="hover:text-blue-600">
            Serviços
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate">{service.title}</span>
        </div>

        {/* Galeria */}
        <ServiceGallery images={service.images} />

        {/* Info Básica */}
        <Card className="border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full font-semibold">
                  {service.category}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-3 border-y border-slate-200">
              <span className="text-gray-600 font-semibold">Valor:</span>
              <span className="text-2xl font-bold text-slate-900">
                R$ {service.price.toFixed(2)}
              </span>
            </div>

            {/* Info do Profissional */}
            <div className="flex gap-4 items-start pt-2">
              <img
                src={service.provider.photo}
                alt={service.provider.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-900"
              />
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-lg">{service.provider.name}</p>
                <p className="text-sm text-gray-600">{service.provider.bio}</p>
                {service.provider.verified && (
                  <p className="text-xs text-green-600 font-bold mt-1">✓ Profissional Verificado</p>
                )}
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex gap-3 items-center text-sm">
                <MapPin className="w-4 h-4 text-slate-600" />
                <span className="text-gray-700 font-medium">{service.provider.location}</span>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Phone className="w-4 h-4 text-slate-600" />
                <a href={`tel:${service.provider.phone}`} className="text-blue-600 hover:underline">
                  {service.provider.phone}
                </a>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Mail className="w-4 h-4 text-slate-600" />
                <a href={`mailto:${service.provider.email}`} className="text-blue-600 hover:underline">
                  {service.provider.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Descrição Detalhada */}
        <Card className="border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Sobre o Serviço</h2>
            <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {service.description}
            </p>
          </CardContent>
        </Card>

        {/* Disponibilidade */}
        <Card className="border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Disponibilidade
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(service.availability).map(([day, info]) => (
                <div
                  key={day}
                  className={`p-3 rounded-lg text-sm font-semibold ${
                    info.available
                      ? 'bg-green-50 text-green-900 border border-green-200'
                      : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }`}
                >
                  <p className="capitalize">{day}</p>
                  {info.available && (
                    <p className="text-xs opacity-75">
                      {info.start} - {info.end}
                    </p>
                  )}
                  {!info.available && <p className="text-xs opacity-75">Indisponível</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Avaliações</h2>
            <ReviewsList
              reviews={service.reviews}
              averageRating={service.averageRating}
              totalReviews={service.totalReviews}
            />
          </CardContent>
        </Card>

        {/* Formulário de Agendamento */}
        <Card className="border-slate-200 sticky bottom-20 md:relative md:bottom-auto">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Agende Agora</h2>
            <BookingForm
              serviceName={service.title}
              providerName={service.provider.name}
              onSubmit={handleBooking}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}