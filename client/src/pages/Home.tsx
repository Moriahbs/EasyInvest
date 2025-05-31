import Lottie from "lottie-react";
import BlueSearchAnimation from "../assets/SmartSearch.json";
import LocationsOnMapAnimation from "../assets/LocationsOnMap.json";
import ChatBotAnimation from "../assets/ChatBot.json";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-[140px] overflow-hidden">
      <div className="flex flex-col items-center justify-center h-[30vh] text-white bg-blue-400">
        <h1 className="text-4xl font-bold mb-4">Easy Invest</h1>
        <h4 className="text-xl font-bold mb-4">השקעות בסטארטאפים מתחילים</h4>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 bg-black hover:bg-gray-800 rounded-full"
            onClick={() => navigate("/create-startup")}
          >
            ליצור פרויקט חדש
          </button>
          <button
            className="px-6 py-2 bg-black hover:bg-gray-800 rounded-full"
            onClick={() => navigate("/smart-search")}
          >
            לחפש בצורה חכמה
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
    </div>
  );
}
