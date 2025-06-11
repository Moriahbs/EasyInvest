import express, { Request, Response } from "express";
import mongoose from "mongoose";
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
  contactEmail: string;
  contactPhone: string;
  founders: string;
  image: string;
  country: string;
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
 *         multipart/form-data:
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
 *               - contactEmail
 *               - country
 *               - contactPhone
 *               - founders
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
 *               contactEmail:
 *                 type: string
 *               country:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               founders:
 *                 type: string
 *               startupImage:
 *                 type: string
 *                 format: binary
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
        contactEmail,
        contactPhone,
        founders,
        country,
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
        !tags ||
        !contactEmail ||
        !contactPhone ||
        !founders ||
        !country
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
        contactEmail,
        contactPhone,
        founders,
        owner: userId,
        image,
        country,
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

const valuationRanges = [
  { min: 0, max: 5000000 },
  { min: 5000000, max: 10000000 },
  { min: 10000000, max: 20000000 },
  { min: 20000000, max: Infinity },
];

const HEBREW_COUNTRIES = [
  "ארצות הברית",
  "קנדה",
  "צרפת",
  "גרמניה",
  "בריטניה",
  "אוסטרליה",
  "הודו",
  "סין",
  "יפן",
  "ברזיל",
  "רוסיה",
  "ישראל",
  "ספרד",
  "איטליה",
  "אחר",
];

/**
 * @swagger
 * /startups:
 *   get:
 *     summary: Retrieve filtered startups
 *     tags: [Startups]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name of the startup
 *         schema:
 *           type: string
 *       - in: query
 *         name: region
 *         required: false
 *         description: The region where the startup is located (e.g., "ישראל", "חו״ל").
 *         schema:
 *           type: string
 *       - in: query
 *         name: fundingStages
 *         required: false
 *         description: Comma-separated list of funding stages (e.g., "seed,series_a").
 *         schema:
 *           type: string
 *       - in: query
 *         name: categories
 *         required: false
 *         description: Comma-separated list of startup categories (e.g., "tech,health").
 *         schema:
 *           type: string
 *       - in: query
 *         name: valuation
 *         required: false
 *         description: The valuation range of the startup based on last funding round (e.g., "0,5000000" for valuation between 0 and 5 million).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of filtered startups.
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
 *                   contactEmail:
 *                     type: string
 *                   country:
 *                     type: string
 *                   contactPhone:
 *                     type: string
 *                   founders:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       500:
 *         description: Error occurred during fetching the startups.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching startups"
 */
// GET ALL STARTUPS
router.get("/", async (req: Request, res: Response) => {
  try {
    const { name, region, fundingStages, categories, valuation } = req.query;

    const filter: any = {};
    if (name) {
      filter.name = { $regex: name as string, $options: "i" };
    }

    if (region) {
      if (region === "אחר") {
        filter.country = { $nin: HEBREW_COUNTRIES };
      } else {
        filter.country = region;
      }
    }
    if (fundingStages)
      filter.fundingStage = { $in: (fundingStages as string).split(",") };
    if (categories) filter.tags = { $in: (categories as string).split(",") };
    if (valuation !== undefined) {
      const idx = parseInt(valuation as string, 10);
      const range = valuationRanges[idx] || valuationRanges[0];
      filter.valuationLastRound = { $gte: range.min, $lt: range.max };
    }

    const startups = await Startup.find(filter)
      .populate("owner")
      .sort({ createdAt: -1 });

    res.status(200).json(startups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching startups" });
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
 *                   contactEmail:
 *                     type: string
 *                   country:
 *                     type: string
 *                   contactPhone:
 *                     type: string
 *                   founders:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
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
      .populate("visits.user")
      .sort({ createdAt: -1 });
    if (!senderStartups.length) {
      res.status(200).send([]);
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 fundingStage:
 *                   type: string
 *                 valuationLastRound:
 *                   type: number
 *                 latitude:
 *                   type: number
 *                 location:
 *                   type: string
 *                 longitude:
 *                   type: number
 *                 foundedYear:
 *                   type: integer
 *                 contactEmail:
 *                   type: string
 *                 country:
 *                   type: string
 *                 contactPhone:
 *                   type: string
 *                 founders:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 image:
 *                   type: string
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
 *         multipart/form-data:
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
 *               - contactEmail
 *               - country
 *               - contactPhone
 *               - founders
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
 *               contactEmail:
 *                 type: string
 *               country:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               founders:
 *                 type: string
 *               startupImage:
 *                 type: string
 *                 format: binary
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
        contactEmail,
        contactPhone,
        founders,
        country,
      } = req.body;
      const image = req.file
        ? `${req.file?.destination}${req.file?.filename}`
        : undefined;
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
        !contactEmail ||
        !contactPhone ||
        !founders ||
        !id ||
        !country
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
      if (contactEmail) updatedStartup.contactEmail = contactEmail;
      if (country) updatedStartup.country = country;
      if (contactPhone) updatedStartup.contactPhone = contactPhone;
      if (founders) updatedStartup.founders = founders;
      if (image) updatedStartup.image = image;

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

/**
 * @swagger
 * /startups/{startupId}/visit:
 *   post:
 *     summary: Add visit to startup
 *     tags: [Startups]
 *     parameters:
 *       - name: startupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully added visit.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Startup or user not found.
 *       500:
 *         description: Failed to add visit.
 */
router.post("/visit", async (req: Request, res: Response) => {
  try {
    const { startupId }: { startupId: string } = req.body;

    if (!startupId) {
      res.status(400).send({ error: "Please provide startupId" });
      return;
    }

    const token = getAccessToken(req) || "";
    const { userId } = verifyAccessToken(token) || { userId: "" };

    const [user, startup] = await Promise.all([
      User.findById(userId),
      Startup.findById(startupId),
    ]);

    if (!user || !startup) {
      res.status(404).send({ error: "User or Startup not found" });
      return;
    }

    // Add visit to Startup document
    const update = {
      $push: {
        visits: {
          user: userId,
          visitedAt: new Date(),
        },
      },
    };

    const updatedStartup = await Startup.findByIdAndUpdate(startupId, update, { new: true });

    res.status(201).send(updatedStartup);
  } catch (error) {
    console.error("Error adding visit to startup:", error);
    res.status(500).send({ error: "An error occurred while adding the visit" });
  }
});


/**
 * @swagger
 * /startups/{startupId}/visit:
 *   get:
 *     summary: Get visit stats for startup
 *     tags: [Startups]
 *     parameters:
 *       - name: startupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: range
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [daily, monthly]
 *     responses:
 *       200:
 *         description: Visit details.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Error occurred during fetch.
 */
router.get("/visit/:startupId", async (req: Request, res: Response) => {
  try {
    const startupId = req.params.startupId;
    const range = req.query.range as "daily" | "monthly";

    if (!startupId) {
      res.status(400).send({ error: "Please provide startupId" });
      return;
    }

    const startupObjectId = new mongoose.Types.ObjectId(startupId);

    let fromDate: Date;
    let groupFormat: string;

    if (range === "monthly") {
      fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 3);
      groupFormat = "%Y-%m";
    } else {
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 6);
      groupFormat = "%Y-%m-%d";
    }

    const result = await Startup.aggregate([
      { $match: { _id: startupObjectId } },
      { $unwind: "$visits" },
      {
        $match: {
          "visits.visitedAt": { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: groupFormat,
                date: "$visits.visitedAt",
              },
            },
            userId: "$visits.user",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          uniqueVisits: { $sum: 1 },
          allVisits: { $sum: "$count" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          allVisits: 1,
          uniqueVisits: 1,
        },
      },
    ]);

    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching startup visits:", error);
    res.status(500).send({ error: "An error occurred while fetching visits" });
  }
});

export default router;
