-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'DOCTOR';
