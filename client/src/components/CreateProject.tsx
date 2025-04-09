import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/actions/projectActions";
import UploadImage from "./UploadImage";
import { toast } from "sonner";

export interface NewProject {
  name: string;
  category: string;
  description: string;
  targetAudience: string;
  financialGoals: string;
  image?: string;
}

export default function CreateProjectModal({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  onCreate: (newProject: any) => void;
}) {
  const [projectDetails, setProjectDetails] = useState<NewProject>({
    name: "",
    category: "",
    description: "",
    targetAudience: "",
    financialGoals: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { name, category, description, targetAudience, financialGoals } =
      projectDetails;
    if (
      !name ||
      !category ||
      !description ||
      !targetAudience ||
      !financialGoals
    )
      return toast.error("יש למלא את כל השדות");

    setLoading(true);
    const newProject = await createProject(
      name,
      category,
      description,
      targetAudience,
      financialGoals,
      image
    );
    setLoading(false);
    onCreate(newProject);
    setOpen(false);
    setProjectDetails({
      name: "",
      category: "",
      description: "",
      targetAudience: "",
      financialGoals: "",
    });
  };

  const labelClass =
    "block font-semibold text-right text-sm leading-tight mb-1";
  const inputClass = "mb-[0.6rem]";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent dir="rtl" className="font-hebrew max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl flex justify-center">
            יצירת פרויקט חדש
          </DialogTitle>
        </DialogHeader>

        <div className="flex w-full">
          <div className="w-1/4">
            <UploadImage setImage={setImage} />
          </div>

          <div className="w-3/4 flex flex-col">
            <label className={labelClass}>שם הפרויקט</label>
            <Input
              className={inputClass}
              placeholder="שם קליט שייצג את הפרויקט"
              value={projectDetails.name}
              onChange={(e) =>
                setProjectDetails({ ...projectDetails, name: e.target.value })
              }
            />

            <label className={labelClass}>קטגוריה</label>
            <Input
              className={inputClass}
              placeholder="קטגוריה או נושא"
              value={projectDetails.category}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  category: e.target.value,
                })
              }
            />

            <label className={labelClass}>תיאור</label>
            <Textarea
              className={inputClass}
              placeholder="תיאור"
              value={projectDetails.description}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  description: e.target.value,
                })
              }
            />

            <label className={labelClass}>קהל היעד</label>
            <Input
              className={inputClass}
              placeholder="קהל היעד"
              value={projectDetails.targetAudience}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  targetAudience: e.target.value,
                })
              }
            />

            <label className={labelClass}>יעדים כספיים</label>
            <Input
              className={inputClass}
              placeholder="יעדים כספיים"
              value={projectDetails.financialGoals}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  financialGoals: e.target.value,
                })
              }
            />

            <div className="w-full flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-1/3 bg-[#5252cb] hover:bg-[#7878e0] border-none mt-2 just"
              >
                {loading ? "מעלה את הפרויקט..." : "יצירה"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
