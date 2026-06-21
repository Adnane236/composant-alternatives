-- ============================================================================
-- PostgreSQL schema — tables only (no seed data).
-- Mirrors sql/schema.sql; use this when you want a clean structure to import
-- your own data into.  Run:  psql "$DATABASE_URL" -f sql/schema_create_only.sql
-- ============================================================================

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
