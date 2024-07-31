const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authenticate user
exports.authenticate = (req, res) => {
  const { user } = req;
  return user ? res.status(200).json({ message: user }) : res.status(500).json({ error: "Unauthorized" });
};

// Total users
exports.getCount = (req, res) => {
  User.countDocuments()
    .then((data) => {
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Get all users
exports.getAll = (req, res) => {
  //For pagination and sorting
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const sort = parseInt(req.query.sort) || 1;

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  //Remove password from returned users
  User.find({}, { password: 0 })
    .sort({ createdAt: sort })
    .skip((page - 1) * limit)
    .limit(limit)
    .then((users) => {
      return res.status(200).json({ message: users });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Get one user
exports.getOne = (req, res) => {
  const { email } = req.params;
  //Remove password from returned user
  User.findOne({ email }, { password: 0 })
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: user });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Update one user with ID
exports.deleteOne = (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: `User has been deleted! (${user._id})` });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Update one user with ID (Admin)
exports.updateOne = (req, res) => {
  const { firstname, lastname, email, isAdmin } = req.body;
  const { id } = req.params;
  const updateInfo = {
    firstname,
    lastname,
    email,
    isAdmin,
  };
  if (!/\S+@\w+\.\w+(\.\w+)?/.test(email)) return res.status(400).json({ error: "Invalid email" });

  //Remove password from returned user
  User.findById(id)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user.email === "admin@admin.com") return res.status(400).json({ error: "Cannot update admin account" });

      User.updateOne({ _id: user }, updateInfo, { projection: { password: 0 }, new: true, runValidators: true })
        .then(() => {
          return res.status(200).json({ message: `Information updated!` });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })

    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Update one user with ID (Non-admin)
exports.updateProfile = (req, res) => {
  const { firstname, lastname, email } = req.body;
  const { id } = req.params;
  const updateInfo = {
    firstname,
    lastname,
    email,
  };
  if (!/\S+@\w+\.\w+(\.\w+)?/.test(email)) return res.status(400).json({ error: "Invalid email" });

  //Remove password from returned user
  User.findById(id)
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user.email === "admin@admin.com") return res.status(400).json({ error: "Cannot update admin account" });

      User.updateOne(user, updateInfo, { projection: { password: 0 }, new: true, runValidators: true })
        .then(() => {
          return res.status(200).json({ message: `Information updated!` });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })

    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Register a new user
exports.register = (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password)
    return res.status(400).json({ error: "Please provide all fields." });
  if (!/\S+@\w+\.\w+(\.\w+)?/.test(email)) return res.status(400).json({ error: "Invalid email" });
  if (password.length < 8) return res.status(400).json({ error: "Password needs to be atleast 8 characters long" });
  //Hash the password with 10 rounds of salt
  bcrypt.hash(password, 10).then((hashedPassword) => {
    //Check if email already exists in database
    User.findOne({ email })
      .then((user) => {
        if (user) return res.status(400).json({ error: "User with email already exists!" });

        const newUser = new User({
          firstname,
          lastname,
          email,
          password: hashedPassword,
        });

        newUser
          .save()
          .then((data) => {
            if (!data) return res.status(400).json({ error: "Something went wrong" });
            return res.status(200).json({ message: "Registered successfully!" });
          })
          .catch((err) => {
            return res.status(500).json({ error: `Server Error ${err}` });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  });
};

//Logging in a user
// exports.login = (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: "Please provide all fields." });
//   User.findOne({ email })
//     .then((user) => {
//       if (!user) return res.status(401).json({ error: "Invalid credentials" });

//       bcrypt
//         .compare(password, user.password)
//         .then((compare) => {
//           if (!compare) return res.status(401).json({ error: "Invalid credentials" });
//           const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//           const userInfo = {
//             firstname: user.firstname,
//             lastname: user.lastname,
//             email: user.email,
//           };
//           return res.status(200).json({ message: "Logged in successfully!", token: jwtToken, user: userInfo });
//         })
//         .catch((err) => {
//           return res.status(500).json({ error: `Server Error ${err}` });
//         });
//     })
//     .catch((err) => {
//       return res.status(500).json({ error: `Server Error ${err}` });
//     });
// };
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Please provide all fields." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Check if the user is the admin with email and password
    if (email === "admin@admin.com" && password === "password") {
      user.isAdmin = true;
      await user.save();
    }

    const jwtToken = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    const userInfo = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return res.status(200).json({ message: "Logged in successfully!", token: jwtToken, user: userInfo });
  } catch (err) {
    return res.status(500).json({ error: `Server Error ${err}` });
  }
};