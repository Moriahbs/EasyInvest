import { useEffect, useState } from "react";
import { MailPlus, UserIcon } from "lucide-react";
import { getUsersByFavorite } from "@/actions/profileActions";
import { User } from "@/models/userModel";
import ContactModal from "./ContactModal";

export default function StartupSavesList({ startupId }: { startupId: string }) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [interestedUsers, setInterestedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      await getInterestedUsers();
    };
    fetchAndUpdateData();
  }, []);

  const getInterestedUsers = async () => {
    const users = await getUsersByFavorite(startupId);
    setInterestedUsers(users);
  };

  return (
    <div className="h-96 overflow-y-auto p-4">
      {interestedUsers.map((user) => (
        <div
          key={user._id}
          className="flex justify-between border-b py-2 gap-2"
        >
          <div className="flex gap-2 items-center">
            <UserIcon className="w-4 h-4" />
            <p className="text-blue-950 font-bold">{user.username}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setSenderEmail(user.email);
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
    </div>
  );
}
