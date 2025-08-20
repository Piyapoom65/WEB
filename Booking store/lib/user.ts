import prisma from "./prisma";

export function createOrFindUser(user_id: string) {
  return prisma.users.upsert({
    where: {
      user_id,
    },
    create: {
      user_id,
    },
    update: {
      user_id,
    },
  });  
}
