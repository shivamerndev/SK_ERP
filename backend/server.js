import connectDB from "./src/config/db.config.js";
import app from "./src/app.js";
import { PORT } from "./src/config/env.config.js"


await connectDB()

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));