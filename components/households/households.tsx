import HouseholdsHeader from "./header";
import HouseholdsToolbar from "./toolbar/toolbar";
import HouseholdsTable from "./table/households-table";

export default function Households() {
  return (
    <section id="households" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HouseholdsHeader />
      <HouseholdsToolbar />
      <HouseholdsTable />
    </section>
  );
}
