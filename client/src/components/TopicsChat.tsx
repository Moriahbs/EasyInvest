import { useState } from "react";
import axios from "axios";
import config from "@/config.ts";
import { Loader2, Minus, Maximize2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";

export default function TopicsChat() {
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(`${config.SERVER_URL}/api/topics`, {
        prompt: userInput,
      });

      setAiResponse(response.data.aiResponse);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-4 bg-white shadow-lg rounded-lg p-3 resize ${
        isMinimized
          ? "w-[260px] h-[40px] overflow-hidden"
          : "w-[380px] max-h-[80vh] overflow-auto"
      } z-[9999] transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">צ'אט מושגים חכם</h3>
        <Button
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
        </Button>
      </div>

      {!isMinimized && (
        <>
          <div className="mb-4 text-sm">
            <p>רוצה להכיר מושגים חדשים?</p>
            <p className="underline text-xs mt-1">מושגים מומלצים:</p>
            <p className="text-xs">
              קוונטום, Mobility, Devops, ענן, Agtech, Creator Economy
            </p>
          </div>
          <Textarea
            placeholder="שאל כדי להכיר מושגים חדשים..."
            className="w-full resize-y"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
          {isLoading ? (
            <div className="flex flex-col items-center mt-4 gap-2">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <p className="text-xs text-muted-foreground">חושב..</p>
            </div>
          ) : (
            aiResponse && <p className="mt-4 text-sm">{aiResponse}</p>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !userInput}
            >
              שלח
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
