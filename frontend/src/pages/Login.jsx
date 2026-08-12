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
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">


      {/* LEFT BRANDING SECTION */}

      <div className="hidden lg:flex relative bg-slate-900 text-white p-12 flex-col justify-between overflow-hidden">


        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>


        <div>


          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-400/30 flex items-center justify-center mb-8">

            <Shield className="w-8 h-8 text-orange-500"/>

          </div>


          <h1 className="text-4xl font-bold leading-tight">
            Industrial Worker Safety
          </h1>


          <p className="mt-5 text-slate-300 text-lg leading-relaxed">
            Protecting workers.
            Managing safety.
            Simplifying compensation.
          </p>


        </div>



        <div className="space-y-4">


          <div className="flex items-center gap-3 text-sm text-slate-300">

            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Accident Reporting System

          </div>


          <div className="flex items-center gap-3 text-sm text-slate-300">

            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Worker Compensation Management

          </div>


          <div className="flex items-center gap-3 text-sm text-slate-300">

            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Industrial Safety Monitoring

          </div>


        </div>


      </div>




      {/* RIGHT LOGIN SECTION */}


      <div className="bg-white p-8 sm:p-12">


        {/* Mobile Header */}

        <div className="lg:hidden text-center mb-8">


          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">

            <Shield className="w-7 h-7 text-orange-500"/>

          </div>


          <h1 className="text-2xl font-bold text-slate-900">
            Industrial Worker Safety
          </h1>


        </div>




        {/* Desktop Header */}

        <div className="mb-8">


          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h2>


          <p className="text-slate-500 mt-2">
            Sign in to your organization account
          </p>


        </div>





        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-5">


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
            className="w-full mt-3 h-12 text-base"
            size="lg"
          >

            Sign In to System

          </Button>



        </form>





        {/* QUICK LOGIN */}


        <div className="mt-10 pt-8 border-t border-slate-200">


          <p className="text-sm font-semibold text-slate-600 text-center mb-4">

            Quick Role Demo Access

          </p>



          <div className="grid grid-cols-2 gap-3">


            {[
              ['Worker','worker@industrial.com'],
              ['Factory Admin','admin@factory.com'],
              ['Gov Officer','officer@gov.in'],
              ['Super Admin','superadmin@system.com']
            ].map(([role,email]) => (

              <button

                key={role}

                type="button"

                onClick={() => handleQuickFill(email)}

                className="
                group
                p-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                hover:bg-orange-50
                hover:border-orange-300
                transition-all
                flex
                items-center
                gap-3
                text-left
                "

              >

                <div className="
                w-8
                h-8
                rounded-lg
                bg-orange-100
                flex
                items-center
                justify-center
                ">

                  <UserCheck className="w-4 h-4 text-orange-600"/>

                </div>


                <span className="text-sm font-medium text-slate-700 group-hover:text-orange-700">

                  {role}

                </span>


              </button>


            ))}


          </div>


        </div>





        <div className="mt-8 text-center text-sm text-slate-500">


          Don't have a registered account?{' '}


          <Link

            to="/register"

            className="font-semibold text-orange-600 hover:text-orange-700"

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