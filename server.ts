import app from "./src/app"

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

process.on("SIGINT", () => {
  console.log("Server is shutting down")
  process.exit(0)
})
