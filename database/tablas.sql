-- =====================================================
-- Sistema de Citas, Refacciones y Expedientes
-- para un Taller Automotriz
-- Script 1: Creación de la base de datos y las tablas
-- =====================================================

-- Ejecutar primero (conectado a la base "postgres"):
-- CREATE DATABASE taller_automotriz;

-- Después, conectarse a "taller_automotriz" y ejecutar lo siguiente:

-- Borra las tablas si ya existían (permite volver a ejecutar el script)
DROP TABLE IF EXISTS citas, servicios, mecanicos, vehiculos;

-- Tabla: servicios
CREATE TABLE servicios (
    id_servicio         SERIAL PRIMARY KEY,
    nombre_servicio     VARCHAR(100)   NOT NULL,
    costo_base          NUMERIC(10,2)  NOT NULL,
    tiempo_estimado_min INTEGER        NOT NULL   -- tiempo estimado en minutos
);

-- Tabla: mecanicos
CREATE TABLE mecanicos (
    id_mecanico       SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    especialidad      VARCHAR(100) NOT NULL,
    anios_experiencia INTEGER      NOT NULL
);

-- Tabla: vehiculos
CREATE TABLE vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    placas      VARCHAR(15)  NOT NULL UNIQUE,
    marca       VARCHAR(50)  NOT NULL,
    modelo      VARCHAR(50)  NOT NULL,
    anio        INTEGER      NOT NULL
);

-- Tabla: citas (tabla principal, relaciona las otras tres)
CREATE TABLE citas (
    id_cita     SERIAL PRIMARY KEY,
    fecha_hora  TIMESTAMP NOT NULL,
    id_vehiculo INTEGER   NOT NULL,
    id_mecanico INTEGER   NOT NULL,
    id_servicio INTEGER   NOT NULL,
    CONSTRAINT fk_cita_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculos (id_vehiculo),
    CONSTRAINT fk_cita_mecanico FOREIGN KEY (id_mecanico) REFERENCES mecanicos (id_mecanico),
    CONSTRAINT fk_cita_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
);
