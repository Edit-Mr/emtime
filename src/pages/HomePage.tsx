import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const HomePage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      login(response);
      navigate('/dashboard');
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  });

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-500 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex flex-col items-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              emtime
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl text-gray-600 font-semibold">
              Analyze Your Daily Life
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 text-center max-w-md text-lg">
              Connect your Google Calendar to gain insights into how you spend your time.
              Track your work, study, and life activities with beautiful visualizations
              and goal tracking.
            </p>

            {/* Sign In Button */}
            <button
              onClick={() => googleLogin()}
              className="mt-6 flex items-center space-x-3 bg-white border-2 border-gray-300 hover:border-primary-500 hover:shadow-lg text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Privacy Note */}
            <p className="mt-6 text-sm text-gray-500">
              We only read your calendar data. Your information stays private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
