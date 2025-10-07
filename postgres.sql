-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 1.2.8
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2025-10-07 15:12:11.045483
-- -------------------------------------------------------------

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."anotaciones_clinicas" (
    "id_anotacion" int4 NOT NULL,
    "fecha" varchar NOT NULL,
    "hora" varchar,
    "texto" text NOT NULL,
    "creado_en" timestamp NOT NULL DEFAULT now(),
    "id_turno" int4,
    "id_paciente" int4,
    "id_profesional" int4,
    PRIMARY KEY ("id_anotacion")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."auditoria" (
    "id" int4 NOT NULL,
    "idUsuarioModificado" int4 NOT NULL,
    "fecha" text NOT NULL,
    "usuarioIdUsuario" int4,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."cliente" (
    "id_cliente" int4 NOT NULL,
    "nombre_cliente" text NOT NULL,
    "apellido_cliente" text NOT NULL,
    "telefono_cliente" text NOT NULL,
    "dni" text NOT NULL,
    "genero" text NOT NULL,
    "fecha_alta" text NOT NULL,
    "fecha_ult_upd" text NOT NULL,
    "peso" float8 NOT NULL,
    "altura" float8 NOT NULL,
    "fecha_nacimiento" text NOT NULL,
    "nivel_fisico" text NOT NULL,
    "observaciones" text NOT NULL,
    PRIMARY KEY ("id_cliente")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."clientes_por_servicios" (
    "id" int4 NOT NULL,
    "idClienteIdCliente" int4,
    "id_servicio" int4,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."diagnosticos" (
    "id_diagnostico" int4 NOT NULL,
    "fecha" varchar NOT NULL,
    "estado" varchar NOT NULL DEFAULT 'ACTIVO'::character varying,
    "certeza" varchar NOT NULL DEFAULT 'EN_ESTUDIO'::character varying,
    "codigo_cie" text NOT NULL,
    "sintomas_principales" text NOT NULL,
    "fecha_cierre" varchar,
    "observaciones" text,
    "creado_en" timestamp NOT NULL DEFAULT now(),
    "id_paciente" int4,
    "id_profesional" int4,
    PRIMARY KEY ("id_diagnostico")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."gerente" (
    "id_gerente" int4 NOT NULL,
    "nombre_gerente" varchar,
    "apellido_gerente" varchar,
    "telefono_gerente" varchar,
    "dni" varchar,
    "fecha_alta" varchar,
    "fecha_ult_upd" varchar,
    "id_usuario" int4,
    PRIMARY KEY ("id_gerente")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."medicaciones" (
    "id_medicacion" int4 NOT NULL,
    "farmaco" text NOT NULL,
    "dosis" varchar,
    "frecuencia" varchar,
    "indicacion" text,
    "fecha_inicio" varchar NOT NULL,
    "fecha_fin" varchar,
    "estado" varchar NOT NULL DEFAULT 'ACTIVO'::character varying,
    "creado_en" timestamp NOT NULL DEFAULT now(),
    "id_paciente" int4,
    "id_profesional" int4,
    PRIMARY KEY ("id_medicacion")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."obra_social" (
    "id_os" int4 NOT NULL,
    "nombre" text NOT NULL,
    "fecha_alta" text NOT NULL,
    PRIMARY KEY ("id_os")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."obra_social_por_profesional" (
    "id_opp" int4 NOT NULL,
    "obraSocialIdOs" int4,
    "profesionalIdProfesionales" int4,
    PRIMARY KEY ("id_opp")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."paciente" (
    "id_paciente" int4 NOT NULL,
    "nombre_paciente" text NOT NULL,
    "apellido_paciente" text NOT NULL,
    "telefono_paciente" text NOT NULL,
    "dni" text NOT NULL,
    "genero" text NOT NULL,
    "fecha_nacimiento" text NOT NULL,
    "observaciones" text NOT NULL,
    "estado" bool NOT NULL DEFAULT true,
    "email" text NOT NULL DEFAULT ''::text,
    "nro_obrasocial" int4 NOT NULL DEFAULT 0,
    "obraSocialIdOs" int4,
    PRIMARY KEY ("id_paciente")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."profesionales" (
    "id_profesionales" int4 NOT NULL,
    "nombre_profesional" varchar,
    "apellido_profesional" varchar,
    "email" varchar,
    "telefono" varchar,
    "dni" varchar,
    "genero" varchar,
    "fecha_alta" varchar,
    "fecha_ult_upd" varchar,
    "id_usuario" int4,
    "servicio" text,
    "estado" bool NOT NULL DEFAULT true,
    "hora_inicio_laboral" time NOT NULL DEFAULT '09:00:00'::time without time zone,
    "hora_fin_laboral" time NOT NULL DEFAULT '21:00:00'::time without time zone,
    PRIMARY KEY ("id_profesionales")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."profesionales_por_servicios" (
    "id" int4 NOT NULL,
    "id_profesional" int4,
    "id_servicio" int4,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."recepcionista" (
    "id_recepcionista" int4 NOT NULL,
    "nombre_recepcionista" varchar,
    "apellido_recepcionista" varchar,
    "telefono_recepcionista" varchar,
    "dni" varchar,
    "fecha_alta" varchar,
    "fecha_ult_upd" varchar,
    "id_usuario" int4,
    PRIMARY KEY ("id_recepcionista")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."servicio" (
    "id_servicio" int4 NOT NULL,
    "nombre" varchar,
    PRIMARY KEY ("id_servicio")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."turnos" (
    "id_turno" int4 NOT NULL,
    "fecha" varchar,
    "hora_inicio" varchar,
    "observacion" varchar,
    "estado" varchar,
    "fecha_alta" varchar,
    "fecha_ult_upd" varchar,
    "id_profesional" int4,
    "id_recepcionista" int4,
    "idPacienteIdPaciente" int4,
    PRIMARY KEY ("id_turno")
);

-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Table Definition
CREATE TABLE "public"."usuario" (
    "id_usuario" int4 NOT NULL,
    "email" varchar,
    "rol" varchar,
    "contraseña" varchar,
    PRIMARY KEY ("id_usuario")
);

