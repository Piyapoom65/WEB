import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { createBasketSchema } from "@/schema/basket/createBasket.schema";
import { handleErrorBase } from "@/lib/errors";
import { createOrFindUser } from "@/lib/user";

export async function POST(req: NextRequest) {
  try {
    const user = await createOrFindUser(auth().protect().userId);

    const { product_id } = createBasketSchema.parse(await req.json());

    const result = await prisma.products.findUnique({
      where: {
        id: product_id,
        deleted_at: null,
      },
    });

    if (!result) return NextResponse.json({}, { status: 404 });

    // Check if out of stock
    if (result.stocks <= 0) return NextResponse.json({}, { status: 410 });

    const basket = await prisma.baskets.findFirst({
      where: {
        product_id: result.id,
        user_id: user.id,
      },
    });

    if (!basket) {
      await prisma.baskets.create({
        data: {
          product_id: result.id,
          user_id: user.id,
        },
      });
    }

    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    return handleErrorBase(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await createOrFindUser(auth().protect().userId);
    const basket_id = new URL(req.url).searchParams.get("id") || "";

    await prisma.baskets.delete({
      where: {
        id: basket_id,
        user_id: user.id,
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return handleErrorBase(e);
  }
}
