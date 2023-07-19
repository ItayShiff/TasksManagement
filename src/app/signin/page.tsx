import SignIn from "@/components/ClientComponents/signin/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Task Management",
  description: "A site that allows you to manage your tasks",
};

export default async function PageServerComponent() {
  return <SignIn />;
}
