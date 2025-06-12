import { useState } from "react";
import Cookies from "js-cookie";
import { MoreVertical, Pencil, Trash2, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { deleteStartup, getStartupsBySender } from "@/actions/startupActions";
import { Startup } from "@/models/StartupModel";
import config from "@/config";
import StartupVisitsGraph from "./StartupVisitsGraph";
import StartupSavesList from "./StartupSavesList";
import StartupVisitsList from "./StartupVisitsList";
import StartupSavesGraph from "./StartupSavesGraph";
import { cn } from "@/lib/utils";

interface StartupOwnerCardProps {
  startup: Startup;
  setStartups: React.Dispatch<React.SetStateAction<Startup[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStartup: React.Dispatch<React.SetStateAction<Startup | undefined>>;
}

const StartupOwnerCard: React.FC<StartupOwnerCardProps> = ({
  startup,
  setStartups,
  setOpen,
  setCurrentStartup,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedViewId, setSelectedViewId] = useState<number>(0);

  const views = [
    {
      id: 0,
      title: "היסטוריית צפיות",
      component: <StartupVisitsList startup={startup} />,
    },
    {
      id: 1,
      title: "היסטוריית שמירות",
      component: <StartupSavesList startupId={startup._id} />,
    },
    {
      id: 2,
      title: "כמות צפיות",
      component: <StartupVisitsGraph startupId={startup._id} />,
    },
    {
      id: 3,
      title: "כמות שמירות",
      component: <StartupSavesGraph startup={startup} />,
    },
  ];

  const getImageUrl = (imageSrc: string | undefined) => {
    if (imageSrc?.startsWith("https")) {
      return imageSrc;
    } else if (imageSrc) {
      return `${config.SERVER_URL}/${imageSrc}`;
    }
    return "/src/assets/default-image.png";
  };

  const token = Cookies.get("Authorization") || "";

  const getStartups = async () => {
    const userStartups = await getStartupsBySender(token);
    setStartups(userStartups);
  };

  const handleEditStartup = async (startup: Startup) => {
    setOpen(true);
    setCurrentStartup(startup);
  };

  const handleDeleteStartup = async (startupId: string) => {
    await deleteStartup(startupId);
    await getStartups();
  };

  return (
    <div className="w-[400px] h-[100px] bg-white rounded-xl shadow flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <img
          src={getImageUrl(startup?.image)}
          alt={startup.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="font-bold text-blue-950">{startup.name}</div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="bg-transparent p-0 focus:outline-none">
          <MoreVertical className="cursor-pointer text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="rtl text-right">
          <DropdownMenuItem
            onSelect={() => setModalOpen(true)}
            className="justify-end cursor-pointer"
          >
            פעילות
            <BarChart2 className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleEditStartup(startup)}
            className="justify-end cursor-pointer"
          >
            עריכה
            <Pencil className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleDeleteStartup(startup._id)}
            className="justify-end cursor-pointer"
          >
            מחיקה
            <Trash2 className="w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={modalOpen} onOpenChange={() => setModalOpen(false)}>
        <DialogContent className="w-3/5 h-5/6 text-center items-center max-w-screen-xl p-6 overflow-y-auto !z-[2147483647] bg-white text-black rounded-lg shadow-lg [&>button.absolute]:hidden">
          <DialogTitle className="text-2xl">פעילות משתמשים</DialogTitle>
          <h2 className="text-lg">{views[selectedViewId].title}</h2>
          <div className="flex flex-row h-[60vh] justify-center gap-10">
            <div className="flex flex-col w-1/4 divide-y divide-gray-20 mt-10">
              {views.map((view) => (
                <div
                  className={cn(
                    "cursor-pointer",
                    view.id === selectedViewId && "text-[#10B981]"
                  )}
                  onClick={() => setSelectedViewId(view.id)}
                >
                  {view.title}
                </div>
              ))}
            </div>
            <div className="w-2/3">{views[selectedViewId].component}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartupOwnerCard;
