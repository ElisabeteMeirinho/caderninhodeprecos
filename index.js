import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/ofertas", async (req, res) => {
  try {
    const url = "https://www.paguemenos.com.br/categoria/medicamentos";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const produtos = [];

    $(".product__item").each((i, el) => {
      const nome = $(el).find(".product__name").text().trim();
      const preco = $(el).find(".sales").text().trim();
      if (nome && preco) {
        produtos.push({ nome, preco });
      }
    });

    res.json(produtos.slice(0, 10));
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
