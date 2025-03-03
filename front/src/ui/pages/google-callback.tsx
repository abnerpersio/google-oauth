import { useAuth } from "@/app/hooks/use-auth";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GoogleCallback() {
  const location = useLocation();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    handleGoogleCallback(code);
  }, [location.search, handleGoogleCallback]);

  return (
    <div className="flex items-center gap-2">
      <Loader2Icon className="size-6 animate-spin" />
      <h1 className="text-3xl tracking-tight font-semibold">Carregando...</h1>
    </div>
  );
}
