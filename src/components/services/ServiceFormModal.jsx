import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["Limpeza", "Garçom", "Pedreiro", "Jardinagem", "Babá", "Eletricista", "Encanador", "Pintor", "Cozinheiro", "Outro"];
const PRICE_UNITS = ["hora", "dia", "serviço", "projeto"];

export default function ServiceFormModal({ open, onClose, onSubmit, initialData, isSubmitting }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    not_included: "",
    category: "",
    price: "",
    price_unit: "hora",
    duration_estimate: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        not_included: initialData.not_included || "",
        category: initialData.category || "",
        price: initialData.price?.toString() || "",
        price_unit: initialData.price_unit || "hora",
        duration_estimate: initialData.duration_estimate || "",
      });
    } else {
      setForm({ title: "", description: "", not_included: "", category: "", price: "", price_unit: "hora", duration_estimate: "" });
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: parseFloat(form.price) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Título *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Ex: Limpeza Residencial Completa" />
          </div>

          <div>
            <Label>Categoria *</Label>
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))} required>
              <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descreva o que está incluso no serviço..." rows={3} />
          </div>

          <div>
            <Label>O que NÃO está incluso</Label>
            <Textarea value={form.not_included} onChange={e => setForm(f => ({ ...f, not_included: e.target.value }))} placeholder="Ex: Produtos de limpeza, deslocamento..." rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preço (R$) *</Label>
              <Input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="0.00" />
            </div>
            <div>
              <Label>Unidade</Label>
              <Select value={form.price_unit} onValueChange={v => setForm(f => ({ ...f, price_unit: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRICE_UNITS.map(u => <SelectItem key={u} value={u}>por {u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Duração estimada</Label>
            <Input value={form.duration_estimate} onChange={e => setForm(f => ({ ...f, duration_estimate: e.target.value }))} placeholder="Ex: Aprox. 3 horas" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? "Salvar Alterações" : "Criar Serviço"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}