import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../db/dbUtils";
import authMiddleware from "../handlers/auth";
import upload from "../handlers/uploadUtils";
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessToken,
  verifyAccessToken,
} from "../handlers/authUtils";
import nodemailer from "nodemailer";

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Error occurred during creation.
 */
// REGISTER
router.post(
  "/register",
  upload.single("profileImage"),
  async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const destination = req.file?.destination;
      const filename = req.file?.filename;
      const profilePhoto =
        destination && filename ? `${destination}${filename}` : "";

      if (!username || !email || !password) {
        res.status(400).send({ error: "יש למלא את כל השדות" });
        return;
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        res.status(400).send({ error: "שם משתמש או אמייל כבר קיימים" });
        return;
      }

      if (password.length < 10) {
        res
          .status(400)
          .send({ error: "סיסמא צריכה להיות באורך 10 תווים לפחות" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePhoto,
      });

      const user = await newUser.save();
      const userId = user._id.toString();

      const accessToken = generateAccessToken({ userId });
      const refreshToken = generateRefreshToken({ userId });

      res.cookie("refreshToken", refreshToken);
      res.cookie("Authorization", `Bearer ${accessToken}`);

      res.status(201).send({ accessToken });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send({ error: "An error occurred" });
    }
  }
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully logged in.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Error occurred during creation.
 */
// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send({ error: "Please provide all fields" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password || ""
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const userId = existingUser._id.toString();
    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId });

    res.cookie("refreshToken", refreshToken);
    res.cookie("Authorization", `Bearer ${accessToken}`);

    res.status(201).send({ accessToken });
  } catch (error) {
    console.error("Error login user:", error);
    res.status(500).send({ error: "An error occurred" });
  }
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized.
 */
// LOGOUT
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("Authorization");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 */
// GET ALL USERS
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "An error occurred while fetching users" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during fetch.
 */
// GET USER BY ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ error: "Please provide user id" });
      return;
    }

    const user = await User.findById(id).populate("favorites");

    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the user" });
  }
});

/**
 * @swagger
 * /users/favorite/{startupId}:
 *   get:
 *     summary: Get users favorite by startup id
 *     tags: [Users]
 *     parameters:
 *       - name: startupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Startup ID
 *     responses:
 *       200:
 *         description: Users details.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during fetch.
 */
// GET USERS BY FAVORITE
router.get("/favorite/:startupId", async (req: Request, res: Response) => {
  try {
    const startupId = req.params.startupId;

    if (!startupId) {
      res.status(400).send({ error: "Please provide startup id" });
      return;
    }

    const users = await User.find({ favorites: startupId });

    if (!users) {
      res.status(404).send({ error: "Users not found" });
      return;
    }

    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the user" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully updated.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during update.
 */
// UPDATE USER BY ID
router.put(
  "/:id",
  upload.single("profileImage"),
  async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const profilePhoto = `${req.file?.destination}${req.file?.filename}`;
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .send({ error: "Please provide user id and update details" });
        return;
      }

      const updateData: {
        username?: string;
        email?: string;
        password?: string;
        profilePhoto?: string;
      } = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      if (req.file) updateData.profilePhoto = profilePhoto;

      const userToUpdate = await User.findOne({ _id: id });

      if (!userToUpdate) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      const token = getAccessToken(req) || "";
      const { userId } = verifyAccessToken(token) || { userId: "" };

      if (userToUpdate._id.toString() !== userId) {
        res.status(401).send({ error: "No permission to update this user" });
        return;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      res.status(200).send(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .send({ error: "An error occurred while updating the user" });
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during delete.
 */
// DELETE USER BY ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ error: "Please provide user id" });
      return;
    }

    const token = getAccessToken(req) || "";
    const { userId } = verifyAccessToken(token) || { userId: "" };

    if (id !== userId) {
      res.status(401).send({ error: "No permission to delete this post" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(200).send(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the user" });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * @swagger
 * /users/favorite:
 *   post:
 *     summary: add startup to favorites
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startupId
 *             properties:
 *               startupId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added startup successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to add.
 */
// ADD STARTUP TO FAVORITES
router.post("/favorite", async (req: Request, res: Response) => {
  try {
    const { startupId }: { startupId: string } = req.body;

    if (!startupId) {
      res.status(400).send({ error: "Please provide startupId" });
      return;
    }

    const token = getAccessToken(req) || "";
    const { userId } = verifyAccessToken(token) || { userId: "" };
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const update = { $push: { favorites: startupId } };
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(201).send(updatedUser);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res
      .status(500)
      .send({ error: "An error occurred while adding the favorite" });
  }
});

/**
 * @swagger
 * /users/favorite/{startupId}:
 *   delete:
 *     summary: Delete startup from favorites
 *     tags: [Users]
 *     parameters:
 *       - name: startupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Startup Id
 *     responses:
 *       200:
 *         description: Startup successfully deleted.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error occurred during delete.
 */
// DELETE STARTUP FROM FAVORITES
router.delete("/favorite/:startupId", async (req: Request, res: Response) => {
  try {
    const startupId = req.params.startupId;

    if (!startupId) {
      res.status(400).send({ error: "Please provide startupId" });
      return;
    }

    const token = getAccessToken(req);
    if (!token) {
      res.status(401).send({ error: "Access token required" });
      return;
    }

    const { userId } = verifyAccessToken(token) || {};
    if (!userId) {
      res.status(401).send({ error: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: startupId } },
      { new: true }
    );

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error removing favorite:", error);
    res
      .status(500)
      .send({ error: "An error occurred while removing the favorite" });
  }
});

/**
 * @swagger
 * /users/email/{email}:
 *   post:
 *     summary: send email
 *     tags: [Users]
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Invalid user.
 *       403:
 *         description: No permission to send email.
 *       500:
 *         description: Failed to send email.
 */
// SEND EMAIL TO USER
router.post("/email/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const { subject, message } = req.body;

    if (!email || !subject || !message) {
      res.status(400).send({ error: "Missing email, subject, or message" });
    }

    const token = getAccessToken(req) || "";
    const { userId } = verifyAccessToken(token) || { userId: "" };

    const user = await User.findById(userId);
    if (!user) {
      res.status(401).send({ error: "Invalid user" });
      return;
    }

    if (user.email !== email) {
      res.status(403).send({ error: "No permission to send to this email" });
      return;
    }

    await transporter.sendMail({
      from: '"Easy Invest" <' + process.env.EMAIL + ">",
      to: email,
      subject,
      text: message,
      headers: {
        "X-Mailer": "Nodemailer",
        "X-Priority": "1 (Highest)",
      },
    });

    await transporter.sendMail({
      from: '"Easy Invest" <' + process.env.EMAIL + ">",
      to: user.email,
      subject: "הודעה בדבר פנייה",
      text: ` שלום${user.username}, פנייתך נשלחה בהצלחה `,
      headers: {
        "X-Mailer": "Nodemailer",
        "X-Priority": "1 (Highest)",
      },
    });

    await transporter.sendMail({
      from: '"Easy Invest" <' + process.env.EMAIL + ">",
      to: user.email,
      subject: "אישור פנייה",
      text: ` שלום${user.username}, פנייתך נשלחה בהצלחה `,
      headers: {
        "X-Mailer": "Nodemailer",
        "X-Priority": "1 (Highest)",
      },
    });

    res.status(200).send({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Failed to send email" });
  }
});

export default router;
