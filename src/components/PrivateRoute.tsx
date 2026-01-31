import { Navigate } from "react-router-dom";
import { userService } from "../services/auth.service";
import { useAuthVerification } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = userService.getUser();

  const {
    data: isAuthenticated,
    isLoading,
    error,
  } = useAuthVerification({
    enabled: !!user,
  });
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Verifying authentication...</div>
      </div>
    );
  }

  // If verification failed, redirect to login
  if (error || !isAuthenticated) {
    userService.removeUser(); // Clean up localStorage
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
