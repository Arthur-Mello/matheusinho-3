const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const authenticateToken = require('./middleware/authenticateToken');
const alrealdyAuthenticated = require('./middleware/alrealdyAuthenticated');
const controllers = {
  user: require("./controller/userController"),
};

router.get('/', alrealdyAuthenticated, (req, res) => {
  const message = req.query.message || '';
  console.log('Entering / route');

  return res.render('index', { message });
});


router.post("/cadastrar", async (req, res) => {
  try {
    console.log("entrou no post")
    const message = await controllers.user.createUser(req.body);
    res.redirect(`/?message=${message}`);
  } catch (error) {
    res.redirect(`/?message=error`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await controllers.user.loginUser(req.body);

    console.log('Token:', token);

    if (token) {
      res.cookie('token', token, { httpOnly: true });
      return res.redirect("/dashboard");
    } else {
      const errorMessage = 'errorinvalido';
      return res.redirect(`/?message=${errorMessage}`);
    }
  } catch (error) {
    const errorMessage = 'error';
    return res.redirect(`/?message=${errorMessage}`);
  }
});

router.get("/dashboard", authenticateToken, async (req, res) => {
  console.log("aaa" + req.user)
  res.render('prontuarios', { user: req.user });
});

router.get("/teste", authenticateToken, async (req, res) => {
  res.render('teste');
});

router.use((req, res) => {
  res.render('notExist', { user: req.user });
});
module.exports = router;
