import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@/ui/components/button";
import { GoogleIcon } from "@/ui/components/google-icon";

export default function SignIn() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button className="gap-1" onClick={signInWithGoogle}>
      <GoogleIcon />
      Entrar com o Google
    </Button>
  );
}
