"use client";

import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { products } from "@prisma/client";
import { useState, useTransition } from "react";

type TProduct = Omit<products, "created_at" | "updated_at" | "deleted_at">;

export default function ProductClientPage(props: { product: products[] }) {
  // Product default base
  const productDefaultBase: TProduct = {
    id: "",
    description: "",
    image: "",
    price: 0,
    stocks: 1,
    title: "",
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [product, setProduct] = useState<TProduct>(productDefaultBase);
  const [isLoading, startLoading] = useTransition();
  const [isLoadingUpload, startLoadingUpload] = useTransition();

  async function uploadImage() {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";
    el.onchange = (e) =>
      startLoadingUpload(async () => {
        const files = (e.target as HTMLInputElement).files || [];
        if (files.length > 0) {
          const file = files[0];
          if (file) {
            // Create form
            const form = new FormData();
            form.append("file", file, file.name);
            const resp = await fetch("/api/upload", {
              method: "POST",
              body: form,
            });

            const js = (await resp.json()) as { url: string; message: string };
            if (resp.status !== 201) {
              alert(js.message);
            }

            setProduct((p) => ({ ...p, image: js.url }));
          }
        }
      });
    el.click();
  }

  async function doAction() {
    const resp = await fetch("/api/products", {
      body: JSON.stringify(product),
      method: product.id === "" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.status === 200) {
      window.location.reload();
      return;
    }

    alert(await resp.text());
  }

  async function doDelete(id: string) {
    const isConfirm = confirm("คุณต้องการลบข้อมูลหรือไม่?");

    if (isConfirm) {
      await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      window.location.reload();
    }
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button
            color="primary"
            onPress={() => {
              setProduct(productDefaultBase);
              onOpen();
            }}
          >
            เพิ่มสินค้า
          </Button>
        </div>
        <Table aria-label="Example table with custom cells">
          <TableHeader>
            <TableColumn>รูปสินค้า</TableColumn>
            <TableColumn>ชื่อสินค้า</TableColumn>
            <TableColumn>ราคา</TableColumn>
            <TableColumn>สต็อกคงเหลือ</TableColumn>
            <TableColumn>การทำงาน</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"ไม่พบสินค้า"}>
            {props.product.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <Image
                    alt="NextUI hero Image"
                    className="object-cover"
                    height={84}
                    src={i.image || ""}
                    width={64}
                  />
                </TableCell>
                <TableCell>{i.title}</TableCell>
                <TableCell>{i.price.toLocaleString()} บาท</TableCell>
                <TableCell>{i.stocks.toLocaleString()} ชิ้น</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Button
                      color="primary"
                      onPress={() => {
                        setProduct(i);
                        onOpen();
                      }}
                    >
                      แก้ไข
                    </Button>
                    <Button color="danger" onPress={() => doDelete(i.id)}>ลบ</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Modal (Create / Update) */}
      <Modal isOpen={isOpen} placement="auto" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                เพิ่ม / แก้ไขสินค้า
              </ModalHeader>
              <ModalBody>
                {product && (
                  <>
                    <Input
                      label="ชื่อสินค้า"
                      value={product.title}
                      onChange={(e) =>
                        setProduct((p) => ({
                          ...p,
                          title: e.target.value || "",
                        }))
                      }
                    />
                    <div className="w-full space-y-3">
                      <Button
                        className="w-full"
                        color="primary"
                        isLoading={isLoadingUpload}
                        onPress={uploadImage}
                      >
                        อัพโหลดรูปภาพ
                      </Button>
                      {product.image && (
                        <Image
                          alt="NextUI hero Image"
                          className="object-cover mx-auto w-[50%]"
                          src={product.image}
                        />
                      )}
                    </div>
                    <Input
                      label="ราคา / ชิ้น"
                      min={1}
                      value={product.price.toString()}
                      onChange={(e) =>
                        setProduct((p) => ({
                          ...p,
                          price: +e.target.value || 0,
                        }))
                      }
                    />
                    <Input
                      label="คงเหลือสินค้า"
                      min={1}
                      value={product.stocks.toString()}
                      onChange={(e) =>
                        setProduct((p) => ({
                          ...p,
                          stocks: +e.target.value || 0,
                        }))
                      }
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={isLoading}
                  variant="light"
                  onPress={onClose}
                >
                  ปิดหน้าต่าง
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={() => startLoading(doAction)}
                >
                  บันทึก
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
