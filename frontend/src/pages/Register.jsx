import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, User, Mail, Lock, Phone, Building, BadgeCheck } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Worker',
    factoryName: '',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'Worker', label: 'Industrial Worker' },
    { value: 'Factory Admin', label: 'Factory Administrator' },
    { value: 'Government Officer', label: 'Government Safety Officer' },
    { value: 'Super Admin', label: 'Super Administrator' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showSuccess('Registration successful! Welcome to the platform.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Create User Account</h2>
          <p className="text-xs text-blue-100 mt-0.5 font-medium">Join the Worker Safety & Compensation Network</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="john@factory.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
              />
            </div>

            <Select
              label="User Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Factory Name"
                name="factoryName"
                placeholder="Apex Steel Industries"
                value={formData.factoryName}
                onChange={handleChange}
                icon={Building}
              />

              <Input
                label="Employee ID"
                name="employeeId"
                placeholder="EMP-1024"
                value={formData.employeeId}
                onChange={handleChange}
                icon={BadgeCheck}
              />
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-4" size="lg">
              Complete Account Registration
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an active account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
