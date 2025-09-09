-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_alias_key" ON "User"("alias");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Like_postId_idx" ON "Like"("postId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ------------------------------------------------------------
-- METADATA: Comentarios para objetos de BD, tablas e índices
-- ------------------------------------------------------------

-- Esquema
COMMENT ON SCHEMA public IS 'Esquema principal de la aplicación Social Network.';

-- Tabla: User
COMMENT ON TABLE "User" IS 'Usuarios de la red social.';
COMMENT ON COLUMN "User"."id" IS 'Identificador único (UUID como texto).';
COMMENT ON COLUMN "User"."email" IS 'Correo electrónico único del usuario.';
COMMENT ON COLUMN "User"."username" IS 'Nombre de usuario único para autenticación.';
COMMENT ON COLUMN "User"."passwordHash" IS 'Hash SHA-256 de la contraseña.';
COMMENT ON COLUMN "User"."firstName" IS 'Nombre del usuario.';
COMMENT ON COLUMN "User"."lastName" IS 'Apellido del usuario.';
COMMENT ON COLUMN "User"."birthDate" IS 'Fecha de nacimiento.';
COMMENT ON COLUMN "User"."alias" IS 'Alias público y único del usuario.';
COMMENT ON COLUMN "User"."createdAt" IS 'Fecha de creación del registro.';
COMMENT ON COLUMN "User"."updatedAt" IS 'Fecha de última actualización.';
COMMENT ON INDEX "User_email_key" IS 'Índice único por correo electrónico.';
COMMENT ON INDEX "User_username_key" IS 'Índice único por nombre de usuario.';
COMMENT ON INDEX "User_alias_key" IS 'Índice único por alias.';

-- Tabla: Post
COMMENT ON TABLE "Post" IS 'Publicaciones (posts) creadas por los usuarios.';
COMMENT ON COLUMN "Post"."id" IS 'Identificador único (UUID como texto).';
COMMENT ON COLUMN "Post"."message" IS 'Contenido del post.';
COMMENT ON COLUMN "Post"."createdAt" IS 'Fecha de creación del post.';
COMMENT ON COLUMN "Post"."userId" IS 'ID del usuario autor del post.';
COMMENT ON COLUMN "Post"."likeCount" IS 'Contador denormalizado de likes.';
COMMENT ON INDEX "Post_createdAt_idx" IS 'Índice por fecha de creación para ordenados recientes.';
COMMENT ON INDEX "Post_userId_idx" IS 'Índice por autor del post.';

-- Tabla: Like
COMMENT ON TABLE "Like" IS 'Relación de likes de usuarios sobre posts.';
COMMENT ON COLUMN "Like"."id" IS 'Identificador único (UUID como texto).';
COMMENT ON COLUMN "Like"."userId" IS 'ID del usuario que da like.';
COMMENT ON COLUMN "Like"."postId" IS 'ID del post al que se da like.';
COMMENT ON COLUMN "Like"."createdAt" IS 'Fecha en que se creó el like.';
COMMENT ON INDEX "Like_postId_idx" IS 'Índice para consultar likes por post.';
COMMENT ON INDEX "Like_userId_idx" IS 'Índice para consultar likes por usuario.';
COMMENT ON INDEX "Like_userId_postId_key" IS 'Restricción única para evitar likes duplicados.';

-- ------------------------------------------------------------
-- Datos iniciales: Inserción de usuarios de prueba predefinidos
-- Nota: idempotente, no duplica si ya existen por email
-- Contraseñas: 'password' (hash SHA-256)
-- ------------------------------------------------------------

INSERT INTO "User" ("email", "username", "passwordHash", "firstName", "lastName", "birthDate", "alias", "createdAt", "updatedAt")
VALUES (
    'demo1@example.com',
    'demo1',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    'Demo',
    'One',
    '1990-01-01',
    'demo.one',
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "User" ("email", "username", "passwordHash", "firstName", "lastName", "birthDate", "alias", "createdAt", "updatedAt")
VALUES (
    'demo2@example.com',
    'demo2',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    'Demo',
    'Two',
    '1992-02-02',
    'demo.two',
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO NOTHING;
