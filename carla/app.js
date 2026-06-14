// ── Configuración ──────────────────────────────────────────────
// Fecha de inicio: primer regalo disponible desde este día
const FECHA_INICIO = new Date('2026-06-14T00:00:00');

const regalos = [
  {
    semana: 'Semana 1',
    nombre: 'El anillo',
    pista: 'Para llevarlo siempre contigo y recordar lo que tenemos.',
    foto: 'assets/anillo.jpg'
  },
  {
    semana: 'Semana 2',
    nombre: 'La pulsera',
    pista: 'Una pulsera especial para ir llenando de recuerdos.',
    foto: 'assets/pulsera.webp'
  },
  {
    semana: 'Semana 3',
    nombre: 'Charms para la pulsera',
    pista: 'Pequeños detalles que la hacen única, como tú.',
    foto: 'assets/trtuga.webp'
  },
  {
    semana: 'Semana 4',
    nombre: 'Camiseta de España',
    pista: 'Para que sigas la Selección con estilo.',
    foto: 'assets/españa.webp'
  },
  {
    semana: 'Semana 5',
    nombre: 'Cuadro de Quevedo',
    pista: 'Una sorpresa del artista que más te gusta.',
    foto: 'assets/cuadro.jpeg'
  },
  {
    semana: 'Semana 6',
    nombre: 'Entradas para Quevedo',
    pista: 'Porque la mejor música se disfruta en directo, juntos.',
    foto: 'assets/entradas.jpeg'
  }
];

// ── Lógica de fechas ────────────────────────────────────────────

function regalosDesbloqueados() {
  const ahora = new Date();
  const diff = ahora - FECHA_INICIO;
  const semanasPasadas = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  return Math.min(semanasPasadas + 1, regalos.length);
}

function fechaDesbloqueo(indice) {
  const fecha = new Date(FECHA_INICIO);
  fecha.setDate(fecha.getDate() + indice * 7);
  return fecha;
}

function tiempoRestante(indice) {
  const objetivo = fechaDesbloqueo(indice);
  const ahora = new Date();
  const diff = objetivo - ahora;

  if (diff <= 0) return null;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);

  if (dias > 0) return `${dias}d ${horas}h ${minutos}m`;
  if (horas > 0) return `${horas}h ${minutos}m ${segundos}s`;
  return `${minutos}m ${segundos}s`;
}

// ── SVG iconos ──────────────────────────────────────────────────

function iconoCandado() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#c8b4aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>`;
}

function iconoCheck() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#c4956a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>`;
}

function iconoReloj() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#c4956a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 3"/>
  </svg>`;
}

// ── Render ──────────────────────────────────────────────────────

function render() {
  const desbloqueados = regalosDesbloqueados();
  const cont = document.getElementById('regalos');
  const dotsEl = document.getElementById('dots');

  cont.innerHTML = '';
  dotsEl.innerHTML = '';

  regalos.forEach((r, i) => {
    const estaDesbloqueado = i < desbloqueados;
    const esSiguiente = i === desbloqueados && i < regalos.length;

    // Dot de progreso
    const dot = document.createElement('div');
    dot.className = 'dot' + (estaDesbloqueado ? ' activo' : '');
    dotsEl.appendChild(dot);

    // Card
    const card = document.createElement('div');
    let claseCard = 'regalo-card ';
    if (estaDesbloqueado) claseCard += 'desbloqueado';
    else if (esSiguiente) claseCard += 'siguiente';
    else claseCard += 'bloqueado';
    card.className = claseCard;

    // Foto
    let fotoHTML;
    if (estaDesbloqueado) {
      fotoHTML = `<img src="${r.foto}" alt="${r.nombre}" onerror="this.style.display='none'">`;
    } else {
      fotoHTML = `<div class="foto-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>`;
    }

    // Contador para el siguiente regalo
    let contadorHTML = '';
    if (esSiguiente) {
      const tiempo = tiempoRestante(i);
      contadorHTML = tiempo
        ? `<div class="contador-wrap">
            <p class="contador-label">Se revela en</p>
            <p class="contador-tiempo" id="contador-${i}">${tiempo}</p>
           </div>`
        : '';
    }

    // Icono estado
    let icono = '';
    if (estaDesbloqueado) icono = iconoCheck();
    else if (esSiguiente) icono = iconoReloj();
    else icono = iconoCandado();

    card.innerHTML = `
      <div class="card-inner">
        <div class="foto-wrap">${fotoHTML}</div>
        <div class="card-contenido">
          <p class="semana-tag">
            ${r.semana}
            ${esSiguiente ? '<span class="tag-siguiente">próximo</span>' : ''}
          </p>
          <p class="regalo-nombre ${estaDesbloqueado ? '' : 'desenfocado'}">${r.nombre}</p>
          <p class="regalo-pista ${estaDesbloqueado ? '' : 'desenfocado'}">${r.pista}</p>
          ${contadorHTML}
          <div class="icono-estado">${icono}</div>
        </div>
      </div>
    `;

    cont.appendChild(card);
  });

  // Mensaje final
  const msgFinal = document.getElementById('mensaje-final');
  if (desbloqueados >= regalos.length) {
    msgFinal.classList.add('visible');
  }
}

// ── Contador en tiempo real ─────────────────────────────────────

function actualizarContadores() {
  const desbloqueados = regalosDesbloqueados();
  const i = desbloqueados;

  if (i >= regalos.length) return;

  const el = document.getElementById(`contador-${i}`);
  if (!el) return;

  const tiempo = tiempoRestante(i);
  if (tiempo) {
    el.textContent = tiempo;
  } else {
    // Se acaba de desbloquear, re-render completo
    render();
  }
}

// ── Inicialización ──────────────────────────────────────────────

render();
setInterval(actualizarContadores, 1000);
