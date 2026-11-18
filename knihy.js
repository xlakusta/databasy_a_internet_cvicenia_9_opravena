const zoznam = document.getElementById("zoznam");
const formular = document.getElementById("knihyForm");
const sprava = document.getElementById("sprava");
const chyba = document.getElementById("chyba");

function ukazChybu(text) {
    if (chyba) chyba.textContent = text || "";
}

function ukazSpravu(text) {
    if (sprava) sprava.textContent = text || "";
}

async function textChyby(odpoved) {
    const text = await odpoved.text();
    return text || "Chyba servera (" + odpoved.status + ")";
}

async function nacitajKnihy() {
    ukazChybu("");
    try {
        const odpoved = await fetch("/api/knihy");
        if (!odpoved.ok) throw new Error(await textChyby(odpoved));
        const knihy = await odpoved.json();

        zoznam.innerHTML = "";

        if (knihy.length === 0) {
            const riadok = document.createElement("tr");
            const bunka = document.createElement("td");
            bunka.colSpan = 6;
            bunka.textContent = "V databaze zatial nie su ziadne knihy.";
            riadok.appendChild(bunka);
            zoznam.appendChild(riadok);
            return;
        }

        knihy.forEach(kniha => {
            const riadok = document.createElement("tr");

            [kniha.id, kniha.nazov, kniha.autor, kniha.rok, kniha.cena].forEach(hodnota => {
                const bunka = document.createElement("td");
                bunka.textContent = hodnota;
                riadok.appendChild(bunka);
            });

            const bunkaAkcia = document.createElement("td");

            // Odstranit
            const tlacidko = document.createElement("button");
            tlacidko.textContent = "Odstrániť";
            tlacidko.onclick = () => odstranKnihu(kniha);
            bunkaAkcia.appendChild(tlacidko);

            // Zmenit cenu (nastavi novu cenu)
            const cenaBtn = document.createElement("button");
            cenaBtn.textContent = "Zmeniť cenu";
            cenaBtn.onclick = () => zmenCenu(kniha);
            bunkaAkcia.appendChild(cenaBtn);

            // Upravit nazov, autora, rok
            const zmenaBtn = document.createElement("button");
            zmenaBtn.textContent = "Upraviť";
            zmenaBtn.onclick = () => upravKnihu(kniha);
            bunkaAkcia.appendChild(zmenaBtn);

            riadok.appendChild(bunkaAkcia);
            zoznam.appendChild(riadok);
        });
    } catch (error) {
        ukazChybu("Knihy sa nepodarilo nacitat: " + error.message);
    }
}

async function odstranKnihu(kniha) {
    if (!window.confirm("Naozaj chcete vymazat knihu \"" + kniha.nazov + "\"?")) return;
    ukazChybu("");
    try {
        const odpoved = await fetch("/api/knihy/" + encodeURIComponent(kniha.id), { method: "DELETE" });
        if (!odpoved.ok) throw new Error(await textChyby(odpoved));
        ukazSpravu("Kniha bola vymazana.");
        await nacitajKnihy();
    } catch (error) {
        ukazChybu("Knihu sa nepodarilo vymazat: " + error.message);
    }
}

async function zmenCenu(kniha) {
    const vstup = prompt("Zadajte sumu (mozete aj zapornu, napr. -5):", "0");
    if (vstup === null || vstup.trim() === "") return;

    const suma = Number(vstup.replace(",", "."));
    if (!Number.isFinite(suma)) {
        alert("Zadajte platne cislo.");
        return;
    }

    const novaCena = Math.round((Number(kniha.cena) + suma) * 100) / 100;
    if (novaCena < 0) {
        alert("Cena nemoze byt zaporna. Aktualna cena je " + kniha.cena + ".");
        return;
    }

    ukazChybu("");
    try {
        const odpoved = await fetch("/api/knihy/" + encodeURIComponent(kniha.id) + "/cena", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cena: novaCena })
        });
        if (!odpoved.ok) throw new Error(await textChyby(odpoved));
        ukazSpravu("Nova cena: " + novaCena);
        await nacitajKnihy();
    } catch (error) {
        ukazChybu("Cenu sa nepodarilo zmenit: " + error.message);
    }
}
async function upravKnihu(kniha) {
    const nazov = prompt("uved nazov:", kniha.nazov);
    if (nazov === null) return;
    const autor = prompt("uved autor:", kniha.autor);
    if (autor === null) return;
    const rokText = prompt("uved rok:", kniha.rok);
    if (rokText === null) return;

    const rok = Number(rokText);
    if (!nazov.trim() || !autor.trim() || !Number.isInteger(rok)) {
        alert("Vyplnte spravne nazov, autora a rok.");
        return;
    }

    ukazChybu("");
    try {
        const odpoved = await fetch("/api/knihy/" + encodeURIComponent(kniha.id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nazov: nazov.trim(), autor: autor.trim(), rok: rok })
        });
        if (!odpoved.ok) throw new Error(await textChyby(odpoved));
        ukazSpravu("Kniha bola upravena.");
        await nacitajKnihy();
    } catch (error) {
        ukazChybu("Knihu sa nepodarilo upravit: " + error.message);
    }
}

formular.addEventListener("submit", async (event) => {
    event.preventDefault();
    ukazSpravu("");
    ukazChybu("");

    const kniha = {
        nazov: document.getElementById("nazov").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        rok: Number(document.getElementById("rok").value),
        cena: Number(document.getElementById("cena").value)
    };

    if (!kniha.nazov || !kniha.autor || !Number.isInteger(kniha.rok)
        || !Number.isFinite(kniha.cena) || kniha.cena < 0) {
        ukazChybu("Vyplnte spravne vsetky polia.");
        return;
    }

    try {
        const odpoved = await fetch("/api/knihy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kniha)
        });
        if (!odpoved.ok) throw new Error(await textChyby(odpoved));
        formular.reset();
        ukazSpravu("Kniha bola pridana.");
        await nacitajKnihy();
    } catch (error) {
        ukazChybu("Knihu sa nepodarilo pridat: " + error.message);
    }
});

nacitajKnihy();
