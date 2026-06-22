const express = require("express")
const path = require("path")
const app = express()
process.loadEnvFile()

app.use(express.static(path.join(__dirname, "public")))

app.listen(process.env.PORT, () => {
    console.log("App launched")
})