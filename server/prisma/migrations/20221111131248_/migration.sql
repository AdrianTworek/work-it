-- CreateEnum
CREATE TYPE "NotificationTypeEnum" AS ENUM ('newCandidate', 'feedback');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationTypeEnum" NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "message" TEXT NOT NULL,
    "redirectUrl" TEXT,
    "recipientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_id_recipientId_idx" ON "notifications"("id", "recipientId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
