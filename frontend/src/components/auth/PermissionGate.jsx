// frontend/src/components/auth/PermissionGate.jsx
import { useSelector } from 'react-redux';
import { selectUserPermissions } from '../../store/authSlice';

const PermissionGate = ({ children, permissions }) => {
  const userPermissions = useSelector(selectUserPermissions);
  
  const hasRequired = Array.isArray(permissions)
    ? permissions.every(permission => userPermissions.includes(permission))
    : userPermissions.includes(permissions);

  return hasRequired ? children : null;
};

export default PermissionGate;
