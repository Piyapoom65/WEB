import { z } from "zod";

const productBaseSchema = {
  title: z.string(),
  image: z.string().url(),
  price: z.coerce.number().min(1),
  stocks: z.coerce.number(),
};

export const createProductSchema = z.object(productBaseSchema);
export const updateProductSchema = z.object({
  ...productBaseSchema,
  id: z.string().uuid(),
});
