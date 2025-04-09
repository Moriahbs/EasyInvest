import config from "@/config";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";

interface UploadProfileProps {
  setImage: (image: File | null) => void;
  imageUrl?: string;
}

const UploadImage: React.FC<UploadProfileProps> = ({ setImage, imageUrl }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-5">
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <Avatar className="w-32 h-32">
          {preview ? (
            <AvatarImage src={preview} alt="Image Preview" />
          ) : imageUrl ? (
            <AvatarImage src={`${config.SERVER_URL}/${imageUrl}`} />
          ) : (
            <AvatarImage
              src={"./src//assets/default.png"}
              className="bg-gray-300"
            />
          )}
        </Avatar>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
};

export default UploadImage;
