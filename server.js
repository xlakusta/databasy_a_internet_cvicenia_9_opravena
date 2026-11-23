const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
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
const hladat = (req.query.hladat || "").trim();
const zoradit = req.query.zoradit || "id";
const smer = req.query.smer === "DESC" ? "DESC" : "ASC";
// Whitelist povolenych stlpcov pre ORDER BY (ochrana pred SQLInjection)
const povoleneStlpce = ["id", "nazov", "autor", "rok", "cena"];
const stlpec = povoleneStlpce.includes(zoradit) ? zoradit : "id";
let sql = "SELECT * FROM knihy";
const parametre = [];
if (hladat !== "") {
sql += " WHERE nazov LIKE ? OR autor LIKE ?";
parametre.push(`%${hladat}%`, `%${hladat}%`);
}
sql += ` ORDER BY ${stlpec} ${smer}`;
db.query(sql, parametre, (error, knihy) => {
if (error) return res.status(500).send("Chyba SQL");
res.json(knihy);
});
})

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

// 1. Ziskanie zoznamu pouzivatelov (bez stlpca heslo_hash!)
app.get("/api/pouzivatelia", (req, res) => {
const sql = "SELECT id, meno, email FROM pouzivatelia ORDER BY id ASC"
;
4
db.query(sql, (error, pouzivatelia) => {
if (error) return res.status(500).send("Chyba SQL");
res.json(pouzivatelia);
});
});
// 2. Registracia noveho pouzivatela s hashovanim hesla
app.post("/api/pouzivatelia", async (req, res) => {
const { meno, email, heslo } = req.body;
if (!meno || !email || !heslo) {
return res.status(400).send("Vyplnte meno, e-mail aj heslo");
}
if (heslo.length < 6) {
return res.status(400).send("Heslo musi mat aspon 6 znakov");
}
try {
const hesloHash = await bcrypt.hash(heslo, 10);
const sql = "INSERT INTO pouzivatelia (meno, email, heslo_hash) VALUES (?, ?, ?)";
db.query(sql, [meno.trim(), email.trim(), hesloHash], error => {
if (error) {
if (error.code === "ER_DUP_ENTRY") {
return res.status(409).send("Pouzivatel s tymto e-mailom uz existuje");
}
return res.status(500).send("Chyba SQL");
}
res.status(201).send("Pouzivatel bol uspesne zaregistrovany");
});
} catch (err) {
res.status(500).send("Chyba pri spracovani hesla");
}
});
// 3. Vymazanie pouzivatela podla ID
app.delete("/api/pouzivatelia/:id", (req, res) => {
const sql = "DELETE FROM pouzivatelia WHERE id = ?";
db.query(sql, [req.params.id], (error, vysledok) => {
if (error) return res.status(500).send("Chyba SQL");
if (!vysledok.affectedRows) return res.sendStatus(404);
res.send("Pouzivatel vymazany");
});
});

// 4. Overenie prihlasovacich udajov
app.post("/api/prihlasenie", (req, res) => {
const { email, heslo } = req.body;
if (!email || !heslo) {
return res.status(400).json({ sprava: "Zadajte e-mail aj heslo" });
5
}
const sql = "SELECT * FROM pouzivatelia WHERE email = ?";
db.query(sql, [email.trim()], async (error, vysledok) => {
if (error) return res.status(500).json({ sprava: "Chyba SQL" });
// Ak e-mail v databaze neexistuje
if (vysledok.length === 0) {
return res.status(401).json({ sprava: "Nespravny e-mail alebo heslo" });
}
const pouzivatel = vysledok[0];
const zhoda = await bcrypt.compare(heslo, pouzivatel.heslo_hash);
if (!zhoda) {
return res.status(401).json({ sprava: "Nespravny e-mail alebo heslo" });
}
res.json({
sprava: "Prihlasenie uspesne",
pouzivatel: {
id: pouzivatel.id,
meno: pouzivatel.meno,
email: pouzivatel.email
}
});
});
});


app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});

app.listen(3000, () => console.log("http://localhost:3000"));
