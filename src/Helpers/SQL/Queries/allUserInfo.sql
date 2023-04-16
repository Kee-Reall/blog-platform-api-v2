SELECT u.*,c.*,r.*,b.* FROM public."Users" as u
LEFT JOIN public."Confirmation" as c
ON u."id" = c."userId"
LEFT JOIN public."UsersRecovery" as r
ON u."id" = r."userId"
LEFT JOIN public."AdminUsersBans" as b
ON u."id" = b."userId"