import * as dotenv from "dotenv";
dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function init() {
  const { initServer } = await import("../app");
  const app = await initServer();
  app.listen(8000, () => {
    console.log("Server Started at PORT 8000");
  });
}

init();