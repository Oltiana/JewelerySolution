// popup.js — open OrderConfirmation in a centered popup or fallback to a modal
function openOrderPopup(orderData = {}) {
  const url = 'OrderConfirmation.html';
  const width = 760;
  const height = 720;
  const left = Math.floor((screen.width - width) / 2);
  const top = Math.floor((screen.height - height) / 2);
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

  const popup = window.open(url, 'orderPopup', features);

  // If the browser blocked the popup, show an inline modal fallback
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    showModalFallback(url, orderData);
    return null;
  }

  // When the popup loads, send order data via postMessage (if provided)
  window.addEventListener('message', function onReady(event) {
    if (event.source === popup && event.data && event.data.type === 'requestOrderData') {
      popup.postMessage({ type: 'orderData', data: orderData }, location.origin);
      window.removeEventListener('message', onReady);
    }
  });

  return popup;
}

function showModalFallback(url, orderData) {
  // Create overlay
  let overlay = document.getElementById('order-popup-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'order-popup-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = 9999;

  const modal = document.createElement('div');
  modal.style.width = 'min(960px, 95%)';
  modal.style.maxHeight = '90vh';
  modal.style.overflow = 'auto';
  modal.style.background = '#fff';
  modal.style.borderRadius = '12px';
  modal.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)';
  modal.style.padding = '18px';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.float = 'right';
  closeBtn.style.marginBottom = '8px';
  closeBtn.onclick = () => overlay.remove();

  // Add top-right 'X' close button for quicker closing
  const closeX = document.createElement('button');
  closeX.className = 'modal-close';
  closeX.setAttribute('aria-label', 'Close dialog');
  closeX.innerHTML = '\u00d7'; // multiplication '×'
  closeX.style.position = 'absolute';
  closeX.style.top = '10px';
  closeX.style.right = '12px';
  closeX.style.border = 'none';
  closeX.style.background = 'transparent';
  closeX.style.fontSize = '22px';
  closeX.style.cursor = 'pointer';
  closeX.onclick = () => closeOverlay();
  // Attach keydown handler for Escape to close the modal
  function onKeyDown(e){ if(e.key === 'Escape'){ closeOverlay(); } }
  document.addEventListener('keydown', onKeyDown);

  // closing helper (animates then removes)
  function closeOverlay(){
    if (overlay.classList.contains('closing')) return;
    overlay.classList.remove('open');
    overlay.classList.add('closing');
    // cleanup on transition end
    const cleanup = () => { document.removeEventListener('keydown', onKeyDown); if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
    const onEnd = (ev) => { if (ev.target === overlay) { cleanup(); overlay.removeEventListener('transitionend', onEnd); } };
    overlay.addEventListener('transitionend', onEnd);
    // fallback
    setTimeout(cleanup, 600);
  }

  modal.appendChild(closeBtn);

  // fetch the OrderConfirmation HTML and inject body content
  fetch(url).then(r => r.text()).then(html => {
    // Extract the inner content of the body from the fetched HTML
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const bodyContent = tmp.querySelector('body');
    if (bodyContent) {
      // remove script tags — we'll not execute remote scripts in the modal
      bodyContent.querySelectorAll('script').forEach(s => s.remove());
      // Append the rest of the content into our modal wrapper
      Array.from(bodyContent.childNodes).forEach(node => modal.appendChild(node.cloneNode(true)));

      // insert close X into modal
      modal.appendChild(closeX);

      // After inserting, dispatch a custom event so that the content can initialize
      setTimeout(() => {
        modal.dispatchEvent(new CustomEvent('orderModalInserted', { detail: orderData }));
      }, 50);
    } else {
      modal.appendChild(document.createTextNode('Failed to load order details.'));
    }
  }).catch(() => {
    modal.appendChild(document.createTextNode('Failed to load order details.'));
  });

  // clicking outside the modal content closes the overlay
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeOverlay(); });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  // Insert small delay then start opening animation
  requestAnimationFrame(() => setTimeout(() => overlay.classList.add('open'), 20));
}

// Expose to global
window.openOrderPopup = openOrderPopup;
window.showModalFallback = showModalFallback;
