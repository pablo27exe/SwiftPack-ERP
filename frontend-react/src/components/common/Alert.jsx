const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  };

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  if (!message) return null;

  return (
    <div className={`${styles[type]} border-l-4 p-4 rounded mb-4 flex justify-between items-center`}>
      <div className="flex items-center">
        <span className="font-bold mr-2">{icons[type]}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;