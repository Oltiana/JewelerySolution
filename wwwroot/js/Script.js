// script.js — order confirmation interactions
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.order-table tbody');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('total');
  const saveBtn = document.getElementById('save-changes');
  const orderAgainBtn = document.getElementById('order-again');

  function parsePrice(text){ return parseFloat(text) || 0; }
  function updateTotals(){
    const rows = Array.from(table.querySelectorAll('tr'));
    let subtotal = 0;
    rows.forEach(r => {
      const price = parsePrice(r.querySelector('.price').textContent.trim());
      const qty = parseInt(r.querySelector('.qty').value) || 1;
      subtotal += price * qty;
    });
    subtotalEl.textContent = subtotal.toFixed(2);
    const shipping = parsePrice(shippingEl.textContent);
    totalEl.textContent = (subtotal + shipping).toFixed(2);
  }

  // Move row up/down
  table.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const tr = btn.closest('tr');
    if(btn.classList.contains('up')){
      const prev = tr.previousElementSibling;
      if(prev) tr.parentNode.insertBefore(tr, prev);
    }
    if(btn.classList.contains('down')){
      const next = tr.nextElementSibling;
      if(next) tr.parentNode.insertBefore(next, tr);
    }
    if(btn.classList.contains('remove')){
      tr.remove();
    }
    updateTotals();
  });

  // Qty change
  table.addEventListener('input', (e) => {
    if(e.target.classList.contains('qty')){
      if(e.target.value < 1) e.target.value = 1;
      updateTotals();
    }
  });

  // Save changes (POST to backend API)
  saveBtn.addEventListener('click', async () => {
    const rows = Array.from(table.querySelectorAll('tr'));
    const items = rows.map(r => ({
      item: r.querySelector('.item').textContent.trim(),
      qty: parseInt(r.querySelector('.qty').value) || 1,
      price: parseFloat(r.querySelector('.price').textContent) || 0
    }));
    const payload = {
      email: document.getElementById('order-email')?.textContent || '',
      items
    };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      // show confirmation and store returned id on page
      document.getElementById('order-number').textContent = data.orderNumber || (`#${data.id}`);
      document.getElementById('order-number').dataset.orderId = data.id;
      alert('Order saved to server (id: ' + data.id + ')');
    } catch (err) {
      console.error(err);
      alert('Failed to save changes to server — saved locally instead.');
      const fallback = rows.map(r => ({
        item: r.querySelector('.item').textContent.trim(),
        qty: parseInt(r.querySelector('.qty').value) || 1,
        price: parseFloat(r.querySelector('.price').textContent) || 0
      }));
      localStorage.setItem('lastOrderEdits', JSON.stringify(fallback));
    }
    updateTotals();
  });

  // Order again (POST to /api/reorder/{id})
  orderAgainBtn.addEventListener('click', async () => {
    const id = document.getElementById('order-number')?.dataset?.orderId;
    if (!id) {
      alert('No saved order id found. Save first.');
      return;
    }
    try {
      const res = await fetch(`/api/reorder/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Reorder failed');
      const data = await res.json();
      alert('Reorder action simulated (server returned order ' + data.id + ').');
    } catch (err) {
      console.error(err);
      alert('Failed to reorder via server.');
    }
  });

  // Initial totals
  updateTotals();
});

// Placeholder functions to avoid console errors
function trackOrder(){ alert('Tracking page (demo)'); }
function continueShopping(){ window.location.href = './home.html'; }
