import prisma from "@/lib/prisma";
import AdminClientPage from "@/components/page/admin";

export default async function AdminDashboard() {
  const product = await prisma.products.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return <AdminClientPage product={product} />;
}
