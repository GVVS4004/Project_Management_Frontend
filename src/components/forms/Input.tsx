interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input : React.FC<InputProps> = ({ label, error, helperText, className='', id, ...props }) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="w-full">
            <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
            id={inputId}
            className={`
                w-full px-3 py-2 border rounded
                focus:outline-none focus:ring-2
                transition-colors
                ${
                    error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }
                ${className}
            `}
            {...props}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600" role="alert">
                {error}
            </p>
        )}
        {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
    </div>
);
};

export default Input;