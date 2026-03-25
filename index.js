console.log("JS START");

document.addEventListener("DOMContentLoaded", function () {
    
    // ====== ПРОВЕРКА ДАННЫХ ======
function hasAnyParams() {
    return window.location.search && window.location.search.length > 1;
}

if (!hasAnyParams()) {
    const modal = document.getElementById("noDataModal");
    if (modal) {
        modal.style.display = "flex";
    }
    return; // останавливаем дальнейший JS
}

    // ====== УТИЛИТЫ ======
    function getParam(name) {
        const match = window.location.search.match(
            new RegExp("[?&]" + name + "=([^&]+)")
        );
        return match ? decodeURIComponent(match[1]) : null;
    }

    // ====== ПОЛУЧАТЕЛЬ ======
    function setRecipient() {
        const r1 = getParam("r1");
        const r2 = getParam("r2");
        const r3 = getParam("r3");

        const el = document.getElementById("recipient");

        console.log("RECIPIENT:", r1, r2, r3);

        if (el) {
            el.innerHTML = [r1, r2, r3].filter(Boolean).join("<br>");
        }
    }

    // ====== ОБЫЧНЫЕ ПОЛЯ ======
    function setIfExists(id, param) {
        const value = getParam(param);
        if (value) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
            }
        }
    }

    // 👉 получатель
    setRecipient();

    // 👉 остальные данные
    setIfExists("activeFrom", "from");
    setIfExists("activeTo", "to");
    setIfExists("description", "desc");

    // ====== ЦЕНА (С BYN) ======
    const price = getParam("price");
    const priceEl = document.getElementById("price");

    if (priceEl && price) {
        const formatted = parseFloat(price).toFixed(2);
        priceEl.textContent = formatted + " BYN";
    }

    // ====== QR-код ======
    const descriptionEl = document.querySelector(".description___HgXmR");
    const canvas = document.querySelector(".qrBlock___ngXsb canvas");

    if (!descriptionEl || !canvas) return;

    const text = descriptionEl.textContent.trim();
    if (!text) return;

    QRCode.toCanvas(canvas, text, {
        width: 325,
        margin: 4
    }, function (error) {
        if (error) console.error(error);
    });

});