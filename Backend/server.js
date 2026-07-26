require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

// Health check route (must be before DB connection so Render can probe it even during startup)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" })
})

const PORT = process.env.PORT || 3000

connectToDB()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error("Failed to connect to Database:", err)
        process.exit(1)
    })