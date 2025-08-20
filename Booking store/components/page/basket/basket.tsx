"use client";

import { useState } from "react";
import { baskets, products } from "@prisma/client";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

import BasketItem from "./basketItem";

type TBasketBase = baskets & { product: products };
export type TBasket = TBasketBase & { qty: number };

export default function BasketClientPage(props: { data: TBasketBase[] }) {
  const [isLoading, setLoading] = useState(false);

  const [orderState, setOrderState] = useState<TBasket[]>(
    props.data.map((i) => ({
      ...i,
      qty: 1,
    }))
  );

  async function deleteBasketItem(idx: number) {
    const isConfirm = confirm("Are you sure delete this item?");

    if (isConfirm) {
      const item = orderState[idx];

      await fetch(`/api/basket?id=${item.id}`, {
        method: "DELETE",
      });

      window.location.reload();
    }
  }

  async function confirmProceed() {
    setLoading(true);

    const resp = await fetch(`/api/order`, {
      method: "POST",
      body: JSON.stringify(
        orderState.map((i) => ({
          basket_id: i.id,
          unit: i.qty,
        }))
      ),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 201) {
      return (window.location.href = "/orders");
    }

    alert("Unknown error");
    setLoading(false);
  }

  const total = orderState.reduce((sum, p) => sum + p.product.price * p.qty, 0);

  return (
    <>
      {orderState.map((i, idx) => (
        <BasketItem
          key={idx}
          data={i}
          index={idx}
          onDecrement={(idx) => {
            let twice = false;

            setOrderState((p) => {
              if (!twice) {
                p[idx].qty -= 1;
                if (p[idx].qty <= 0) p[idx].qty += 1;
              }

              twice = true;

              return [...p];
            });
          }}
          onDeleteItem={deleteBasketItem}
          onIncrement={(idx) => {
            let twice = false;

            setOrderState((p) => {
              if (!twice) {
                p[idx].qty += 1;
                if (p[idx].qty > i.product.stocks) p[idx].qty -= 1;
              }

              twice = true;

              return [...p];
            });
          }}
        />
      ))}
      {props.data.length > 0 ? (
        <Card>
          <CardBody>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">รวมทั้งสิ้น:</h2>
              <p className="text-xl ">{total.toLocaleString()} บาท</p>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              className="w-full"
              color="primary"
              isLoading={isLoading}
              onPress={confirmProceed}
            >
              ดำเนินการซื้อสินค้า
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <h4>ไม่พบสินค้า</h4>
        </div>
      )}
    </>
  );
}
