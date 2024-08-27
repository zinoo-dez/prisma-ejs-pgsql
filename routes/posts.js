const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, postController.listPosts);
router.get("/new", auth, postController.showCreateForm);
router.post("/", auth, postController.createPost);
router.get("/edit/:id", auth, postController.showEditForm);
router.post("/edit/:id", auth, postController.updatePost);
router.post("/delete/:id", auth, postController.deletePost);

module.exports = router;
