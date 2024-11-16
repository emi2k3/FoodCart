CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear tabla de telefono sin la clave foránea al usuario inicialmente
create table if not exists telefono (
    id serial primary key,
    numeroTel varchar(20) not null
);

-- Crear tabla de direccion sin la clave foránea al usuario inicialmente
create table if not exists direccion (
    id serial primary key,
    numero varchar(10) not null,
    calle varchar(20) not null,
    apto varchar(5) null
);

-- Crear la tabla LOCAL
create table if not exists local (
    id_local serial primary key,
    nombre varchar(20) not null,
    id_telefono integer not null,
    id_direccion integer not null,
    foto boolean null,
    CONSTRAINT fk_telefono FOREIGN KEY(id_telefono) REFERENCES telefono(id) on delete cascade,
    CONSTRAINT fk_direccion FOREIGN KEY(id_direccion) REFERENCES direccion(id) on delete cascade
);

-- Crear la tabla usuario que hará referencia a direccion y telefono más adelante
create table if not exists usuario (
    id serial primary key,
    nombre varchar(20) not null,
    apellido varchar(20) not null,
    email varchar(50) not null unique,
    id_direccion integer not null,
    id_telefono integer not null,
    contraseña varchar(225) not null,
    foto boolean null,
    admin boolean not null default FALSE
);

CREATE TABLE if not exists usuarios_direcciones (
    id_usuario INT,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) on delete cascade,
    id_direccion INT,
    CONSTRAINT fk_direccion FOREIGN KEY (id_direccion) REFERENCES direccion(id) on delete cascade
);

-- Alterar tabla usuario para añadir claves foráneas a direccion y telefono
alter table usuario 
    ADD CONSTRAINT fk_telefono FOREIGN KEY (id_telefono) REFERENCES telefono(id),
    ADD CONSTRAINT fk_direccion FOREIGN KEY (id_direccion) REFERENCES direccion(id);

create table categoria (
    id_categoria serial PRIMARY KEY,
    nombre VARCHAR(15) CHECK (nombre IN ('BEBIDA', 'COMIDA', 'ACOMPAÑAMIENTO'))
);

create table if not exists producto (
    id_producto serial primary key,
    nombre varchar(50) not null,
    descripcion varchar(300) not null,
    precio_unidad numeric(10,2) not null,
    id_categoria integer not null,
    foto boolean null, 
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) 
        REFERENCES categoria(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT precio_positivo CHECK (precio_unidad > 0)
); 

create table if not exists pedido (
    id_pedido serial primary key,
    fecha_hora timestamp default current_timestamp,
    estado varchar(15) CHECK (estado IN ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO')),
    importe_total numeric(10,2) CHECK (importe_total >= 0),
    id_local integer not null,
    id_usuario integer not null,
    CONSTRAINT fk_local FOREIGN KEY (id_local) 
        REFERENCES local(id_local) ON DELETE RESTRICT,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id) ON DELETE RESTRICT
);

create table if not exists detalle_pedido (
	cantidad integer not null, 
	indicaciones varchar(200) null, 
	id_pedido integer not null, 
	id_producto integer not null, 
 	CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) 
        REFERENCES pedido(id_pedido) ON DELETE RESTRICT,
    CONSTRAINT fk_producto FOREIGN KEY (id_producto) 
        REFERENCES producto(id_producto) ON DELETE RESTRICT
);

INSERT INTO telefono (numeroTel) VALUES('099482111');
INSERT INTO direccion (numero,calle) VALUES('123','vibaracha');

INSERT INTO usuario (nombre,apellido,email,id_direccion,id_telefono,contraseña) VALUES('ad','min','admin@example.com',1,1,crypt('Contraseña123!', gen_salt('bf')));
UPDATE usuario SET admin=true WHERE id=1;

INSERT INTO categoria (nombre) VALUES('COMIDA');
INSERT INTO categoria (nombre) VALUES('BEBIDA');
INSERT INTO categoria (nombre) VALUES('ACOMPAÑAMIENTO');
INSERT INTO producto (nombre, descripcion, precio_unidad, id_categoria, foto) 
VALUES
('Hamburguesa Clásica', 'Hamburguesa con carne de res, lechuga, tomate y queso cheddar', 350, 1, true),
('Hamburguesa BBQ', 'Hamburguesa con carne de res, salsa BBQ, cebolla crujiente y queso suizo', 300, 1,true),
('Pancho', 'Frankfurter en pan con mostaza y ketchup', 200, 1, true),
('Pancho con Queso', 'Frankfurter con queso derretido y jalapeños', 220, 1, true),
('Hamburguesa Doble', 'Hamburguesa doble carne con queso y bacon', 400, 1, true),
('Hamburguesa Vegetariana', 'Hamburguesa con hamburguesa de lentejas y verduras frescas', 450, 1, true),
('Coca-cola', 'Coca de 500ml', 70, 2, true),
('Agua Mineral', 'Botella de agua mineral de 500ml', 50, 2, true);

INSERT INTO telefono (numeroTel) VALUES('098777234');
INSERT INTO direccion (numero,calle) VALUES('450','Brasil');
INSERT INTO local (nombre,id_telefono,id_direccion) VALUES('Barsito',2,2);
INSERT INTO pedido (estado,importe_total,id_local,id_usuario) VALUES('CONFIRMADO',200,1,1);
INSERT INTO detalle_pedido (cantidad,indicaciones,id_pedido,id_producto) VALUES(1,'Sin mostaza el pancho',1,3);
INSERT INTO pedido (estado,importe_total,id_local,id_usuario) VALUES('CONFIRMADO',220,1,1);
INSERT INTO detalle_pedido (cantidad,indicaciones,id_pedido,id_producto) VALUES(1,'Sin pan,sin mostaza, sin pancho, sinnnnnnnnnnnnnnnnn',2,4);
INSERT INTO detalle_pedido (cantidad,indicaciones,id_pedido,id_producto) VALUES(2,'Sin pan,sin mostaza, con pancho',2,3);


