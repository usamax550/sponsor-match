import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useEffect } from "react";

const useRedirectAuth = (isLoggedIn=false) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoggedIn) {
      navigate('/', { replace: true });
    }
    else if (isAuthenticated && isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated]);
};

export default useRedirectAuth;
