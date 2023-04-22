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

ALTER TABLE IF EXISTS public."AdminUsersBans"
  OWNER to nodejs;


CREATE TABLE public."AdminBlogsBans"
(
  "blogId" integer NOT NULL,
  status boolean NOT NULL DEFAULT false,
  date timestamp without time zone DEFAULT NULL,
  reason character varying DEFAULT NULL,
  UNIQUE ("blogId"),
  FOREIGN KEY ("blogId")
    REFERENCES public."Blogs" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
      NOT VALID
);

ALTER TABLE IF EXISTS public."AdminBlogsBans"
  OWNER to nodejs;