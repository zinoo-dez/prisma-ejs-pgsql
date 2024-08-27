const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// fot ui
exports.showRegister = (req, res) => {
  res.render("auth/register");
};
// to database
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error during registration:", error.message);
    res
      .status(400)
      .send("User already exists <a href='/auth/login'> Login here</a> ");
  }
};

exports.showLogin = (req, res) => {
  res.render("auth/login"); //ui
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user.id;
    req.session.status = true;
    req.session.save(() => {
      res.redirect("/posts");
    });
  } else {
    res.status(400).send("Invalid email or password");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
