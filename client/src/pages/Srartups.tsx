import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getAllStartups } from "@/actions/startupActions";
import { Startup } from "@/models/StartupModel";
import FilterBar from "../components/FilterBar";
import Map from "@/components/Map";
import StartupList from "@/components/StartupList";

export default function StartupsPage() {
  const [startups, setStartUps] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAllStartups();
      setStartUps(res);
      setLoading(false);
    };

    fetchData();
  }, []);


  return (
    <div className="flex flex-col flex-wrap items-start" dir="ltr">
      <FilterBar />
      <div className="w-full flex flex-row flex-wrap justify-between">
        <Map startups={startups} />
        <div className="w-full md:w-[35%]">
          <StartupList startups={startups} loading={loading} />
        </div>
      </div>
    </div>
  );
}
