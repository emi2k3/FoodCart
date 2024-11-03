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
    foto varchar(255) null,
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
    foto varchar(255) null,
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
    nombre varchar(20) not null,
    descripcion varchar(300) not null,
    precio_unidad numeric(10,2) not null,
    id_categoria integer not null,
    foto varchar(255) null,  -- para almacenar la ruta o URL de la imagen
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
    id_producto integer not null,
    CONSTRAINT fk_local FOREIGN KEY (id_local) 
        REFERENCES local(id_local) ON DELETE RESTRICT,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id) ON DELETE RESTRICT,
    CONSTRAINT fk_producto FOREIGN KEY (id_producto) 
        REFERENCES producto(id_producto) ON DELETE RESTRICT
);


INSERT INTO telefono (numeroTel) VALUES('099482111');
INSERT INTO direccion (numero,calle) VALUES('123','vibaracha');

INSERT INTO usuario (nombre,apellido,email,id_direccion,id_telefono,contraseña) VALUES('ad','min','admin@example.com',1,1,crypt('Contraseña123!', gen_salt('bf')));
UPDATE usuario SET admin=true WHERE id=1;

INSERT INTO categoria (nombre) VALUES('COMIDA');