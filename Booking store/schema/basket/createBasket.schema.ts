import { z } from "zod";

export const createBasketSchema = z.object({
  product_id: z.string().uuid(),
});
