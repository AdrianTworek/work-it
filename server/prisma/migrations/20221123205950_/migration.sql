-- CreateTable
CREATE TABLE "recruitmentSteps" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "importanceLevel" INTEGER NOT NULL,

    CONSTRAINT "recruitmentSteps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "recruitmentStepId" TEXT NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recruitmentSteps" ADD CONSTRAINT "recruitmentSteps_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_recruitmentStepId_fkey" FOREIGN KEY ("recruitmentStepId") REFERENCES "recruitmentSteps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
