import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { sendEmail } from "@/actions/profileActions.ts";
import { toast } from "sonner";

export default function ContactModal({
  open,
  setOpen,
  email,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  email: string;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendEmail(email, subject, message);
      toast.success("ההודעה נשלחה בהצלחה!");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error sending email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="w-2/5 h-3/4 max-w-screen-xl p-6 overflow-y-auto !z-[2147483647] bg-white text-black rounded-lg shadow-lg [&>button.absolute]:hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-2xl font-bold text-center">צור קשר</h2>

          <label className="flex flex-col text-right">
            <span className="mb-1 font-medium">נושא</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-[70vh] p-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="flex flex-col text-right">
            <span className="mb-1 font-medium">הודעה</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              className="w-[70vh] p-2 bg-white text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 w-[30vh]"
            disabled={loading}
          >
            {loading ? "שולח..." : "שלח הודעה"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
