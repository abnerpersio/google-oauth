import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@/ui/components/button";
import { DoorOpenIcon } from "lucide-react";

export default function Home() {
  const { signOut, profile } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-medium tracking-tight">
        Bem-vindo(a), {profile.firstName} ({profile.email})!
      </h1>

      <p className="text-muted-foreground">
        Você está na área privada do sistema...
      </p>

      <Button
        className="mt-6 gap-1"
        size="sm"
        variant="outline"
        onClick={signOut}
      >
        Sair <DoorOpenIcon className="size-4" />
      </Button>
    </div>
  );
}
