import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2]">
      <PublicHeader />
      <main className="flex-grow">{children}</main>
      <PublicFooter />
    </div>
  );
}
