import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to chat page
  redirect("/chat");
}
