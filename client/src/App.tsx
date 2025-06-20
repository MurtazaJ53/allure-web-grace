
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Router() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner 
          size="xl" 
          variant="progress" 
          message="Loading TaskFlow..."
        />
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Landing />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
