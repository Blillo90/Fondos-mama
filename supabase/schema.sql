-- =============================================
-- SCHEMA: Seguimiento Cartera Fondos Mama
-- Maria Nieves Herrero Delgado · Abril 2026
-- =============================================

-- FONDOS
CREATE TABLE IF NOT EXISTS funds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  isin TEXT,
  category TEXT,
  cagr DECIMAL(6,2),
  sharpe DECIMAL(5,2),
  ter DECIMAL(5,2),
  rent_2025 DECIMAL(6,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARTERAS
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  initial_value DECIMAL(12,2),
  ter_annual DECIMAL(5,2),
  expected_net_return DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPOSICION DE CARTERAS
CREATE TABLE IF NOT EXISTS portfolio_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id TEXT REFERENCES portfolios(id) ON DELETE CASCADE,
  fund_id TEXT REFERENCES funds(id) ON DELETE CASCADE,
  target_weight DECIMAL(6,2),
  initial_amount DECIMAL(12,2),
  UNIQUE(portfolio_id, fund_id)
);

-- SNAPSHOTS DIARIOS DE CARTERA
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id TEXT REFERENCES portfolios(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_value DECIMAL(12,2) NOT NULL,
  daily_change DECIMAL(12,2),
  daily_change_pct DECIMAL(8,4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, date)
);

-- VALORES DIARIOS POR FONDO
CREATE TABLE IF NOT EXISTS fund_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT REFERENCES funds(id) ON DELETE CASCADE,
  portfolio_id TEXT REFERENCES portfolios(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fund_id, portfolio_id, date)
);

-- TRASPASOS DE MIGRACION
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_num INTEGER NOT NULL,
  phase TEXT NOT NULL,
  from_fund_id TEXT REFERENCES funds(id),
  to_fund_id TEXT REFERENCES funds(id),
  planned_amount DECIMAL(12,2),
  actual_amount DECIMAL(12,2),
  status TEXT DEFAULT 'pending',
  executed_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DATOS SEED
-- =============================================

-- FONDOS ACTUALES (origen de los traspasos)
INSERT INTO funds (id, name, isin, category, cagr, ter, rent_2025, notes) VALUES
  ('sabadell-prudente', 'Sabadell Prudente', 'ES0111187003', 'Mixto Conservador', 4.5, 1.50, 4.46, 'Fondo principal. 42.977€. Vaciado en meses 5-6'),
  ('sabadell-consolida94', 'Sabadell Consolida 94', 'ES0111203008', 'Mixto Conservador', 3.0, 1.30, null, '10.450€. Vaciado en mes 5'),
  ('sabadell-rendimiento', 'Sabadell Rendimiento', 'ES0173829039', 'Mixto Conservador', 3.5, 1.20, null, '13.470€. Vaciado en mes 5'),
  ('sabadell-interes-euro', 'Sabadell Interés Euro', 'ES0174403008', 'RF Corto', 2.5, 0.80, 2.80, 'Mes 1. 4.780€'),
  ('sabadell-bonos-euro', 'Sabadell Bonos Euro', 'ES0173828007', 'RF', 2.0, 0.90, null, 'Mes 1. 3.136€'),
  ('sabadell-euro-yield', 'Sabadell Euro Yield', 'ES0184976001', 'RF', 2.0, 0.90, null, 'Mes 1. 1.379€'),
  ('sabadell-bonos-flotantes', 'Sabadell Bonos Flotantes Euro', 'ES0174356016', 'RF Flotante', 2.2, 0.80, null, 'Mes 1. 788€'),
  ('amundi-abs-responsible', 'Amundi ABS Responsible', 'FR0010319996', 'RF', 2.0, 1.00, null, 'Mes 1. 742€'),
  ('eurizon-euro-bond', 'Eurizon Fund II Euro Bond Z', 'LU0278427041', 'RF', 1.8, 0.70, null, 'Mes 1. 707€'),
  ('sabadell-bonos-sos', 'Sabadell Bonos Sostenibles España', 'ES0158862021', 'RF', 1.5, 0.80, null, 'Mes 1. 510€'),
  ('muzinich-yield', 'Muzinich Enhanced Yield ST', 'IE00BYXHR262', 'RF HY', 2.8, 1.00, null, 'Mes 1. 476€'),
  ('sabadell-dolar-fijo', 'Sabadell Dólar Fijo', 'ES0138950003', 'RF USD', 1.5, 0.90, null, 'Mes 1. 317€'),
  ('bnp-bond-6m', 'BNP Paribas Enhanced Bond 6M', 'LU0325598752', 'RF Corto', 2.0, 0.80, null, 'Mes 2. 929€'),
  ('dws-short-duration', 'DWS Short Duration Credit IC', 'LU0982752155', 'RF Crédito', 2.2, 0.70, null, 'Mes 2. 772€'),
  ('mg-european-credit', 'M&G European Credit QI', 'LU2188668326', 'RF Crédito', 2.5, 0.75, null, 'Mes 2. 731€'),
  ('axa-europe-hy', 'AXA IM Europe SD High Yield', 'LU0658025209', 'RF HY', 3.0, 1.00, null, 'Mes 2. 478€'),
  ('generali-bond', 'Generali Euro Bond 1-3 Years G', 'LU1373301057', 'RF', 1.8, 0.60, null, 'Mes 2. 406€'),
  ('axa-credit-sdx', 'AXA WF Euro Credit SD X', 'LU1601096537', 'RF Crédito', 2.0, 0.50, null, 'Mes 2. 261€'),
  ('axa-credit-sdi', 'AXA WF Euro Credit SD I', 'LU0227127643', 'RF Crédito', 2.0, 0.50, null, 'Mes 2. 259€'),
  ('sabadell-usa-bolsa', 'Sabadell Estados Unidos Bolsa', 'ES0138983004', 'RV EEUU', 7.0, 1.50, -1.54, 'Mes 2. 657€'),
  ('jpm-america-equity', 'JPM America Equity', 'LU1734444273', 'RV EEUU', 7.5, 1.60, -1.54, 'Mes 2. 294€'),
  ('amundi-us-growth', 'Amundi US Equity Fundamental Growth J2', 'LU2732984955', 'RV EEUU Growth', 8.0, 1.50, null, 'Mes 3. 108€'),
  ('loomis-us-growth', 'Loomis Sayles US Growth Equity S1', 'LU1435387458', 'RV EEUU Growth', 8.5, 1.70, null, 'Mes 3. 61€'),
  ('ab-us-equity', 'AB Select US Equity Portfolio S1', 'LU1764069099', 'RV EEUU', 7.5, 1.60, null, 'Mes 3. 58€'),
  ('sabadell-economia-digital', 'Sabadell Economía Digital', 'ES0138528015', 'RV Temático', 8.0, 1.50, null, 'Mes 3. 180€'),
  ('alma-japan', 'Alma Eikoh Japan Large Cap Equity', 'LU1870374508', 'RV Japón', 5.0, 1.80, null, 'Mes 3. 102€'),
  ('amundi-us-value-j21', 'Amundi US Equity Research Value J21', 'LU2931223932', 'RV EEUU Value', 6.5, 1.50, null, 'Mes 3. 152€'),
  ('ct-us-contrarian', 'CT Lux US Contrarian Core Equities ZE', 'LU0957798324', 'RV EEUU Value', 6.0, 1.40, null, 'Mes 3. 78€'),
  ('lazard-capital-sri', 'Lazard Capital SRI SC', 'FR0013311446', 'RV Europa', 7.0, 1.50, null, 'Mes 3. 329€'),
  ('sabadell-europa-futuro', 'Sabadell Europa Bolsa Futuro', 'ES0183339003', 'RV Europa', 6.0, 1.40, null, 'Mes 3. 128€'),
  ('sabadell-economia-verde', 'Sabadell Economía Verde', 'ES0138529013', 'RV Temático', 5.0, 1.50, null, 'Mes 4. 53€'),
  ('sabadell-emergente-mixto', 'Sabadell Emergente Mixto Flexible', 'ES0105142006', 'Emergentes Mixto', 4.5, 1.60, 6.14, 'Mes 4. 273€'),
  ('sabadell-bolsas-emergentes', 'Sabadell Bolsas Emergentes', 'ES0175083007', 'RV Emergentes', 5.0, 1.70, null, 'Mes 4. 180€'),
  ('jpm-em-local', 'JPM EM Local Currency Debt', 'LU0804757648', 'RF Emergente Local', 4.0, 1.20, null, 'Mes 4. 215€'),
  ('amundi-abs-multi', 'Amundi ABS Ret Multi-Strategy J', 'LU1882440925', 'Alternativo', 3.5, 1.00, null, 'Mes 4. 211€'),
  ('amundi-commodities', 'Amundi SF EUR Commodities R', 'LU1706853931', 'Materias Primas', 5.0, 1.20, null, 'Mes 4. 54€'),
  ('sabadell-sel-alternativa', 'Sabadell Selección Alternativa', 'ES0182282014', 'Alternativo', 3.0, 2.97, null, 'Mes 4. 2.174€ (1.486+688)'),
  ('sabadell-espana-futuro', 'Sabadell España Bolsa Futuro', 'ES0111092005', 'RV España', 5.0, 1.50, null, 'Mes 4. 3€ (residual)')
ON CONFLICT (id) DO NOTHING;

-- FONDOS OBJETIVO (destino de los traspasos)
INSERT INTO funds (id, name, isin, category, cagr, sharpe, ter, rent_2025, notes) VALUES
  ('nb-short-duration', 'NB Short Duration Bond', 'IE00BFZMJT78', 'RF Corto Plazo', 2.3, -0.79, 0.35, 3.86, 'Renta fija corto plazo. 20.7% cartera objetivo'),
  ('schroder-euro-credit', 'Schroder Euro Credit', 'LU2080996049', 'RF Crédito EUR', 1.1, -0.63, 0.40, null, '13.8% cartera objetivo'),
  ('jpm-us-equity-focus', 'JPMorgan US Equity Focus', 'LU2510715605', 'RV EEUU', 8.0, null, 0.50, 6.80, '16.1% cartera objetivo'),
  ('amundi-us-equity-value', 'Amundi US Equity Value R2', 'LU1894686523', 'RV EEUU Value', 6.7, 0.26, 0.40, 2.58, '9.2% cartera objetivo. Vigilar vs growth'),
  ('eleva-european', 'Eleva European Selection', 'LU1111643042', 'RV Europa', 10.3, 0.48, 0.60, 19.97, 'Núcleo cartera. 10.4%'),
  ('sabadell-euroaccion', 'Sabadell Euroacción', 'ES0111098002', 'RV Europa', 6.4, 0.13, 1.20, 16.61, '4.6%. Traspaso fiscal ventajoso'),
  ('mfs-meridian-em-debt', 'MFS Meridian EM Debt', 'LU0583240782', 'RF Emergente', 7.9, 0.94, 0.65, 9.86, '5.2%. Solo 3 años datos'),
  ('nb-em-debt-hard', 'NB EM Debt Hard CCY', 'IE00B986G486', 'RF Emergente USD', 1.9, -0.18, 0.40, null, '4.8%. Afectado en 2022'),
  ('ofi-precious-metals', 'OFI Precious Metals', 'FR0011170786', 'Metales Preciosos', 8.6, 0.33, 0.80, null, '6.3%. Cobertura inflación'),
  ('man-alpha-alternative', 'Man Alpha Select Alternative', 'IE00B3LJVG97', 'Alternativo', 5.5, 0.44, 2.97, 2.86, '2.0%. URGENTE: negociar clase I (coste actual 2.97% vs ganancia 2.86%)'),
  ('atlas-infrastructure', 'Atlas Global Infrastructure', 'IE000NPCPQI2', 'Infraestructura', 9.1, 0.50, 0.60, null, '1.7% cartera objetivo'),
  ('sabadell-prudente-residual', 'Sabadell Prudente (residual)', 'ES0111187003', 'Mixto Conservador', 4.5, null, 1.50, 4.46, '5.2% residual durante migración')
ON CONFLICT (id) DO UPDATE SET
  cagr = EXCLUDED.cagr,
  sharpe = EXCLUDED.sharpe,
  ter = EXCLUDED.ter,
  rent_2025 = EXCLUDED.rent_2025,
  notes = EXCLUDED.notes;

-- CARTERAS
INSERT INTO portfolios (id, name, label, description, initial_value, ter_annual, expected_net_return) VALUES
  ('actual', 'Cartera Actual', 'Banco Sabadell · 49 fondos', 'Cartera original en Banco Sabadell. 49 fondos. Exceso de concentración en mixtos conservadores (73%). TER elevado 1.45%/año = 1.333€.', 91664.82, 1.45, 1.79),
  ('objetivo', 'Cartera Objetivo', 'Optimizada · 12 fondos', 'Cartera optimizada tras migración. 12 fondos diversificados con perfil moderado. TER reducido 0.55%/año = 504€. Ahorro anual: 828€.', 91664.82, 0.55, 6.43)
ON CONFLICT (id) DO NOTHING;

-- COMPOSICION CARTERA ACTUAL (fondos principales)
INSERT INTO portfolio_funds (portfolio_id, fund_id, target_weight, initial_amount) VALUES
  ('actual', 'sabadell-prudente', 46.88, 42977.00),
  ('actual', 'sabadell-consolida94', 11.40, 10450.00),
  ('actual', 'sabadell-rendimiento', 14.70, 13470.00),
  ('actual', 'sabadell-interes-euro', 5.21, 4780.29),
  ('actual', 'sabadell-bonos-euro', 3.42, 3136.46),
  ('actual', 'sabadell-euro-yield', 1.50, 1379.31),
  ('actual', 'sabadell-bonos-flotantes', 0.86, 788.26),
  ('actual', 'amundi-abs-responsible', 0.81, 742.06),
  ('actual', 'eurizon-euro-bond', 0.77, 707.31),
  ('actual', 'sabadell-bonos-sos', 0.56, 510.31),
  ('actual', 'muzinich-yield', 0.52, 476.19),
  ('actual', 'sabadell-dolar-fijo', 0.35, 316.93),
  ('actual', 'bnp-bond-6m', 1.01, 929.27),
  ('actual', 'dws-short-duration', 0.84, 772.45),
  ('actual', 'mg-european-credit', 0.80, 730.58),
  ('actual', 'axa-europe-hy', 0.52, 478.46),
  ('actual', 'generali-bond', 0.44, 405.70),
  ('actual', 'axa-credit-sdx', 0.28, 261.05),
  ('actual', 'axa-credit-sdi', 0.28, 258.70),
  ('actual', 'sabadell-usa-bolsa', 0.72, 657.45),
  ('actual', 'jpm-america-equity', 0.32, 294.02),
  ('actual', 'amundi-us-growth', 0.12, 107.73),
  ('actual', 'loomis-us-growth', 0.07, 60.53),
  ('actual', 'ab-us-equity', 0.06, 57.95),
  ('actual', 'sabadell-economia-digital', 0.20, 180.00),
  ('actual', 'alma-japan', 0.11, 101.66),
  ('actual', 'amundi-us-value-j21', 0.17, 152.09),
  ('actual', 'ct-us-contrarian', 0.08, 77.87),
  ('actual', 'lazard-capital-sri', 0.36, 328.61),
  ('actual', 'sabadell-europa-futuro', 0.14, 127.63),
  ('actual', 'sabadell-economia-verde', 0.06, 52.58),
  ('actual', 'sabadell-emergente-mixto', 0.30, 272.65),
  ('actual', 'sabadell-bolsas-emergentes', 0.20, 180.32),
  ('actual', 'jpm-em-local', 0.23, 214.59),
  ('actual', 'amundi-abs-multi', 0.23, 211.14),
  ('actual', 'amundi-commodities', 0.06, 54.30),
  ('actual', 'sabadell-sel-alternativa', 2.37, 2173.73),
  ('actual', 'sabadell-espana-futuro', 0.00, 3.19)
ON CONFLICT (portfolio_id, fund_id) DO NOTHING;

-- COMPOSICION CARTERA OBJETIVO
INSERT INTO portfolio_funds (portfolio_id, fund_id, target_weight, initial_amount) VALUES
  ('objetivo', 'nb-short-duration', 20.7, 18988.00),
  ('objetivo', 'schroder-euro-credit', 13.8, 12658.00),
  ('objetivo', 'jpm-us-equity-focus', 16.1, 14768.00),
  ('objetivo', 'amundi-us-equity-value', 9.2, 8439.00),
  ('objetivo', 'eleva-european', 10.4, 9494.00),
  ('objetivo', 'sabadell-euroaccion', 4.6, 4219.00),
  ('objetivo', 'mfs-meridian-em-debt', 5.2, 4747.00),
  ('objetivo', 'nb-em-debt-hard', 4.8, 4430.00),
  ('objetivo', 'ofi-precious-metals', 6.3, 5802.00),
  ('objetivo', 'man-alpha-alternative', 2.0, 1793.00),
  ('objetivo', 'atlas-infrastructure', 1.7, 1582.00),
  ('objetivo', 'sabadell-prudente-residual', 5.2, 4747.00)
ON CONFLICT (portfolio_id, fund_id) DO NOTHING;

-- TRASPASOS - MES 1 (MAYO 2026)
INSERT INTO transfers (month_num, phase, from_fund_id, to_fund_id, planned_amount, status) VALUES
  (1, 'A', 'sabadell-interes-euro', 'nb-short-duration', 4780.29, 'pending'),
  (1, 'A', 'sabadell-bonos-euro', 'nb-short-duration', 3136.46, 'pending'),
  (1, 'A', 'sabadell-euro-yield', 'nb-short-duration', 1379.31, 'pending'),
  (1, 'A', 'sabadell-bonos-flotantes', 'nb-short-duration', 788.26, 'pending'),
  (1, 'A', 'amundi-abs-responsible', 'nb-short-duration', 742.06, 'pending'),
  (1, 'A', 'eurizon-euro-bond', 'nb-short-duration', 707.31, 'pending'),
  (1, 'A', 'sabadell-bonos-sos', 'nb-short-duration', 510.31, 'pending'),
  (1, 'A', 'muzinich-yield', 'nb-short-duration', 476.19, 'pending'),
  (1, 'A', 'sabadell-dolar-fijo', 'nb-short-duration', 316.93, 'pending');

-- TRASPASOS - MES 2 (JUNIO 2026)
INSERT INTO transfers (month_num, phase, from_fund_id, to_fund_id, planned_amount, status) VALUES
  (2, 'A', 'bnp-bond-6m', 'schroder-euro-credit', 929.27, 'pending'),
  (2, 'A', 'dws-short-duration', 'schroder-euro-credit', 772.45, 'pending'),
  (2, 'A', 'mg-european-credit', 'schroder-euro-credit', 730.58, 'pending'),
  (2, 'A', 'axa-europe-hy', 'schroder-euro-credit', 478.46, 'pending'),
  (2, 'A', 'generali-bond', 'schroder-euro-credit', 405.70, 'pending'),
  (2, 'A', 'axa-credit-sdx', 'schroder-euro-credit', 261.05, 'pending'),
  (2, 'A', 'axa-credit-sdi', 'schroder-euro-credit', 258.70, 'pending'),
  (2, 'A', 'sabadell-usa-bolsa', 'jpm-us-equity-focus', 657.45, 'pending'),
  (2, 'A', 'jpm-america-equity', 'jpm-us-equity-focus', 294.02, 'pending');

-- TRASPASOS - MES 3 (JULIO 2026)
INSERT INTO transfers (month_num, phase, from_fund_id, to_fund_id, planned_amount, status) VALUES
  (3, 'B', 'amundi-us-growth', 'jpm-us-equity-focus', 107.73, 'pending'),
  (3, 'B', 'loomis-us-growth', 'jpm-us-equity-focus', 60.53, 'pending'),
  (3, 'B', 'ab-us-equity', 'jpm-us-equity-focus', 57.95, 'pending'),
  (3, 'B', 'sabadell-economia-digital', 'jpm-us-equity-focus', 180.00, 'pending'),
  (3, 'B', 'alma-japan', 'jpm-us-equity-focus', 101.66, 'pending'),
  (3, 'B', 'amundi-us-value-j21', 'amundi-us-equity-value', 152.09, 'pending'),
  (3, 'B', 'ct-us-contrarian', 'amundi-us-equity-value', 77.87, 'pending'),
  (3, 'B', 'lazard-capital-sri', 'eleva-european', 328.61, 'pending'),
  (3, 'B', 'sabadell-europa-futuro', 'eleva-european', 127.63, 'pending');

-- TRASPASOS - MES 4 (AGOSTO 2026)
INSERT INTO transfers (month_num, phase, from_fund_id, to_fund_id, planned_amount, status) VALUES
  (4, 'B', 'sabadell-economia-verde', 'eleva-european', 52.58, 'pending'),
  (4, 'B', 'sabadell-emergente-mixto', 'mfs-meridian-em-debt', 272.65, 'pending'),
  (4, 'B', 'sabadell-bolsas-emergentes', 'mfs-meridian-em-debt', 180.32, 'pending'),
  (4, 'B', 'jpm-em-local', 'nb-em-debt-hard', 214.59, 'pending'),
  (4, 'B', 'amundi-abs-multi', 'man-alpha-alternative', 211.14, 'pending'),
  (4, 'B', 'amundi-commodities', 'ofi-precious-metals', 54.30, 'pending'),
  (4, 'B', 'sabadell-sel-alternativa', 'atlas-infrastructure', 1485.78, 'pending'),
  (4, 'B', 'sabadell-sel-alternativa', 'man-alpha-alternative', 687.95, 'pending'),
  (4, 'B', 'sabadell-espana-futuro', 'sabadell-euroaccion', 3.19, 'pending');

-- TRASPASOS - MES 5 (SEPTIEMBRE 2026)
INSERT INTO transfers (month_num, phase, from_fund_id, to_fund_id, planned_amount, status) VALUES
  (5, 'C', 'sabadell-rendimiento', 'nb-short-duration', 5079.22, 'pending'),
  (5, 'C', 'sabadell-rendimiento', 'ofi-precious-metals', 5705.09, 'pending'),
  (5, 'C', 'sabadell-rendimiento', 'jpm-us-equity-focus', 2685.69, 'pending'),
  (5, 'C', 'sabadell-consolida94', 'mfs-meridian-em-debt', 4203.57, 'pending'),
  (5, 'C', 'sabadell-consolida94', 'nb-em-debt-hard', 4139.41, 'pending'),
  (5, 'C', 'sabadell-consolida94', 'sabadell-euroaccion', 2107.41, 'pending'),
  (5, 'C', 'sabadell-prudente', 'schroder-euro-credit', 8264.44, 'pending'),
  (5, 'C', 'sabadell-prudente', 'amundi-us-equity-value', 8090.47, 'pending');

-- TRASPASOS - MES 6 (OCTUBRE 2026)
INSERT INTO transfers (month_num, phase, from_fund_id, to_fund_id, planned_amount, status) VALUES
  (6, 'C', 'sabadell-prudente', 'jpm-us-equity-focus', 10407.05, 'pending'),
  (6, 'C', 'sabadell-prudente', 'eleva-european', 8933.52, 'pending'),
  (6, 'C', 'sabadell-prudente', 'sabadell-euroaccion', 1996.04, 'pending'),
  (6, 'C', 'sabadell-prudente', 'man-alpha-alternative', 489.91, 'pending'),
  (6, 'C', 'sabadell-prudente', 'atlas-infrastructure', 48.26, 'pending');

-- SNAPSHOT INICIAL (Abril 2026)
INSERT INTO portfolio_snapshots (portfolio_id, date, total_value, daily_change, daily_change_pct) VALUES
  ('actual', '2026-04-21', 91664.82, 0, 0),
  ('objetivo', '2026-04-21', 91664.82, 0, 0)
ON CONFLICT (portfolio_id, date) DO NOTHING;
