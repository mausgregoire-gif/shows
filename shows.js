
    const artistMapping = {
        "4": "Nicolas Michaux",
        "54": "Leo Leonard",
        "46": "Clément Nourry",
        "58": "Isla Oiseau",
        "40": "Fervents",
        "11": "KAT",
        "36": "Solak",
        "49": "Ben Chace",
        "50": "Alex Van Pelt",
        "57": "Dodi EL Sherbini",
        "27": "Robbing Millions",
        "3": "Under The Reefs Orchestra",
        "8": "Twin Toes",
        "5": "Turner Cody",
        "64": "Mélanie Pain"
    };

      function getFlag(country) {
    const normalized = country.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // sans accents
        .replace(/\s+/g, "");

    const flags = {
        france: "&#127467;&#127479;",       // ??
        belgique: "&#127463;&#127466;",    // ??
        belgium: "&#127463;&#127466;",
        angleterre: "&#127468;&#127463;",  // ??
        england: "&#127468;&#127463;",
        royaumeuni: "&#127468;&#127463;",
        unitedkingdom: "&#127468;&#127463;",
        uk: "&#127468;&#127463;",
        ecosse: "&#127988;&#917607;&#917602;&#917605;&#917614;&#917607;", // ?
        scotland: "&#127988;&#917607;&#917602;&#917605;&#917614;&#917607;",
        irlande: "&#127470;&#127466;",     // ??
        ireland: "&#127470;&#127466;",
        pologne: "&#127477;&#127473;",     // ??
        poland: "&#127477;&#127473;",
        allemagne: "&#127465;&#127466;",   // ??
        germany: "&#127465;&#127466;",
        espagne: "&#127466;&#127480;",     // ??
        spain: "&#127466;&#127480;",
        portugal: "&#127477;&#127481;",    // ??
        italie: "&#127470;&#127481;",      // ??
        italy: "&#127470;&#127481;",
        suisse: "&#127464;&#127469;",      // ??
        switzerland: "&#127464;&#127469;",
        autriche: "&#127462;&#127481;",    // ??
        austria: "&#127462;&#127481;",
        paysbas: "&#127475;&#127473;",     // ??
        netherlands: "&#127475;&#127473;",
        hollande: "&#127475;&#127473;",
        luxembourg: "&#127473;&#127482;",  // ??
        danemark: "&#127465;&#127472;",    // ??
        denmark: "&#127465;&#127472;",
        suede: "&#127480;&#127466;",       // ??
        sweden: "&#127480;&#127466;",
        norvege: "&#127475;&#127476;",     // ??
        norway: "&#127475;&#127476;",
        finlande: "&#127467;&#127470;",    // ??
        finland: "&#127467;&#127470;",
        islande: "&#127470;&#127474;",     // ??
        iceland: "&#127470;&#127474;",
        etatsunis: "&#127482;&#127480;",   // ??
        usa: "&#127482;&#127480;",
        unitedstates: "&#127482;&#127480;",
        canada: "&#127464;&#127462;",      // ??
        australie: "&#127462;&#127482;",   // ??
        australia: "&#127462;&#127482;",
        turquie: "&#127481;&#127479;",     // ??
        turkey: "&#127481;&#127479;"
    };

    return flags[normalized] || "";
}

    const artistId = new URLSearchParams(window.location.search).get("id") || "4";
    const artistName = artistMapping[artistId];
    const sheetId = "1bMZ-a3RGnjpvmY65TcafUPNKlxf5ABZPqnBtUR8SOUk";
    const apiKey = "AIzaSyASo8n_-mItC7Pbp_Dk4AMxc1rZ2kANCfU";
    const range = "Avenir";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}&callback=processData`;

    function jsonpRequest(url) {
        const script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, '');
    }

    function processData(response) {
        if (!response.values) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Stocke les lignes pertinentes avec leur date
        const upcoming = response.values
            .filter(row => row[0] === artistName)
            .map(row => ({
                date: new Date(row[1]),
                row: row
            }))
            .filter(obj => !isNaN(obj.date) && obj.date >= today)
            .sort((a, b) => a.date - b.date); // Tri ASC

        // Génère le HTML
        let html = "";
        upcoming.forEach(({ date, row }) => {
            const dateFormatted = formatDate(row[1]);
            const salle = row[4] || "";
            const ville = row[3] || "";
            const country = row[2] || "";
            const flag = getFlag(country);
            const ticket = row[5] ? `<a href="${row[5]}" target="_blank">Tickets</a>` : "";
            html += `${dateFormatted} › ${salle} - ${ville} ${flag} ${ticket}<br />`;
        });

        const allStrongTags = document.querySelectorAll("strong");
        allStrongTags.forEach(tag => {
            if (tag.innerText.includes("UPCOMING SHOWS")) {
                const next = tag.parentElement.nextElementSibling;
                if (next) next.innerHTML = html || "Aucune date disponible pour cet artiste.";
            }
        });
    }

    jsonpRequest(url);