const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.listPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: req.session.userId },
  });
  res.render("posts/list", { posts });
};

exports.showCreateForm = (req, res) => {
  res.render("posts/create");
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  await prisma.post.create({
    data: {
      title,
      content,
      authorId: req.session.userId,
    },
  });
  res.redirect("/posts");
};

exports.showEditForm = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (post.authorId !== req.session.userId) {
    return res.status(403).send("Forbidden");
  }

  res.render("posts/edit", { post });
};

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  await prisma.post.update({
    where: { id: parseInt(req.params.id) },
    data: { title, content },
  });
  res.redirect("/posts");
};

exports.deletePost = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (post.authorId !== req.session.userId) {
    return res.status(403).send("Forbidden");
  }

  await prisma.post.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.redirect("/posts");
};
