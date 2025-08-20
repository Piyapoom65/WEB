import { z } from "zod";

export const createOrderSchema = z.array(
  z.object({
    basket_id: z.string().uuid(),
    unit: z.number().min(1),
  })
);
