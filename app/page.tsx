import Sidebar from "@/components/_common/sidebar/sidebar";
import Households from "@/components/households/households";

export default function Home() {
  return (
    <main className="flex h-dvh max-w-full overflow-hidden">
      <Sidebar />
      <Households />
    </main>
  );
}
