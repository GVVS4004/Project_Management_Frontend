import { useState } from 'react';
  import { Link } from 'react-router-dom';
  import { Input, Button, ErrorMessage } from '../components/forms';
  import { useLogin } from '../hooks/useAuth';
  import { validateEmail, validatePassword } from '../utils/validation';

  const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const loginMutation = useLogin();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }

      if (loginMutation.error) {
        loginMutation.reset();
      }
    };

    const validateForm = (): boolean => {
      const newErrors: { [key: string]: string } = {};

      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;

      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      loginMutation.mutate(formData);
    };

    const apiError = loginMutation.error
      ? (loginMutation.error as any).response?.data?.message ||
        'Login failed. Please check your credentials.'
      : '';
    console.log("apiError:", apiError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Login to Task Manager
          </h2>

          {apiError && <ErrorMessage message={apiError} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <Button type="submit" fullWidth loading={loginMutation.isPending}>
              Login
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default Login;