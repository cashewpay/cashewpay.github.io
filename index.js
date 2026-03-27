console.log("JS START UPD 27.03");

document.addEventListener("DOMContentLoaded", function () {

    async function waitForFirebase() {
        while (!window.db || !window.firebaseFns) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    function parseCustomDate(str) {
        if (!str) return null;

        try {
            const [datePart, timePart] = str.split(" ");
            const [day, month, year] = datePart.split(".");
            const [hours, minutes] = timePart.split(":");

            return new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hours),
                Number(minutes)
            );
        } catch (e) {
            console.error("Ошибка парсинга даты:", str);
            return null;
        }
    }

    function isExpired(activeTo) {
        const endDate = parseCustomDate(activeTo);
        if (!endDate) return false;

        return new Date() > endDate;
    }

    async function loadData() {

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

            if (isExpired(data.to)) {
                const qrBlock = document.querySelector(".qrBlock___ngXsb");

                if (qrBlock) {
                    const confirmImg = qrBlock.querySelector(".confirm___2Q9pa");
                    const confirmAnim = qrBlock.querySelector(".confirm___CQ9pa");

                    if (confirmImg) confirmImg.remove();
                    if (confirmAnim) confirmAnim.remove();

                    const cancelImg = document.createElement("img");
                    cancelImg.className = "cancel___1ZlPJ";
                    cancelImg.src = "/assets/cancel.svg";
                    cancelImg.alt = "cancel";

                    qrBlock.appendChild(cancelImg);
                }
            }

            const recipientEl = document.getElementById("recipient");
            if (recipientEl) {
                recipientEl.innerHTML =
                    [data.r1, data.r2, data.r3]
                    .filter(Boolean)
                    .join("<br>");
            }

            setText("activeFrom", data.from);
            setText("activeTo", data.to);
            setText("description", data.desc);

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

        generateQR();
        showSuccess();
    }

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
        path: '/check.json'
    });

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

    loadData();

});
