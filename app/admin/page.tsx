import { redirect } from "next/navigation";
import { ADMIN_STATISTICS_URL } from "@/constants";

export default async function AdminPage() {
  redirect(ADMIN_STATISTICS_URL);
}
