import { AuthProvider } from "@/app/contexts/auth-context";
import { AuthGuard } from "@/app/guards/auth-guard";
import { LaunchScreen } from "@/ui/components/launch-screen";
import { Toaster } from "@/ui/components/Toaster";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryProvider } from "./providers/query";

const GoogleCallback = lazy(() => import("@/ui/pages/google-callback"));
const Home = lazy(() => import("@/ui/pages/home"));
const SignIn = lazy(() => import("@/ui/pages/sign-in"));

export function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <div className="min-h-screen grid place-items-center">
            <Suspense fallback={<LaunchScreen isLoading />}>
              <Routes>
                <Route element={<AuthGuard isPrivate={false} />}>
                  <Route path="/signin" element={<SignIn />} />
                  <Route
                    path="/callbacks/google"
                    element={<GoogleCallback />}
                  />
                </Route>

                <Route element={<AuthGuard isPrivate />}>
                  <Route path="/" element={<Home />} />
                </Route>
              </Routes>
            </Suspense>
          </div>

          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}
