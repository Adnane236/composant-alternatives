export type ComponentItem = {
  id: string;
  name: string;
  reference: string;
  category: string;
  status: 'Disponible' | 'Rupture' | 'En attente';
  stock: number;
  alternatives: string[];
  description: string;
  features: string[];
  location: string;
  supplier: string;
  leadTime: string;
};

export const components: ComponentItem[] = [
  {
    id: '123-456',
    name: 'Connecteur principal',
    reference: 'CPT-1200',
    category: 'Connectique',
    status: 'Disponible',
    stock: 116,
    alternatives: ['ALT-A', 'ALT-B'],
    description: 'Connecteur industriel haute résistance pour boîtiers étanches.',
    features: ['IP67', '3 pôles', 'Acier inoxydable'],
    location: 'Entrepôt A1',
    supplier: 'ProPart Industrie',
    leadTime: '3 jours',
  },
  {
    id: 'DVT-001',
    name: 'Terminal secondaire',
    reference: 'TRM-240',
    category: 'Terminal',
    status: 'En attente',
    stock: 0,
    alternatives: ['TRM-241'],
    description: 'Terminal à sertir pour câble 2,5 mm² avec revêtement anti-corrosion.',
    features: ['Sertissage fiable', 'Montage rapide'],
    location: 'Stock central',
    supplier: 'ElectroFast',
    leadTime: '7 jours',
  },
  {
    id: 'SEAL-1001',
    name: 'Kit de joint étanche',
    reference: 'JNT-501',
    category: 'Étanchéité',
    status: 'Disponible',
    stock: 48,
    alternatives: ['SEAL-2002'],
    description: 'Kit de joints pour connecteurs industriels conformes IP67.',
    features: ['Résistant aux solvants', 'Diamètre 2.0–2.8 mm'],
    location: 'Entrepôt B3',
    supplier: 'SealTech',
    leadTime: '2 jours',
  },
  {
    id: 'DIE-4567',
    name: 'Matrice de sertissage',
    reference: 'DIE-4567',
    category: 'Outils',
    status: 'Rupture',
    stock: 0,
    alternatives: ['DIE-4580'],
    description: 'Matrice pour presses de sertissage avec durée de vie prolongée.',
    features: ['18 500 cycles restants', 'Compatible PSI-120'],
    location: 'Maintenance',
    supplier: 'ToolMasters',
    leadTime: '12 jours',
  },
];
