const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const authenticateToken = require('./middleware/authenticateToken');
const authenticateTokenLogin = require('./middleware/authenticateTokenLogin')

const controllers = {
  user: require("./controller/userController"),
};

router.get('/', authenticateToken, (req, res) => {
  const message = req.query.message || '';
  console.log('Entering / route');
  if (req.user) {
    return res.render('prontuarios');
  }

  return res.render('index', { message });
});


router.post("/cadastrar", async (req, res) => {
  try {
    const message = await controllers.user.createUser(req.body);
    res.redirect(`/?message=${message}`);
  } catch (error) {
    res.redirect(`/?message=error`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await controllers.user.loginUser(req.body);

    console.log('Token:', token);

    if (token) {
      res.cookie('token', token, { httpOnly: true });
      res.json({ token });
    } else {
      const errorMessage = 'errorinvalido';
      res.redirect(`/?message=${errorMessage}`);
    }
  } catch (error) {
    const errorMessage = 'error';
    res.redirect(`/?message=${errorMessage}`);
  }
});

router.get("/dashboard", authenticateTokenLogin, async (req, res) => {
  res.render('prontuarios');
});
module.exports = router;
