import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { createOrFindUser } from "@/lib/user";
import {
  createProductSchema,
  updateProductSchema,
} from "@/schema/porduct/createProduct";
import prisma from "@/lib/prisma";
import { handleErrorBase } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    // Parse body
    const user = await createOrFindUser(auth().protect().userId);
    if (user.role !== Role.MERCHANT) throw new Error("Forhidden!");

    const body = await createProductSchema.parseAsync(await req.json());

    await prisma.products.create({
      data: {
        title: body.title,
        description: "",
        price: body.price,
        stocks: body.stocks,
        image: body.image,
      },
    });

    return NextResponse.json(
      {},
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleErrorBase(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Parse body
    const user = await createOrFindUser(auth().protect().userId);
    if (user.role !== Role.MERCHANT) throw new Error("Forhidden!");

    const body = await updateProductSchema.parseAsync(await req.json());

    const result = await prisma.products.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!result) return NextResponse.json({}, { status: 404 });

    await prisma.products.update({
      where: {
        id: result.id,
        deleted_at: null,
      },
      data: {
        title: body.title,
        description: "",
        price: body.price,
        stocks: body.stocks,
        image: body.image,
      },
    });

    return NextResponse.json(
      {},
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleErrorBase(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Parse URL
    const parsed = new URL(req.url);

    // Parse body
    const user = await createOrFindUser(auth().protect().userId);
    if (user.role !== Role.MERCHANT) throw new Error("Forhidden!");

    await prisma.products.update({
      where: {
        id: parsed.searchParams.get("id") || "",
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json(
      {},
      {
        status: 200,
      }
    );
  } catch (e) {
    return handleErrorBase(e);
  }
}
