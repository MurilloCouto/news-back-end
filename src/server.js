import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";

import UserModel from "./module/user/user.model.js";
import NewsModel from "./module/news/news.model.js";

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

const PORT = process.env.PORT || 8080;

app.post("/login", async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "O campo 'e-mail' é obrigatório." });
  }

  if (!req.body.password) {
    return res.status(400).json({ message: "O campo 'senha' é obrigatório." });
  }

  const existingUser = await UserModel.findOne({ email: req.body.email });

  if (!existingUser) {
    return res.status(400).json({ message: "Usuário não cadastrado." });
  }

  const verifiedPassword = bcrypt.compareSync(
    req.body.password,
    existingUser.password
  );

  if (!verifiedPassword) {
    return res.status(400).json({ message: "E-mail ou senha incorretos." });
  }

  const token = jwt.sign({ _id: existingUser._id }, "bless");

  return res.status(200).json({ message: "Acesso liberado!", token });
});

app.get("/user", async (_, res) => {
  const users = await UserModel.find({});

  return res.status(200).json(users);
});

app.post("/user", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "O campo 'nome' é obrigatório." });
    }
    if (!req.body.email) {
      return res
        .status(400)
        .json({ message: "O campo 'e-mail' é obrigatório." });
    }

    if (!req.body.password) {
      return res
        .status(400)
        .json({ message: "O campo 'senha' é obrigatório." });
    }

    const existingUser = await UserModel.find({ email: req.body.email });

    if (existingUser.length > 0) {
      return res.status(422).json({ message: "E-mail já cadastrado." });
    }

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: encryptedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro durante a criação do usuário:", error);
    return res
      .status(500)
      .json({ message: "Erro durante a criação do usuário" });
  }
});

app.get("/news", async (req, res) => {
  let filterCategory = {};
  if (req.query.category) {
    filterCategory = { category: req.query.category };
  }
  const news = await NewsModel.find(filterCategory);
  return res.status(200).json(news);
});

app.post("/news", async (req, res) => {
  try {
    if (!req.body.title) {
      return res
        .status(400)
        .json({ message: "O campo 'Título' é obrigatório" });
    }
    if (!req.body.image) {
      return res
        .status(400)
        .json({ message: "O campo 'Imagem' é obrigatório" });
    }
    if (!req.body.text) {
      return res.status(400).json({ message: "O campo 'Texto' é obrigatório" });
    }
    if (!req.body.category) {
      return res
        .status(400)
        .json({ message: "O campo 'Categoria' é obrigatório" });
    }

    const newNew = await NewsModel.create({
      title: req.body.title,
      image: req.body.image,
      text: req.body.text,
      category: req.body.category,
    });

    await newNew.save();

    return res.status(201).json({ message: "Notícia criada com sucesso!" });
  } catch (error) {
    console.error("Erro durante a criação da notícia", error);
    return res
      .status(500)
      .json({ message: "Erro durante a criação da notícia." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
