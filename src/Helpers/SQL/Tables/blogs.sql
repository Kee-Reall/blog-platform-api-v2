CREATE TABLE public."Blogs"
(
    id serial NOT NULL,
    "ownerId" integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    "websiteUrl" character varying NOT NULL,
    "isMembership" boolean NOT NULL DEFAULT false,
    "isDeleted" boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id),
    UNIQUE (id),
    FOREIGN KEY ("ownerId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public."Blogs"
    OWNER to nodejs;