import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleErrorBase(e: unknown) {
  if (e instanceof SyntaxError) {
    return NextResponse.json(
      {
        message: "Malformed body.",
      },
      {
        status: 400,
      }
    );
  }

  if (e instanceof ZodError) {
    return NextResponse.json(
      {
        errors: e.issues,
      },
      {
        status: 400,
      }
    );
  }

  if (e instanceof Error) {
    return NextResponse.json(
      {
        errors: e.message || "Unknown error",
      },
      {
        status: 400,
      }
    );
  }

  // eslint-disable-next-line no-console
  console.error(e);

  return NextResponse.json(
    {
      message: "Unknown error",
    },
    { status: 500 }
  );
}
