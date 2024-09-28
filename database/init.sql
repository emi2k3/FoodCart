CREATE EXTENSION IF NOT EXISTS pgcrypto;

create table if not exists usuario (
    id serial primary key,
    nombre varchar(20) not null,
    apellido varchar(20) not null,
    email varchar(50) not null unique,
    id_direccion integer not null,
    id_telefono integer not null,
    contraseña varchar(20) not null
);

create table if not exists telefono (
    id serial primary key,
    id_usuario integer not null,
    numeroTel varchar(20) not null
);

create table if not exists direccion (
    id serial primary key,
    id_usuario integer not null,
    numero varchar(10) not null,
    calle varchar(20) not null,
    apto varchar(5) not null
);

alter table usuario ADD CONSTRAINT fk_telefono FOREIGN KEY (id_telefono) REFERENCES telefono(id);
alter table usuario ADD CONSTRAINT fk_direccion FOREIGN KEY (id_direccion) REFERENCES direccion(id);
alter table telefono ADD CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id);
alter table direccion ADD CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id);


