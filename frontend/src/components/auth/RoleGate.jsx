// frontend/src/components/auth/RoleGate.jsx
import { useSelector } from 'react-redux';
import { selectUserRoles } from '../../store/authSlice';

export const RoleGate = ({ children, roles, requireAll = false }) => {
  const userRoles = useSelector(selectUserRoles);
  
  const hasRequired = Array.isArray(roles)
    ? requireAll
      ? roles.every(role => userRoles.includes(role))
      : roles.some(role => userRoles.includes(role))
    : userRoles.includes(roles);

  return hasRequired ? children : null;
};
export default RoleGate;