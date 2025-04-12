import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import config from "@/config.ts";
import { Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";

export default function TopicsChat({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
}) {
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(`${config.SERVER_URL}/api/topics`, {
        prompt: userInput,
      });

      setAiResponse(response.data.aiResponse);
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
          <DialogTitle className="py-3">AI Topics</DialogTitle>
          <div className="mb-4">
            <p>Want to know new topics?</p>
            <p className="underline text-sm">Suggested Topics:</p>
            <p className="text-sm">
              Cloud, Quantum, Mobility, Agtech, Creator Economy, DevOps
            </p>
          </div>
          <Textarea
            placeholder="Ask to know new topic"
            className="w-full"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
          {isLoading ? (
            <div className="flex flex-col items-center mt-4 gap-2">
              <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          ) : (
            <>{aiResponse && <p className="mt-4 text-sm">{aiResponse}</p>}</>
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
