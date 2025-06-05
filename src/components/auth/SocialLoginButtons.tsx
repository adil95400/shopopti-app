import React from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SocialLoginButtonsProps {
  onLoginStart?: () => void;
  onLoginComplete?: () => void;
  onLoginError?: (error: Error) => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onLoginStart,
  onLoginComplete,
  onLoginError
}) => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple' | 'whatsapp') => {
    try {
      if (onLoginStart) onLoginStart();
      setLoading(provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/#/auth/callback`
        }
      });
      
      if (error) throw error;
      
      if (onLoginComplete) onLoginComplete();
    } catch (error: any) {
      console.error(`Error logging in with ${provider}:`, error);
      toast.error(`Failed to login with ${provider}`);
      if (onLoginError) onLoginError(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {/* WhatsApp */}
      <button
        onClick={() => handleSocialLogin('whatsapp')}
        disabled={loading !== null}
        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors relative"
      >
        {loading === 'whatsapp' ? (
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        ) : (
          <div className="bg-green-500 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg\" width="24\" height="24\" viewBox="0 0 24 24\" fill="white">
              <path d="M17.6 6.2c-1.5-1.5-3.4-2.3-5.5-2.3-4.3 0-7.8 3.5-7.8 7.8 0 1.4 0.4 2.7 1 3.9l-1.1 4 4.1-1.1c1.1 0.6 2.4 0.9 3.7 0.9 4.3 0 7.8-3.5 7.8-7.8 0-2.1-0.8-4-2.3-5.5zm-5.5 11.9c-1.2 0-2.3-0.3-3.3-0.9l-0.2-0.1-2.4 0.6 0.6-2.3-0.1-0.2c-0.6-1-1-2.2-1-3.4 0-3.6 2.9-6.5 6.5-6.5 1.7 0 3.3 0.7 4.6 1.9 1.2 1.2 1.9 2.8 1.9 4.6 0 3.6-2.9 6.5-6.5 6.5zm3.5-4.8c-0.2-0.1-1.2-0.6-1.4-0.7-0.2-0.1-0.3-0.1-0.4 0.1-0.1 0.2-0.5 0.7-0.6 0.8-0.1 0.1-0.2 0.1-0.4 0-0.2-0.1-0.8-0.3-1.6-0.9-0.6-0.5-1-1.1-1.1-1.3-0.1-0.2 0-0.3 0.1-0.4 0.1-0.1 0.2-0.2 0.3-0.3 0.1-0.1 0.1-0.2 0.2-0.3 0.1-0.1 0-0.2 0-0.3-0.1-0.1-0.4-1-0.6-1.4-0.2-0.4-0.3-0.3-0.4-0.3h-0.3c-0.1 0-0.3 0-0.5 0.2-0.2 0.2-0.7 0.7-0.7 1.6s0.7 1.9 0.8 2c0.1 0.1 1.4 2.1 3.3 2.9 0.5 0.2 0.8 0.3 1.1 0.4 0.5 0.1 0.9 0.1 1.2 0.1 0.4-0.1 1.2-0.5 1.3-0.9 0.2-0.5 0.2-0.9 0.1-1-0.1-0.1-0.2-0.1-0.4-0.2z"/>
            </svg>
          </div>
        )}
      </button>
      
      {/* Facebook */}
      <button
        onClick={() => handleSocialLogin('facebook')}
        disabled={loading !== null}
        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors relative"
      >
        {loading === 'facebook' ? (
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg\" width="24\" height="24\" viewBox="0 0 24 24\" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )}
      </button>
      
      {/* Google */}
      <button
        onClick={() => handleSocialLogin('google')}
        disabled={loading !== null}
        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors relative"
      >
        {loading === 'google' ? (
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg\" width="24\" height="24\" viewBox="0 0 24 24">
            <path fill="#EA4335\" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
            <path fill="#34A853\" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
            <path fill="#4A90E2\" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
            <path fill="#FBBC05\" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
          </svg>
        )}
      </button>
      
      {/* Apple */}
      <button
        onClick={() => handleSocialLogin('apple')}
        disabled={loading !== null}
        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors relative"
      >
        {loading === 'apple' ? (
          <Loader2 className="h-6 w-6 animate-spin text-black" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg\" width="24\" height="24\" viewBox="0 0 24 24\" fill="black">
            <path d="M16.462 16.965c-.516.887-1.07 1.723-1.659 2.513-.789 1.058-1.435 1.793-1.932 2.206-.773.777-1.6 1.175-2.485 1.195-.636 0-1.405-.187-2.3-.562-.898-.375-1.723-.562-2.474-.562-.79 0-1.638.187-2.544.562-.908.375-1.639.57-2.196.586-.85.036-1.698-.37-2.544-1.217-.538-.446-1.212-1.21-2.02-2.294-.865-1.17-1.577-2.524-2.137-4.068-.6-1.66-.9-3.267-.9-4.818 0-1.775.376-3.3 1.13-4.576.59-1.02 1.374-1.824 2.355-2.413.98-.59 2.04-.893 3.18-.913.624 0 1.442.192 2.458.57 1.014.38 1.667.572 1.957.572.214 0 .94-.225 2.174-.67 1.168-.414 2.154-.587 2.96-.517 2.186.18 3.826 1.057 4.916 2.634-1.955 1.22-2.92 2.927-2.895 5.12.023 1.708.62 3.131 1.788 4.262.532.52 1.125.924 1.784 1.214-.143.418-.295.82-.456 1.207zM12.14.076c0 1.335-.382 2.582-1.145 3.736-.92 1.372-2.035 2.165-3.307 2.038-.015-.128-.024-.262-.024-.404 0-1.29.433-2.67 1.2-3.8.384-.57.872-1.043 1.465-1.418.592-.37 1.15-.575 1.673-.612.015.14.028.28.04.42z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default SocialLoginButtons;