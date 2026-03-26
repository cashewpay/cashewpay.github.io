console.log("JS START");

document.addEventListener("DOMContentLoaded", function () {

    // ====== ОЖИДАНИЕ FIREBASE ======
    async function waitForFirebase() {
        while (!window.db || !window.firebaseFns) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    // ====== ЗАГРУЗКА ДАННЫХ ИЗ FIREBASE ======
    async function loadData() {

        // 🔥 ВАЖНО — ждём Firebase
        await waitForFirebase();

        const params = new URLSearchParams(window.location.search);
        let id = params.get("id");

        if (!id) {
            id = window.location.pathname.slice(1);
        }

        if (!id) {
            showNoData();
            return;
        }

        const { doc, getDoc } = window.firebaseFns;

        try {
            const ref = doc(window.db, "links", id);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                showNoData();
                return;
            }

            const data = snap.data();

            // ====== ПОЛУЧАТЕЛЬ ======
            const recipientEl = document.getElementById("recipient");
            if (recipientEl) {
                recipientEl.innerHTML =
                    [data.r1, data.r2, data.r3]
                    .filter(Boolean)
                    .join("<br>");
            }

            // ====== ОБЫЧНЫЕ ПОЛЯ ======
            setText("activeFrom", data.from);
            setText("activeTo", data.to);
            setText("description", data.desc);

            // ====== ЦЕНА ======
            if (data.price) {
                const priceEl = document.getElementById("price");
                if (priceEl) {
                    const formatted = parseFloat(data.price).toFixed(2);
                    priceEl.textContent = formatted + " BYN";
                }
            }

        } catch (e) {
            console.error("Ошибка Firebase:", e);
            showNoData();
            return;
        }

        // 👉 QR генерируем только после загрузки данных
        generateQR();
        showSuccess();
    }

    // ====== УТИЛИТЫ ======
    function setText(id, value) {
        if (!value) return;
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function showNoData() {
        const modal = document.getElementById("noDataModal");
        if (modal) {
            modal.style.display = "flex";
        }
    }
    
    lottie.loadAnimation({
        container: document.getElementById('checkAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'check.json' // сюда файл анимации
    });

    // ====== QR-КОД ======
    function generateQR() {
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
    }

    function showSuccess() {
        const el = document.querySelector(".successAnim");
        if (!el) return;
    
        el.classList.remove("active");
        void el.offsetWidth;
        el.classList.add("active");
    }

    // ====== СТАРТ ======
    loadData();

});
