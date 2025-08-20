import { randomUUID } from "crypto";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { handleErrorBase } from "@/lib/errors";
import { createOrderSchema } from "@/schema/order/createOrder";
import prisma from "@/lib/prisma";
import { createOrFindUser } from "@/lib/user";

export async function POST(req: NextRequest) {
  try {
    // Parse body
    const user = await createOrFindUser(auth().protect().userId);

    const items = createOrderSchema.parse(await req.json());

    const resp = await prisma.$transaction(async (tx) => {
      // Create order
      let order = await tx.orders.create({
        data: {
          order_id: randomUUID(),
          order_price: 0,
          order_holder_id: user.id,
        },
      });

      for (const item of items) {
        const result = await tx.baskets.findUnique({
          where: {
            id: item.basket_id,
            product: {
              deleted_at: null,
            },
          },
          include: {
            product: true,
          },
        });

        if (result) {
          const productUpdate = await tx.products.update({
            where: {
              id: result.product.id,
            },
            data: {
              stocks: {
                decrement: item.unit,
              },
            },
          });

          if (productUpdate.stocks < 0)
            throw new Error("Product has been out of stock");

          // Create order items
          await tx.order_items.create({
            data: {
              order_product_id: result.product.id,
              order_id: order.id,
              order_price: result.product.price,
              order_units: item.unit,
            },
          });

          order.order_price += result.product.price * item.unit;
        }
      }

      return await tx.orders.update({
        where: {
          id: order.id,
        },
        data: {
          order_price: order.order_price,
        },
      });
    });

    // Delete all basket
    await prisma.baskets.deleteMany({
      where: {
        user_id: user.id,
      },
    });

    return NextResponse.json(resp, {
      status: 201,
    });
  } catch (e) {
    return handleErrorBase(e);
  }
}
