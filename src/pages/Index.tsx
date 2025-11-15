import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to paid-ads as the default service
  return <Navigate to="/paid-ads" replace />;
};

export default Index;