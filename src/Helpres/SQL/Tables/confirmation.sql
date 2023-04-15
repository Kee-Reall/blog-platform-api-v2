CREATE TABLE public."Confirmation"
(
    "userId" integer NOT NULL,
    date timestamp without time zone,
    code character varying,
    status boolean NOT NULL,
    UNIQUE ("userId"),
    FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public."Confirmation"
    OWNER to nodejs;