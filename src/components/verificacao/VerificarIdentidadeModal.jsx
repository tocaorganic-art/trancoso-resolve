import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, ShieldCheck, FileImage, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { analisarDocumento } from "@/functions/analisarDocumento";

export default function VerificarIdentidadeModal({ isOpen, onClose, user, onSuccess }) {
  const [step, setStep] = useState("form"); // form | uploading | analyzing | done
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file || !documentType) {
      toast.error("Selecione o tipo de documento e faça o upload da imagem.");
      return;
    }

    try {
      setStep("uploading");

      // 1. Upload do arquivo
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // 2. Criar registro de verificação
      const verificacao = await base44.entities.Verificacao.create({
        user_email: user.email,
        user_name: user.full_name,
        document_url: file_url,
        document_type: documentType,
        status: "Em Análise",
        submission_date: new Date().toISOString(),
      });

      setStep("analyzing");

      // 3. Chamar IA para análise
      await analisarDocumento({
        verificacao_id: verificacao.id,
        document_url: file_url,
        document_type: documentType,
        user_full_name: user.full_name,
      });

      setStep("done");
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao enviar documento.", { description: error.message });
      setStep("form");
    }
  };

  const handleClose = () => {
    setStep("form");
    setDocumentType("");
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            Verificar Identidade
          </DialogTitle>
          <DialogDescription>
            Envie uma foto do seu documento (CNH ou RG) para receber o selo de identidade verificada.
          </DialogDescription>
        </DialogHeader>

        {step === "done" ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-slate-900">Documento enviado!</h3>
              <p className="text-sm text-slate-500 mt-1">
                ✅ Seu documento foi enviado com sucesso. Nossa equipe irá analisar e você receberá uma resposta em breve.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">Fechar</Button>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Tipo de documento */}
            <div className="space-y-1.5">
              <Label>Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType} disabled={step !== "form"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione CNH ou RG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNH">CNH – Carteira de Habilitação</SelectItem>
                  <SelectItem value="RG">RG – Carteira de Identidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload */}
            <div className="space-y-1.5">
              <Label>Foto do Documento</Label>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={preview} alt="Documento" className="w-full h-48 object-contain" />
                  {step === "form" && (
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md hover:bg-black/80 transition"
                    >
                      Trocar
                    </button>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="doc-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <FileImage className="w-10 h-10 text-slate-300 mb-2" />
                  <span className="text-sm font-medium text-slate-500">Clique para selecionar a foto</span>
                  <span className="text-xs text-slate-400 mt-1">JPG, PNG ou PDF (máx. 10MB)</span>
                  <input
                    id="doc-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {/* Dicas */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 font-medium mb-1">Dicas para uma boa foto:</p>
              <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
                <li>Certifique-se de que o documento está completamente visível</li>
                <li>Boa iluminação, sem reflexos ou sombras</li>
                <li>Foco nítido — todas as informações devem ser legíveis</li>
              </ul>
            </div>

            {/* Estado de progresso */}
            {step === "uploading" && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Enviando documento…</p>
                  <p className="text-xs text-blue-600">Por favor, aguarde.</p>
                </div>
              </div>
            )}
            {step === "analyzing" && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Analisando com IA…</p>
                  <p className="text-xs text-purple-600">Verificando autenticidade do documento.</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleClose} disabled={step !== "form"} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={step !== "form" || !file || !documentType}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar Documento
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}