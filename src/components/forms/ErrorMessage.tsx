import React from 'react';

  interface ErrorMessageProps {
    message?: string;
    className?: string;
  }

  const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
    if (!message) return null;

    return (
      <div
        className={`
          bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative
          ${className}
        `}
        role="alert"
      >
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0
  101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      </div>
    );
  };

  export default ErrorMessage;
