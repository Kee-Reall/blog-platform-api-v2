CREATE TABLE public."Sessions"
(
    "userId" integer NOT NULL,
    "deviceId" serial NOT NULL,
    "updateDate" date NOT NULL DEFAULT NOW(),
    "lastIP" character varying DEFAULT NULL,
    title character varying,
    UNIQUE ("deviceId"),
    FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public."Sessions"
    OWNER to nodejs;