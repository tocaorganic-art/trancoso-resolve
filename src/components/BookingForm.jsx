import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BookingForm({ serviceName, providerName, onSubmit }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: '',
    fullName: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.time) newErrors.time = 'Horário é obrigatório';
    if (!formData.fullName.trim()) newErrors.fullName = 'Nome é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';

    if (formData.description.length > 500) newErrors.description = 'Máximo 500 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit?.(formData);
      setIsSubmitted(true);
      setFormData({
        date: '',
        time: '',
        description: '',
        fullName: '',
        phone: '',
        email: '',
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Erro ao enviar solicitação. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <div>
          <p className="font-bold text-white text-lg">Solicitação Enviada!</p>
          <p className="text-gray-300 text-sm mt-1">
            O profissional entrará em contato em breve pelo telefone ou email fornecido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resumo do Serviço */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-gray-400 font-semibold">Serviço</p>
        <p className="font-bold text-white text-lg">{serviceName}</p>
        <p className="text-gray-300 text-sm mt-1">com {providerName}</p>
      </div>

      {/* Data */}
      <div>
        <label htmlFor="date" className="block text-sm font-bold text-white mb-2">
          Data Desejada <span className="text-red-500">*</span>
        </label>
        <Input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
          disabled={isLoading}
        />
        {errors.date && (
          <div className="flex gap-2 items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.date}
          </div>
        )}
      </div>

      {/* Horário */}
      <div>
        <label htmlFor="time" className="block text-sm font-bold text-white mb-2">
          Horário <span className="text-red-500">*</span>
        </label>
        <Input
          id="time"
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
          disabled={isLoading}
        />
        {errors.time && (
          <div className="flex gap-2 items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.time}
          </div>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="description" className="block text-sm font-bold text-white mb-2">
          Descrição do Problema
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva brevemente o que você precisa..."
          maxLength={500}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none text-sm resize-none h-24"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">
          {formData.description.length}/500 caracteres
        </p>
      </div>

      {/* Nome */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-bold text-white mb-2">
          Seu Nome <span className="text-red-500">*</span>
        </label>
        <Input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="João Silva"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
          disabled={isLoading}
        />
        {errors.fullName && (
          <div className="flex gap-2 items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.fullName}
          </div>
        )}
      </div>

      {/* Telefone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-white mb-2">
          Telefone <span className="text-red-500">*</span>
        </label>
        <Input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
          disabled={isLoading}
        />
        {errors.phone && (
          <div className="flex gap-2 items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </div>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500"
          disabled={isLoading}
        />
        {errors.email && (
          <div className="flex gap-2 items-center mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </div>
        )}
      </div>

      {errors.submit && (
        <div className="flex gap-2 items-center p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errors.submit}
        </div>
      )}

      {/* Botão Submit */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Solicitar Agora'}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Ao enviar, você concorda com os termos de serviço
      </p>
    </form>
  );
}