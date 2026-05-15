import { useEffect, useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contato - Trancoso Resolve';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Entre em contato com o Trancoso Resolve. Estamos aqui para ajudar com dúvidas, sugestões e feedback sobre nossa plataforma de serviços.';

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = 'Contato - Trancoso Resolve';

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `${window.location.origin}/Contact`;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to a backend function
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">Entre em Contato</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-accent mb-6">Formas de Contato</h2>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:suporte@trancosoresolve.com" className="text-primary hover:underline">
                  suporte@trancosoresolve.com
                </a>
                <p className="text-sm text-muted-foreground mt-1">Resposta em até 24 horas</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Redes Sociais</h3>
                <div className="flex gap-3 flex-wrap">
                  <a href="#" className="text-primary hover:underline text-sm">WhatsApp</a>
                  <a href="#" className="text-primary hover:underline text-sm">Instagram</a>
                  <a href="#" className="text-primary hover:underline text-sm">Facebook</a>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Mensagens respondidas durante o horário comercial</p>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-bold mb-2 text-accent">Localização</h3>
              <p className="text-sm">Trancoso, Bahia, Brasil</p>
              <p className="text-sm text-muted-foreground mt-1">Atendimento de segunda a sexta, 8h às 18h</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-accent mb-6">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Deixe sua mensagem, dúvida ou sugestão..."
                  rows="5"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar Mensagem
              </Button>

              {submitted && (
                <div className="p-3 bg-green-500/20 border border-green-500 text-green-100 rounded">
                  Mensagem enviada! Obrigado por entrar em contato.
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="p-6 bg-accent/10 rounded-lg border border-accent/20">
          <h3 className="text-xl font-bold mb-3">Precisa de Ajuda Rápida?</h3>
          <p className="mb-4">Verifique nossa página de <a href="/Manual" className="text-primary hover:underline">FAQ e Manual</a> para respostas às perguntas mais frequentes.</p>
        </div>
      </div>
    </div>
  );
}