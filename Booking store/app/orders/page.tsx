import { auth } from "@clerk/nextjs/server";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

import prisma from "@/lib/prisma";
import dayjs from "@/lib/dayjs";

export default async function BasketPage() {
  const user = auth().protect();

  // Query database
  const result = await prisma.orders.findMany({
    where: {
      user: {
        user_id: user.userId,
      },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      order_items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">รายการสินค้า</h1>
      <div className="space-y-3">
        {result.map((i, idx) => (
          <Card key={idx}>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">
                  {dayjs(i.created_at).format("DD MMM YYYY HH:mm:ss")}
                </p>
                <p className="text-small text-default-500">{i.id}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              {i.order_items.map((j, idx2) => (
                <div
                  key={`${idx}-${idx2}`}
                  className="flex flex-row items-center"
                >
                  <img
                    alt={j.product.title}
                    className="w-24 h-24 object-cover mr-4"
                    src={j.product.image || ''}
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">
                      {j.product.title}{" "}
                    </h2>
                    <p className="text-gray-600">
                      {j.order_price.toLocaleString()} บาท (x{j.order_units})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-semibold text-xl">
                      {(j.order_price * j.order_units).toLocaleString()} บาท
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <h2 className="text-xl font-semibold">รวมทั้งสิ้น:</h2>
                <p className="text-xl">{i.order_price.toLocaleString()} บาท</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
