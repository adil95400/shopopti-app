import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  const footerLinks = {
    product: [
      { label: 'Fonctionnalités', href: '/features' },
      { label: 'Tarifs', href: '/pricing' },
      { label: 'Intégrations', href: '/integrations' },
      { label: 'API', href: '/api' },
      { label: 'Marketplace', href: '/marketplace-b2b' }
    ],
    company: [
      { label: 'À propos', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/careers' },
      { label: 'Presse', href: '/press' },
      { label: 'Partenaires', href: '/partners' }
    ],
    resources: [
      { label: 'Documentation', href: '/documentation' },
      { label: 'Centre d\'aide', href: '/help-center' },
      { label: 'Guides', href: '/guides' },
      { label: 'Tutoriels', href: '/tutorials' },
      { label: 'Webinaires', href: '/webinars' }
    ],
    legal: [
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Conditions', href: '/terms' },
      { label: 'Sécurité', href: '/security' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'RGPD', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo variant="white" />
            <p className="mt-4 text-gray-400 max-w-md">
              Plateforme e-commerce tout-en-un propulsée par l'IA pour aider les entreprises à se développer à l'échelle mondiale.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:contact@shopopti.com" className="text-gray-400 hover:text-white">
                  contact@shopopti.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a href="tel:+33123456789" className="text-gray-400 hover:text-white">
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <span className="text-gray-400">
                  123 Rue du Commerce<br />
                  75001 Paris, France
                </span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-medium mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Shopopti+. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
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