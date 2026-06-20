
-- ─────────────────────────────────────────────────────────
-- TABLE : Fils (Simple Wires)
-- Source : Feuille "Simple_Wires_RHD/LHD"
-- ─────────────────────────────────────────────────────────
CREATE TABLE Fils (
  id            INT IDENTITY PRIMARY KEY,
  famille       NVARCHAR(50)  NOT NULL,  -- ex: PASSENGER DOOR RHD, LHD
  zone          NVARCHAR(20),            -- ex: 630-YB, 630-ZB
  num_drwn      NVARCHAR(50),
  num_fil       NVARCHAR(100) NOT NULL,
  long          INT,                     -- longueur mm
  cable         NVARCHAR(50),
  section_fil   DECIMAL(5,2),
  coml          NVARCHAR(20),
  type_isol     NVARCHAR(50),
  union_tors_a  NVARCHAR(100),
  connect_a     NVARCHAR(100),
  dpn_connect_a NVARCHAR(200),
  acces         NVARCHAR(50),
  voie_a        NVARCHAR(10),
  terminal_a    NVARCHAR(100),
  seal_a        NVARCHAR(100),
  connect_b     NVARCHAR(100),
  dpn_connect_b NVARCHAR(200),
  voie_b        NVARCHAR(10),
  terminal_b    NVARCHAR(100),
  seal_b        NVARCHAR(100),
  options       NVARCHAR(200),
  created_at    DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : Torsades (Twisted Pairs)
-- Source : Feuille "DATA DES TWIST" / "TORSADOS_RHD/LHD"
-- ─────────────────────────────────────────────────────────
CREATE TABLE Torsades (
  id                  INT IDENTITY PRIMARY KEY,
  famille             NVARCHAR(50) NOT NULL,
  zone                NVARCHAR(20),
  num_torsade         NVARCHAR(100) NOT NULL,
  lead_code_torsade   NVARCHAR(100),
  num_fil             NVARCHAR(100) NOT NULL,
  lead_code_fil       NVARCHAR(100),
  couleur             NVARCHAR(50),
  section             DECIMAL(5,2),
  bobine              NVARCHAR(50),
  longueur_torsade    INT,
  longueur_initiale   INT,
  longueur_finale     INT,
  longueur_libre_1    INT,
  seal_1              NVARCHAR(100),
  terminal_1          NVARCHAR(100),
  longueur_libre_2    INT,
  seal_2              NVARCHAR(100),
  terminal_2          NVARCHAR(100),
  pas_de_torsade      INT,
  ksk_module          NVARCHAR(100),
  dpn_ksk_module      NVARCHAR(100),
  created_at          DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : Splices
-- Source : Feuille "splice" (RHD/LHD)
-- ─────────────────────────────────────────────────────────
CREATE TABLE Splices (
  id              INT IDENTITY PRIMARY KEY,
  famille         NVARCHAR(50) NOT NULL,
  zone            NVARCHAR(20),
  splice          NVARCHAR(100) NOT NULL,
  us_location     NVARCHAR(100),
  groupe          NVARCHAR(50),
  n_file          NVARCHAR(100),
  couleur         NVARCHAR(50),
  section         DECIMAL(5,2),
  type_iso        NVARCHAR(50),
  long            INT,
  cout            DECIMAL(10,2),
  to_item         NVARCHAR(100),
  to_cavity       NVARCHAR(50),
  union_torsade   NVARCHAR(100),
  option          NVARCHAR(200),
  created_at      DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : SpliceFils (fils rattachés à un splice - feuille UCAB)
-- Source : Feuille "UCAB"
-- ─────────────────────────────────────────────────────────
CREATE TABLE SpliceFils (
  id              INT IDENTITY PRIMARY KEY,
  famille         NVARCHAR(50) NOT NULL,
  splice          NVARCHAR(100) NOT NULL,
  us              NVARCHAR(100),
  num_wire        NVARCHAR(100),
  num_wire_coupe  NVARCHAR(100),
  color           NVARCHAR(50),
  size            DECIMAL(5,2),
  type_isol       NVARCHAR(50),
  cote            NVARCHAR(10),
  alpha_code      NVARCHAR(20),
  module          NVARCHAR(100),
  fna_code        NVARCHAR(100),
  dpn_isolot      NVARCHAR(100),
  section_total   DECIMAL(5,2),
  configuration_clip NVARCHAR(100),
  heatshrink      NVARCHAR(100),
  created_at      DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : Inventaire (Outils)
-- Source : Feuille "Inventaire M6"
-- ─────────────────────────────────────────────────────────
CREATE TABLE Inventaire (
  id              INT IDENTITY PRIMARY KEY,
  type_outil      NVARCHAR(10)  NOT NULL,  -- G, P
  n_outil         NVARCHAR(50)  NOT NULL,
  alphab          NVARCHAR(20),
  inventory_no    NVARCHAR(100),
  localisation    NVARCHAR(100),
  terminal        NVARCHAR(100),
  type_corp       NVARCHAR(50),
  commentaire     NVARCHAR(200),
  created_at      DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : ProductionTracking (suivi commandes/livraisons)
-- Source : Feuilles MFA, JLRKSK, JRBL55X, JLRBX540, JLRDOORServicekits
-- ─────────────────────────────────────────────────────────
CREATE TABLE ProductionTracking (
  id                          INT IDENTITY PRIMARY KEY,
  feuille                     NVARCHAR(50) NOT NULL,  -- MFA, JLRKSK, etc.
  plant                       NVARCHAR(20),
  oem                         NVARCHAR(50),
  jlr_pn                      NVARCHAR(100),
  cpn                         NVARCHAR(100),
  apn                         NVARCHAR(100),
  famille                     NVARCHAR(200),
  criticity_vor_bo            NVARCHAR(50),
  received_order_date         DATE,
  s_lead_time                 INT,
  needed_in_customer          DATE,
  plant_delivery_plan         DATE,
  plant_status                NVARCHAR(30),  -- On Time, Delay
  qty                         INT,
  shipped                     INT,
  net                         INT,
  comment                     NVARCHAR(500),
  -- Statuts jalons
  me_d                        NVARCHAR(20),
  drawing                     NVARCHAR(20),
  prg                         NVARCHAR(20),
  process_of                  NVARCHAR(20),
  raw_material                NVARCHAR(20),
  wires                       NVARCHAR(20),
  production                  NVARCHAR(20),
  validation                  NVARCHAR(20),
  packaging                   NVARCHAR(20),
  shipment                    NVARCHAR(20),
  is_shipment_plan_ok         NVARCHAR(10),
  created_at                  DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : Contacts
-- Source : Feuille "Contacts"
-- ─────────────────────────────────────────────────────────
CREATE TABLE Contacts (
  id                  INT IDENTITY PRIMARY KEY,
  project             NVARCHAR(100) NOT NULL,
  contact_pcl         NVARCHAR(200),
  ship_mode           NVARCHAR(50),
  plant_responsibility NVARCHAR(50),
  sold_to             NVARCHAR(50),
  ship_to             NVARCHAR(50),
  contact_sales       NVARCHAR(200),
  destination         NVARCHAR(100),
  dhl_account         NVARCHAR(50),
  created_at          DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : Recap (Récapitulatif expéditions after-sales)
-- Source : colonnes droites du tableau de bord (build date, BL, DN, Customer PO)
-- ─────────────────────────────────────────────────────────
CREATE TABLE Recap (
  id                    INT IDENTITY PRIMARY KEY,
  feuille               NVARCHAR(50) NOT NULL,    -- MFA, JLRKSK, JLRBL55X, etc.
  oem                   NVARCHAR(50),
  jlr_pn                NVARCHAR(100),
  famille               NVARCHAR(200),
  original_build_date   DATE,                      -- "Original date of built the car"
  customer_po           NVARCHAR(100),             -- Customer Purchase Order
  bl_number             NVARCHAR(100),             -- Bill of Lading
  dn_number             NVARCHAR(100),             -- Delivery Note
  shipment_date         DATE,
  qty_shipped           INT,
  destination           NVARCHAR(100),
  notes                 NVARCHAR(500),
  created_at            DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : MeetingReports (rapports de présence Teams)
-- Source : export CSV Microsoft Teams "Rapport de présence"
-- ─────────────────────────────────────────────────────────
CREATE TABLE MeetingReports (
  id                        INT IDENTITY PRIMARY KEY,
  titre                     NVARCHAR(300) NOT NULL,
  date_debut                DATETIME,
  date_fin                  DATETIME,
  duree                     NVARCHAR(50),
  temps_participation_moyen NVARCHAR(50),
  nb_participants           INT,
  created_at                DATETIME DEFAULT GETDATE()
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : MeetingParticipants (participants par réunion)
-- ─────────────────────────────────────────────────────────
CREATE TABLE MeetingParticipants (
  id                      INT IDENTITY PRIMARY KEY,
  meeting_id              INT NOT NULL,
  nom                     NVARCHAR(200),
  premiere_participation  DATETIME,
  heure_dernier_depart    DATETIME,
  duree                   NVARCHAR(50),
  email                   NVARCHAR(200),
  upn                     NVARCHAR(200),
  role                    NVARCHAR(100),
  camera_active           INT DEFAULT 0,
  lever_main              INT DEFAULT 0,
  reactiver_son           INT DEFAULT 0,
  CONSTRAINT FK_MeetingParticipants_Meeting FOREIGN KEY (meeting_id) REFERENCES MeetingReports(id)
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : MeetingEngagements (événements d'engagement)
-- ─────────────────────────────────────────────────────────
CREATE TABLE MeetingEngagements (
  id                INT IDENTITY PRIMARY KEY,
  meeting_id        INT NOT NULL,
  nom_participant   NVARCHAR(200),
  type_engagement   NVARCHAR(100),
  heure             DATETIME,
  CONSTRAINT FK_MeetingEngagements_Meeting FOREIGN KEY (meeting_id) REFERENCES MeetingReports(id)
);
GO

-- ─────────────────────────────────────────────────────────
-- TABLE : VariantConfig (codes véhicules / configurations)
-- Source : colonnes oranges à droite dans les feuilles RHD/LHD
-- ─────────────────────────────────────────────────────────
CREATE TABLE VariantConfig (
  id            INT IDENTITY PRIMARY KEY,
  famille       NVARCHAR(50) NOT NULL,
  config_code   NVARCHAR(50) NOT NULL,   -- ex: 3S10070-FAB, JK72-14630-FAB
  description   NVARCHAR(200),
  created_at    DATETIME DEFAULT GETDATE()
);
GO

-- Liaison Fils <-> VariantConfig (quelle config utilise ce fil)
CREATE TABLE FilVariant (
  fil_id        INT NOT NULL,
  variant_id    INT NOT NULL,
  qty           INT DEFAULT 1,
  CONSTRAINT PK_FilVariant PRIMARY KEY (fil_id, variant_id),
  CONSTRAINT FK_FilVariant_Fil FOREIGN KEY (fil_id) REFERENCES Fils(id),
  CONSTRAINT FK_FilVariant_Variant FOREIGN KEY (variant_id) REFERENCES VariantConfig(id)
);
GO

-- Liaison Torsades <-> VariantConfig
CREATE TABLE TorsadeVariant (
  torsade_id    INT NOT NULL,
  variant_id    INT NOT NULL,
  qty           INT DEFAULT 1,
  CONSTRAINT PK_TorsadeVariant PRIMARY KEY (torsade_id, variant_id),
  CONSTRAINT FK_TorsadeVariant_Torsade FOREIGN KEY (torsade_id) REFERENCES Torsades(id),
  CONSTRAINT FK_TorsadeVariant_Variant FOREIGN KEY (variant_id) REFERENCES VariantConfig(id)
);
GO

-- ─────────────────────────────────────────────────────────
-- DONNÉES DE DÉMONSTRATION
-- ─────────────────────────────────────────────────────────

INSERT INTO Fils (famille, zone, num_drwn, num_fil, long, section_fil, type_isol, connect_a, dpn_connect_a, voie_a, terminal_a, seal_a, connect_b, voie_b, terminal_b, seal_b, options)
VALUES
('PASSENGER DOOR RHD','630-YB','CLN04A','CLN04A',400,'0.35','FLRY-B','CBPL23','15324806',6,10793721,NULL,'CBPW04B',20,33136808,NULL,'BASE'),
('PASSENGER DOOR RHD','630-YB','CLN17MB','CLN17MB-R',1920,'0.35','FLRY-B','C3BB','33124481+33111549+33111548+33122244',41,12198039,NULL,'SBLN17',NULL,NULL,NULL,'SPLICE'),
('PASSENGER DOOR RHD','630-YB','CLN17MF','CLN17MF-R',270,'0.35','FLRY-B','CBPL23','15324806',5,10793721,NULL,'SBLN17',NULL,NULL,NULL,'BASE'),
('PASSENGER DOOR LHD','630-ZB','CLN04A','CLN04A-L',400,'0.35','FLRY-B','CBPL23','15324806',6,10793721,NULL,'CBPW04B',20,33136808,NULL,'BASE'),
('PASSENGER DOOR LHD','630-ZB','CLN17MB','CLN17MB-L',1920,'0.35','FLRY-B','C3BB','33124481+33111549+33111548+33122244',41,12198039,NULL,'SBLN17',NULL,NULL,NULL,'SPLICE');
GO

INSERT INTO Torsades (famille, zone, num_torsade, num_fil, couleur, section, bobine, longueur_torsade, longueur_initiale, longueur_finale, longueur_libre_1, seal_1, terminal_1, longueur_libre_2, seal_2, terminal_2, pas_de_torsade, ksk_module, dpn_ksk_module)
VALUES
('PASSENGER DOOR RHD','630-YB','T2_CRB01A','CRB01A-R','BK','0.35','M3232201',NULL,1035,1020,40,NULL,15448359,40,NULL,33136808,25,'PK72-14H100-ABA','35543915'),
('PASSENGER DOOR RHD','630-YB','T2_CRB01A','CRB02A-R','BK','0.35','M3232201',NULL,1035,1020,40,NULL,15448359,40,NULL,33136808,25,'PK72-14H100-ABA','35543915'),
('PASSENGER DOOR RHD','630-YB','T2_VDB33K','VDB33K-R','BK','0.13','M6158001',NULL,1915,1855,40,NULL,10780330,40,NULL,33136809,15,'PK72-14H100-ABA','35543915'),
('PASSENGER DOOR LHD','630-ZB','T2_CRB01A','CRB01A-L','BK','0.35','M3232201',NULL,1045,1030,40,NULL,15448359,40,NULL,33136808,25,'PK72-14H100-BBB','35612589'),
('PASSENGER DOOR LHD','630-ZB','T2_VDB33K','VDB33K-L','BK','0.13','M6158001',NULL,1915,1855,40,NULL,10780330,40,NULL,33136809,15,'PK72-14H100-BBB','35612589');
GO

INSERT INTO Splices (famille, zone, splice, us_location, n_file, couleur, section, type_iso, long, to_item, union_torsade, option)
VALUES
('PASSENGER DOOR RHD',NULL,'5BD136A/Y',NULL,'VDB33K-R,VDB34K-R','BK','0.35','FLRY-B',NULL,'CBPW19',NULL,'JCBAS'),
('PASSENGER DOOR RHD',NULL,'5BLN17/Y',NULL,'CLN17MA-R','BK','0.35','FLRY-B',NULL,'SBLN17',NULL,'BASE'),
('PASSENGER DOOR LHD',NULL,'5BD140/Z',NULL,'GD140AC-L,GD140AL-L','BK','0.35','FLRY-B',NULL,'CSLN42',NULL,'JCBAS'),
('PASSENGER DOOR LHD',NULL,'5BPL07/Z',NULL,'CPL07CA-L,CPL07SA-L','BK','0.75','FLRY-B',NULL,'CSPL23',NULL,'CBSAE');
GO

INSERT INTO Inventaire (type_outil, n_outil, alphab, inventory_no, localisation, commentaire)
VALUES
('G','1177','A','G1177A','Rack01-A','Salle Process'),
('G','9488','B','G9488B','Rack01-A','Salle Process'),
('G','9288','A','G9288A','Rack01-A','Salle Process'),
('P','9058','A','P9058A','Rack01-A','Salle Process'),
('P','433','D','P433D','Rack01-A','Salle Process'),
('G','9191','A','P9191A','Rack01-A','Salle Process'),
('G','934','D','G934D','Rack01-A','Salle Process'),
('G','9212','C','G9212C','Rack01-A','Salle Process'),
('G','9462','A','G9462A','Rack01-A','Salle Process'),
('P','803','BO','P803BO','Rack01-A','Salle Process'),
('G','730','B-LP','G730B-LP','Rack01-A','Salle Process'),
('G','9964','A','G9964A','Rack01-A','Salle Process');
GO

INSERT INTO ProductionTracking (feuille, plant, oem, jlr_pn, cpn, apn, famille, criticity_vor_bo, received_order_date, s_lead_time, needed_in_customer, plant_delivery_plan, plant_status, qty, shipped, net, comment, me_d, drawing, wires, production, validation, packaging, shipment, is_shipment_plan_ok)
VALUES
('MFA','M6','MFA','A1185409313','35190808','645',NULL,NULL,'2025-12-04',50,'2026-01-23','2026-01-13','Delay',5,-5,NULL,'OK','OK',NULL,NULL,NULL,NULL,NULL,NULL,'OK'),
('MFA','M6','MFA','A1185409513','35130831','655',NULL,NULL,'2025-12-09',50,'2026-01-18','2026-01-16','Delay',80,-80,NULL,'OK','OK',NULL,NULL,NULL,NULL,NULL,NULL,'OK'),
('MFA','M6','MFA','A2435406710','35531258','696B',NULL,NULL,'2026-02-09',52,'2026-04-02','2026-03-23','On Time',300,-300,'New','OK',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'OK'),
('JLRKSK','M8','JLR KSK','K8D214J010AA',NULL,NULL,'MEGA L551',NULL,'2025-12-09',38,'2026-01-18','2026-01-06','Delay',1,-1,'Need Vass Number or HARPY',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'NOK'),
('JLRBX540','M6 Serie','X540','02J9C34047','N8D214N178AA','35516335','COOLING BOX FAN MHEV',NULL,'2026-01-29',63,'2026-04-02','2026-03-23','On Time',61,-61,'New',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'OK');
GO

INSERT INTO Recap (feuille, oem, jlr_pn, famille, original_build_date, customer_po, bl_number, dn_number, shipment_date, qty_shipped, destination, notes)
VALUES
('JLRBL55X','L551','LR162459','COOLING BOX FAN MHEV','2019-09-27','4532575718','78096674','9000123456','2025-04-11',268,'Coventry','Shipped on time'),
('JLRKSK','JLR KSK','K6D214J010AA','MEGA L551','2022-11-16','4532499007','78102341','9000234567','2025-03-11',120,'Coventry',''),
('JLRKSK','JLR KSK','LK7214J010AA','MEGA L550','2023-09-19','4532340897','78109912','9000345678','2026-03-26',38,'Coventry','Partial shipment'),
('MFA','MFA','PK7214J010AA','','2019-09-19','4531524405','78115003','9000456789','2026-03-26',300,'France',''),
('JLRKSK','JLR KSK','PY7214J010AA','MEGA L551','2023-04-19','4533024405','78120558','9000567890','2026-02-04',60,'Coventry',''),
('JLRBL55X','L551','R6D214400AA','IP L551','2025-06-08','4532530398','78131221','9000678901','2026-03-24',1,'Coventry','Urgent VOR');
GO

INSERT INTO MeetingReports (titre, date_debut, date_fin, duree, temps_participation_moyen, nb_participants)
VALUES ('AFM PSA & FCA Transfer', '2026-05-28 10:00:35', '2026-05-28 10:05:01', '4m 26s', '3m 42s', 4);
GO

INSERT INTO MeetingParticipants (meeting_id, nom, premiere_participation, heure_dernier_depart, duree, email, upn, role, camera_active, lever_main, reactiver_son)
VALUES
(1, 'Szczepaniak, Robert (Versigent)', '2026-05-28 10:00:42', '2026-05-28 10:05:00', '4m 17s', 'robert.szczepaniak@aptiv.com', 'robert.szczepaniak@aptiv.com', 'Présentateur', 0, 0, 1),
(1, 'Kashchenko, Denys (Versigent)',   '2026-05-28 10:00:56', '2026-05-28 10:05:01', '4m 4s',  'denys.kashchenko@aptiv.com',  'denys.kashchenko@aptiv.com',  'Présentateur', 0, 0, 1),
(1, 'Kwasny, Anita (Versigent)',       '2026-05-28 10:01:09', '2026-05-28 10:04:58', '3m 49s', 'anita.kwasny@aptiv.com',      'anita.kwasny@aptiv.com',      'Présentateur', 0, 0, 2),
(1, 'Ursul, Dmytro (Versigent)',       '2026-05-28 10:02:21', '2026-05-28 10:04:59', '2m 38s', 'Dmytro.Ursul1@aptiv.com',     'Dmytro.Ursul1@aptiv.com',     'Présentateur', 0, 0, 1);
GO

INSERT INTO MeetingEngagements (meeting_id, nom_participant, type_engagement, heure)
VALUES
(1, 'Szczepaniak, Robert (Versigent)', 'Micro activé', '2026-05-28 10:01:07'),
(1, 'Kashchenko, Denys (Versigent)',   'Micro activé', '2026-05-28 10:01:00'),
(1, 'Kwasny, Anita (Versigent)',       'Micro activé', '2026-05-28 10:01:16'),
(1, 'Kwasny, Anita (Versigent)',       'Micro activé', '2026-05-28 10:03:34'),
(1, 'Ursul, Dmytro (Versigent)',       'Micro activé', '2026-05-28 10:02:23');
GO

INSERT INTO Contacts (project, contact_pcl, ship_mode, plant_responsibility, sold_to, ship_to, contact_sales, destination, dhl_account)
VALUES
('RSA','Uryga, Agnieszka','DHL','M1','115484','765077','by tools','France',NULL),
('PSA','Miekina, Klaudia','DHL','M1','115484','764961','by tools','France',NULL),
('FIAT','Rys, Tobiasz','Truck','M1','103904','754571','by tools','Italy',NULL),
('OPEL-Polska','Golebiowska, Natalia','DHL','customer DHL account','111211','766125','by tools','Polska','963800554'),
('OPEL-France','Golebiowska, Natalia','DHL','M1','115484','767379','by tools','France',NULL),
('JLR KSK','Szymanski, Mateusz','DHL','customer DHL account','102345','722898','by tools','coventry','968583197'),
('JLR Doors / Serv Kits','Szymanski, Mateusz','Truck','M1','102345','722898','by tools','coventry',NULL),
('X540','Szymanski, Mateusz','Truck','M1','102345','722898','by tools','coventry',NULL),
('L55X','Szymanski, Mateusz','Truck','M1','102345','722898','by tools','coventry',NULL);
GO
