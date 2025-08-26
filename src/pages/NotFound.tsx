import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation={false} />
      
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
          <a href="/" className="text-primary hover:text-secondary underline font-medium">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
