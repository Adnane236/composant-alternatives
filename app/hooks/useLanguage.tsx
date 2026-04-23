'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type Translations = {
  portfolio_tech: string;
  composants: string;
  alternatives: string;
  disponibilite: string;
  importer: string;
  search: string;
  language: string;
  theme: string;
  hero_title: string;
  hero_subtitle: string;
  see_components: string;
  import_charge: string;
  dashboard_title: string;
  dashboard_desc: string;
  status_general_title: string;
  status_general_highlight: string;
  order_in_progress: string;
  tools_to_calibrate: string;
  critical_shortages: string;
  bom_alternatives_title: string;
  bom_highlight: string;
  priority_title: string;
  priority_desc: string;
  components_page_title: string;
  components_page_desc: string;
  alternatives_page_title: string;
  alternatives_page_desc: string;
  availability_page_title: string;
  availability_page_desc: string;
  import_page_title: string;
  import_page_desc: string;
  import_placeholder: string;
  import_button: string;
  search_placeholder: string;
  search_button: string;
  no_results: string;
  search_error: string;
  none_label: string;
  component_not_found: string;
  not_found_message: string;
  back_to_list: string;
  details_title: string;
  features_title: string;
  alternatives_title: string;
  reference_label: string;
  category_label: string;
  status_label: string;
  stock_label: string;
  warehouse_label: string;
  available_label: string;
  unavailable_label: string;
  results_heading: string;
  result_available_title: string;
  result_alternatives_title: string;
  result_unavailable_title: string;
  result_ref: string;
  result_status: string;
  result_stock: string;
  result_supplier: string;
  result_alternatives: string;
  result_location: string;
  result_lead_time: string;
  view_component: string;
};

const translations = {
  fr: {
    portfolio_tech: 'Technology Portfolio',
    composants: 'Composants',
    alternatives: 'Alternatives',
    disponibilite: 'Disponibilité',
    importer: 'Importer',
    search: 'Recherche',
    language: 'Langue',
    theme: 'Thème',
    hero_title: 'Le leader mondial des architectures électriques pour véhicules',
    hero_subtitle:
      'Versigent centralise les besoins du cahier des charges industriel pour gérer les composants disponibles, les alternatives et les ruptures en un seul tableau de bord.',
    see_components: 'Voir les composants',
    import_charge: 'Importer un cahier de charge',
    dashboard_title: 'Tableau de bord industriel',
    dashboard_desc: 'Analyse en temps réel des statuts composants, de la BOM et de la qualité.',
    status_general_title: 'Statut général',
    status_general_highlight: 'Delivery on Time : 92 %',
    order_in_progress: 'Commandes en cours',
    tools_to_calibrate: 'Outils à calibrer',
    critical_shortages: 'Pénuries critiques',
    bom_alternatives_title: 'BOM & alternatives',
    bom_highlight: 'Analyse intelligente des pièces',
    priority_title: 'Composants prioritaires',
    priority_desc: 'Pièces stratégiques, disponibles ou avec alternatives.',
    components_page_title: 'Composants industriels',
    components_page_desc: 'Liste des pièces disponibles, en rupture et leurs alternatives.',
    alternatives_page_title: 'Alternatives & pièces de rechange',
    alternatives_page_desc: 'Identifiez rapidement les solutions de remplacement pour les composants indisponibles.',
    availability_page_title: 'Disponibilité des stocks',
    availability_page_desc: 'Vue consolidée des stocks, délais et disponibilités sur l’ensemble des composants.',
    import_page_title: 'Importer un cahier de charge',
    import_page_desc: 'Collez les références des composants et obtenez immédiatement la disponibilité, les alternatives et les ruptures.',
    import_placeholder: 'Exemple : 123-456, DVT-001, SEAL-1001',
    import_button: 'Importer et rechercher',
    search_placeholder: 'Ex: Connecteur, 123-456, DVT-001',
    search_button: 'Rechercher',
    no_results: 'Aucun composant trouvé pour ces références.',
    search_error: 'Erreur lors de la recherche. Vérifiez la connexion ou les données.',
    none_label: 'Aucune',
    component_not_found: 'Composant introuvable',
    not_found_message: 'La référence recherchée ne figure pas dans la base de données.',
    back_to_list: 'Retour à la liste',
    details_title: 'Détails du composant',
    features_title: 'Caractéristiques',
    alternatives_title: 'Alternatives',
    reference_label: 'Référence',
    category_label: 'Catégorie',
    status_label: 'Statut',
    stock_label: 'Stock',
    warehouse_label: 'Entrepôt',
    available_label: 'Disponible',
    unavailable_label: 'Non disponible',
    results_heading: 'Résultats de la recherche',
    result_available_title: 'Dispo',
    result_alternatives_title: 'Alternatives',
    result_unavailable_title: 'Rupture',
    result_ref: 'Réf.',
    result_status: 'Statut :',
    result_stock: 'Stock :',
    result_supplier: 'Fournisseur :',
    result_alternatives: 'Alternatives :',
    result_location: 'Localisation :',
    result_lead_time: 'Lead time :',
    view_component: 'Voir le composant →',
  },
};

type LanguageContextType = {
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      t: translations.fr,
    }),
    []
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}