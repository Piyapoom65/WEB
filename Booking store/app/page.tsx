import ProductCard from "@/components/product";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Query database
  const result = await prisma.products.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {result.map((product, idx) => (
        <ProductCard key={idx} data={product} />
      ))}
    </div>
  );
}
