import express, { Request, Response } from "express";
import { Project, User } from "../db/dbUtils";
import authMiddleware from "../handlers/auth";
import { IProject, IUser } from "../models/models";
import { getAccessToken, verifyAccessToken } from "../handlers/authUtils";
import upload from "../handlers/uploadUtils";

const router = express.Router();
router.use(authMiddleware);

interface ProjectRequestBody {
  name: string;
  category: string;
  description: string;
  targetAudience: string;
  financialGoals: string;
  image: string;
}

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - targetAudience
 *               - financialGoals
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the project
 *               category:
 *                 type: string
 *                 description: Category of the project
 *               description:
 *                 type: string
 *                 description: Description of the project
 *               targetAudience:
 *                 type: string
 *                 description: Target audience of the project
 *               financialGoals:
 *                 type: string
 *                 description: Financial Goals of the project
 *     responses:
 *       201:
 *         description: Project successfully created.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during creation.
 */
// CREATE NEW PROJECT
router.post(
  "/",
  upload.single("startupImage"),
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        category,
        description,
        targetAudience,
        financialGoals,
      }: ProjectRequestBody = req.body;
      const image = req.file
        ? `${req.file?.destination}${req.file?.filename}`
        : undefined;

      if (
        !name ||
        !category ||
        !description ||
        !targetAudience ||
        !financialGoals
      ) {
        res.status(400).send({ error: "Please provide all details" });
        return;
      }

      const token = getAccessToken(req) || "";
      const { userId } = verifyAccessToken(token) || { userId: "" };
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      const newProject = new Project({
        name,
        category,
        description,
        targetAudience,
        financialGoals,
        owner: userId,
        image,
      });

      await newProject.save();

      user.projects.push(newProject._id);
      await user.save();

      const found = await Project.findById(newProject._id).populate("owner");
      res.status(201).send(found);
    } catch (error) {
      console.error("Error creating project:", error);
      res
        .status(500)
        .send({ error: "An error occurred while creating the project" });
    }
  }
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of all projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   targetAudience:
 *                     type: string
 *                   financialGoals:
 *                     type: string
 *       500:
 *         description: Error occurred during fetch.
 */
// GET ALL PROJECTS
router.get("/", async (req: Request, res: Response) => {
  try {
    const allProjects = await Project.find()
      .populate("owner")
      .sort({ createdAt: -1 });
    res.status(200).send(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching projects" });
  }
});

/**
 * @swagger
 * /projects/sender/{ownerId}:
 *   get:
 *     summary: Retrieve projects by a specific owner
 *     tags: [Projects]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the owner
 *     responses:
 *       200:
 *         description: A list of projects by the specified owner.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   targetAudience:
 *                     type: string
 *                   financialGoals:
 *                     type: string
 *                   ownerId:
 *                     type: string
 *                     description: The ID of the owner who created the project
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: No projects found for the given owner.
 *       500:
 *         description: Error occurred during fetch.
 */
// GET ALL PROJECTS BY SENDER
router.get("/sender/:sender", async (req: Request, res: Response) => {
  try {
    const sender = req.params.sender;

    if (!sender) {
      res.status(400).send({ error: "Please provide sender id" });
      return;
    }
    const senderProjects = await Project.find({ owner: sender })
      .populate("owner")
      .sort({ createdAt: -1 });
    if (!senderProjects.length) {
      res.status(404).send({ error: "No projects found for this sender" });
      return;
    }
    res.status(200).send(senderProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching projects" });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Retrieve a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details.
 *       400:
 *         description: Ivalid input.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Error occurred during fetch.
 */
// GET PROJECT BY ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ error: "Please provide project id" });
      return;
    }

    const found = await Project.findById(id).populate("owner");
    if (!found) {
      res.status(404).send({ error: "Project not found" });
      return;
    }

    res.status(200).send(found);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the project" });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   targetAudience:
 *                     type: string
 *                   financialGoals:
 *                     type: string
 *     responses:
 *       200:
 *         description: Project successfully updated.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Error occurred during update.
 */
// UPDATE PROJECT BY ID
router.put(
  "/:id",
  upload.single("startupImage"),
  async (req: Request, res: Response) => {
    try {
      const updatedProject: Partial<ProjectRequestBody> = {};
      const { name, category, description, targetAudience, financialGoals } =
        req.body;
      const image = `${req.file?.destination}${req.file?.filename}`;
      const id = req.params.id;

      if (
        !name ||
        !category ||
        !description ||
        !targetAudience ||
        !financialGoals ||
        !id
      ) {
        res
          .status(400)
          .send({ error: "Please provide project id and update details" });
        return;
      }

      if (name) updatedProject.name = name;
      if (category) updatedProject.category = category;
      if (description) updatedProject.description = description;
      if (targetAudience) updatedProject.targetAudience = targetAudience;
      if (financialGoals) updatedProject.financialGoals = financialGoals;
      if (req.file) updatedProject.image = image;

      const project = await Project.findById(id).populate("owner");
      const projectToUpdate = project as unknown as IProject & { owner: IUser };

      if (!projectToUpdate) {
        res.status(404).send({ error: "Project not found" });
        return;
      }

      const token = getAccessToken(req) || "";
      const { userId } = verifyAccessToken(token) || { userId: "" };

      if (projectToUpdate.owner._id.toString() !== userId) {
        res.status(401).send({ error: "No permission to update this project" });
        return;
      }

      const updated = await Project.findOneAndUpdate(
        { _id: id },
        updatedProject,
        {
          returnDocument: "after",
        }
      );

      res.status(200).send(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res
        .status(500)
        .send({ error: "An error occurred while updating the project" });
    }
  }
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project successfully deleted.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Error occurred during delete.
 */
// DELETE PROJECT BY ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      res.status(400).send({ error: "Please provide project id" });
      return;
    }

    const project = await Project.findById(projectId).populate("owner");
    const projectToDelete = project as unknown as IProject & { owner: IUser };

    if (!projectToDelete) {
      res.status(404).send({ error: "Project not found" });
      return;
    }

    const token = getAccessToken(req) || "";
    const { userId } = verifyAccessToken(token) || { userId: "" };

    if (projectToDelete.owner._id.toString() !== userId) {
      res.status(401).send({ error: "No permission to delete this project" });
      return;
    }

    const user = projectToDelete.owner;
    user.projects.pull(projectId);
    await user.save();

    await Project.findByIdAndDelete(projectId);

    res.status(200).send({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the project" });
  }
});

// // ADD LIKE TO POST
// router.post("/like", async (req: Request, res: Response) => {
//   try {
//     const { postId }: { postId: string } = req.body;

//     if (!postId) {
//       res.status(400).send({ error: "Please provide postId" });
//       return;
//     }

//     const token = getAccessToken(req) || "";
//     const { userId } = verifyAccessToken(token) || { userId: "" };
//     const user = await User.findById(userId);

//     if (!user) {
//       res.status(404).send({ error: "User not found" });
//       return;
//     }

//     const update = { $push: { likes: user } };
//     const updatedPost = await Post.findByIdAndUpdate(postId, update, {
//       new: true,
//     });

//     if (!updatedPost) {
//       res.status(404).send({ error: "Post not found" });
//       return;
//     }

//     res.status(201).send(updatedPost);
//   } catch (error) {
//     console.error("Error adding like:", error);
//     res
//       .status(500)
//       .send({ error: "An error occurred while adding the like" });
//   }
// });

// // DELETE LIKE FROM POST
// router.delete("/like/:id", async (req: Request, res: Response) => {
//   try {
//     const postId = req.params.id;

//     if (!postId) {
//       res.status(400).send({ error: "Please provide postId" });
//       return;
//     }

//     const token = getAccessToken(req) || "";
//     const { userId } = verifyAccessToken(token) || { userId: "" };
//     const user = await User.findById(userId);

//     if (!user) {
//       res.status(404).send({ error: "User not found" });
//       return;
//     }

//     const update = { $pull: { likes: new mongoose.Types.ObjectId(userId) } };
//     const updatedPost = await Post.findByIdAndUpdate(postId, update, {
//       new: true,
//     });

//     if (!updatedPost) {
//       res.status(404).send({ error: "Post not found" });
//       return;
//     }

//     res.status(201).send(updatedPost);
//   } catch (error) {
//     console.error("Error adding like:", error);
//     res
//       .status(500)
//       .send({ error: "An error occurred while adding the like" });
//   }
// });

export default router;
