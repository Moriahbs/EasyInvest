import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getAllStartups, StartupFilters } from "@/actions/startupActions";
import { Startup } from "@/models/StartupModel";
import FilterBar from "@/components/FilterBar";
import Map from "@/components/Map";
import StartupList from "@/components/StartupList";

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(0); 
  const [region, setRegion] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [fundingStages, setFundingStages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [valuation, setValuation] = useState<string>("");

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      setCurrentPage(0);
      const filters: StartupFilters = {
        name,
        region,
        fundingStages,
        categories,
        valuation,
      };
      const data = await getAllStartups(filters);
      setStartups(data);
      setLoading(false);
    };
    fetchFiltered();
  }, [region, fundingStages, categories, valuation, name]);

  return (
    <div className="flex flex-col" dir="ltr">
      <FilterBar
        name={name}
        setName={setName}
        region={region}
        setRegion={setRegion}
        fundingStages={fundingStages}
        setFundingStages={setFundingStages}
        categories={categories}
        setCategories={setCategories}
        valuation={valuation}
        setValuation={setValuation}
      />

      <div className="flex flex-row flex-wrap w-full justify-between">
        <Map startups={startups} />
        <div className="w-full md:w-[35%]">
          <StartupList
            title={"סטארטאפים רלוונטים עבורך"}
            startups={startups}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
}
