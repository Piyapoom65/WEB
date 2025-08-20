import { auth } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { ReactNode } from "react";

import ForhiddenPage from "@/components/error/403";
import { createOrFindUser } from "@/lib/user";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await createOrFindUser(auth().protect().userId);

  if (user.role !== Role.MERCHANT) {
    return <ForhiddenPage />;
  }

  return children;
}
