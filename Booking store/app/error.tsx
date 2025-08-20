"use client";

import { useEffect } from "react";

import InternalServerError from "@/components/error/500";

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return <InternalServerError />;
}
