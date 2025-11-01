// test to see if data is going into database

import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main(){
  const skills = await Promise.all([
  prisma.skills.upsert({ where: { skill_name: "Teamwork" }, update: {}, create: { skill_name: "Teamwork" } }),
  prisma.skills.upsert({ where: { skill_name: "First Aid" }, update: {}, create: { skill_name: "First Aid" } }),
  prisma.skills.upsert({ where: { skill_name: "Organization" }, update: {}, create: { skill_name: "Organization" } }),
  prisma.skills.upsert({ where: { skill_name: "Leadership" }, update: {}, create: { skill_name: "Leadership" } }),
  prisma.skills.upsert({ where: { skill_name: "Communication" }, update: {}, create: { skill_name: "Communication" } }),
  prisma.skills.upsert({ where: { skill_name: "Problem Solving" }, update: {}, create: { skill_name: "Problem Solving" } }),
  prisma.skills.upsert({ where: { skill_name: "Event Planning" }, update: {}, create: { skill_name: "Event Planning" } }),
  prisma.skills.upsert({ where: { skill_name: "Data Entry" }, update: {}, create: { skill_name: "Data Entry" } }),
  prisma.skills.upsert({ where: { skill_name: "Fundraising" }, update: {}, create: { skill_name: "Fundraising" } }),
  prisma.skills.upsert({ where: { skill_name: "Teaching" }, update: {}, create: { skill_name: "Teaching" } }),
  prisma.skills.upsert({ where: { skill_name: "Social Media Management" }, update: {}, create: { skill_name: "Social Media Management" } }),
  prisma.skills.upsert({ where: { skill_name: "Customer Service" }, update: {}, create: { skill_name: "Customer Service" } }),
]);

  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const user = await prisma.user_credentials.upsert({
    where: { email: "demo@volunteer.app" },
    update: {},
    create: {
      email: "demo@volunteer.app",
      password_hash: hashedPassword,
      role: "volunteer",
    },
  });

  await prisma.user_profile.upsert({
    where: { user_id: user.id },
    update: {},
    create: {
      user_id: user.id,
      full_name: "Demo Volunteer",
      address1: "123 Main St",
      city: "Houston",
      state: "TX",
      zip: "77002",
      preferences: "Prefers weekend events",
    },
  });

  const event = await prisma.event_details.create({
    data: {
      event_name: "Community Cleanup",
      description: "Neighborhood park cleanup event.",
      location: "Houston, TX",
      urgency: "Medium",
      event_date: new Date(Date.now() + 86400000),
    },
  });

  const relatedSkills = await prisma.skills.findMany({
  where: {
    skill_name: { in: ["Teamwork", "Organization", "Leadership"] },
  },
});

if (relatedSkills.length > 0) {
  await prisma.event_skills.createMany({
    data: relatedSkills.map(skill => ({
      event_id: event.event_id,
      skill_id: skill.skill_id,
    })),
  });
}

  await prisma.volunteer_history.create({
    data: {
      user_id: user.id,
      event_id: event.event_id,
      participation_date: new Date(),
      status: "Registered",
    },
  });
}

main()
  .then(() => {
    console.log("Database seeded successfully.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });