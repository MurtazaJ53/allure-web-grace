
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Routes>
      {isLoading || !isAuthenticated ? (
        <Route path="/" element={<Landing />} />
      ) : (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
