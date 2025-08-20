import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import BasketClientPage from "@/components/page/basket/basket";

export default async function BasketPage() {
  const user = auth().protect();

  // Query database
  const result = await prisma.baskets.findMany({
    where: {
      user: {
        user_id: user.userId,
      },
      product: {
        deleted_at: null,
      },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      product: true,
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">รายการสินค้า</h1>
      <BasketClientPage data={result} />
    </div>
  );
}
