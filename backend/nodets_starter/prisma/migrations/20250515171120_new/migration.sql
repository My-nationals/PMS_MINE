-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "PasswordResetStatus" AS ENUM ('PENDING', 'IDLE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "password" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/relaxia-services.appspot.com/o/relaxia-profiles%2Fblank-profile-picture-973460_960_720.webp?alt=media',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verification_code" TEXT,
    "verification_expires" TIMESTAMP(3),
    "password_reset_status" "PasswordResetStatus" NOT NULL DEFAULT 'IDLE',
    "password_reset_code" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "assignedSlotId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slots" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "occupied" BOOLEAN DEFAULT false,
    "description" TEXT,
    "userId" TEXT,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telephone_key" ON "users"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "users_assignedSlotId_key" ON "users"("assignedSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "slots_code_key" ON "slots"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_assignedSlotId_fkey" FOREIGN KEY ("assignedSlotId") REFERENCES "slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_requests" ADD CONSTRAINT "parking_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
