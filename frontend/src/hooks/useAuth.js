

// frontend/src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectCurrentUser,
  selectUserPermissions,
  selectUserRoles,
  logout
} from '../../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const permissions = useSelector(selectUserPermissions);
  const roles = useSelector(selectUserRoles);

  const hasPermission = (permission) => permissions.includes(permission);
  const hasRole = (role) => roles.includes(role);
  const hasAnyRole = (roleList) => roleList.some(role => roles.includes(role));
  const hasAllRoles = (roleList) => roleList.every(role => roles.includes(role));

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    logout: logoutUser
  };
};