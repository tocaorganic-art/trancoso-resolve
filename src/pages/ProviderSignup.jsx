import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, idx) => (
      <div key={idx} className="flex-1">
        <div
          className={`h-2 rounded-full transition-all ${
            idx < currentStep ? 'bg-green-500' : idx === currentStep ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        />
        <p className="text-xs text-gray-400 mt-2 font-semibold text-center">
          Etapa {idx + 1}
        </p>
      </div>
    ))}
  </div>
);

// Validação de CPF
const validateCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  return true;
};

// Validação de Email
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Step 1: Informações Pessoais
function PersonalInfoStep({ data, onChange, onValidate }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.fullName?.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!data.email?.trim()) newErrors.email = 'Email é obrigatório';
    else if (!validateEmail(data.email)) newErrors.email = 'Email inválido';
    if (!data.cpf?.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!validateCPF(data.cpf)) newErrors.cpf = 'CPF inválido';
    if (!data.phone?.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!data.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';

    setErrors(newErrors);
    onValidate(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validate();
  }, [data]);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">Informações Pessoais</h2>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Nome Completo <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="João Silva"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
            <AlertCircle className="w-4 h-4" /> {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="seu@email.com"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
            <AlertCircle className="w-4 h-4" /> {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          CPF <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.cpf || ''}
          onChange={(e) => handleChange('cpf', e.target.value.replace(/\D/g, '').slice(0, 11))}
          placeholder="000.000.000-00"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        />
        {errors.cpf && (
          <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
            <AlertCircle className="w-4 h-4" /> {errors.cpf}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Telefone <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(11) 99999-9999"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
            <AlertCircle className="w-4 h-4" /> {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Data de Nascimento <span className="text-red-500">*</span>
        </label>
        <Input
          type="date"
          value={data.birthDate || ''}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        />
        {errors.birthDate && (
          <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
            <AlertCircle className="w-4 h-4" /> {errors.birthDate}
          </p>
        )}
      </div>
    </div>
  );
}

// Step 2: Informações Profissionais
function ProfessionalInfoStep({ data, onChange }) {
  const categories = [
    'Limpeza',
    'Eletricista',
    'Encanador',
    'Jardinagem',
    'Cozinheiro',
    'Pedreiro',
    'Pintor',
    'Babá',
  ];

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const toggleCategory = (cat) => {
    const selected = data.categories || [];
    if (selected.includes(cat)) {
      onChange({ ...data, categories: selected.filter((c) => c !== cat) });
    } else {
      onChange({ ...data, categories: [...selected, cat] });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">Informações Profissionais</h2>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Categorias de Serviço <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`p-3 rounded-lg text-sm font-semibold transition-all text-center ${
                (data.categories || []).includes(cat)
                  ? 'bg-cyan-500 text-white border border-cyan-600'
                  : 'bg-slate-800 text-gray-300 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Bio Profissional
        </label>
        <textarea
          value={data.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Descreva sua experiência e especialidades..."
          maxLength={500}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none text-sm resize-none h-24"
        />
        <p className="text-xs text-gray-400 mt-1">{(data.bio || '').length}/500</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Taxa por Hora (R$)
        </label>
        <Input
          type="number"
          value={data.hourlyRate || ''}
          onChange={(e) => handleChange('hourlyRate', e.target.value)}
          placeholder="50.00"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
        />
      </div>
    </div>
  );
}

// Step 3: Documentos
function DocumentsStep({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">Documentos de Verificação</h2>

      <div className="bg-cyan-500/10 border border-cyan-500 rounded-lg p-4 text-sm text-cyan-100 font-semibold">
        Faça o upload de seus documentos para verificação de identidade
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Identidade (RG ou CNH) <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleChange('identityDoc', e.target.files?.[0])}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
        />
        {data.identityDoc && (
          <p className="text-xs text-green-500 mt-1 flex gap-1 items-center">
            <CheckCircle2 className="w-4 h-4" /> {data.identityDoc.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Comprovante de Endereço <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleChange('addressDoc', e.target.files?.[0])}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
        />
        {data.addressDoc && (
          <p className="text-xs text-green-500 mt-1 flex gap-1 items-center">
            <CheckCircle2 className="w-4 h-4" /> {data.addressDoc.name}
          </p>
        )}
      </div>
    </div>
  );
}

// Step 4: Disponibilidade
function AvailabilityStep({ data, onChange }) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleChange = (day, field, value) => {
    const availability = data.availability || {};
    onChange({
      ...data,
      availability: {
        ...availability,
        [day]: { ...availability[day], [field]: value },
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">Disponibilidade Semanal</h2>

      <div className="space-y-3">
        {days.map((day, idx) => (
          <div key={day} className="border border-slate-700 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-white">{day}</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.availability?.[day]?.available ?? true}
                  onChange={(e) => handleChange(day, 'available', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-300">Disponível</span>
              </label>
            </div>

            {(data.availability?.[day]?.available ?? true) && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={data.availability?.[day]?.start || '08:00'}
                  onChange={(e) => handleChange(day, 'start', e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="time"
                  value={data.availability?.[day]?.end || '18:00'}
                  onChange={(e) => handleChange(day, 'end', e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Página Principal
export default function ProviderSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('providerSignupDraft');
    return saved ? JSON.parse(saved) : {};
  });

  // Salvar rascunho
  useEffect(() => {
    localStorage.setItem('providerSignupDraft', JSON.stringify(formData));
  }, [formData]);

  const handleNext = async () => {
    if (currentStep === 4) {
      setIsLoading(true);
      try {
        // Integrar com API/backend aqui
        console.log('Cadastro enviado:', formData);
        localStorage.removeItem('providerSignupDraft');
        navigate('/provider-signup-success');
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const steps = [
    <PersonalInfoStep
      key="step1"
      data={formData}
      onChange={setFormData}
      onValidate={setIsValid}
    />,
    <ProfessionalInfoStep key="step2" data={formData} onChange={setFormData} />,
    <DocumentsStep key="step3" data={formData} onChange={setFormData} />,
    <AvailabilityStep key="step4" data={formData} onChange={setFormData} />,
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-bold text-white">Cadastro de Prestador</h1>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} totalSteps={4} />

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          {steps[currentStep - 1]}
        </div>

        {/* Botões de Navegação */}
        <div className="flex gap-4">
          <Button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStep === 1 && !isValid}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            loading={isLoading}
          >
            {currentStep === 4 ? 'Finalizar Cadastro' : 'Próximo'}
            {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Mensagem de Rascunho */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Seu progresso é salvo automaticamente
        </p>
      </div>
    </div>
  );
}