import Sidebar from "@/components/_common/sidebar/sidebar";
import BookOverlays from "@/components/_common/book-overlays";
import StoreHydrator from "@/components/_common/store-hydrator";

export default function BookLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex h-dvh max-w-full overflow-hidden">
      <StoreHydrator />
      <Sidebar />
      {children}
      <BookOverlays />
    </main>
  );
}
