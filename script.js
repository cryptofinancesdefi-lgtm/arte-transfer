// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// WhatsApp mask
const whatsappInput = document.getElementById('whatsapp');
whatsappInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 7) {
    v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  e.target.value = v;
});

// Form submission
const form = document.getElementById('formOrcamento');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const nome = data.get('nome');
  const produto = document.getElementById('produto');
  const produtoTexto = produto.options[produto.selectedIndex].text;
  const quantidade = data.get('quantidade');

  // Build WhatsApp message
  const msg = encodeURIComponent(
    `Olá! Gostaria de solicitar um orçamento.\n\n` +
    `*Nome:* ${nome}\n` +
    `*E-mail:* ${data.get('email')}\n` +
    `*WhatsApp:* ${data.get('whatsapp')}\n` +
    `*Produto:* ${produtoTexto}\n` +
    `*Quantidade:* ${quantidade}\n` +
    `*Mensagem:* ${data.get('mensagem') || 'Sem mensagem adicional'}`
  );

  // Show success state
  form.innerHTML = `
    <div class="form-success">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#25D366" stroke-width="3" fill="rgba(37,211,102,0.1)"/>
        <path d="M20 32L28 40L44 24" stroke="#25D366" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h3>Solicitação enviada!</h3>
      <p>Você será redirecionado para o WhatsApp para confirmar seu orçamento.</p>
    </div>
  `;

  // Redirect to WhatsApp
  setTimeout(() => {
    window.open(`https://wa.me/5569992641022?text=${msg}`, '_blank');
  }, 1500);
});

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.produto-card, .diferencial-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Add visible class styles
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .produto-card.visible, .diferencial-card.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);
