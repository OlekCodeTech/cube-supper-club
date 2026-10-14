import type { Metadata } from "next";
import { HostApp } from "@/components/host/HostApp";
import "./host.css";

export const metadata: Metadata = {
  title: "Host’s Book · Cube Supper Club",
  robots: { index: false, follow: false },
};

export default function HostPage() {
  return <HostApp />;
}
