import { createToken } from "../lib/createToken.js";
import User from "../models/user.model.js";

import bcrypts from "bcryptjs";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  if(!email || !username || !password) return res.status(400).json({ message: "Por favor, rellena todos los campos" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 6 caracteres" });

  const usernameExist = await User.findOne({ username });
  if (usernameExist)
    return res.status(400).json({ message: "Este username está en uso" });

  const hashPassword = await bcrypts.hash(password, 10);

  const user = {
    email,
    username,
    password: hashPassword,
  };

  const newUser = new User(user);
  await newUser.save();

  const token = await createToken({ id: newUser._id });

  res.cookie("token", token, {
    httpOnly: true, // Solo accesible desde el servidor, no desde JavaScript del navegador.
    sameSite: "strict", // Protege contra ataques CSRF.
    secure: process.env.NODE_ENV === "production" // Solo enviar cookies seguras en producción.
});

  return res.status(200).json({ 
    _id: newUser._id,
    email: newUser.email,
    username: newUser.username,
    profilePic: newUser.profilePic,
    createdAt: newUser.createdAt,
    submitedAt: newUser.updatedAt,
    following: newUser.following,
    followers: newUser.followers
   });
};

export const login = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});

    if(!user) return res.status(400).json({message: "Username o contraseña incorrectos"});

    const matchPassword = await bcrypts.compare(password, user.password);

    if(!matchPassword) return res.status(400).json({message: "Username o contraseña incorrectos"});

    const token = await createToken({id: user._id});

    res.cookie("token", token, {
        httpOnly: true, // Solo accesible desde el servidor, no desde JavaScript del navegador.
        sameSite: "strict", // Protege contra ataques CSRF.
        secure: process.env.NODE_ENV === "production" // Solo enviar cookies seguras en producción.
    });

    return res.status(200).json({
        _id: user._id,
        email: user.email,
        username: user.username,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        submitedAt: user.updatedAt,
        following: user.following,
        followers: user.followers

    });
};

export const logout = async (req, res) => {
    res.clearCookie("token");

    return res.status(200).json({message: "Hasta pronto"});
};


export const checkAuth = async (req, res) => {
    try {
      res.status(200).json(req.user);
    }
    catch (error) {
      res.status(400).json({ message: error.message });
    }
};
