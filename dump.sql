PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE cliente (
 	id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
 	nombre TEXT NOT NULL,
 	apellido TEXT NOT NULL,
 	dni TEXT UNIQUE NOT NULL,
 	email TEXT,
 	telefono TEXT
 );
INSERT INTO cliente VALUES(1,'Juan','Pérez','30111222','juan.perez@email.com','1123456789');
INSERT INTO cliente VALUES(2,'María','Gómez','30222333','maria.gomez@email.com','1134567890');
INSERT INTO cliente VALUES(3,'Carlos','Rodríguez','29333444','carlos.rodriguez@email.com','1145678901');
INSERT INTO cliente VALUES(4,'Laura','Fernández','31444555','laura.fernandez@email.com','1156789012');
INSERT INTO cliente VALUES(5,'Diego','López','28555666','diego.lopez@email.com','1167890123');
INSERT INTO cliente VALUES(6,'Sofía','Martínez','32666777','sofia.martinez@email.com','1178901234');
INSERT INTO cliente VALUES(7,'Martín','García','29777888','martin.garcia@email.com','1189012345');
INSERT INTO cliente VALUES(8,'Ana','Sánchez','33888999','ana.sanchez@email.com','1190123456');
INSERT INTO cliente VALUES(9,'Federico','Romero','30999000','federico.romero@email.com','1101234567');
INSERT INTO cliente VALUES(10,'Valentina','Torres','32100111','valentina.torres@email.com','1112345678');
CREATE TABLE poliza (
    id_poliza INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_poliza TEXT NOT NULL UNIQUE,
    id_cliente INTEGER NOT NULL,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    estado TEXT NOT NULL,

    FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
);
INSERT INTO poliza VALUES(1,'AP-0001',1,'2026-01-01','2026-12-31','Vigente');
INSERT INTO poliza VALUES(2,'AP-0002',2,'2026-01-15','2027-01-14','Vigente');
INSERT INTO poliza VALUES(3,'AP-0003',3,'2026-02-01','2027-01-31','Vigente');
INSERT INTO poliza VALUES(4,'AP-0004',4,'2026-02-15','2027-02-14','Vigente');
INSERT INTO poliza VALUES(5,'AP-0005',5,'2026-03-01','2027-02-28','Vigente');
INSERT INTO poliza VALUES(6,'AP-0006',6,'2026-03-15','2027-03-14','Vigente');
INSERT INTO poliza VALUES(7,'AP-0007',7,'2026-04-01','2027-03-31','Vigente');
INSERT INTO poliza VALUES(8,'AP-0008',8,'2026-04-15','2027-04-14','Vigente');
INSERT INTO poliza VALUES(9,'AP-0009',9,'2026-05-01','2027-04-30','Vigente');
INSERT INTO poliza VALUES(10,'AP-0010',10,'2026-05-15','2027-05-14','Vigente');
CREATE TABLE cobertura (
    id_cobertura INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT
);
INSERT INTO cobertura VALUES(1,'Muerte accidental','Indemnización por fallecimiento como consecuencia de un accidente.');
INSERT INTO cobertura VALUES(2,'Invalidez total','Cobertura ante invalidez total permanente derivada de un accidente.');
INSERT INTO cobertura VALUES(3,'Invalidez parcial','Cobertura ante invalidez parcial permanente derivada de un accidente.');
INSERT INTO cobertura VALUES(4,'Gastos médicos','Reintegro de gastos médicos ocasionados por accidentes.');
INSERT INTO cobertura VALUES(5,'Renta diaria por internación','Pago de una renta diaria durante la internación por accidente.');
CREATE TABLE siniestro (
    id_siniestro INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poliza INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT NOT NULL,

    FOREIGN KEY (id_poliza)
        REFERENCES poliza(id_poliza)
);
INSERT INTO siniestro VALUES(1,1,'2026-03-10','Accidente laboral','Caída durante la jornada laboral con lesión en el brazo.','Cerrado');
INSERT INTO siniestro VALUES(2,2,'2026-04-05','Accidente doméstico','Caída en el domicilio que provocó una lesión en la pierna.','En evaluación');
INSERT INTO siniestro VALUES(3,3,'2026-04-20','Accidente de tránsito','Colisión entre automóvil y motocicleta.','Cerrado');
INSERT INTO siniestro VALUES(4,4,'2026-05-10','Accidente laboral','Lesión en la espalda durante el traslado de mercadería.','En evaluación');
INSERT INTO siniestro VALUES(5,5,'2026-05-25','Accidente deportivo','Lesión de rodilla durante una actividad deportiva.','Cerrado');
INSERT INTO siniestro VALUES(6,6,'2026-06-01','Accidente doméstico','Caída por escaleras dentro del domicilio.','Denunciado');
INSERT INTO siniestro VALUES(7,7,'2026-06-15','Accidente de tránsito','Accidente automovilístico con lesiones leves.','En evaluación');
INSERT INTO siniestro VALUES(8,8,'2026-07-01','Accidente laboral','Golpe en la mano mientras realizaba tareas laborales.','Cerrado');
INSERT INTO siniestro VALUES(9,9,'2026-07-20','Accidente deportivo','Lesión muscular durante actividad física.','Denunciado');
INSERT INTO siniestro VALUES(10,10,'2026-08-05','Accidente doméstico','Caída dentro del domicilio con lesión en el tobillo.','En evaluación');
CREATE TABLE pago (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_poliza INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    importe REAL NOT NULL,
    estado TEXT NOT NULL,

    FOREIGN KEY (id_poliza)
        REFERENCES poliza(id_poliza)
);
INSERT INTO pago VALUES(1,1,'2026-01-05',25000.0,'Pagado');
INSERT INTO pago VALUES(2,1,'2026-02-05',25000.0,'Pagado');
INSERT INTO pago VALUES(3,2,'2026-01-20',28000.0,'Pagado');
INSERT INTO pago VALUES(4,2,'2026-02-20',28000.0,'Pagado');
INSERT INTO pago VALUES(5,3,'2026-02-05',30000.0,'Pagado');
INSERT INTO pago VALUES(6,3,'2026-03-05',30000.0,'Pagado');
INSERT INTO pago VALUES(7,4,'2026-02-20',27000.0,'Pagado');
INSERT INTO pago VALUES(8,5,'2026-03-05',32000.0,'Pagado');
INSERT INTO pago VALUES(9,5,'2026-04-05',32000.0,'Pagado');
INSERT INTO pago VALUES(10,6,'2026-03-20',22000.0,'Pagado');
INSERT INTO pago VALUES(11,6,'2026-04-20',22000.0,'Pendiente');
INSERT INTO pago VALUES(12,7,'2026-04-05',35000.0,'Pagado');
INSERT INTO pago VALUES(13,8,'2026-04-20',26000.0,'Pagado');
INSERT INTO pago VALUES(14,9,'2026-05-05',40000.0,'Pagado');
INSERT INTO pago VALUES(15,10,'2026-05-20',24000.0,'Pendiente');
CREATE TABLE poliza_cobertura (
    id_poliza INTEGER NOT NULL,
    id_cobertura INTEGER NOT NULL,

    PRIMARY KEY (id_poliza, id_cobertura),

    FOREIGN KEY (id_poliza)
        REFERENCES poliza(id_poliza),

    FOREIGN KEY (id_cobertura)
        REFERENCES cobertura(id_cobertura)
);
INSERT INTO poliza_cobertura VALUES(1,1);
INSERT INTO poliza_cobertura VALUES(1,2);
INSERT INTO poliza_cobertura VALUES(1,4);
INSERT INTO poliza_cobertura VALUES(2,1);
INSERT INTO poliza_cobertura VALUES(2,3);
INSERT INTO poliza_cobertura VALUES(2,4);
INSERT INTO poliza_cobertura VALUES(3,1);
INSERT INTO poliza_cobertura VALUES(3,2);
INSERT INTO poliza_cobertura VALUES(3,4);
INSERT INTO poliza_cobertura VALUES(3,5);
INSERT INTO poliza_cobertura VALUES(4,1);
INSERT INTO poliza_cobertura VALUES(4,3);
INSERT INTO poliza_cobertura VALUES(4,5);
INSERT INTO poliza_cobertura VALUES(5,1);
INSERT INTO poliza_cobertura VALUES(5,2);
INSERT INTO poliza_cobertura VALUES(5,3);
INSERT INTO poliza_cobertura VALUES(5,4);
INSERT INTO poliza_cobertura VALUES(6,1);
INSERT INTO poliza_cobertura VALUES(6,4);
INSERT INTO poliza_cobertura VALUES(7,1);
INSERT INTO poliza_cobertura VALUES(7,2);
INSERT INTO poliza_cobertura VALUES(7,5);
INSERT INTO poliza_cobertura VALUES(8,1);
INSERT INTO poliza_cobertura VALUES(8,3);
INSERT INTO poliza_cobertura VALUES(8,4);
INSERT INTO poliza_cobertura VALUES(9,1);
INSERT INTO poliza_cobertura VALUES(9,2);
INSERT INTO poliza_cobertura VALUES(9,3);
INSERT INTO poliza_cobertura VALUES(9,4);
INSERT INTO poliza_cobertura VALUES(9,5);
INSERT INTO poliza_cobertura VALUES(10,1);
INSERT INTO poliza_cobertura VALUES(10,4);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('cliente',11);
INSERT INTO sqlite_sequence VALUES('cobertura',5);
INSERT INTO sqlite_sequence VALUES('poliza',11);
INSERT INTO sqlite_sequence VALUES('pago',15);
INSERT INTO sqlite_sequence VALUES('siniestro',11);
COMMIT;
