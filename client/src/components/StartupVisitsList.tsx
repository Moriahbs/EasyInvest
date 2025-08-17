import { useState } from "react";
import { MailPlus, UserIcon } from "lucide-react";
import dayjs from "dayjs";
import ContactModal from "./ContactModal";
import { Startup, Visit } from "@/models/StartupModel";

export default function StartupSavesList({ startup }: { startup: Startup }) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [senderEmail, setSenderEmail] = useState<string>("");
  const usersVisits = startup?.visits?.sort((a, b) => (new Date(b.visitedAt) as any) - (new Date(a.visitedAt) as any));

  return (
    <div className="h-96 overflow-y-auto p-4">
      {usersVisits?.length ? (
        <>
          {usersVisits?.map((visit: Visit) => (
            <div
              key={visit.user._id}
              className="flex justify-between border-b py-2 gap-2"
            >
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 ml-2" />
                <p className="text-blue-950 font-bold ml-3">
                  {visit.user.username}
                </p>
                <p className="text-gray-500">צפה בעמוד ב</p>
                <p className="text-gray-500">
                  {dayjs(visit.visitedAt).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <button
                onClick={() => {
                  setSenderEmail(visit.user.email);
                  setOpenModal(true);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-full p-2"
              >
                <MailPlus className="w-5 h-5" />
              </button>
            </div>
          ))}

          {openModal && senderEmail && senderEmail !== "" && (
            <ContactModal
              open={openModal}
              setOpen={setOpenModal}
              email={senderEmail}
            />
          )}
        </>
      ) : (
        <div className="size-full items-center flex justify-center">
          <p className="text-gray-600 ml-3">אין נתונים להצגה</p>
        </div>
      )}
    </div>
  );
}
