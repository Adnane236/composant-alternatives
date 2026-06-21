-- ============================================================================
-- PostgreSQL schema — Versigent After-Sales (wiring-harness management, JLR L550)
--
-- Run against an empty Postgres database (Neon / Supabase / self-hosted):
--   psql "$DATABASE_URL" -f sql/schema.sql
--
-- Table names are PascalCase to match the application's TABLE_COLUMNS contract,
-- so they MUST stay double-quoted in SQL. Columns are lowercase snake_case.
-- This schema mirrors lib/db.ts TABLE_COLUMNS exactly (the authoritative list).
-- ============================================================================

DROP TABLE IF EXISTS "Fils"                 CASCADE;
DROP TABLE IF EXISTS "Torsades"             CASCADE;
DROP TABLE IF EXISTS "Splices"              CASCADE;
DROP TABLE IF EXISTS "SpliceFils"           CASCADE;
DROP TABLE IF EXISTS "Inventaire"           CASCADE;
DROP TABLE IF EXISTS "ProductionTracking"   CASCADE;
DROP TABLE IF EXISTS "Contacts"             CASCADE;
DROP TABLE IF EXISTS "Recap"                CASCADE;
DROP TABLE IF EXISTS "RMAlternativeMateriel" CASCADE;

-- ─── Fils (simple wires) ────────────────────────────────────────────────────
CREATE TABLE "Fils" (
  id            SERIAL PRIMARY KEY,
  famille       VARCHAR(50)  NOT NULL,
  zone          VARCHAR(20),
  num_drwn      VARCHAR(50),
  num_fil       VARCHAR(100) NOT NULL,
  long          INTEGER,
  cable         VARCHAR(50),
  section_fil   NUMERIC(5,2),
  coml          VARCHAR(20),
  type_isol     VARCHAR(50),
  union_tors_a  VARCHAR(100),
  connect_a     VARCHAR(100),
  dpn_connect_a VARCHAR(200),
  acces         VARCHAR(50),
  voie_a        VARCHAR(10),
  terminal_a    VARCHAR(100),
  seal_a        VARCHAR(100),
  connect_b     VARCHAR(100),
  dpn_connect_b VARCHAR(200),
  voie_b        VARCHAR(10),
  terminal_b    VARCHAR(100),
  seal_b        VARCHAR(100),
  options       VARCHAR(200),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── Torsades (twisted pairs) ───────────────────────────────────────────────
CREATE TABLE "Torsades" (
  id                SERIAL PRIMARY KEY,
  famille           VARCHAR(50) NOT NULL,
  zone              VARCHAR(20),
  num_torsade       VARCHAR(100) NOT NULL,
  lead_code_torsade VARCHAR(100),
  num_fil           VARCHAR(100) NOT NULL,
  lead_code_fil     VARCHAR(100),
  couleur           VARCHAR(50),
  section           NUMERIC(5,2),
  bobine            VARCHAR(50),
  longueur_torsade  INTEGER,
  longueur_initiale INTEGER,
  longueur_finale   INTEGER,
  longueur_libre_1  INTEGER,
  seal_1            VARCHAR(100),
  terminal_1        VARCHAR(100),
  longueur_libre_2  INTEGER,
  seal_2            VARCHAR(100),
  terminal_2        VARCHAR(100),
  pas_de_torsade    INTEGER,
  ksk_module        VARCHAR(100),
  dpn_ksk_module    VARCHAR(100),
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ─── Splices ────────────────────────────────────────────────────────────────
CREATE TABLE "Splices" (
  id            SERIAL PRIMARY KEY,
  famille       VARCHAR(50) NOT NULL,
  zone          VARCHAR(20),
  splice        VARCHAR(100) NOT NULL,
  us_location   VARCHAR(100),
  groupe        VARCHAR(50),
  n_file        VARCHAR(100),
  couleur       VARCHAR(50),
  section       NUMERIC(5,2),
  type_iso      VARCHAR(50),
  long          INTEGER,
  cout          NUMERIC(10,2),
  to_item       VARCHAR(100),
  to_cavity     VARCHAR(50),
  union_torsade VARCHAR(100),
  option        VARCHAR(200),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── SpliceFils (wires attached to a splice — UCAB sheet) ───────────────────
CREATE TABLE "SpliceFils" (
  id                 SERIAL PRIMARY KEY,
  famille            VARCHAR(50) NOT NULL,
  splice             VARCHAR(100) NOT NULL,
  us                 VARCHAR(100),
  num_wire           VARCHAR(100),
  num_wire_coupe     VARCHAR(100),
  color              VARCHAR(50),
  size               NUMERIC(5,2),
  type_isol          VARCHAR(50),
  cote               VARCHAR(10),
  alpha_code         VARCHAR(20),
  module             VARCHAR(100),
  fna_code           VARCHAR(100),
  dpn_isolot         VARCHAR(100),
  section_total      NUMERIC(5,2),
  configuration_clip VARCHAR(100),
  heatshrink         VARCHAR(100),
  created_at         TIMESTAMP DEFAULT NOW()
);

-- ─── Inventaire (crimping dies / tools) ─────────────────────────────────────
CREATE TABLE "Inventaire" (
  id           SERIAL PRIMARY KEY,
  type_outil   VARCHAR(10)  NOT NULL,
  n_outil      VARCHAR(50)  NOT NULL,
  alphab       VARCHAR(20),
  inventory_no VARCHAR(100),
  localisation VARCHAR(100),
  terminal     VARCHAR(100),
  type_corp    VARCHAR(50),
  commentaire  VARCHAR(200),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ─── ProductionTracking (order / delivery planning) ─────────────────────────
CREATE TABLE "ProductionTracking" (
  id                  SERIAL PRIMARY KEY,
  feuille             VARCHAR(50) NOT NULL,
  plant               VARCHAR(20),
  oem                 VARCHAR(50),
  jlr_pn              VARCHAR(100),
  cpn                 VARCHAR(100),
  apn                 VARCHAR(100),
  famille             VARCHAR(200),
  criticity_vor_bo    VARCHAR(50),
  received_order_date DATE,
  s_lead_time         INTEGER,
  needed_in_customer  DATE,
  plant_delivery_plan DATE,
  plant_status        VARCHAR(30),
  qty                 INTEGER,
  shipped             INTEGER,
  net                 INTEGER,
  comment             VARCHAR(500),
  me_d                VARCHAR(20),
  drawing             VARCHAR(20),
  prg                 VARCHAR(20),
  process_of          VARCHAR(20),
  raw_material        VARCHAR(20),
  wires               VARCHAR(20),
  production          VARCHAR(20),
  validation          VARCHAR(20),
  packaging           VARCHAR(20),
  shipment            VARCHAR(20),
  is_shipment_plan_ok VARCHAR(10),
  responsable         VARCHAR(120),
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ─── Contacts ───────────────────────────────────────────────────────────────
CREATE TABLE "Contacts" (
  id                   SERIAL PRIMARY KEY,
  project              VARCHAR(100) NOT NULL,
  contact_pcl          VARCHAR(200),
  ship_mode            VARCHAR(50),
  plant_responsibility VARCHAR(50),
  sold_to              VARCHAR(50),
  ship_to              VARCHAR(50),
  contact_sales        VARCHAR(200),
  destination          VARCHAR(100),
  dhl_account          VARCHAR(50),
  created_at           TIMESTAMP DEFAULT NOW()
);

-- ─── Recap (after-sales shipment records) ───────────────────────────────────
CREATE TABLE "Recap" (
  id                  SERIAL PRIMARY KEY,
  feuille             VARCHAR(50) NOT NULL,
  oem                 VARCHAR(50),
  jlr_pn              VARCHAR(100),
  famille             VARCHAR(200),
  original_build_date DATE,
  customer_po         VARCHAR(100),
  bl_number           VARCHAR(100),
  dn_number           VARCHAR(100),
  shipment_date       DATE,
  qty_shipped         INTEGER,
  destination         VARCHAR(100),
  notes               VARCHAR(500),
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ─── RMAlternativeMateriel (alternative materials — PE proposals) ───────────
CREATE TABLE "RMAlternativeMateriel" (
  id                SERIAL PRIMARY KEY,
  original_apn      VARCHAR(100),
  original_material VARCHAR(300),
  original_code     VARCHAR(100),
  original_code2    VARCHAR(100),
  me_proposal       VARCHAR(300),
  apn               VARCHAR(100),
  description       VARCHAR(300),
  pe_code           VARCHAR(100),
  ba                VARCHAR(100),
  serial_or_ni      VARCHAR(100),
  comment           VARCHAR(500),
  afm_build         VARCHAR(100),
  date_requested    VARCHAR(50),
  drawing           VARCHAR(100),
  requestor         VARCHAR(120),
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- Sample data (optional) — lets you confirm the connection end-to-end.
-- The app ships its own in-memory demo data, so seeding is only for a live DB.
-- ============================================================================

INSERT INTO "Fils" (famille, zone, num_drwn, num_fil, long, cable, section_fil, coml, type_isol, connect_a, dpn_connect_a, voie_a, terminal_a, connect_b, voie_b, terminal_b, options) VALUES
('PASSENGER DOOR RHD','630-YB','CLN04A','CLN04A',400,'M3232201',0.35,'BK','FLRY-B','CBPL23','15324806','6','10793721','CBPW04B','20','33136808','BASE'),
('PASSENGER DOOR RHD','630-YB','CLN17MB','CLN17MB-R',1920,'M3232201',0.35,'BK','FLRY-B','C3BB','33124481+33111549','41','12198039','SBLN17',NULL,NULL,'SPLICE'),
('PASSENGER DOOR RHD','630-YB','CLN17MF','CLN17MF-R',270,'M3232201',0.35,'BK','FLRY-B','CBPL23','15324806','5','10793721','SBLN17',NULL,NULL,'BASE'),
('PASSENGER DOOR LHD','630-ZB','CLN04A','CLN04A-L',400,'M3232201',0.35,'BK','FLRY-B','CBPL23','15324806','6','10793721','CBPW04B','20','33136808','BASE'),
('PASSENGER DOOR LHD','630-ZB','CLN17MB','CLN17MB-L',1920,'M3232201',0.35,'BK','FLRY-B','C3BB','33124481+33111549','41','12198039','SBLN17',NULL,NULL,'SPLICE');

INSERT INTO "Torsades" (famille, zone, num_torsade, num_fil, couleur, section, bobine, longueur_torsade, longueur_initiale, longueur_finale, longueur_libre_1, terminal_1, longueur_libre_2, terminal_2, pas_de_torsade, ksk_module, dpn_ksk_module) VALUES
('PASSENGER DOOR RHD','630-YB','T2_CRB01A','CRB01A-R','BK',0.35,'M3232201',940,1035,1020,40,'15448359',40,'33136808',25,'PK72-14H100-ABA','35543915'),
('PASSENGER DOOR RHD','630-YB','T2_CRB01A','CRB02A-R','BK',0.35,'M3232201',940,1035,1020,40,'15448359',40,'33136808',25,'PK72-14H100-ABA','35543915'),
('PASSENGER DOOR RHD','630-YB','T2_VDB33K','VDB33K-R','BK',0.13,'M6158001',1775,1915,1855,40,'10780330',40,'33136809',15,'PK72-14H100-ABA','35543915'),
('PASSENGER DOOR LHD','630-ZB','T2_CRB01A','CRB01A-L','BK',0.35,'M3232201',950,1045,1030,40,'15448359',40,'33136808',25,'PK72-14H100-BBB','35612589'),
('PASSENGER DOOR LHD','630-ZB','T2_VDB33K','VDB33K-L','BK',0.13,'M6158001',1775,1915,1855,40,'10780330',40,'33136809',15,'PK72-14H100-BBB','35612589');

INSERT INTO "Splices" (famille, splice, n_file, couleur, section, type_iso, to_item, option) VALUES
('PASSENGER DOOR RHD','5BD136A/Y','VDB33K-R,VDB34K-R','BK',0.35,'FLRY-B','CBPW19','JCBAS'),
('PASSENGER DOOR RHD','5BLN17/Y','CLN17MA-R','BK',0.35,'FLRY-B','SBLN17','BASE'),
('PASSENGER DOOR LHD','5BD140/Z','GD140AC-L,GD140AL-L','BK',0.35,'FLRY-B','CSLN42','JCBAS'),
('PASSENGER DOOR LHD','5BPL07/Z','CPL07CA-L,CPL07SA-L','BK',0.75,'FLRY-B','CSPL23','CBSAE');

INSERT INTO "Inventaire" (type_outil, n_outil, alphab, inventory_no, localisation, commentaire) VALUES
('G','1177','A','G1177A','Rack01-A','Salle Process'),
('G','9488','B','G9488B','Rack01-A','Salle Process'),
('G','9288','A','G9288A','Rack01-A','Salle Process'),
('P','9058','A','P9058A','Rack01-A','Salle Process'),
('P','433','D','P433D','Rack01-A','Salle Process'),
('G','9449','A','G9449A','Rack01-B','Salle Process');

INSERT INTO "ProductionTracking" (feuille, plant, oem, jlr_pn, cpn, apn, famille, received_order_date, s_lead_time, needed_in_customer, plant_delivery_plan, plant_status, qty, shipped, net, comment, me_d, drawing, is_shipment_plan_ok) VALUES
('MFA','M6','MFA','A1185409313','35190808','645',NULL,'2025-12-04',50,'2026-01-23','2026-01-13','Delay',5,0,-5,NULL,'OK','OK','OK'),
('MFA','M6','MFA','A1185409513','35130831','655',NULL,'2025-12-09',50,'2026-01-18','2026-01-16','Delay',80,0,-80,NULL,'OK','OK','OK'),
('MFA','M6','MFA','A2435406710','35531258','696B',NULL,'2026-02-09',52,'2026-04-02','2026-03-23','On Time',300,0,-300,'New','OK',NULL,'OK'),
('JLRKSK','M8','JLR KSK','K8D214J010AA',NULL,NULL,'MEGA L551','2025-12-09',38,'2026-01-18','2026-01-06','Delay',1,0,-1,'Need Vass Number or HARPY',NULL,NULL,'NOK'),
('JLRBX540','M6 Serie','X540','02J9C34047','N8D214N178AA','35516335','COOLING BOX FAN MHEV','2026-01-29',63,'2026-04-02','2026-03-23','On Time',61,0,-61,'New',NULL,NULL,'OK');

INSERT INTO "Recap" (feuille, oem, jlr_pn, famille, original_build_date, customer_po, bl_number, dn_number, shipment_date, qty_shipped, destination, notes) VALUES
('JLRBL55X','L551','LR162459','COOLING BOX FAN MHEV','2019-09-27','4532575718','78096674','9000123456','2025-04-11',268,'Coventry','Shipped on time'),
('JLRKSK','JLR KSK','K6D214J010AA','MEGA L551','2022-11-16','4532499007','78102341','9000234567','2025-03-11',120,'Coventry',NULL),
('JLRKSK','JLR KSK','LK7214J010AA','MEGA L550','2023-09-19','4532340897','78109912','9000345678','2026-03-26',38,'Coventry','Partial shipment'),
('MFA','MFA','PK7214J010AA',NULL,'2019-09-19','4531524405','78115003','9000456789','2026-03-26',300,'France',NULL),
('JLRBL55X','L551','R6D214400AA','IP L551','2025-06-08','4532530398','78131221','9000678901','2026-03-24',1,'Coventry','Urgent VOR');

INSERT INTO "Contacts" (project, contact_pcl, ship_mode, plant_responsibility, sold_to, ship_to, contact_sales, destination, dhl_account) VALUES
('RSA','Uryga, Agnieszka','DHL','M1','115484','765077','by tools','France',NULL),
('PSA','Miekina, Klaudia','DHL','M1','115484','764961','by tools','France',NULL),
('FIAT','Rys, Tobiasz','Truck','M1','103904','754571','by tools','Italy',NULL),
('JLR KSK','Szymanski, Mateusz','DHL','customer DHL account','102345','722898','by tools','coventry','968583197'),
('JLR Doors / Serv Kits','Szymanski, Mateusz','Truck','M1','102345','722898','by tools','coventry',NULL),
('X540','Szymanski, Mateusz','Truck','M1','102345','722898','by tools','coventry',NULL);
