import "dotenv/config"


export const {
    PORT,
    MONGO_URI,
    NODE_ENV, 
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    MISTRAL_API_KEY,
    METAL_RATE_API,
    FRONTEND_URL = "http://localhost:5173",
} = process.env



const checkVariables = {
    PORT,
    MONGO_URI,
    NODE_ENV,
    JWT_SECRET,
    MISTRAL_API_KEY,
    METAL_RATE_API,
}

Object.entries(checkVariables).forEach(([key, value]) => {
    if (!value) {
        console.log(`Missing Environment Variable: ${key}`)
        process.exit(1)
    }
})