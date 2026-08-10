import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail, UserCheck } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, token } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {

    if (token) {
      navigate('/dashboard');
    }

    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get('expired') === 'true') {
      showWarning('Your session has expired. Please sign in again.');
    }

  }, [token, navigate, location]);


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }


    setLoading(true);

    try {

      const user = await login(email, password);

      showSuccess(`Welcome back, ${user.name}! (${user.role})`);

      navigate('/dashboard');

    } catch (err) {

      showError(err.message || 'Login failed. Please verify credentials.');

    } finally {

      setLoading(false);

    }

  };


  const handleQuickFill = (roleEmail) => {

    setEmail(roleEmail);
    setPassword('password123');

  };


  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">


      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">


        {/* Header */}

        <div className="bg-slate-900 text-white p-8 text-center">


          <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">

            <Shield className="w-7 h-7 text-orange-500" />

          </div>


          <h1 className="text-2xl font-bold">
            Industrial Worker Safety
          </h1>


          <p className="text-sm text-slate-300 mt-1">
            Sign in to your organization account
          </p>


        </div>



        {/* Form */}

        <div className="p-8">


          <form onSubmit={handleSubmit} className="space-y-4">


            <Input

              label="Email Address"

              type="email"

              placeholder="user@factory.com"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

              icon={Mail}

              required

            />



            <Input

              label="Password"

              type="password"

              placeholder="••••••••"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

              icon={Lock}

              required

            />



            <Button

              type="submit"

              variant="primary"

              loading={loading}

              className="w-full mt-2"

              size="lg"

            >

              Sign In to System

            </Button>


          </form>




          {/* Quick Preset Roles */}

          <div className="mt-8 pt-6 border-t border-slate-100">


            <p className="text-xs font-semibold text-slate-500 text-center mb-3">

              Quick Role Demo Preset Login:

            </p>



            <div className="grid grid-cols-2 gap-2 text-xs">


              <button

                type="button"

                onClick={() => handleQuickFill('worker@industrial.com')}

                className="p-2 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 rounded-lg text-slate-700 font-medium text-left transition-colors flex items-center gap-1.5"

              >

                <UserCheck className="w-3.5 h-3.5 text-orange-500" />

                Worker

              </button>




              <button

                type="button"

                onClick={() => handleQuickFill('admin@factory.com')}

                className="p-2 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 rounded-lg text-slate-700 font-medium text-left transition-colors flex items-center gap-1.5"

              >

                <UserCheck className="w-3.5 h-3.5 text-orange-500" />

                Factory Admin

              </button>





              <button

                type="button"

                onClick={() => handleQuickFill('officer@gov.in')}

                className="p-2 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 rounded-lg text-slate-700 font-medium text-left transition-colors flex items-center gap-1.5"

              >

                <UserCheck className="w-3.5 h-3.5 text-orange-500" />

                Gov Officer

              </button>





              <button

                type="button"

                onClick={() => handleQuickFill('superadmin@system.com')}

                className="p-2 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 rounded-lg text-slate-700 font-medium text-left transition-colors flex items-center gap-1.5"

              >

                <UserCheck className="w-3.5 h-3.5 text-orange-500" />

                Super Admin

              </button>


            </div>


          </div>




          <div className="mt-6 text-center text-xs text-slate-500">


            Don't have a registered account?{' '}


            <Link

              to="/register"

              className="font-semibold text-orange-600 hover:underline"

            >

              Register Profile

            </Link>


          </div>



        </div>


      </div>


    </div>

  );

};


export default Login;