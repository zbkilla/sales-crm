import HouseholdDetail from "@/components/households/detail/household-detail";
import Profile from "@/components/households/profile/profile";
import NewHouseholdDialog from "@/components/households/new-household/new-household-dialog";
import CommandMenu from "@/components/households/command-menu/command-menu";
import AssistantSheet from "@/components/assistant/assistant-sheet";

export default function BookOverlays() {
  return (
    <>
      <HouseholdDetail />
      <Profile />
      <NewHouseholdDialog />
      <CommandMenu />
      <AssistantSheet />
    </>
  );
}
