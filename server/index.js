const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Markis AI Server is running 🚀")
})

app.post("/generate", (req, res) => {
  const { prompt } = req.body

  console.log("Prompt:", prompt)

  res.json({
    message: "Image generation started",
    prompt: prompt
  })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})