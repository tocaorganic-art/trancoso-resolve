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
  const [uploadMode, setUploadMode] = useState("inteiro"); // inteiro | frente_verso
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileFrente, setFileFrente] = useState(null);
  const [previewFrente, setPreviewFrente] = useState(null);
  const [fileVerso, setFileVerso] = useState(null);
  const [previewVerso, setPreviewVerso] = useState(null);
  const [userType] = useState(user?.tipo_pessoa || 'pf');
  const [hasPhysicalLocation] = useState(user?.tem_ponto_fisico_em_trancoso || false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleFrenteChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileFrente(f);
    setPreviewFrente(URL.createObjectURL(f));
  };

  const handleVersoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileVerso(f);
    setPreviewVerso(URL.createObjectURL(f));
  };

  const isFormValid = () => {
    if (!documentType) return false;
    if (uploadMode === "inteiro") return !!file;
    return !!fileFrente && !!fileVerso;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Selecione o tipo de documento e faça o upload das imagens.");
      return;
    }

    try {
      setStep("uploading");

      let document_url;
      let document_url_verso = null;

      if (uploadMode === "inteiro") {
        const result = await base44.integrations.Core.UploadFile({ file });
        document_url = result.file_url;
      } else {
        const [resFrente, resVerso] = await Promise.all([
          base44.integrations.Core.UploadFile({ file: fileFrente }),
          base44.integrations.Core.UploadFile({ file: fileVerso }),
        ]);
        document_url = resFrente.file_url;
        document_url_verso = resVerso.file_url;
      }

      // 2. Criar registro de verificação
      const verificacao = await base44.entities.Verificacao.create({
        user_email: user.email,
        user_name: user.full_name,
        document_url,
        ...(document_url_verso && { document_url_verso }),
        document_type: documentType,
        upload_mode: uploadMode,
        status: "Em Análise",
        submission_date: new Date().toISOString(),
      });

      setStep("analyzing");

      // 3. Chamar IA para análise
      await analisarDocumento({
        verificacao_id: verificacao.id,
        document_url,
        ...(document_url_verso && { document_url_verso }),
        document_type: documentType,
        user_full_name: user.full_name,
      });

      setStep("done");
      onSuccess?.();
    } catch (error) {
      const msg = error.message?.includes('unsupported image') 
        ? 'Formato de imagem não suportado. Use JPG ou PNG.'
        : error.message;
      toast.error("Erro ao enviar documento.", { description: msg });
      setStep("form");
    }
  };

  const handleClose = () => {
    setStep("form");
    setDocumentType("");
    setUploadMode("inteiro");
    setFile(null);
    setPreview(null);
    setFileFrente(null);
    setPreviewFrente(null);
    setFileVerso(null);
    setPreviewVerso(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-blue-500" />
             {(userType === 'mei' || userType === 'pj') && hasPhysicalLocation ? 'Verificar Identidade da Empresa' : 'Verificar Identidade'}
           </DialogTitle>
           <DialogDescription>
             {(userType === 'mei' || userType === 'pj') && hasPhysicalLocation
               ? 'Envie uma foto do seu CNPJ ou documento MEI para receber o selo de empresa verificada.'
               : 'Envie uma foto do seu documento (CNH ou RG) para receber o selo de identidade verificada.'}
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
                  <SelectValue placeholder={
                    (userType === 'mei' || userType === 'pj') && hasPhysicalLocation
                      ? 'Selecione CNPJ ou MEI'
                      : 'Selecione CNH ou RG'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {(userType === 'mei' || userType === 'pj') && hasPhysicalLocation ? (
                    <>
                      <SelectItem value="CNPJ">CNPJ – Registro da Empresa</SelectItem>
                      <SelectItem value="MEI">MEI – Certificado de Registro</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="CNH">CNH – Carteira de Habilitação</SelectItem>
                      <SelectItem value="RG">RG – Carteira de Identidade</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Modo de upload */}
            <div className="space-y-1.5">
              <Label>Forma de envio</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode("inteiro")}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    uploadMode === "inteiro"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  📄 Documento inteiro
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("frente_verso")}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    uploadMode === "frente_verso"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  🪪 Frente e verso
                </button>
              </div>
            </div>

            {/* Upload */}
            {uploadMode === "inteiro" ? (
              <div className="space-y-1.5">
                <Label>Foto do Documento</Label>
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={preview} alt="Documento" className="w-full h-48 object-contain" />
                    {step === "form" && (
                      <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                        className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md hover:bg-black/80 transition">
                        Trocar
                      </button>
                    )}
                  </div>
                ) : (
                  <label htmlFor="doc-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <FileImage className="w-10 h-10 text-slate-300 mb-2" />
                    <span className="text-sm font-medium text-slate-500">Clique para selecionar a foto</span>
                    <span className="text-xs text-slate-400 mt-1">JPG, PNG ou PDF (máx. 10MB)</span>
                    <input id="doc-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Frente */}
                <div className="space-y-1.5">
                  <Label>Frente do Documento</Label>
                  {previewFrente ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={previewFrente} alt="Frente" className="w-full h-36 object-contain" />
                      {step === "form" && (
                        <button type="button" onClick={() => { setFileFrente(null); setPreviewFrente(null); }}
                          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md hover:bg-black/80 transition">
                          Trocar
                        </button>
                      )}
                    </div>
                  ) : (
                    <label htmlFor="doc-frente"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <FileImage className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-sm font-medium text-slate-500">Frente</span>
                      <input id="doc-frente" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFrenteChange} />
                    </label>
                  )}
                </div>
                {/* Verso */}
                <div className="space-y-1.5">
                  <Label>Verso do Documento</Label>
                  {previewVerso ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={previewVerso} alt="Verso" className="w-full h-36 object-contain" />
                      {step === "form" && (
                        <button type="button" onClick={() => { setFileVerso(null); setPreviewVerso(null); }}
                          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md hover:bg-black/80 transition">
                          Trocar
                        </button>
                      )}
                    </div>
                  ) : (
                    <label htmlFor="doc-verso"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <FileImage className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-sm font-medium text-slate-500">Verso</span>
                      <input id="doc-verso" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleVersoChange} />
                    </label>
                  )}
                </div>
              </div>
            )}

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
                disabled={step !== "form" || !isFormValid()}
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