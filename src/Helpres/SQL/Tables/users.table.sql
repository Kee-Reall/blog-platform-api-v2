CREATE TABLE public."Users"
(
    id serial NOT NULL,
    login character varying NOT NULL,
    email character varying NOT NULL,
    hash character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW(),
    "isDeleted" boolean NOT NULL DEFAULT False,
    CONSTRAINT "userId" PRIMARY KEY (id),
    CONSTRAINT login UNIQUE (login),
    CONSTRAINT email UNIQUE (email)
);

ALTER TABLE IF EXISTS public."Users"
    OWNER to nodejs;