// src/components/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RequireAuth({ children }) {
  const user = useSelector((s) => s.user.user);
  const loc  = useLocation();
  if (!user) {
    return <Navigate to="/auth?mode=login" state={{ from: loc }} replace />;
  }
  return children;
}
