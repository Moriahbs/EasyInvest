import { Dialog, DialogContent } from "@/components/ui/dialog";
import StartupForm from "./StartupForm";
import { Startup } from "@/models/StartupModel";

export default function EditStartupModal({
  open,
  setOpen,
  startup,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  startup: Startup;
}) {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="w-3/4 h-5/6 max-w-screen-xl p-6 overflow-y-auto [&>button.absolute]:hidden">
        <StartupForm existingStartup={startup} />
      </DialogContent>
    </Dialog>
  );
}
