-- =====================================================
-- Script 2: Inserción de registros (10 por tabla)
-- =====================================================

INSERT INTO servicios (nombre_servicio, costo_base, tiempo_estimado_min) VALUES
('Afinación mayor',               1800.00, 180),
('Cambio de aceite y filtro',      650.00,  45),
('Frenos (balatas delanteras)',   1200.00,  90),
('Alineación y balanceo',          550.00,  60),
('Cambio de batería',              300.00,  30),
('Diagnóstico por escáner',        450.00,  40),
('Cambio de amortiguadores',      2500.00, 150),
('Servicio de clutch',            3800.00, 300),
('Carga de gas para A/C',          900.00,  60),
('Cambio de banda de distribución',2200.00, 240);

INSERT INTO mecanicos (nombre, especialidad, anios_experiencia) VALUES
('Jorge Ramírez Torres',      'Motor',                    15),
('Luis Hernández Cruz',       'Frenos y suspensión',       8),
('Carlos Mendoza Ruiz',       'Transmisión',              12),
('Miguel Ángel Soto Díaz',    'Sistema eléctrico',         6),
('Ricardo Flores Vega',       'Aire acondicionado',        9),
('Fernando Castillo Ortiz',   'Diagnóstico electrónico',   4),
('Alejandro Morales Peña',    'Afinación',                10),
('Roberto Jiménez Luna',      'Alineación y balanceo',     7),
('Daniel Ortega Silva',       'Motor',                    20),
('Andrés Navarro Reyes',      'Frenos y suspensión',       3);

INSERT INTO vehiculos (placas, marca, modelo, anio) VALUES
('ABC-123-A', 'Nissan',     'Versa',   2019),
('DEF-456-B', 'Chevrolet',  'Aveo',    2018),
('GHI-789-C', 'Volkswagen', 'Jetta',   2020),
('JKL-012-D', 'Toyota',     'Corolla', 2021),
('MNO-345-E', 'Honda',      'Civic',   2017),
('PQR-678-F', 'Ford',       'Ranger',  2022),
('STU-901-G', 'Mazda',      'Mazda 3', 2019),
('VWX-234-H', 'Kia',        'Rio',     2023),
('YZA-567-J', 'Hyundai',    'Accent',  2016),
('BCD-890-K', 'Nissan',     'Sentra',  2020);

INSERT INTO citas (fecha_hora, id_vehiculo, id_mecanico, id_servicio) VALUES
('2026-12-01 09:00', 1,  7, 1),
('2026-12-01 11:30', 2,  1, 2),
('2026-12-02 08:30', 3,  2, 3),
('2026-12-02 13:00', 4,  8, 4),
('2026-12-03 10:00', 5,  4, 5),
('2026-12-03 15:00', 6,  6, 6),
('2026-12-04 09:30', 7, 10, 7),
('2026-12-04 12:00', 8,  3, 8),
('2026-12-05 10:30', 9,  5, 9),
('2026-12-05 14:00', 10, 9, 10);

-- Verificación
SELECT * FROM servicios;
SELECT * FROM mecanicos;
SELECT * FROM vehiculos;
SELECT * FROM citas;
