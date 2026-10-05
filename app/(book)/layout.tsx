import Sidebar from "@/components/_common/sidebar/sidebar";
import BookOverlays from "@/components/_common/book-overlays";

export default function BookLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex h-dvh max-w-full overflow-hidden">
      <Sidebar />
      {children}
      <BookOverlays />
    </main>
  );
}
