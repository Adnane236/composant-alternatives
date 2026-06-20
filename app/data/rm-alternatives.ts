export type RMAlternativeMaterial = {
  id: string;
  codePiece: string;
  designationFrancaise: string;
  designationEnglish: string;
  fournisseurPrincipal: string;
  coutUnitaire: number;
  delaiLivraison: string;
  stockDisponible: number;
  materiaux: string[];
  proprietes: string[];
  alternatives: string[];
  notes: string;
};

export const rmAlternativeMaterials: RMAlternativeMaterial[] = [
  {
    id: 'RM001',
    codePiece: 'ALT-M-001',
    designationFrancaise: 'Connecteur RM alternatif - Cuivre',
    designationEnglish: 'Alternative RM Connector - Copper',
    fournisseurPrincipal: 'ProPart France',
    coutUnitaire: 12.50,
    delaiLivraison: '5 jours',
    stockDisponible: 450,
    materiaux: ['Cuivre 99%', 'Laiton nickelé', 'Résine époxy'],
    proprietes: ['Conductivité élevée', 'Résistant à la corrosion', 'Plage temp: -40°C à +120°C'],
    alternatives: ['ALT-M-002', 'ALT-M-003'],
    notes: 'Certifié RoHS, compatible avec normes JLR',
  },
  {
    id: 'RM002',
    codePiece: 'ALT-M-002',
    designationFrancaise: 'Connecteur RM alternatif - Aluminium',
    designationEnglish: 'Alternative RM Connector - Aluminium',
    fournisseurPrincipal: 'AluSupply Int.',
    coutUnitaire: 8.75,
    delaiLivraison: '7 jours',
    stockDisponible: 320,
    materiaux: ['Aluminium 6061-T6', 'Anodisé noir', 'Joint viton'],
    proprietes: ['Léger 35% moins lourd', 'Bonne conductivité', 'Excellent rapport prix/performance'],
    alternatives: ['ALT-M-001', 'ALT-M-004'],
    notes: 'Poids réduit, idéal pour applications légères',
  },
  {
    id: 'RM003',
    codePiece: 'ALT-M-003',
    designationFrancaise: 'Boîtier de sertissage - Acier inoxydable',
    designationEnglish: 'Crimping Housing - Stainless Steel',
    fournisseurPrincipal: 'SteelTech Europe',
    coutUnitaire: 15.30,
    delaiLivraison: '4 jours',
    stockDisponible: 580,
    materiaux: ['Acier inox 316L', 'Traitement passivation', 'Revêtement téflon'],
    proprietes: ['Haute résistance à la corrosion', 'Soudable', 'Non-magnétique'],
    alternatives: ['ALT-M-002', 'ALT-M-005'],
    notes: 'Utilisation en environnement marin ou corrosif recommandée',
  },
  {
    id: 'RM004',
    codePiece: 'ALT-M-004',
    designationFrancaise: 'Joint d\'étanchéité composite',
    designationEnglish: 'Composite Sealing Gasket',
    fournisseurPrincipal: 'SealTech Premium',
    coutUnitaire: 2.85,
    delaiLivraison: '3 jours',
    stockDisponible: 2400,
    materiaux: ['EPDM 70 Shore', 'Fibres de verre aramide', 'Charge minérale'],
    proprietes: ['Compression set <20%', 'Imperméable gaz', 'UV résistant'],
    alternatives: ['ALT-M-006'],
    notes: 'Approuvé pour appareillage électrique haute tension',
  },
  {
    id: 'RM005',
    codePiece: 'ALT-M-005',
    designationFrancaise: 'Ressort de contact - Acier phosphoré',
    designationEnglish: 'Contact Spring - Phosphor Bronze',
    fournisseurPrincipal: 'SpringForce Ltd',
    coutUnitaire: 0.95,
    delaiLivraison: '6 jours',
    stockDisponible: 15000,
    materiaux: ['Phosphor Bronze C5191', 'Traitement thermique', 'Passivation'],
    proprietes: ['Force de contact: 150-200g', 'Cycle de vie: 100 000 cycles', 'Excellent ressort'],
    alternatives: ['ALT-M-007'],
    notes: 'Excellente mémoire d\'élasticité, recommandé pour haute fréquence',
  },
];
