
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">404</h1>
        <p className="text-xl text-gray-600 mb-4">Page not found</p>
        <a href="/" className="text-blue-600 hover:text-blue-800 underline">
          Return to Converter
        </a>
      </div>
    </div>
  );
};

export default NotFound;
