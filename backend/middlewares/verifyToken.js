const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

//Authenticate the user with the jwt token
exports.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Unauthorized" });
  const token = authorization.replace("bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    const { _id } = data;
    //Not selecting the password field
    User.findById(_id, { password: 0 })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  });
};
