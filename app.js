const express = require("express")
const path = require("path")
const app = express()
process.loadEnvFile()

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log("App launched")
})