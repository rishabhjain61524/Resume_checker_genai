const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    "https://resume-checker-genai.vercel.app",
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000"
].map(url => url && url.replace(/\/$/, "")).filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true)
        } else {
            callback(new Error(`CORS policy: origin ${origin} not allowed`))
        }
    },
    credentials: true
}))

// Health check route for Render
app.get("/health", (req, res) => {
    res.status(200).json({ status: 'OK' })
})

/* require all the routes here */

const authRouter = require("./routes/auth.routes")

const interviewRouter = require("./routes/interview.routes")

 
 /* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


module.exports = app