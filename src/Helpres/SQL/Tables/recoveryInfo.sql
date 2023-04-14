CREATE TABLE public."UsersRecovery"
(
    "userId" integer NOT NULL,
    expiration date DEFAULT NULL,
    code character varying DEFAULT NULL,
    UNIQUE ("userId"),
    FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public."UsersRecovery"
    OWNER to nodejs;