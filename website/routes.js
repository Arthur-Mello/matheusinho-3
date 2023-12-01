const express = require("express");
const router = express.Router();
const authenticateToken = require('./middleware/authenticateToken');
const alrealdyAuthenticated = require('./middleware/alrealdyAuthenticated');
const isMedic = require('./middleware/isMedic')
const controllers = {
  user: require("./controller/userController"),
};

router.get('/', alrealdyAuthenticated, (req, res) => {
  const message = req.query.message || '';

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

router.get("/dashboard", authenticateToken, isMedic, async (req, res) => {
  res.render('dashboard', { user: req.user });
});

router.get("/teste", authenticateToken, async (req, res) => {
  res.render('teste');
});

router.get('/logout', authenticateToken, (req, res) => {

  res.clearCookie('token');

  res.redirect('/?message=logout');
});



/*rotas mobile*/








/* fim rotas */
router.use((req, res) => {
  res.render('notExist', { user: req.user });
});
module.exports = router;
