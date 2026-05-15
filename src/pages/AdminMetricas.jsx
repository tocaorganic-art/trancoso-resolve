import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { BarChart2 } from "lucide-react";

export default function AdminMetricas() {
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        base44.auth.redirectToLogin("/admin/metricas");
      } else if (user.role !== "admin") {
        navigate("/");
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <BarChart2 className="w-7 h-7 text-blue-400" />
        <h1 className="text-2xl font-bold text-slate-100">📊 Métricas</h1>
      </div>
      <p className="text-slate-400">Painel de métricas em construção.</p>
    </div>
  );
}