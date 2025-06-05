import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { 
  X, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2,
  Facebook,
  Apple,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../ui/button';

interface LoginFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, isModal = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Connexion réussie');
      
      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/app/dashboard');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error(`Erreur de connexion avec ${provider}:`, error);
      toast.error(`Échec de la connexion avec ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
      {isModal && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
      
      {!isModal && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">
            Pas encore de compte ? <Link to="/register" className="text-primary hover:text-primary-600 font-medium">Créer un compte</Link>
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          {isModal ? "Pas encore de compte ?" : ""}
        </p>
        <Link to="/register" className="text-primary hover:text-primary-600 font-medium text-sm">
          {isModal ? "S'inscrire" : ""}
        </Link>
        
        <div className="flex items-center ml-auto">
          <span className="text-sm text-gray-600 mr-2">Langue:</span>
          <button className="flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="English" className="h-5 w-8" />
            <svg className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => handleSocialLogin('google')}
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
        </button>
        <button
          onClick={() => handleSocialLogin('facebook')}
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50"
        >
          <Facebook className="h-6 w-6 text-blue-600" />
        </button>
        <button
          onClick={() => handleSocialLogin('apple')}
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50"
        >
          <Apple className="h-6 w-6 text-gray-800" />
        </button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">Ou par email</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-600">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-md"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;