"use strict";
const { url } = require("inspector");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "This contains API for users, posts and comments",
    },
    servers: [
        {
            url: "http://localhost:3000",
        }, { url: "http://10.10.248.74" }, { url: "https://10.10.248.74" },
    ],
};
const options = {
    swaggerDefinition,
    apis: ["./routes/*.ts"],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
