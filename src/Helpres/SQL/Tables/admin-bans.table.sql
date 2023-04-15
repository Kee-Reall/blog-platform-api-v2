CREATE TABLE public."AdminUsersBans"
(
    "userId" integer NOT NULL,
    reason character varying DEFAULT null,
    date timestamp without time zone,
    status boolean NOT NULL DEFAULT false,
    UNIQUE ("userId"),
    FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public."AdminBans"
    OWNER to nodejs;