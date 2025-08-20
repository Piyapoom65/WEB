import { createHash } from "crypto";

import * as mime from "mime";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Role } from "@prisma/client";

import { handleErrorBase } from "@/lib/errors";
import { createOrFindUser } from "@/lib/user";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_API_URL!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // Parse body
    const user = await createOrFindUser(auth().protect().userId);
    if (user.role !== Role.MERCHANT) throw new Error("Forhidden!");

    const file = (await req.formData()).get("file");
    if (!file) throw new Error("Missing file");
    if (!(file instanceof File)) throw new Error("Malformed file");
    if (!file.type.startsWith("image")) throw new Error("Support image only");

    // Into buffer
    const buf = Buffer.from(await file.arrayBuffer());

    // Uplaod into S3 server
    const filename =
      createHash("sha1").update(buf).digest("hex") +
      "." +
      mime.getExtension(file.type);

    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: filename,
        Body: buf,
        ContentType: file.type,
      })
    );

    return NextResponse.json(
      {
        url: `${process.env.S3_PUBLIC_URL}/${filename}`,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    return handleErrorBase(e);
  }
}
