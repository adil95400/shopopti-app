import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { label: 'Fonctionnalités', href: '/features' },
      { label: 'Tarification', href: '/pricing' },
      { label: 'Intégrations', href: '/integrations' },
      { label: 'API', href: '/api' }
    ],
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/careers' },
      { label: 'Contact', href: '/contact' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Centre d\'aide', href: '/help' },
      { label: 'Guides', href: '/guides' },
      { label: 'Partenaires', href: '/partners' }
    ],
    legal: [
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Conditions', href: '/terms' },
      { label: 'Sécurité', href: '/security' },
      { label: 'Cookies', href: '/cookies' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-secondary-500 border-t border-accent-200/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-accent-200 max-w-md">
              Shopopti+ est la plateforme leader de dropshipping alimentée par l'IA, 
              aidant les entrepreneurs à développer leur activité e-commerce.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-accent-200 hover:text-primary-400 transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={category}>
              <h3 className="text-white font-medium mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-accent-200 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-accent-200/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-accent-200 text-sm">
              © {new Date().getFullYear()} Shopopti+. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link to="/privacy" className="text-accent-200 hover:text-primary-400 text-sm">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-accent-200 hover:text-primary-400 text-sm">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;