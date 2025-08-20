import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function ForhiddenPage() {
  return (
    <div className="text-center  space-y-3">
      <h4 className="text-5xl font-bold">403</h4>
      <h6 className="text-xl">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</h6>
      <Button as={Link} color="primary" href="/" variant="solid">
        กลับไปยังหน้าหลัก
      </Button>
    </div>
  );
}
