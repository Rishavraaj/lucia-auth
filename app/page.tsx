import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/authenticate");
  }
  return (
    <div>
      <h1>Hello World</h1>
      {user?.name}
    </div>
  );
}
