"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/card";

import { TBasket } from "./basket";

export default function BasketItem(props: {
  index: number;
  data: TBasket;
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onDeleteItem: (index: number) => void;
}) {
  return (
    <Card key={props.data.id} className="mb-4">
      <CardBody className="flex flex-row items-center">
        <img
          alt={props.data.product.title}
          className="w-24 h-24 object-cover mr-4"
          src={props.data.product.image || ''}
        />
        <div className="flex-grow">
          <h2 className="text-lg font-semibold">{props.data.product.title} </h2>
          <p className="text-gray-600">
            {props.data.product.price.toLocaleString()} บาท
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onClick={() => props.onDecrement(props.index)}
          >
            -
          </Button>
          <Input
            readOnly
            className="w-16 text-center"
            size="sm"
            value={props.data.qty.toString()}
          />
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => {
              props.onIncrement(props.index);
            }}
          >
            +
          </Button>
          <Button
            isIconOnly
            color="danger"
            size="sm"
            variant="flat"
            onPress={() => {
              props.onDeleteItem(props.index);
            }}
          >
            Del
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
