(function () {
  const cards = [...document.querySelectorAll('.event-card')];
  const quantity = document.querySelector('.quantity-control strong');
  const total = document.querySelector('.summary-total strong');
  const line = document.querySelector('.summary-line span');
  const selectedCity = document.querySelector('.summary-event strong');
  const selectedMeta = document.querySelectorAll('.summary-event div span');
  let count = 1;
  const price = 35;
  function refresh() {
    if (quantity) quantity.textContent = count;
    if (total) total.textContent = `€${count * price}`;
    if (line) line.textContent = `Tickets × €${price}`;
  }
  cards.forEach((card) => card.addEventListener('click', () => {
    cards.forEach((item) => item.classList.remove('selected'));
    card.classList.add('selected');
    if (selectedCity) selectedCity.textContent = card.querySelector('.event-city').textContent;
    if (selectedMeta[0]) selectedMeta[0].textContent = card.querySelector('.event-date').textContent;
    if (selectedMeta[1]) selectedMeta[1].textContent = card.querySelector('.event-venue').textContent;
  }));
  document.querySelectorAll('.quantity-control button').forEach((button) => button.addEventListener('click', () => {
    count = button.textContent.trim() === '+' || button.textContent.trim() === '＋' ? Math.min(6, count + 1) : Math.max(1, count - 1);
    refresh();
  }));
  document.querySelector('.ticket-workspace')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [...document.querySelectorAll('.ticket-fields input')];
    if (!fields[0]?.value.trim() || !fields[1]?.value.includes('@')) {
      document.querySelector('.ticket-error')?.classList.add('visible');
      return;
    }
    const summary = document.querySelector('.ticket-summary');
    if (summary) summary.innerHTML = '<div class="ticket-summary-label">YOUR RESERVATION</div><div class="ticket-confirmation"><div class="confirmation-icon">✓</div><h2>Your request is reserved.</h2><p>We have prepared your reservation request. The production team will confirm the venue details and send payment instructions once ticketing opens.</p><div class="reference"><span>Reference</span><strong>G90-DEMO-2027</strong></div><small>No payment has been taken in this demo.</small></div>';
  });
  refresh();
})();
