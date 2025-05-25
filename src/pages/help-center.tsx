// src/pages/help-center.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Mail, BookOpen } from 'lucide-react';

const HelpCenterPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('Retour au tableau de bord')}
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <HelpCircle className="w-6 h-6" /> {t("Centre d'aide Shopopti+")}
      </h1>

      <p className="text-muted-foreground">
        {t('Trouvez rapidement les réponses à vos questions ou contactez notre équipe de support.')} 📘
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link to="/faq">
          <div className="border border-border rounded-xl p-6 bg-muted/30 hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{t('Consulter la FAQ')}</h2>
            </div>
            <p className="text-muted-foreground">{t('Questions fréquentes sur Shopify, abonnements, TikTok, et plus.')}</p>
          </div>
        </Link>

        <Link to="/support">
          <div className="border border-border rounded-xl p-6 bg-muted/30 hover:bg-muted/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{t('Contacter le support')}</h2>
            </div>
            <p className="text-muted-foreground">{t('Formulaire de contact, horaires de chat et email de support.')}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HelpCenterPage;
