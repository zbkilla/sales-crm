import HouseholdsHeader from "./header/header";
import HouseholdsToolbar from "./toolbar/toolbar";
import HouseholdsTable from "./table/households-table";
import HouseholdDetail from "./detail/household-detail";
import Profile from "./profile/profile";
import NewHouseholdDialog from "./new-household/new-household-dialog";
import CommandMenu from "./command-menu/command-menu";

export default function Households() {
  return (
    <section id="households" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <HouseholdsHeader />
      <HouseholdsToolbar />
      <HouseholdsTable />
      <HouseholdDetail />
      <Profile />
      <NewHouseholdDialog />
      <CommandMenu />
    </section>
  );
}
