-- CreateTable
CREATE TABLE "RequestLog" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);
