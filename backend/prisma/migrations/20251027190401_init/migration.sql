-- CreateTable
CREATE TABLE "user_credentials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'volunteer'
);

-- CreateTable
CREATE TABLE "user_profile" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "preferences" TEXT,
    CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_credentials" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skills" (
    "skill_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skill_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_skills" (
    "user_id" TEXT NOT NULL,
    "skill_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "skill_id"),
    CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills" ("skill_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "availability" (
    "user_id" TEXT NOT NULL,
    "available_date" DATETIME NOT NULL,

    PRIMARY KEY ("user_id", "available_date"),
    CONSTRAINT "availability_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_details" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "event_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "event_skills" (
    "event_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    PRIMARY KEY ("event_id", "skill_id"),
    CONSTRAINT "event_skills_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_details" ("event_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills" ("skill_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "volunteer_history" (
    "history_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "participation_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "volunteer_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "volunteer_history_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_details" ("event_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "States" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_credentials_email_key" ON "user_credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "skills_skill_name_key" ON "skills"("skill_name");
