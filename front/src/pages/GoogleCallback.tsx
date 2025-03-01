import { api } from "@/lib/api";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(async () => {
    const code = new URLSearchParams(location.search).get("code");
    const params = {
      code,
      redirectURI: "http://localhost:5173/callbacks/google",
    };

    try {
      await api.post("/auth/google", {}, { params });
    } catch {
      toast.error("Credenciais inválidas");
      navigate("/signin");
    }
  }, [location.search]);

  return (
    <div className="flex items-center gap-2">
      <Loader2Icon className="size-6 animate-spin" />
      <h1 className="text-3xl tracking-tight font-semibold">Carregando...</h1>
    </div>
  );
}
