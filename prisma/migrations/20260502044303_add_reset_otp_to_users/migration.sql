-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_otp" TEXT,
ADD COLUMN     "reset_otp_expires" TIMESTAMP(3);
