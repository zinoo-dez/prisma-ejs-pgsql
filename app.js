const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const path = require("path");
const app = express();

/** middleware */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.userId = req.session.userId; //important session key
  next();
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.get("/", async (_req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.render("index", { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching posts.");
  }
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
