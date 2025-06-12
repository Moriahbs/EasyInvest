import request from "supertest";
import appPromise from "../app";
import { User, Startup } from "../models/models";
import mongoose from "mongoose";
import { Express } from "express";
import { verifyAccessToken } from "../handlers/authUtils";
import path from "path";

describe("User API tests", () => {
  var app: Express;
  let authToken: string;
  let startupId: string;

  beforeAll(async () => {
    app = await appPromise;

    await User.deleteMany();
    await Startup.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Register user", async () => {
    const response = await request(app)
      .post("/users/register")
      .field("username", "test")
      .field("email", "test@gmail.com")
      .field("password", "test123456")
      .attach(
        "profileImage",
        path.join(__dirname, "../images/users/archie.jpeg")
      );

    authToken = response.body.accessToken;

    expect(response.statusCode).toEqual(201);
  });

  test("Logout user", async () => {
    const response = await request(app)
      .post("/users/logout")
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Login user", async () => {
    const userDemo = {
      username: "test",
      password: "test123456",
    };

    const response = await request(app)
      .post("/users/login")
      .send(userDemo)
      .set("Content-Type", "application/json");

    authToken = response.body.accessToken;

    expect(response.statusCode).toEqual(201);
  });

  test("Get all users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Get user by id", async () => {
    const decodedToken = verifyAccessToken(authToken);
    const response = await request(app)
      .get(`/users/${decodedToken?.userId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Update user by id", async () => {
    const decodedToken = verifyAccessToken(authToken);
    const updatedUser = {
      username: "test2",
      email: "test2@gmail.com",
      password: "test123456",
    };

    const response = await request(app)
      .put(`/users/${decodedToken?.userId}`)
      .send(updatedUser)
      .set("Content-Type", "application/json")
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Get users by favorite", async () => {
    const startupDemo = {
      tags: ["קיימות", "אנרגיה מתחדשת"],
      foundedYear: 2025,
      valuationLastRound: 10000,
      location: "israel",
      latitude: 10,
      longitude: 20,
      name: "test",
      description: "test for favorites",
      fundingStage: "סיד",
      contactEmail: "test@gmail.com",
      contactPhone: "0500000000",
      founders: "test",
      country: "israel",
    };

    const startupRes = await request(app)
      .post("/startups")
      .send(startupDemo)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    startupId = startupRes.body._id;

    const response = await request(app)
      .get(`/users/favorite/${startupId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);
    expect(response.statusCode).toEqual(200);
  });

  test("Add startup to favorites", async () => {
    const response = await request(app)
      .post(`/users/favorite`)
      .send({ startupId })
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(201);
  });

  test("Delete startup from favorites", async () => {
    const response = await request(app)
      .delete(`/users/favorite/${startupId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Send email to user", async () => {
    const emailDemo = {
      subject: "test",
      message: "message test",
    };

    const response = await request(app)
      .post(`/users/email/test2@gmail.com`)
      .send(emailDemo)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  }, 15000);

  test("Delete user by id", async () => {
    const decodedToken = verifyAccessToken(authToken);
    const response = await request(app)
      .delete(`/users/${decodedToken?.userId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });
});
