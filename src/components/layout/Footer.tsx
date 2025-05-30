import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  const footerLinks = {
    product: [
      { label: t('footer.product.features'), href: '/features' },
      { label: t('footer.product.pricing'), href: '/pricing' },
      { label: t('footer.product.integrations'), href: '/integrations' },
      { label: t('footer.product.api'), href: '/api' }
    ],
    company: [
      { label: t('footer.company.about'), href: '/about' },
      { label: t('footer.company.blog'), href: '/blog' },
      { label: t('footer.company.careers'), href: '/careers' },
      { label: t('footer.company.press'), href: '/press' }
    ],
    resources: [
      { label: t('footer.resources.documentation'), href: '/documentation' },
      { label: t('footer.resources.helpCenter'), href: '/help-center' },
      { label: t('footer.resources.guides'), href: '/guides' },
      { label: t('footer.resources.partners'), href: '/partners' }
    ],
    legal: [
      { label: t('footer.legal.privacy'), href: '/privacy' },
      { label: t('footer.legal.terms'), href: '/terms' },
      { label: t('footer.legal.security'), href: '/security' },
      { label: t('footer.legal.cookies'), href: '/cookies' }
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
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-gray-600 max-w-md">
              {t('footer.description')}
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={category}>
              <h3 className="text-gray-900 font-medium mb-4 capitalize">
                {t(`footer.${category}.title`)}
              </h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Shopopti+. {t('footer.copyright')}
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link to="/privacy" className="text-gray-600 hover:text-primary text-sm">
                {t('footer.legal.privacy')}
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary text-sm">
                {t('footer.legal.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;