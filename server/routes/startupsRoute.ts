import express, { Request, Response } from "express";
import { Startup, User } from "../db/dbUtils";
import authMiddleware from "../handlers/auth";
import { IStartup, IUser } from "../models/models";
import { getAccessToken, verifyAccessToken } from "../handlers/authUtils";
import upload from "../handlers/uploadUtils";

const router = express.Router();
router.use(authMiddleware);

interface StartupRequestBody {
  tags: string[];
  foundedYear: number;
  valuationLastRound: number;
  location: string;
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  fundingStage: string;
  image: string;
}

/**
 * @swagger
 * /startups:
 *   post:
 *     summary: Create a new startup
 *     tags: [Startups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - fundingStage
 *               - valuationLastRound
 *               - location
 *               - latitude
 *               - longitude
 *               - foundedYear
 *               - tags
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               foundedYear:
 *                 type: integer
 *               valuationLastRound:
 *                 type: number
 *               latitude:
 *                 type: number
 *               location:
 *                 type: string
 *               longitude:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               fundingStage:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Startup successfully created.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during creation.
 */
// CREATE NEW STARTUP
router.post(
  "/",
  upload.single("startupImage"),
  async (req: Request, res: Response) => {
    try {
      const {
        tags,
        foundedYear,
        valuationLastRound,
        location,
        latitude,
        longitude,
        name,
        description,
        fundingStage,
      }: StartupRequestBody = req.body;
      const image = req.file
        ? `${req.file?.destination}${req.file?.filename}`
        : undefined;

      if (
        !name ||
        !description ||
        !fundingStage ||
        !valuationLastRound ||
        !location ||
        !latitude ||
        !longitude ||
        !foundedYear ||
        !tags
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

      const newStartup = new Startup({
        tags,
        foundedYear,
        valuationLastRound,
        location,
        latitude,
        longitude,
        name,
        description,
        fundingStage,
        owner: userId,
        image,
      });

      await newStartup.save();

      user.startups.push(newStartup._id);
      await user.save();

      const found = await Startup.findById(newStartup._id).populate("owner");
      res.status(201).send(found);
    } catch (error) {
      console.error("Error creating startup:", error);
      res
        .status(500)
        .send({ error: "An error occurred while creating the startup" });
    }
  }
);

/**
 * @swagger
 * /startups:
 *   get:
 *     summary: Retrieve all startups
 *     tags: [Startups]
 *     responses:
 *       200:
 *         description: A list of all startups.
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
 *                   description:
 *                     type: string
 *                   fundingStage:
 *                     type: string
 *                   valuationLastRound:
 *                     type: number
 *                   latitude:
 *                     type: number
 *                   location:
 *                     type: string
 *                   longitude:
 *                     type: number
 *                   foundedYear:
 *                     type: integer
 *                   tags:
 *                     type: array
 *                   items:
 *                       type: string
 *       500:
 *         description: Error occurred during fetch.
 */
// GET ALL STARTUPS
router.get("/", async (req: Request, res: Response) => {
  try {
    const allStartups = await Startup.find()
      .populate("owner")
      .sort({ createdAt: -1 });
    res.status(200).send(allStartups);
  } catch (error) {
    console.error("Error fetching startups:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching startups" });
  }
});

/**
 * @swagger
 * /startups/sender/{ownerId}:
 *   get:
 *     summary: Retrieve startups by a specific owner
 *     tags: [Startups]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the owner
 *     responses:
 *       200:
 *         description: A list of startups by the specified owner.
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
 *                   description:
 *                     type: string
 *                   fundingStage:
 *                     type: string
 *                   valuationLastRound:
 *                     type: number
 *                   latitude:
 *                     type: number
 *                   location:
 *                     type: string
 *                   longitude:
 *                     type: number
 *                   foundedYear:
 *                     type: integer
 *                   tags:
 *                     type: array
 *                   items:
 *                       type: string
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: No startups found for the given owner.
 *       500:
 *         description: Error occurred during fetch.
 */
// GET ALL STARTUPS BY SENDER
router.get("/sender/:sender", async (req: Request, res: Response) => {
  try {
    const sender = req.params.sender;
    if (!sender) {
      res.status(400).send({ error: "Please provide sender id" });
      return;
    }
    const senderStartups = await Startup.find({ owner: sender })
      .populate("owner")
      .sort({ createdAt: -1 });
    if (!senderStartups.length) {
      res.status(404).send({ error: "No startups found for this sender" });
      return;
    }
    res.status(200).send(senderStartups);
  } catch (error) {
    console.error("Error fetching startups:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching startups" });
  }
});

/**
 * @swagger
 * /startups/{id}:
 *   get:
 *     summary: Retrieve a startup by ID
 *     tags: [Startups]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Startup ID
 *     responses:
 *       200:
 *         description: Startup details.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Startup not found.
 *       500:
 *         description: Error occurred during fetch.
 */
// GET STARTUP BY ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ error: "Please provide startup id" });
      return;
    }

    const found = await Startup.findById(id).populate("owner");
    if (!found) {
      res.status(404).send({ error: "Startup not found" });
      return;
    }

    res.status(200).send(found);
  } catch (error) {
    console.error("Error fetching startup by ID:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the startup" });
  }
});

/**
 * @swagger
 * /startups/{id}:
 *   put:
 *     summary: Update a startup by ID
 *     tags: [Startups]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Startup ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - fundingStage
 *               - valuationLastRound
 *               - location
 *               - latitude
 *               - longitude
 *               - foundedYear
 *               - tags
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               foundedYear:
 *                 type: integer
 *               valuationLastRound:
 *                 type: number
 *               latitude:
 *                 type: number
 *               location:
 *                 type: string
 *               longitude:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               fundingStage:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Startup successfully updated.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Startup not found.
 *       500:
 *         description: Error occurred during update.
 */
// UPDATE STARTUP BY ID
router.put(
  "/:id",
  upload.single("startupImage"),
  async (req: Request, res: Response) => {
    try {
      const updatedStartup: Partial<StartupRequestBody> = {};
      const {
        tags,
        foundedYear,
        valuationLastRound,
        location,
        latitude,
        longitude,
        name,
        description,
        fundingStage,
      } = req.body;
      const image = `${req.file?.destination}${req.file?.filename}`;
      const id = req.params.id;

      if (
        !name ||
        !description ||
        !fundingStage ||
        !valuationLastRound ||
        !location ||
        !latitude ||
        !longitude ||
        !foundedYear ||
        !tags ||
        !id
      ) {
        res
          .status(400)
          .send({ error: "Please provide startup id and update details" });
        return;
      }

      if (tags) updatedStartup.tags = tags;
      if (foundedYear) updatedStartup.foundedYear = foundedYear;
      if (valuationLastRound)
        updatedStartup.valuationLastRound = valuationLastRound;
      if (latitude) updatedStartup.latitude = latitude;
      if (location) updatedStartup.location = location;
      if (longitude) updatedStartup.longitude = longitude;
      if (name) updatedStartup.name = name;
      if (description) updatedStartup.description = description;
      if (fundingStage) updatedStartup.fundingStage = fundingStage;
      if (req.file) updatedStartup.image = image;

      const startup = await Startup.findById(id).populate("owner");
      const startupToUpdate = startup as unknown as IStartup & { owner: IUser };

      if (!startupToUpdate) {
        res.status(404).send({ error: "Startup not found" });
        return;
      }

      const token = getAccessToken(req) || "";
      const { userId } = verifyAccessToken(token) || { userId: "" };

      if (startupToUpdate.owner._id.toString() !== userId) {
        res.status(401).send({ error: "No permission to update this startup" });
        return;
      }

      const updated = await Startup.findOneAndUpdate(
        { _id: id },
        updatedStartup,
        {
          returnDocument: "after",
        }
      );

      res.status(200).send(updated);
    } catch (error) {
      console.error("Error updating startup:", error);
      res
        .status(500)
        .send({ error: "An error occurred while updating the startup" });
    }
  }
);

/**
 * @swagger
 * /startups/{id}:
 *   delete:
 *     summary: Delete a startup by ID
 *     tags: [Startups]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Startup ID
 *     responses:
 *       200:
 *         description: Startup successfully deleted.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Startup not found.
 *       500:
 *         description: Error occurred during delete.
 */
// DELETE STARTUP BY ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const startupId = req.params.id;

    if (!startupId) {
      res.status(400).send({ error: "Please provide startup id" });
      return;
    }

    const startup = await Startup.findById(startupId).populate("owner");
    const startupToDelete = startup as unknown as IStartup & { owner: IUser };

    if (!startupToDelete) {
      res.status(404).send({ error: "Startup not found" });
      return;
    }

    const token = getAccessToken(req) || "";
    const { userId } = verifyAccessToken(token) || { userId: "" };

    if (startupToDelete.owner._id.toString() !== userId) {
      res.status(401).send({ error: "No permission to delete this startup" });
      return;
    }

    const user = startupToDelete.owner;
    user.startups.pull(startupId);
    await user.save();

    await Startup.findByIdAndDelete(startupId);

    res.status(200).send({ message: "Startup successfully deleted" });
  } catch (error) {
    console.error("Error deleting startup:", error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the startup" });
  }
});

export default router;
