import sql from 'mssql';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Fil = {
  id: number;
  famille: string;
  zone: string;
  num_drwn: string;
  num_fil: string;
  long: number;
  cable: string;
  section_fil: number;
  coml: string;
  type_isol: string;
  union_tors_a: string;
  connect_a: string;
  dpn_connect_a: string;
  acces: string;
  voie_a: string;
  terminal_a: string;
  seal_a: string;
  connect_b: string;
  dpn_connect_b: string;
  voie_b: string;
  terminal_b: string;
  seal_b: string;
  options: string;
};

export type Torsade = {
  id: number;
  famille: string;
  zone: string;
  num_torsade: string;
  lead_code_torsade: string;
  num_fil: string;
  lead_code_fil: string;
  couleur: string;
  section: number;
  bobine: string;
  longueur_torsade: number;
  longueur_initiale: number;
  longueur_finale: number;
  longueur_libre_1: number;
  seal_1: string;
  terminal_1: string;
  longueur_libre_2: number;
  seal_2: string;
  terminal_2: string;
  pas_de_torsade: number;
  ksk_module: string;
  dpn_ksk_module: string;
};

export type Splice = {
  id: number;
  famille: string;
  zone: string;
  splice: string;
  us_location: string;
  groupe: string;
  n_file: string;
  couleur: string;
  section: number;
  type_iso: string;
  long: number;
  cout: number;
  to_item: string;
  to_cavity: string;
  union_torsade: string;
  option: string;
};

export type SpliceFil = {
  id: number;
  famille: string;
  splice: string;
  us: string;
  num_wire: string;
  num_wire_coupe: string;
  color: string;
  size: number;
  type_isol: string;
  cote: string;
  alpha_code: string;
  module: string;
  fna_code: string;
  dpn_isolot: string;
  section_total: number;
  configuration_clip: string;
  heatshrink: string;
};

export type OutilInventaire = {
  id: number;
  type_outil: string;
  n_outil: string;
  alphab: string;
  inventory_no: string;
  localisation: string;
  terminal: string;
  type_corp: string;
  commentaire: string;
};

export type ProductionTracking = {
  id: number;
  feuille: string;
  plant: string;
  oem: string;
  jlr_pn: string;
  cpn: string;
  apn: string;
  famille: string;
  criticity_vor_bo: string;
  received_order_date: string;
  s_lead_time: number;
  needed_in_customer: string;
  plant_delivery_plan: string;
  plant_status: 'On Time' | 'Delay' | string;
  qty: number;
  shipped: number;
  net: number;
  comment: string;
  me_d: string;
  drawing: string;
  prg: string;
  process_of: string;
  raw_material: string;
  wires: string;
  production: string;
  validation: string;
  packaging: string;
  shipment: string;
  is_shipment_plan_ok: string;
};

export type Contact = {
  id: number;
  project: string;
  contact_pcl: string;
  ship_mode: string;
  plant_responsibility: string;
  sold_to: string;
  ship_to: string;
  contact_sales: string;
  destination: string;
  dhl_account: string;
};

export type DashboardStats = {
  total_fils: number;
  total_torsades: number;
  total_splices: number;
  total_outils: number;
  orders_on_time: number;
  orders_delay: number;
  orders_total: number;
  families: string[];
};

// ─── Config ───────────────────────────────────────────────────────────────────

const getConfig = () => {
  const { SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASSWORD, SQL_PORT } = process.env;
  if (!SQL_SERVER || !SQL_DATABASE || !SQL_USER || !SQL_PASSWORD) return null;
  return {
    server: SQL_SERVER,
    database: SQL_DATABASE,
    authentication: { type: 'default' as const, options: { userName: SQL_USER, password: SQL_PASSWORD } },
    options: { encrypt: false, trustServerCertificate: true, port: Number(SQL_PORT || 1433), enableArithAbort: true },
  };
};

async function getPool() {
  const config = getConfig();
  if (!config) return null;
  try {
    return await sql.connect(config);
  } catch {
    return null;
  }
}

// ─── Fils ─────────────────────────────────────────────────────────────────────

export async function getFils(famille?: string): Promise<Fil[]> {
  const pool = await getPool();
  if (!pool) return DEMO_FILS;
  try {
    const q = famille
      ? pool.request().input('f', sql.NVarChar, famille).query(`SELECT * FROM Fils WHERE famille=@f ORDER BY num_fil`)
      : pool.request().query(`SELECT * FROM Fils ORDER BY famille, num_fil`);
    return (await q).recordset;
  } catch { return DEMO_FILS; } finally { pool.close(); }
}

// ─── Torsades ─────────────────────────────────────────────────────────────────

export async function getTorsades(famille?: string): Promise<Torsade[]> {
  const pool = await getPool();
  if (!pool) return DEMO_TORSADES;
  try {
    const q = famille
      ? pool.request().input('f', sql.NVarChar, famille).query(`SELECT * FROM Torsades WHERE famille=@f ORDER BY num_torsade`)
      : pool.request().query(`SELECT * FROM Torsades ORDER BY famille, num_torsade`);
    return (await q).recordset;
  } catch { return DEMO_TORSADES; } finally { pool.close(); }
}

// ─── Splices ──────────────────────────────────────────────────────────────────

export async function getSplices(famille?: string): Promise<Splice[]> {
  const pool = await getPool();
  if (!pool) return DEMO_SPLICES;
  try {
    const q = famille
      ? pool.request().input('f', sql.NVarChar, famille).query(`SELECT * FROM Splices WHERE famille=@f ORDER BY splice`)
      : pool.request().query(`SELECT * FROM Splices ORDER BY famille, splice`);
    return (await q).recordset;
  } catch { return DEMO_SPLICES; } finally { pool.close(); }
}

// ─── Inventaire ───────────────────────────────────────────────────────────────

export async function getInventaire(localisation?: string): Promise<OutilInventaire[]> {
  const pool = await getPool();
  if (!pool) return DEMO_INVENTAIRE;
  try {
    const q = localisation
      ? pool.request().input('l', sql.NVarChar, localisation).query(`SELECT * FROM Inventaire WHERE localisation=@l ORDER BY n_outil`)
      : pool.request().query(`SELECT * FROM Inventaire ORDER BY localisation, n_outil`);
    return (await q).recordset;
  } catch { return DEMO_INVENTAIRE; } finally { pool.close(); }
}

// ─── Production ───────────────────────────────────────────────────────────────

export async function getProductionTracking(feuille?: string): Promise<ProductionTracking[]> {
  const pool = await getPool();
  if (!pool) return DEMO_PRODUCTION;
  try {
    const q = feuille
      ? pool.request().input('f', sql.NVarChar, feuille).query(`SELECT * FROM ProductionTracking WHERE feuille=@f ORDER BY needed_in_customer`)
      : pool.request().query(`SELECT * FROM ProductionTracking ORDER BY feuille, needed_in_customer`);
    return (await q).recordset;
  } catch { return DEMO_PRODUCTION; } finally { pool.close(); }
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export async function getContacts(): Promise<Contact[]> {
  const pool = await getPool();
  if (!pool) return DEMO_CONTACTS;
  try {
    return (await pool.request().query(`SELECT * FROM Contacts ORDER BY project`)).recordset;
  } catch { return DEMO_CONTACTS; } finally { pool.close(); }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const pool = await getPool();
  if (!pool) return DEMO_STATS;
  try {
    const r = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Fils)               AS total_fils,
        (SELECT COUNT(*) FROM Torsades)           AS total_torsades,
        (SELECT COUNT(*) FROM Splices)            AS total_splices,
        (SELECT COUNT(*) FROM Inventaire)         AS total_outils,
        (SELECT COUNT(*) FROM ProductionTracking WHERE plant_status='On Time') AS orders_on_time,
        (SELECT COUNT(*) FROM ProductionTracking WHERE plant_status='Delay')   AS orders_delay,
        (SELECT COUNT(*) FROM ProductionTracking)                               AS orders_total
    `);
    const fam = await pool.request().query(`SELECT DISTINCT famille FROM Fils ORDER BY famille`);
    return {
      ...r.recordset[0],
      families: fam.recordset.map((x: any) => x.famille),
    };
  } catch { return DEMO_STATS; } finally { pool.close(); }
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchAll(query: string): Promise<{ fils: Fil[]; torsades: Torsade[]; splices: Splice[] }> {
  const pool = await getPool();
  const q = `%${query}%`;
  if (!pool) {
    return {
      fils: DEMO_FILS.filter(f => f.num_fil.toLowerCase().includes(query.toLowerCase()) || f.connect_a?.toLowerCase().includes(query.toLowerCase())),
      torsades: DEMO_TORSADES.filter(t => t.num_torsade.toLowerCase().includes(query.toLowerCase()) || t.num_fil.toLowerCase().includes(query.toLowerCase())),
      splices: DEMO_SPLICES.filter(s => s.splice.toLowerCase().includes(query.toLowerCase())),
    };
  }
  try {
    const [fils, torsades, splices] = await Promise.all([
      pool.request().input('q', sql.NVarChar, q).query(`SELECT TOP 50 * FROM Fils WHERE num_fil LIKE @q OR connect_a LIKE @q OR dpn_connect_a LIKE @q ORDER BY num_fil`),
      pool.request().input('q', sql.NVarChar, q).query(`SELECT TOP 50 * FROM Torsades WHERE num_torsade LIKE @q OR num_fil LIKE @q ORDER BY num_torsade`),
      pool.request().input('q', sql.NVarChar, q).query(`SELECT TOP 50 * FROM Splices WHERE splice LIKE @q OR n_file LIKE @q ORDER BY splice`),
    ]);
    return { fils: fils.recordset, torsades: torsades.recordset, splices: splices.recordset };
  } catch { return { fils: [], torsades: [], splices: [] }; } finally { pool.close(); }
}

// ─── Demo data (used when DB is not connected) ────────────────────────────────

const DEMO_FILS: Fil[] = [
  { id:1, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_drwn:'CLN04A', num_fil:'CLN04A', long:400, cable:'M3232201', section_fil:0.35, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'CBPL23', dpn_connect_a:'15324806', acces:'', voie_a:'6', terminal_a:'10793721', seal_a:'', connect_b:'CBPW04B', dpn_connect_b:'', voie_b:'20', terminal_b:'33136808', seal_b:'', options:'BASE' },
  { id:2, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_drwn:'CLN17MB', num_fil:'CLN17MB-R', long:1920, cable:'M3232201', section_fil:0.35, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'C3BB', dpn_connect_a:'33124481+33111549', acces:'', voie_a:'41', terminal_a:'12198039', seal_a:'', connect_b:'SBLN17', dpn_connect_b:'', voie_b:'', terminal_b:'', seal_b:'', options:'SPLICE' },
  { id:3, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_drwn:'CLN17MF', num_fil:'CLN17MF-R', long:270, cable:'M3232201', section_fil:0.35, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'CBPL23', dpn_connect_a:'15324806', acces:'', voie_a:'5', terminal_a:'10793721', seal_a:'', connect_b:'SBLN17', dpn_connect_b:'', voie_b:'', terminal_b:'', seal_b:'', options:'BASE' },
  { id:4, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_drwn:'CLN44G', num_fil:'CLN44G', long:2840, cable:'M3232201', section_fil:0.35, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'C3BB', dpn_connect_a:'33124481+33111549', acces:'', voie_a:'12', terminal_a:'12198039', seal_a:'', connect_b:'CBLN46', dpn_connect_b:'', voie_b:'1', terminal_b:'13545445', seal_b:'', options:'JCBAS' },
  { id:5, famille:'PASSENGER DOOR LHD', zone:'630-ZB', num_drwn:'CLN04A', num_fil:'CLN04A-L', long:400, cable:'M3232201', section_fil:0.35, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'CBPL23', dpn_connect_a:'15324806', acces:'', voie_a:'6', terminal_a:'10793721', seal_a:'', connect_b:'CBPW04B', dpn_connect_b:'', voie_b:'20', terminal_b:'33136808', seal_b:'', options:'BASE' },
  { id:6, famille:'PASSENGER DOOR LHD', zone:'630-ZB', num_drwn:'CLN17MB', num_fil:'CLN17MB-L', long:1920, cable:'M3232201', section_fil:0.35, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'C3BB', dpn_connect_a:'33124481+33111549', acces:'', voie_a:'41', terminal_a:'12198039', seal_a:'', connect_b:'SBLN17', dpn_connect_b:'', voie_b:'', terminal_b:'', seal_b:'', options:'SPLICE' },
  { id:7, famille:'PASSENGER DOOR LHD', zone:'630-ZB', num_drwn:'CPL07B', num_fil:'CPL07B-L', long:280, cable:'M3232401', section_fil:0.75, coml:'BK', type_isol:'FLRY-B', union_tors_a:'', connect_a:'CBPW04A', dpn_connect_a:'33153092', acces:'', voie_a:'5', terminal_a:'15530386', seal_a:'', connect_b:'SBPL07', dpn_connect_b:'', voie_b:'', terminal_b:'', seal_b:'', options:'SPLICE' },
];

const DEMO_TORSADES: Torsade[] = [
  { id:1, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_torsade:'T2_CRB01A', lead_code_torsade:'', num_fil:'CRB01A-R', lead_code_fil:'', couleur:'BK', section:0.35, bobine:'M3232201', longueur_torsade:940, longueur_initiale:1035, longueur_finale:1020, longueur_libre_1:40, seal_1:'', terminal_1:'15448359', longueur_libre_2:40, seal_2:'', terminal_2:'33136808', pas_de_torsade:25, ksk_module:'PK72-14H100-ABA', dpn_ksk_module:'35543915' },
  { id:2, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_torsade:'T2_CRB01A', lead_code_torsade:'', num_fil:'CRB02A-R', lead_code_fil:'', couleur:'BK', section:0.35, bobine:'M3232201', longueur_torsade:940, longueur_initiale:1035, longueur_finale:1020, longueur_libre_1:40, seal_1:'', terminal_1:'15448359', longueur_libre_2:40, seal_2:'', terminal_2:'33136808', pas_de_torsade:25, ksk_module:'PK72-14H100-ABA', dpn_ksk_module:'35543915' },
  { id:3, famille:'PASSENGER DOOR RHD', zone:'630-YB', num_torsade:'T2_VDB33K', lead_code_torsade:'', num_fil:'VDB33K-R', lead_code_fil:'', couleur:'BK', section:0.13, bobine:'M6158001', longueur_torsade:1775, longueur_initiale:1915, longueur_finale:1855, longueur_libre_1:40, seal_1:'', terminal_1:'10780330', longueur_libre_2:40, seal_2:'', terminal_2:'33136809', pas_de_torsade:15, ksk_module:'PK72-14H100-ABA', dpn_ksk_module:'35543915' },
  { id:4, famille:'PASSENGER DOOR LHD', zone:'630-ZB', num_torsade:'T2_CRB01A', lead_code_torsade:'', num_fil:'CRB01A-L', lead_code_fil:'', couleur:'BK', section:0.35, bobine:'M3232201', longueur_torsade:950, longueur_initiale:1045, longueur_finale:1030, longueur_libre_1:40, seal_1:'', terminal_1:'15448359', longueur_libre_2:40, seal_2:'', terminal_2:'33136808', pas_de_torsade:25, ksk_module:'PK72-14H100-BBB', dpn_ksk_module:'35612589' },
  { id:5, famille:'PASSENGER DOOR LHD', zone:'630-ZB', num_torsade:'T2_VDB33K', lead_code_torsade:'', num_fil:'VDB33K-L', lead_code_fil:'', couleur:'BK', section:0.13, bobine:'M6158001', longueur_torsade:1775, longueur_initiale:1915, longueur_finale:1855, longueur_libre_1:40, seal_1:'', terminal_1:'10780330', longueur_libre_2:40, seal_2:'', terminal_2:'33136809', pas_de_torsade:15, ksk_module:'PK72-14H100-BBB', dpn_ksk_module:'35612589' },
  { id:6, famille:'PASSENGER DOOR LHD', zone:'630-ZB', num_torsade:'T2_VPK02B', lead_code_torsade:'', num_fil:'VPK02A-L', lead_code_fil:'', couleur:'BK', section:0.35, bobine:'M3232201', longueur_torsade:1085, longueur_initiale:1180, longueur_finale:1165, longueur_libre_1:40, seal_1:'', terminal_1:'12198039', longueur_libre_2:40, seal_2:'', terminal_2:'15405760', pas_de_torsade:25, ksk_module:'PK72-14H100-BBB', dpn_ksk_module:'35612589' },
];

const DEMO_SPLICES: Splice[] = [
  { id:1, famille:'PASSENGER DOOR RHD', zone:'', splice:'5BD136A/Y', us_location:'', groupe:'', n_file:'VDB33K-R,VDB34K-R', couleur:'BK', section:0.35, type_iso:'FLRY-B', long:0, cout:0, to_item:'CBPW19', to_cavity:'', union_torsade:'', option:'JCBAS' },
  { id:2, famille:'PASSENGER DOOR RHD', zone:'', splice:'5BLN17/Y', us_location:'', groupe:'', n_file:'CLN17MA-R', couleur:'BK', section:0.35, type_iso:'FLRY-B', long:0, cout:0, to_item:'SBLN17', to_cavity:'', union_torsade:'', option:'BASE' },
  { id:3, famille:'PASSENGER DOOR RHD', zone:'', splice:'5BPL07/Y', us_location:'', groupe:'', n_file:'CPL07CA-R', couleur:'BK', section:0.75, type_iso:'FLRY-B', long:0, cout:0, to_item:'SBPL07', to_cavity:'', union_torsade:'', option:'CBSAE' },
  { id:4, famille:'PASSENGER DOOR LHD', zone:'', splice:'5BD140/Z', us_location:'', groupe:'', n_file:'GD140AC-L,GD140AL-L', couleur:'BK', section:0.35, type_iso:'FLRY-B', long:0, cout:0, to_item:'CSLN42', to_cavity:'', union_torsade:'', option:'JCBAS' },
  { id:5, famille:'PASSENGER DOOR LHD', zone:'', splice:'5BPL07/Z', us_location:'', groupe:'', n_file:'CPL07CA-L,CPL07SA-L', couleur:'BK', section:0.75, type_iso:'FLRY-B', long:0, cout:0, to_item:'CSPL23', to_cavity:'', union_torsade:'', option:'CBSAE' },
  { id:6, famille:'PASSENGER DOOR LHD', zone:'', splice:'5BLN17/Z', us_location:'', groupe:'', n_file:'CLN17MG-L', couleur:'BK', section:0.35, type_iso:'FLRY-B', long:0, cout:0, to_item:'CBLN4B', to_cavity:'', union_torsade:'', option:'JCBAS' },
];

const DEMO_INVENTAIRE: OutilInventaire[] = [
  { id:1, type_outil:'G', n_outil:'1177', alphab:'A', inventory_no:'G1177A', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:2, type_outil:'G', n_outil:'9488', alphab:'B', inventory_no:'G9488B', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:3, type_outil:'G', n_outil:'9288', alphab:'A', inventory_no:'G9288A', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:4, type_outil:'P', n_outil:'9058', alphab:'A', inventory_no:'P9058A', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:5, type_outil:'P', n_outil:'433', alphab:'D', inventory_no:'P433D', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:6, type_outil:'G', n_outil:'934', alphab:'D', inventory_no:'G934D', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:7, type_outil:'G', n_outil:'9212', alphab:'C', inventory_no:'G9212C', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:8, type_outil:'G', n_outil:'730', alphab:'B-LP', inventory_no:'G730B-LP', localisation:'Rack01-A', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:9, type_outil:'G', n_outil:'9449', alphab:'A', inventory_no:'G9449A', localisation:'Rack01-B', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:10, type_outil:'G', n_outil:'8111', alphab:'A', inventory_no:'G8111A', localisation:'Rack01-B', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:11, type_outil:'P', n_outil:'9011', alphab:'A', inventory_no:'P9011A', localisation:'Rack01-B', terminal:'', type_corp:'', commentaire:'Salle Process' },
  { id:12, type_outil:'G', n_outil:'9164', alphab:'C-LP', inventory_no:'G9164C-LP', localisation:'Rack01-B', terminal:'', type_corp:'', commentaire:'Salle Process' },
];

const DEMO_PRODUCTION: ProductionTracking[] = [
  { id:1, feuille:'MFA', plant:'M6', oem:'MFA', jlr_pn:'A1185409313', cpn:'35190808', apn:'645', famille:'', criticity_vor_bo:'', received_order_date:'2025-12-04', s_lead_time:50, needed_in_customer:'2026-01-23', plant_delivery_plan:'2026-01-13', plant_status:'Delay', qty:5, shipped:0, net:-5, comment:'', me_d:'OK', drawing:'OK', prg:'', process_of:'', raw_material:'', wires:'', production:'', validation:'', packaging:'', shipment:'', is_shipment_plan_ok:'OK' },
  { id:2, feuille:'MFA', plant:'M6', oem:'MFA', jlr_pn:'A1185409513', cpn:'35130831', apn:'655', famille:'', criticity_vor_bo:'', received_order_date:'2025-12-09', s_lead_time:50, needed_in_customer:'2026-01-18', plant_delivery_plan:'2026-01-16', plant_status:'Delay', qty:80, shipped:0, net:-80, comment:'', me_d:'OK', drawing:'OK', prg:'', process_of:'', raw_material:'', wires:'', production:'', validation:'', packaging:'', shipment:'', is_shipment_plan_ok:'OK' },
  { id:3, feuille:'MFA', plant:'M6', oem:'MFA', jlr_pn:'A2435406710', cpn:'35531258', apn:'696B', famille:'', criticity_vor_bo:'', received_order_date:'2026-02-09', s_lead_time:52, needed_in_customer:'2026-04-02', plant_delivery_plan:'2026-03-23', plant_status:'On Time', qty:300, shipped:0, net:-300, comment:'New', me_d:'OK', drawing:'', prg:'', process_of:'', raw_material:'', wires:'', production:'', validation:'', packaging:'', shipment:'', is_shipment_plan_ok:'OK' },
  { id:4, feuille:'JLRKSK', plant:'M8', oem:'JLR KSK', jlr_pn:'K8D214J010AA', cpn:'', apn:'', famille:'MEGA L551', criticity_vor_bo:'', received_order_date:'2025-12-09', s_lead_time:38, needed_in_customer:'2026-01-18', plant_delivery_plan:'2026-01-06', plant_status:'Delay', qty:1, shipped:0, net:-1, comment:'Need Vass Number or HARPY', me_d:'', drawing:'', prg:'', process_of:'', raw_material:'', wires:'', production:'', validation:'', packaging:'', shipment:'', is_shipment_plan_ok:'NOK' },
  { id:5, feuille:'JLRBX540', plant:'M6 Serie', oem:'X540', jlr_pn:'02J9C34047', cpn:'N8D214N178AA', apn:'35516335', famille:'COOLING BOX FAN MHEV', criticity_vor_bo:'', received_order_date:'2026-01-29', s_lead_time:63, needed_in_customer:'2026-04-02', plant_delivery_plan:'2026-03-23', plant_status:'On Time', qty:61, shipped:0, net:-61, comment:'New', me_d:'', drawing:'', prg:'', process_of:'', raw_material:'', wires:'', production:'', validation:'', packaging:'', shipment:'', is_shipment_plan_ok:'OK' },
  { id:6, feuille:'JLRBL55X', plant:'M6 Serie', oem:'L551', jlr_pn:'LR162459', cpn:'N8D214N178AA', apn:'35516335', famille:'COOLING BOX FAN MHEV', criticity_vor_bo:'', received_order_date:'2025-03-07', s_lead_time:63, needed_in_customer:'2025-04-29', plant_delivery_plan:'2025-04-29', plant_status:'Delay', qty:268, shipped:268, net:0, comment:'Shipped 11/04/2025 – BL 78096674', me_d:'OK', drawing:'OK', prg:'OK', process_of:'OK', raw_material:'OK', wires:'OK', production:'OK', validation:'OK', packaging:'OK', shipment:'OK', is_shipment_plan_ok:'OK' },
];

const DEMO_CONTACTS: Contact[] = [
  { id:1, project:'RSA', contact_pcl:'Uryga, Agnieszka', ship_mode:'DHL', plant_responsibility:'M1', sold_to:'115484', ship_to:'765077', contact_sales:'by tools', destination:'France', dhl_account:'' },
  { id:2, project:'PSA', contact_pcl:'Miekina, Klaudia', ship_mode:'DHL', plant_responsibility:'M1', sold_to:'115484', ship_to:'764961', contact_sales:'by tools', destination:'France', dhl_account:'' },
  { id:3, project:'FIAT', contact_pcl:'Rys, Tobiasz', ship_mode:'Truck', plant_responsibility:'M1', sold_to:'103904', ship_to:'754571', contact_sales:'by tools', destination:'Italy', dhl_account:'' },
  { id:4, project:'JLR KSK', contact_pcl:'Szymanski, Mateusz', ship_mode:'DHL', plant_responsibility:'customer DHL account', sold_to:'102345', ship_to:'722898', contact_sales:'by tools', destination:'coventry', dhl_account:'968583197' },
  { id:5, project:'JLR Doors / Serv Kits', contact_pcl:'Szymanski, Mateusz', ship_mode:'Truck', plant_responsibility:'M1', sold_to:'102345', ship_to:'722898', contact_sales:'by tools', destination:'coventry', dhl_account:'' },
  { id:6, project:'X540', contact_pcl:'Szymanski, Mateusz', ship_mode:'Truck', plant_responsibility:'M1', sold_to:'102345', ship_to:'722898', contact_sales:'by tools', destination:'coventry', dhl_account:'' },
];

const DEMO_STATS: DashboardStats = {
  total_fils: 248,
  total_torsades: 42,
  total_splices: 86,
  total_outils: 1487,
  orders_on_time: 18,
  orders_delay: 7,
  orders_total: 25,
  families: ['PASSENGER DOOR LHD', 'PASSENGER DOOR RHD'],
};
