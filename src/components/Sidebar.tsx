// ✅ Sidebar.tsx mis à jour avec Audit SEO + Analyse concurrente
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, FileText, Bot, Truck,
  Sparkles, Globe, Zap, Import, Search
} from 'lucide-react';

const sections = [
  {
    title: "Tableau de bord",
    links: [
      { path: "/app/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { path: "/app/import-products", label: "Import produits", icon: <Import size={18} /> },
    ]
  },
  {
    title: "Outils IA",
    links: [
      { path: "/blog-ai", label: "Blog IA", icon: <Bot size={18} /> },
      { path: "/seo-ai", label: "SEO IA", icon: <Sparkles size={18} /> },
      { path: "/app/seo-audit", label: "Audit SEO", icon: <Sparkles size={18} /> },
      { path: "/app/seo-competitor", label: "Analyse concurrente", icon: <Search size={18} /> },
    ]
  },
  {
    title: "Utilitaires",
    links: [
      { path: "/tracking", label: "Suivi de livraison", icon: <Truck size={18} /> },
      { path: "/generate-invoice", label: "Factures PDF", icon: <FileText size={18} /> },
    ]
  },
  {
    title: "Business",
    links: [
      { path: "/marketplace-b2b", label: "Marketplace B2B", icon: <Globe size={18} /> },
      { path: "/automations", label: "Automations CRM", icon: <Zap size={18} /> },
    ]
  }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-muted z-40">
        <h1 className="font-bold text-lg">Shopopti+</h1>
        <button onClick={() => setOpen(true)}><Menu size={22} /></button>
      </div>

      {/* Drawer menu */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpen(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Navigation</h2>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            {sections.map((section, i) => (
              <div key={i} className="mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">{section.title}</h3>
                <div className="flex flex-col gap-1">
                  {section.links.map(link => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/50 ${isActive ? 'bg-muted font-semibold' : ''}`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {link.icon} {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 hidden md:block bg-muted p-4 border-r min-h-screen">
        {sections.map((section, i) => (
          <div key={i} className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{section.title}</h3>
            <div className="flex flex-col gap-1">
              {section.links.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 ${isActive ? 'bg-primary/20 font-semibold' : ''}`
                  }
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}
