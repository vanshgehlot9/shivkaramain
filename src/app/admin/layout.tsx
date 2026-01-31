import { Metadata } from "next";
import AdminWrapper from "./AdminWrapper";

export const metadata: Metadata = {
  title: "Admin Console | Shivkara Digital",
  description: "Advanced administrative control center for Shivkara Digital. Manage analytics, financials, bootcamps, and student records.",
  robots: {
    index: false,
    follow: false,
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#000000",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminWrapper>{children}</AdminWrapper>;
}
