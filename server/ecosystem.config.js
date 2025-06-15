module.exports = {
  apps: [{
    name: "app1",
    script: "./dist/server.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
