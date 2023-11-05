const express = require("express");
const router = express.Router();
const path = require("path");
const controllers = {
  user: require("./controller/userController"),
};

router.get("/", (req, res) => {
  const message = req.query.message || "";
  res.render("index", { message });
});

router.post("/cadastrar", async (req, res) => {
    try {
        const message = await controllers.user.createUser(req.body);
        res.redirect(`/?message=${message}`);
    } catch (error) {
        res.redirect(`/?message=error`);
    }
});
module.exports = router;
