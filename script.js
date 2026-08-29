document.addEventListener('DOMContentLoaded', () => {
  const checkIn = document.getElementById('checkin');
  const checkOut = document.getElementById('checkout');
  const roomType = document.getElementById('roomType');
  const guests = document.getElementById('guests');
  const stayTotal = document.getElementById('stayTotal');
  const bookingForm = document.getElementById('bookingForm');

  if (checkIn && checkOut && roomType && guests && stayTotal) {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 2);

    const formatDate = (date) => date.toISOString().split('T')[0];

    checkIn.value = formatDate(startDate);
    checkOut.value = formatDate(endDate);

    const getNightCount = () => {
      if (!checkIn.value || !checkOut.value) return 0;
      const start = new Date(checkIn.value);
      const end = new Date(checkOut.value);
      const diff = end - start;
      return diff > 0 ? Math.ceil(diff / 86400000) : 0;
    };

    const updateStayTotal = () => {
      const nights = getNightCount();
      const rate = Number(roomType.value);
      const guestCount = Number(guests.value);
      const base = nights * rate;
      const guestFee = guestCount > 2 ? (guestCount - 2) * 1250 : 0;
      stayTotal.textContent = `ETB ${base + guestFee}`;
    };

    [checkIn, checkOut, roomType, guests].forEach((element) => {
      element.addEventListener('input', updateStayTotal);
      element.addEventListener('change', updateStayTotal);
    });

    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nights = getNightCount();
      const summary =
        nights > 0
          ? `Your room reservation is ready for ${nights} nights in ${roomType.options[roomType.selectedIndex].text}. Please continue to confirmation.`
          : 'Please choose valid dates.';
      alert(summary);
      // TODO: replace this with a real backend reservation API later.
    });

    updateStayTotal();
  }

  const orderList = document.getElementById('orderList');
  const orderTotal = document.getElementById('orderTotal');
  const checkoutOrder = document.getElementById('checkoutOrder');
  const menuCards = document.querySelectorAll('.food-card');

  if (orderList && orderTotal && checkoutOrder && menuCards.length) {
    const selectedItems = [];

    const renderOrder = () => {
      if (!selectedItems.length) {
        orderList.innerHTML = '<li class="empty-state">No items selected yet.</li>';
        orderTotal.textContent = 'ETB 0';
        return;
      }

      let total = 0;
      orderList.innerHTML = selectedItems
        .map((item) => {
          total += item.price;
          return `<li><span>${item.name}</span><strong>ETB ${item.price}</strong></li>`;
        })
        .join('');

      orderTotal.textContent = `ETB ${total}`;
    };

    menuCards.forEach((card) => {
      const button = card.querySelector('.mini-btn');
      button.addEventListener('click', () => {
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        selectedItems.push({ name, price });
        renderOrder();
      });
    });

    checkoutOrder.addEventListener('click', () => {
      if (!selectedItems.length) {
        alert('Please add a meal before placing your order.');
        return;
      }

      const names = selectedItems.map((item) => item.name).join(', ');
      alert(`Your order is confirmed: ${names}.`);
      selectedItems.length = 0;
      renderOrder();
      // TODO: connect this to a real food ordering backend later.
    });

    renderOrder();
  }

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
