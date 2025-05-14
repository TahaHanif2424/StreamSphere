// src/components/RequireAuth.jsx
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RequireAuth({ children }) {
  const user = useSelector((s) => s.user.user);
  const navigate = useNavigate();
  if (!user) {
    navigate('/auth?mode=login');
  }
  return children;
}
