import { CircularProgress, Fab, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SmartSearch from "@/components/SmartSearch";
import ChatIcon from '@mui/icons-material/Chat';
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import config from "@/config";
import TopicsChat from "@/components/TopicsChat";
import { Startup } from "@/models/StartupModel";
import axios from "axios";
import { getAllStartups } from "@/actions/startupActions";
import CreateStartupModal from "@/components/CreateStartup";

export default function HomePage() {
  const [dbStartups, setDbStartups] = useState<Startup[]>([]);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [openCreateStartup, setOpenCreateStartup] = useState(false);
  const [startups, setStartUps] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [simplifyLoading, setSimplifyLoading] = useState<boolean>(false);
  const [simplifiedDesc, setSimplifiedDesc] = useState('');
  const [isSimplified, setIsSimplified] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAllStartups();
      setStartUps(res);
      setLoading(false);
    };

    fetchData();
  }, []);


  const handleOpenChat = () => {
    setChatOpen(true);
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  const handleCreateStartup = (newStartup: Startup) => {
    setDbStartups([newStartup, ...dbStartups]);
    setOpenCreateStartup(false);
    window.location.href = `${config.CLIENT_URL}/home`;
  };

  const simplifyDescription = async (userInput: string) => {
    if (!isSimplified) {
      setSimplifyLoading(true);
      const response = await axios.post(`${config.SERVER_URL}/api/smartSearch/simplify`, {
        userText: userInput,
      });

      setSimplifyLoading(false);
      setSimplifiedDesc(response.data.simplified);
      console.log(response.data.simplified);
    }
    setIsSimplified(!isSimplified);
  }

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     const projects = await getAllProjects();
  //     setDbProjects(projects);
  //   };
  //   fetchProjects();
  // }, []);

  return (
    <div className="relative w-full h-[30vh]">
      <img
        src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30">
        <h1 className="text-4xl font-bold mb-4">Easy Invets</h1>
        <h4 className="text-xl font-bold mb-4">
          השקעות בפרויקטים מתחילים
        </h4>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full">
            השקעות
          </button>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full">
            תשקיע
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-2">פרויקטים בשבילך</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 1"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 1</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 2"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 2</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 3"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 3</h3>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
              alt="Project 4"
              className="w-40 h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">פרויקט 4</h3>
          </div>
        </div>
      </div>
      <div className="w-full bg-purple-700 py-12 flex justify-around text-white mt-8">
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-semibold mb-2">+100M</h2>
          <h4 className="text-xl font-semibold mb-2">פרויקטים</h4>
          <p>חרטוטים חרטוטים חרטוטים חרטוטים </p>
        </div>
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-semibold mb-2">325</h2>
          <h4 className="text-xl font-semibold mb-2">פרויקטים</h4>
          <p>חרטוטים חרטוטים חרטוטים חרטוטים </p>
        </div>
        <div className="text-center max-w-xs">
          <h2 className="text-3xl font-semibold mb-2">6250</h2>
          <h4 className="text-xl font-semibold mb-2">פרויקטים</h4>
          <p>חרטוטים חרטוטים חרטוטים חרטוטים </p>
        </div>
      </div>
      <div>
        {
          startups.map((startup) => (
            <>
              <div>{startup.name}</div>
              <div>
                {isSimplified ? simplifiedDesc : startup.description}
              </div>
              <button
                onClick={() => simplifyDescription(startup.description)}
                className="bg-[#5856D6] text-white border-none focus:outline-none mt-2">
                {isSimplified ? 'חזרה למקור' :
                  (
                    <>
                      {simplifyLoading && <CircularProgress size={18} thickness={5} sx={{ color: '#fff', marginRight: 1 }} />}
                      תסביר לי
                    </>
                  )}
              </button>
            </>
          )
          )
        }
        <Tooltip title="Search Invest with AI">
          <Fab
            color="primary"
            onClick={handleOpenSearch}
            sx={{
              backgroundColor: "rgb(30, 153, 139)",
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
          >
            <SearchIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Chat with AI">
          <Fab
            color="primary"
            onClick={handleOpenChat}
            sx={{
              backgroundColor: "rgb(77, 153, 30)",
              position: "fixed",
              bottom: 145,
              right: 16,
            }}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
        <Button
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-400 border-0 text-white"
          onClick={() => setOpenCreateStartup(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
        <CreateStartupModal
          open={openCreateStartup}
          setOpen={setOpenCreateStartup}
          onCreate={handleCreateStartup}
        />
        <SmartSearch isSearchOpen={isSearchOpen} handleCloseChat={handleCloseSearch} />
        <TopicsChat isChatOpen={isChatOpen} handleCloseChat={handleCloseChat} />
      </div>
    </div>
  )
}