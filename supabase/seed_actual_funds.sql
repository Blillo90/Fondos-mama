-- Seed: fondos de la cartera actual (extraídos de Plan_Migracion_6_Meses_2026.pdf)
-- Ejecutar en Supabase SQL Editor. ON CONFLICT DO NOTHING evita duplicados.

-- 1. Insertar fondos en tabla 'funds'
INSERT INTO funds (id, name, isin, category, cagr, sharpe, ter, rent_2025, notes) VALUES
  ('sabadell-interes-euro',     'Sabadell Interés Euro',                'ES0174403008', 'RF Corto',        null, null, null, 2.80,  'Traspaso Mes 1 → NB Short Duration'),
  ('sabadell-bonos-euro',       'Sabadell Bonos Euro',                  'ES0173828007', 'RF Corto',        null, null, null, null,  'Traspaso Mes 1'),
  ('sabadell-euro-yield',       'Sabadell Euro Yield',                  'ES0184976001', 'RF Corto',        null, null, null, null,  'Traspaso Mes 1'),
  ('sabadell-bonos-flotantes',  'Sabadell Bonos Flotantes Euro',        'ES0174356016', 'RF Corto',        null, null, null, null,  'Traspaso Mes 1'),
  ('amundi-abs-responsible',    'Amundi ABS Responsible',               'FR0010319996', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 1'),
  ('eurizon-euro-bond',         'Eurizon Fund II Euro Bond Z',          'LU0278427041', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 1'),
  ('sabadell-bonos-sostenibles','Sabadell Bonos Sostenibles España',    'ES0158862021', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 1'),
  ('muzinich-enhanced-yield',   'Muzinich Enhanced Yield ST',           'IE00BYXHR262', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 1'),
  ('bnp-enhanced-bond',         'BNP Paribas Enhanced Bond 6M',        'LU0325598752', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 2'),
  ('dws-short-duration',        'DWS Short Duration Credit IC',         'LU0982752155', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 2'),
  ('mg-european-credit',        'M&G European Credit QI',               'LU2188668326', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 2'),
  ('axa-europe-high-yield',     'AXA IM Europe SD High Yield',          'LU0658025209', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 2'),
  ('generali-euro-bond',        'Generali Euro Bond 1-3 Years G',      'LU1373301057', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 2'),
  ('axa-euro-credit-x',         'AXA WF Euro Credit SD X',             'LU1601096537', 'RF Crédito',      null, null, null, null,  'Traspaso Mes 2'),
  ('sabadell-estados-unidos',   'Sabadell Estados Unidos Bolsa',        'ES0138983004', 'RV EEUU',         null, null, null, null,  'Traspaso Mes 2'),
  ('jpm-america-equity',        'JPM America Equity',                   'LU1734444273', 'RV EEUU',         null, null, -1.54,null,  'Traspaso Mes 2. -1.54% en 2025'),
  ('loomis-us-growth',          'Loomis Sayles US Growth Equity S1',    'LU1435387458', 'RV EEUU',         null, null, null, null,  'Traspaso Mes 3'),
  ('sabadell-economia-digital', 'Sabadell Economía Digital',            'ES0138528015', 'RV EEUU',         null, null, null, null,  'Traspaso Mes 3'),
  ('alma-eikoh-japan',          'Alma Eikoh Japan Large Cap Equity',    'LU1870374508', 'RV Japón',        null, null, null, null,  'Traspaso Mes 3'),
  ('amundi-us-research-value',  'Amundi US Equity Research Value J21',  'LU2931223932', 'RV EEUU',         null, null, null, 2.58,  'Traspaso Mes 3'),
  ('lazard-capital-sri',        'Lazard Capital SRI SC',                'FR0013311446', 'RV Europa',       null, null, null, null,  'Traspaso Mes 3'),
  ('sabadell-emergente-mixto',  'Sabadell Emergente Mixto Flexible',    'ES0105142006', 'RF Emergente',    null, null, null, 6.14,  'Traspaso Mes 4'),
  ('jpm-em-local',              'JPM EM Local Currency Debt',           'LU0804757648', 'RF Emergente',    null, null, null, null,  'Traspaso Mes 4'),
  ('amundi-multi-strategy',     'Amundi ABS Ret Multi-Strategy J',      'LU1882440925', 'Alternativo',     null, null, null, null,  'Traspaso Mes 4'),
  ('amundi-commodities',        'Amundi SF EUR Commodities R',          'LU1706853931', 'Materias Primas', null, null, null, null,  'Traspaso Mes 4'),
  ('sabadell-rendimiento',      'Sabadell Rendimiento',                 'ES0173829039', 'Mixto',           null, null, null, null,  'Traspaso Mes 5 (~13.470€)'),
  ('sabadell-consolida-94',     'Sabadell Consolida 94',                'ES0111203008', 'Mixto',           null, null, null, null,  'Traspaso Mes 5 (~10.450€)')
ON CONFLICT (id) DO NOTHING;

-- Actualizar ISINs de fondos ya existentes en DB
UPDATE funds SET isin = 'LU0957798324' WHERE id = 'ct-us-contrarian'        AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0111187003' WHERE id = 'sabadell-prudente'        AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0175083007' WHERE id = 'sabadell-bolsas-emergentes' AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0138529013' WHERE id = 'sabadell-economia-verde'  AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0183339003' WHERE id = 'sabadell-europa-futuro'   AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'LU1764069099' WHERE id = 'ab-us-equity'             AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0138950003' WHERE id = 'sabadell-dolar-fijo'      AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0111092005' WHERE id = 'sabadell-espana-futuro'   AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'ES0182282014' WHERE id = 'sabadell-sel-alternativa' AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'LU2732984955' WHERE id = 'amundi-us-growth'         AND (isin IS NULL OR isin = '');
UPDATE funds SET isin = 'LU0227127643' WHERE id = 'axa-credit-sdi'           AND (isin IS NULL OR isin = '');

-- 2. Insertar en portfolio_funds los fondos que faltan
-- Los ya existentes se saltan con ON CONFLICT DO NOTHING
INSERT INTO portfolio_funds (id, portfolio_id, fund_id, target_weight, initial_amount) VALUES
  (gen_random_uuid(), 'actual', 'sabadell-interes-euro',     5.22,  4780.29),
  (gen_random_uuid(), 'actual', 'sabadell-bonos-euro',       3.42,  3136.46),
  (gen_random_uuid(), 'actual', 'sabadell-euro-yield',       1.50,  1379.31),
  (gen_random_uuid(), 'actual', 'sabadell-bonos-flotantes',  0.86,   788.26),
  (gen_random_uuid(), 'actual', 'amundi-abs-responsible',    0.81,   742.06),
  (gen_random_uuid(), 'actual', 'eurizon-euro-bond',         0.77,   707.31),
  (gen_random_uuid(), 'actual', 'sabadell-bonos-sostenibles',0.56,   510.31),
  (gen_random_uuid(), 'actual', 'muzinich-enhanced-yield',   0.52,   476.19),
  (gen_random_uuid(), 'actual', 'bnp-enhanced-bond',         1.01,   929.27),
  (gen_random_uuid(), 'actual', 'dws-short-duration',        0.84,   772.45),
  (gen_random_uuid(), 'actual', 'mg-european-credit',        0.80,   730.58),
  (gen_random_uuid(), 'actual', 'axa-europe-high-yield',     0.52,   478.46),
  (gen_random_uuid(), 'actual', 'generali-euro-bond',        0.44,   405.70),
  (gen_random_uuid(), 'actual', 'axa-euro-credit-x',         0.28,   261.05),
  (gen_random_uuid(), 'actual', 'axa-credit-sdi',            0.28,   258.70),
  (gen_random_uuid(), 'actual', 'sabadell-estados-unidos',   0.72,   657.45),
  (gen_random_uuid(), 'actual', 'jpm-america-equity',        0.32,   294.02),
  (gen_random_uuid(), 'actual', 'amundi-us-growth',          0.12,   107.73),
  (gen_random_uuid(), 'actual', 'loomis-us-growth',          0.07,    60.53),
  (gen_random_uuid(), 'actual', 'ab-us-equity',              0.06,    57.95),
  (gen_random_uuid(), 'actual', 'sabadell-economia-digital', 0.20,   180.00),
  (gen_random_uuid(), 'actual', 'alma-eikoh-japan',          0.11,   101.66),
  (gen_random_uuid(), 'actual', 'amundi-us-research-value',  0.17,   152.09),
  (gen_random_uuid(), 'actual', 'ct-us-contrarian',          0.08,    77.87),
  (gen_random_uuid(), 'actual', 'lazard-capital-sri',        0.36,   328.61),
  (gen_random_uuid(), 'actual', 'sabadell-bolsas-emergentes',0.20,   180.32),
  (gen_random_uuid(), 'actual', 'sabadell-emergente-mixto',  0.30,   272.65),
  (gen_random_uuid(), 'actual', 'jpm-em-local',              0.23,   214.59),
  (gen_random_uuid(), 'actual', 'amundi-multi-strategy',     0.23,   211.14),
  (gen_random_uuid(), 'actual', 'amundi-commodities',        0.06,    54.30),
  (gen_random_uuid(), 'actual', 'sabadell-sel-alternativa',  2.37,  2173.73),
  (gen_random_uuid(), 'actual', 'sabadell-espana-futuro',    0.00,     3.19),
  (gen_random_uuid(), 'actual', 'sabadell-rendimiento',     14.69, 13470.00),
  (gen_random_uuid(), 'actual', 'sabadell-consolida-94',    11.40, 10450.39),
  (gen_random_uuid(), 'actual', 'sabadell-prudente',        46.88, 42977.00),
  (gen_random_uuid(), 'actual', 'sabadell-economia-verde',   0.06,    52.58),
  (gen_random_uuid(), 'actual', 'sabadell-europa-futuro',    0.14,   127.63),
  (gen_random_uuid(), 'actual', 'sabadell-dolar-fijo',       0.35,   316.93)
ON CONFLICT DO NOTHING;
