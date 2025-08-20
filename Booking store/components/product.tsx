"use client";

import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { products } from "@prisma/client";
import { useState } from "react";

export default function ProductCard(props: { data: products }) {
  const [isLoading, setLoading] = useState(false);

  async function addBasket() {
    setLoading(true);
    const resp = await fetch("/api/basket", {
      method: "POST",
      body: JSON.stringify({
        product_id: props.data.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);

    if (resp.status === 201) {
      return (window.location.href = "/baskets");
    }

    if (resp.status === 404) {
      alert("Basket not exist.");
    } else if (resp.status === 410) {
      alert("Product has out of stock");
    } else {
      alert("Unknown error");
    }
  }

  return (
    <Card key={props.data.id} className="max-w-xs mx-auto">
      <CardBody className="p-0">
        <Image
          alt={props.data.title}
          className="w-full object-cover"
          src={props.data.image || ""}
        />
      </CardBody>
      <CardFooter className="flex-col items-start">
        <h3 className="text-lg font-semibold line-clamp-2">
          {props.data.title}
        </h3>
        <h6
          className={`text-sm ${props.data.stocks <= 0 ? "text-red-500" : ""}`}
        >
          คงเหลือ: {props.data.stocks}
        </h6>
        <div className="mt-2">
          <span className="text-2xl font-bold">
            {props.data.price.toLocaleString()} บาท
          </span>
        </div>
        <Button
          className="w-full mt-4"
          color="primary"
          isDisabled={props.data.stocks <= 0}
          isLoading={isLoading}
          onPress={addBasket}
        >
          {props.data.stocks > 0 ? "เพิ่มกระตร้าสินค้า" : "สินค้าหมด"}
        </Button>
      </CardFooter>
    </Card>
  );
}
