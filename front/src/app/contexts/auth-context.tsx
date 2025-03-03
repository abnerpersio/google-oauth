import { httpClient } from "@/app/services/http";
import { LaunchScreen } from "@/ui/components/launch-screen";
import QueryString from "qs";
import { createContext, useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Env } from "../config/env";
import { storageKeys } from "../constants/storage-keys.ts";
import { useUserProfile } from "../hooks/use-user-profile";
import type { UserProfile } from "../services/user-service";

const redirectURI = "http://localhost:5173/callbacks/google";

type AuthContextValue = {
  signedIn: boolean;
  profile: UserProfile;
  signInWithGoogle(): void;
  handleGoogleCallback(code: string | null): Promise<void>;
  signOut(): void;
};

type GoogleAuth = {
  accessToken: string;
};

export const AuthContext = createContext({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [hasAccessToken, setHasAccessToken] = useState(
    () => !!localStorage.getItem(storageKeys.accessToken)
  );

  const {
    data: profile,
    isFetching,
    remove: removeUserDetails,
  } = useUserProfile({
    enabled: hasAccessToken,
  });

  const signInWithGoogle = useCallback(() => {
    const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = QueryString.stringify({
      client_id: Env.googleClientId,
      redirect_uri: redirectURI,
      response_type: "code",
      scope: "email profile",
    });

    window.location.href = `${baseURL}?${options}`;
  }, []);

  const handleGoogleCallback = useCallback(
    async (code: string | null) => {
      if (!code) {
        navigate("/signin");
        return;
      }

      try {
        const params = { code, redirectURI };

        const { accessToken } = (
          await httpClient.post<GoogleAuth>("/auth/google", {}, { params })
        )?.data;

        localStorage.setItem(storageKeys.accessToken, accessToken);
        setHasAccessToken(true);
      } catch {
        toast.error("Credenciais inválidas");
        navigate("/signin");
      }
    },
    [navigate]
  );

  const signOut = useCallback(() => {
    localStorage.clear();
    setHasAccessToken(false);
    removeUserDetails();
  }, [removeUserDetails]);

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem(storageKeys.accessToken);

      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return config;
    });

    return () => {
      httpClient.interceptors.request.eject(interceptorId);
    };
  }, []);

  const value: AuthContextValue = {
    signedIn: !!profile,
    profile: profile!,
    signInWithGoogle,
    handleGoogleCallback,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      <LaunchScreen isLoading={isFetching} />

      {!isFetching && children}
    </AuthContext.Provider>
  );
}
