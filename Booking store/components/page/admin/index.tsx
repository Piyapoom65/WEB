"use client";

import { Tab, Tabs } from "@nextui-org/tabs";
import { products } from "@prisma/client";

import DashboardClientPage from "./dashboard";
import ProductClientPage from "./products";

export default function AdminClientPage(props: { product: products[] }) {
  return (
    <Tabs aria-label="Options">
      <Tab key="dashboard" title="Dashboard">
        <DashboardClientPage />
      </Tab>
      <Tab key="products" title="Products">
        <ProductClientPage product={props.product} />
      </Tab>
    </Tabs>
  );
}
