import { useState } from 'react';
  import { Link } from 'react-router-dom';
  import { Input, Button, ErrorMessage } from '../components/forms';
  import { useRegister } from '../hooks/useAuth';
  import { validateEmail, validatePassword, validateUsername } from '../utils/validation';

  const Register = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const registerMutation = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }

      if (registerMutation.error) {
        registerMutation.reset();
      }
    };

    const validateForm = (): boolean => {
      const newErrors: { [key: string]: string } = {};

      const usernameError = validateUsername(formData.username);
      if (usernameError) newErrors.username = usernameError;

      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;

      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const { confirmPassword, ...registerData } = formData;
      registerMutation.mutate(registerData);
    };

    const apiError = registerMutation.error
      ? (registerMutation.error as any).response?.data?.message ||
        'Registration failed. Please try again.'
      : '';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Create an Account
          </h2>

          {apiError && <ErrorMessage message={apiError} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Choose a username"
              required
            />

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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />

            <Button type="submit" fullWidth loading={registerMutation.isPending}>
              Register
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default Register;