import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// register a new user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt(); // generate a salt
    const passwordHashed = await bcrypt.hash(password, salt); // hash the password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHashed,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save(); // save the user in the database

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" + err.message });
  }
};

// login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // find the user in the database
    console.log(user);

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // compare the password with the hashed password
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // delete the password from the user object
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
