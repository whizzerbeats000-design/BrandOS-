import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Home",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
