import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          throw new Error(errorDescription || 'Authentication failed');
        }
        
        if (!accessToken) {
          // Try to get the session directly
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (data.session) {
            setStatus('success');
            setTimeout(() => {
              navigate('/app/dashboard');
            }, 2000);
            return;
          }
          
          throw new Error('No session found');
        }
        
        // Set the session with the tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        
        if (sessionError) throw sessionError;
        
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">Completing authentication...</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your credentials.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">Authentication successful!</h2>
            <p className="mt-2 text-gray-600">You are now signed in. Redirecting to your dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">Authentication failed</h2>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <div className="mt-6">
              <Button onClick={() => navigate('/login')}>
                Return to login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;