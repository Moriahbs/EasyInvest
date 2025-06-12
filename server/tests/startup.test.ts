import request from "supertest";
import appPromise from "../app";
import { Startup, User } from "../models/models";
import mongoose from "mongoose";
import { Express } from "express";
import { verifyAccessToken } from "../handlers/authUtils";
import path from "path";

describe("Startup API tests", () => {
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

  test("Create startup", async () => {
    const registerResponse = await request(app)
      .post("/users/register")
      .field("username", "test")
      .field("email", "test@gmail.com")
      .field("password", "test123456")
      .attach(
        "profileImage",
        path.join(__dirname, "../images/users/archie.jpeg")
      );

    authToken = registerResponse.body.accessToken;

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

    const response = await request(app)
      .post("/startups")
      .send(startupDemo)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    startupId = response.body._id;

    expect(response.statusCode).toEqual(201);
  });

  test("Get all startups", async () => {
    const response = await request(app)
      .get("/startups")
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);
    expect(response.statusCode).toEqual(200);
  });

  test("Get all startups by sender", async () => {
    const decodedToken = verifyAccessToken(authToken);
    const response = await request(app)
      .get(`/startups/sender/${decodedToken?.userId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Get startup by id", async () => {
    const response = await request(app)
      .get(`/startups/${startupId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Update startup by id", async () => {
    const updatedStartup = {
      tags: ["קיימות", "אנרגיה מתחדשת"],
      foundedYear: 2025,
      valuationLastRound: 10000,
      location: "israel",
      latitude: 10,
      longitude: 20,
      name: "test2",
      description: "test2 for favorites",
      fundingStage: "סיד",
      contactEmail: "test2@gmail.com",
      contactPhone: "0500000000",
      founders: "test2",
      country: "israel",
    };

    const response = await request(app)
      .put(`/startups/${startupId}`)
      .send(updatedStartup)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Add visit to startup", async () => {
    const response = await request(app)
      .post(`/startups/visit`)
      .send({ startupId })
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(201);
  });

  test("Get visit count of startup", async () => {
    const response = await request(app)
      .get(`/startups/visit/${startupId}`)
      .send({ startupId })
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });

  test("Delete startup by id", async () => {
    const response = await request(app)
      .delete(`/startups/${startupId}`)
      .set("Cookie", [`Authorization=Bearer ${authToken}`]);

    expect(response.statusCode).toEqual(200);
  });
});
