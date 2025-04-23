import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import ChatStartupList from "@/components/ChatStartupList";
import { Startup } from "@/models/StartupModel";
import axios from "axios";
import config from "@/config";

export default function SmartSearchPage() {
  const [userInput, setUserInput] = useState<string>("");
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [topMatches, setTopMatches] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<any>(null);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${config.SERVER_URL}/api/smartSearch/recommended`,
        {
          prompt: userInput,
        }
      );
      setPreferences(response.data.preferences);
      setFilteredStartups(response.data.startups);
      setTopMatches(response.data.topMatches);
    } catch (error) {
      console.error("Error fetching investment recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            חיפוש חכם ומותאם בעזרת בינה מלאכותית
          </h1>
          <p className="text-sm text-muted-foreground">
            ספר לי על הסטארטאפים הטכנולוגיים שבהם אתה רוצה להשקיע (למשל, סוג הטכנולוגיה, שלב המימון, שנת ההקמה או טווח הערכת השווי).
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="תאר את ההעדפות שלך..."
            className="w-full bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            rows={4}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput}
              className="px-6 py-2"
            >
              שלח
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center mt-8 gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            <p className="text-sm text-muted-foreground">חושב על המלצות מותאמות עבורך...</p>
          </div>
        ) : (
          <>
            {preferences && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6 text-sm text-gray-700 space-y-1">
                <p><strong>תגיות:</strong> {preferences.tags?.join(", ") || "ללא"}</p>
                <p><strong>שלב:</strong> {preferences.fundingStages?.join(", ") || "כל שלב"}</p>
                <p>
                  <strong>שנת הקמה:</strong>{" "}
                  {preferences.minFoundedYear || preferences.maxFoundedYear
                    ? `${preferences.minFoundedYear || "כל שנה"} - ${preferences.maxFoundedYear || "כל שנה"}`
                    : "כל שנה"}
                </p>
                <p>
                  <strong>שווי:</strong>{" "}
                  {preferences.minValuation || preferences.maxValuation
                    ? `${preferences.minValuation || "כל סכום"}M - ${preferences.maxValuation || "כל סכום"}M`
                    : "כל סכום"}
                </p>
              </div>
            )}
            <div className="mt-6">
              <ChatStartupList startups={filteredStartups} topMatches={topMatches} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
