CREATE TABLE public."BloggerBans"
(
    "blogId" integer NOT NULL,
    "userId" integer NOT NULL,
    reason character varying,
    date timestamp without time zone,
    status boolean NOT NULL,
    FOREIGN KEY ("blogId")
        REFERENCES public."Blogs" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public."BloggerBans"
    OWNER to nodejs;