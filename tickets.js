(function () {
  const isGreek = document.documentElement.lang === "el";
  const labels = isGreek
    ? {
        tickets: "εισιτήρια",
        error: "Συμπλήρωσε το όνομα και ένα έγκυρο email.",
        summary: "Η ΚΡΑΤΗΣΗ ΣΟΥ",
        title: "Το αίτημά σου καταχωρήθηκε.",
        body: "Η κράτηση είναι έτοιμη για επιβεβαίωση. Η ομάδα παραγωγής θα στείλει τις τελικές πληροφορίες και τις οδηγίες πληρωμής όταν ανοίξει η προπώληση.",
        reference: "Κωδικός",
        noCharge: "Δεν έγινε χρέωση σε αυτό το demo.",
        reset: "Νέα κράτηση",
      }
    : {
        tickets: "tickets",
        error: "Complete your name and enter a valid email address.",
        summary: "YOUR RESERVATION",
        title: "Your request is reserved.",
        body: "Your reservation is ready for confirmation. The production team will send the final details and payment instructions once ticketing opens.",
        reference: "Reference",
        noCharge: "No payment has been taken in this demo.",
        reset: "Start another reservation",
      };

  const cards = [...document.querySelectorAll(".event-card")];
  const fields = [...document.querySelectorAll(".ticket-fields input")];
  const quantityValue = document.querySelector(".quantity-control strong");
  const lineLabel = document.querySelector(".summary-line span");
  const lineTotal = document.querySelector(".summary-line strong");
  const grandTotal = document.querySelector(".summary-total strong");
  const summaryIndex = document.querySelector(".summary-index");
  const summaryCity = document.querySelector(".summary-event strong");
  const summaryMeta = document.querySelectorAll(".summary-event div span");
  const summaryEmail = document.querySelector(".summary-email");
  const error = document.querySelector(".ticket-error");
  let count = 1;
  let selectedIndex = 0;
  const price = 35;

  function updateTotals() {
    const amount = count * price;
    if (quantityValue) quantityValue.textContent = String(count);
    if (lineLabel)
      lineLabel.textContent = `${count} ${labels.tickets} × €${price}`;
    if (lineTotal) lineTotal.textContent = `€${amount}`;
    if (grandTotal) grandTotal.textContent = `€${amount}`;
  }

  function updateEmail() {
    if (!summaryEmail) return;
    const prefix = isGreek
      ? "Θα σταλεί επιβεβαίωση στο"
      : "We'll send confirmation to";
    summaryEmail.textContent = `${prefix} ${fields[1]?.value.trim() || "you@example.com"}`;
  }

  function selectCard(card, index) {
    selectedIndex = index;
    cards.forEach((item, itemIndex) => {
      const selected = itemIndex === index;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
      const mark = item.querySelector(".event-check");
      if (mark) mark.textContent = selected ? "✓" : "＋";
    });
    if (summaryIndex)
      summaryIndex.textContent = String(index + 1).padStart(2, "0");
    if (summaryCity)
      summaryCity.textContent =
        card.querySelector(".event-city")?.textContent || "";
    if (summaryMeta[0])
      summaryMeta[0].textContent =
        card.querySelector(".event-date")?.textContent || "";
    if (summaryMeta[1])
      summaryMeta[1].textContent =
        card.querySelector(".event-venue")?.textContent || "";
  }

  cards.forEach((card, index) =>
    card.addEventListener("click", () => selectCard(card, index)),
  );

  document.querySelectorAll(".quantity-control button").forEach((button) =>
    button.addEventListener("click", () => {
      const increase =
        button.textContent.trim() === "+" || button.textContent.trim() === "＋";
      count = increase ? Math.min(6, count + 1) : Math.max(1, count - 1);
      updateTotals();
    }),
  );

  fields.forEach((field) =>
    field.addEventListener("input", () => {
      error?.classList.remove("visible");
      updateEmail();
    }),
  );

  document.querySelectorAll(".ticket-language button").forEach((button) =>
    button.addEventListener("click", () => {
      window.location.href =
        button.textContent.trim() === "ΕΛ"
          ? "/tickets-el.html"
          : "/tickets.html";
    }),
  );

  document
    .querySelector(".ticket-workspace")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const validName = fields[0]?.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        fields[1]?.value.trim() || "",
      );
      if (!validName || !validEmail) {
        if (error) {
          error.textContent = labels.error;
          error.classList.add("visible");
          error.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const summary = document.querySelector(".ticket-summary");
      if (!summary) return;
      const city =
        cards[selectedIndex]?.querySelector(".event-city")?.textContent || "";
      const amount = count * price;
      summary.innerHTML = `<div class="ticket-summary-label">${labels.summary}</div><div class="ticket-confirmation"><div class="confirmation-icon">✓</div><h2>${labels.title}</h2><p>${labels.body}</p><div class="confirmation-order"><strong>${city}</strong><span>${count} ${labels.tickets} · €${amount}</span></div><div class="reference"><span>${labels.reference}</span><strong>G90-DEMO-2027</strong></div><small>${labels.noCharge}</small><button type="button" class="summary-secondary">${labels.reset}</button></div>`;
      summary
        .querySelector(".summary-secondary")
        ?.addEventListener("click", () => window.location.reload());
      summary.scrollIntoView({ behavior: "smooth", block: "center" });
    });

  selectCard(cards[0], 0);
  updateTotals();
  updateEmail();
})();
