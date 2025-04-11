import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Startup } from "@/models/StartupModel.ts";
import config from "@/config.ts";
import StartupList from "./StartupList";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SmartSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
}) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-3xl p-0 overflow-hidden [&>button.absolute]:hidden">
        <div className="max-h-[28rem] overflow-y-auto p-6">
          <DialogTitle className="py-3">
            AI Startup Investment Assistant
          </DialogTitle>
          <p className="text-sm text-muted-foreground mb-4">
            Tell me about the tech startups you want to invest in (e.g., type of
            tech, funding stage, founded year, or valuation range).
          </p>
          <Textarea
            placeholder="Describe your investment preferences"
            className="w-full"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
          {isLoading ? (
            <div className="flex flex-col items-center mt-4 gap-2">
              <Loader2 className="animate-spin h-12 w-12 text-red-500" />
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          ) : (
            <>
              {preferences && (
                <p className="text-sm mb-2 mt-4">
                  <strong>Extracted Preferences:</strong>
                  <br />
                  Tags: {preferences.tags.join(", ") || "None"}
                  <br />
                  Funding Stages:{" "}
                  {preferences.fundingStages.join(", ") || "Any"}
                  <br />
                  Founded Year:{" "}
                  {preferences.minFoundedYear || preferences.maxFoundedYear
                    ? `${preferences.minFoundedYear || "Any"} - ${
                        preferences.maxFoundedYear || "Any"
                      }`
                    : "Any"}
                  <br />
                  Valuation:{" "}
                  {preferences.minValuation || preferences.maxValuation
                    ? `${preferences.minValuation || "Any"}M - ${
                        preferences.maxValuation || "Any"
                      }M`
                    : "Any"}
                </p>
              )}
              <StartupList
                startups={filteredStartups}
                topMatches={topMatches}
              />
            </>
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2 pr-4 pb-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
