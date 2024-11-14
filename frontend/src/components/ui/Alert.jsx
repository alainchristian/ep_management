// frontend/src/components/ui/Alert.jsx
const Alert = ({ children, variant = 'default' }) => {
    const variants = {
      default: 'bg-blue-50 text-blue-700 border-blue-200',
      destructive: 'bg-red-50 text-red-700 border-red-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      success: 'bg-green-50 text-green-700 border-green-200',
    };
  
    const className = `${variants[variant]} border rounded-md p-4`;
  
    return (
      <div className={className} role="alert">
        {children}
      </div>
    );
  };
  
  export default Alert;