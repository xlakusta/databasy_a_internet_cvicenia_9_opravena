const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "kniznica_db"
});

db.connect(error => {
  if (error) console.log("Chyba databazy:", error);
  else console.log("Databaza pripojena");
});

app.get("/api/knihy", (req, res) => {
  db.query("SELECT * FROM knihy", (error, knihy) => {
    if (error) return res.status(500).send("Chyba SQL");
    res.json(knihy);
  });
});

app.post("/api/knihy", (req, res) => {
  const { nazov, autor, rok, cena } = req.body;
  db.query(
    "INSERT INTO knihy (nazov, autor, rok, cena) VALUES (?, ?, ?, ?)",
    [nazov, autor, rok, cena],
    (error, vysledok) => {
      if (error) return res.status(500).send("Chyba SQL");
      res.status(201).json({ id: vysledok.insertId, nazov, autor, rok, cena });
    }
  );
});

app.delete("/api/knihy/:id", (req, res) => {
  db.query("DELETE FROM knihy WHERE id = ?", [req.params.id], error => {
    if (error) return res.status(500).send("Chyba SQL");
    res.send("Kniha vymazana");
  });
});

app.patch("/api/knihy/:id/cena", (req, res) => {
  const cena = Number(req.body.cena);
  if (!Number.isFinite(cena) || cena < 0) {
    return res.status(400).send("Neplatna cena");
  }
  db.query("UPDATE knihy SET cena = ? WHERE id = ?", [cena, req.params.id], (error, vysledok) => {
    if (error) return res.status(500).send("Chyba SQL");
    if (vysledok.affectedRows === 0) return res.sendStatus(404);
    res.send("Cena zmenena");
  });
});

app.put("/api/knihy/:id", (req, res) => {
  const { nazov, autor, rok } = req.body;
  if (!nazov || !autor || !Number.isInteger(rok)) {
    return res.status(400).send("Neplatne udaje");
  }
  const sql = "UPDATE knihy SET nazov = ?, autor = ?, rok = ? WHERE id = ?";
  db.query(sql, [nazov, autor, rok, req.params.id], (error, vysledok) => {
    if (error) return res.status(500).send("Chyba SQL");
    if (vysledok.affectedRows === 0) return res.sendStatus(404);
    res.send("Kniha upravena");
  });
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});

app.listen(3000, () => console.log("http://localhost:3000"));
