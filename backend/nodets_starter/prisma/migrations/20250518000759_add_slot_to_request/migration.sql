/*
  Warnings:

  - You are about to drop the `parking_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "parking_requests" DROP CONSTRAINT "parking_requests_userId_fkey";

-- DropTable
DROP TABLE "parking_requests";

-- CreateTable
CREATE TABLE "ParkingRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParkingRequest" ADD CONSTRAINT "ParkingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingRequest" ADD CONSTRAINT "ParkingRequest_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
