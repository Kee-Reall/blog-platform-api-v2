CREATE TABLE public."Posts"
(
    id serial NOT NULL,
    "ownerId" integer NOT NULL,
    "blogId" integer NOT NULL,
    content character varying NOT NULL,
    "shortDescription" character varying NOT NULL,
    title character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "isDeleted" boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY ("ownerId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    FOREIGN KEY ("blogId")
        REFERENCES public."Blogs" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public."Posts"
    OWNER to nodejs;