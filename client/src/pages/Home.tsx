import { useState } from "react";
import Lottie from "lottie-react";
import BlueSearchAnimation from "../assets/SmartSearch.json";
import LocationsOnMapAnimation from "../assets/LocationsOnMap.json";
import ChatBotAnimation from "../assets/ChatBot.json";
import SmartSearch from "@/components/SmartSearch";
import {MessageCircleMore, Plus, Search} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TopicsChat from "@/components/TopicsChat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const [openChat, setOpenChat] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  return (
      <div className="space-y-[140px] overflow-hidden">
        <div className="flex flex-col items-center justify-center h-[30vh] text-white bg-blue-400">
          <h1 className="text-4xl font-bold mb-4">Easy Invest</h1>
          <h4 className="text-xl font-bold mb-4">השקעות בסטארטאפים מתחילים</h4>
          <div className="flex gap-4">
            <Link
                to="/create-startup"
                className="px-6 py-2 bg-black hover:bg-gray-800 rounded-full text-white"
            >
              ליצור פרויקט חדש
            </Link>
            <button
                className="px-6 py-2 bg-black hover:bg-gray-800 rounded-full"
                onClick={() => setOpenChat(true)}
            >
              לחפש פרויקטים להשקעה
            </button>
          </div>
        </div>

        <div className="relative w-full h-[25vh] flex items-center space-x justify-center px-20">
          <div className="flex flex-row gap-10">
            <div className="relative flex justify-center w-[50vh]">
              <p className="w-[250px] absolute top-2 left-1/2 -translate-x-1/2 text-xl text-center font-semibold z-10 px-2 mt-12">
                חיפוש פרויקטים על גבי מפה
              </p>
              <Lottie
                  animationData={LocationsOnMapAnimation}
                  loop
                  autoplay
                  style={{ width: "50vh", height: "auto" }}
              />
            </div>

            <div className="relative flex justify-center w-[70vh]">
              <p className="w-[250px] absolute top-2 left-1/2 -translate-x-1/2 text-xl text-center font-semibold z-10 px-2 mt-12">
                חיפוש חכם במילים פשוטות שימצא את ההתאמות הטובות ביותר עבורך
              </p>
              <Lottie
                  animationData={BlueSearchAnimation}
                  loop
                  autoplay
                  style={{ width: "70vh", height: "auto" }}
              />
            </div>

            <div className="relative flex justify-center w-[50vh]">
              <p className="w-[250px] absolute top-2 left-1/2 -translate-x-1/2 text-xl text-center font-semibold z-10 px-2 mt-12">
                פיצ'רים שעוזרים לך להבין את העולם הטכנולוגי
              </p>
              <Lottie
                  animationData={ChatBotAnimation}
                  loop
                  autoplay
                  style={{ width: "35vh", height: "auto" }}
              />
            </div>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  className="fixed bottom-36 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-400 border-0 text-white"
                  onClick={() => setOpenSearch(true)}
              >
                <Search className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[999]">
              <p>Search Invest with AI</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-400 border-0 text-white"
                  onClick={() => setOpenChat(true)}
              >
                <MessageCircleMore className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[999]">
              <p>Chat with AI</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/create-startup">
                <Button
                    className="fixed bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-400 border-0 text-white"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="z-[999]">
              <p>Create Startup</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SmartSearch open={openSearch} setOpen={setOpenSearch} />
        <TopicsChat open={openChat} setOpen={setOpenChat} />
      </div>
  );
}