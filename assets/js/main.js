/* =========================================================
   Patogenesis — interações do site
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* =======================================================
     1) PLACEHOLDERS DE IMAGEM
     Enquanto não houver fotos reais, geramos SVGs.
     Para usar imagens de verdade: coloque o arquivo em
     assets/img/ e troque data-ph="..." por src="assets/img/foo.jpg".
     ======================================================= */
  // Lê a cor da marca do CSS para os SVGs acompanharem o tema automaticamente.
  const BRAND = getComputedStyle(document.documentElement)
    .getPropertyValue('--brand').trim() || '#1e2d60';

  const PH = {
    hero:     { bg:['#efe3d7','#d9c6b4'], motif:'scene',  label:'' },
    cyto:     { bg:['#efe6fb','#ded0f5'], motif:'cells',  dots:['#5b2ea6','#7a3fd1','#3c1c78'] },
    histo:    { bg:['#fbe3ee','#f5c3da'], motif:'tissue', dots:['#d4407f','#b02a63','#e86ba3'] },
    ihc:      { bg:['#f6efe3','#e8dcc6'], motif:'ihc',    dots:['#8a5a1e','#5d3a10','#8fa8c4'] },
    necropsy: { bg:['#e6e9ec','#cfd6db'], motif:'scene',  label:'' },
    report:   { bg:['#f2f0ed','#dedad4'], motif:'paper',  label:'' },
    slides:   { bg:['#e9e4f4','#cfc6e6'], motif:'slides', label:'' },
    person:   { bg:['#e8e2da','#d2c8bb'], motif:'person', label:'' }
  };
  const AVATAR_BG = ['#e3d5c6','#d6dfe8','#e6dbe9','#dbe7dd','#efe0d2'];

  function svgURI(markup) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
  }

  function rand(seed) { // PRNG determinístico
    let x = seed * 9301 + 49297;
    return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  }

  function motifMarkup(type, cfg, w, h, seed) {
    const r = rand(seed);
    let out = '';
    if (type === 'cells') {
      for (let i = 0; i < 46; i++) {
        const cx = r() * w, cy = r() * h, rr = 6 + r() * 16;
        const c = cfg.dots[i % cfg.dots.length];
        out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rr.toFixed(1)}" fill="${c}" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
      }
    } else if (type === 'tissue') {
      for (let i = 0; i < 16; i++) {
        const cx = r() * w, cy = r() * h, rx = 24 + r() * 46, ry = 14 + r() * 30;
        const c = cfg.dots[i % cfg.dots.length];
        out += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${c}" opacity="${(0.25 + r() * 0.4).toFixed(2)}" transform="rotate(${(r()*180).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
      }
      for (let i = 0; i < 60; i++) {
        out += `<circle cx="${(r()*w).toFixed(1)}" cy="${(r()*h).toFixed(1)}" r="${(2+r()*4).toFixed(1)}" fill="#7d1b48" opacity="${(0.3+r()*0.45).toFixed(2)}"/>`;
      }
    } else if (type === 'ihc') {
      for (let i = 0; i < 12; i++) {
        const cx = r() * w, cy = r() * h, rr = 18 + r() * 34;
        out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rr.toFixed(1)}" fill="none" stroke="${cfg.dots[0]}" stroke-width="${(6+r()*9).toFixed(1)}" opacity="${(0.45+r()*0.4).toFixed(2)}"/>`;
      }
      for (let i = 0; i < 40; i++) {
        out += `<circle cx="${(r()*w).toFixed(1)}" cy="${(r()*h).toFixed(1)}" r="${(3+r()*5).toFixed(1)}" fill="${cfg.dots[2]}" opacity="${(0.35+r()*0.4).toFixed(2)}"/>`;
      }
    } else if (type === 'slides') {
      for (let i = 0; i < 6; i++) {
        const x = 20 + (i % 3) * (w / 3.2), y = 30 + Math.floor(i / 3) * (h / 2.2);
        out += `<rect x="${x}" y="${y}" width="${(w/4).toFixed(0)}" height="${(h/3).toFixed(0)}" rx="6" fill="#ffffff" opacity=".85"/>`;
        for (let j = 0; j < 14; j++) {
          out += `<circle cx="${(x + r()*(w/4)).toFixed(1)}" cy="${(y + r()*(h/3)).toFixed(1)}" r="${(3+r()*7).toFixed(1)}" fill="#6b34c0" opacity="${(0.3+r()*0.5).toFixed(2)}"/>`;
        }
        out += `<rect x="${x}" y="${(y + h/3 - 10).toFixed(0)}" width="${(w/4).toFixed(0)}" height="10" rx="3" fill="${BRAND}" opacity=".8"/>`;
      }
    } else if (type === 'paper') {
      out += `<rect x="${w*0.18}" y="${h*0.12}" width="${w*0.64}" height="${h*0.76}" rx="8" fill="#fff" opacity=".92"/>`;
      for (let i = 0; i < 7; i++) {
        const y = h * 0.24 + i * (h * 0.085);
        out += `<rect x="${w*0.25}" y="${y}" width="${(w*0.5*(0.5+r()*0.5)).toFixed(0)}" height="6" rx="3" fill="#c9c2ba"/>`;
      }
      out += `<rect x="${w*0.25}" y="${h*0.17}" width="${w*0.22}" height="8" rx="4" fill="${BRAND}" opacity=".75"/>`;
    } else if (type === 'person') {
      out += `<circle cx="${w/2}" cy="${h*0.36}" r="${h*0.15}" fill="#ffffff" opacity=".75"/>`;
      out += `<path d="M${w*0.2} ${h} q0 -${h*0.34} ${w*0.3} -${h*0.34} q${w*0.3} 0 ${w*0.3} ${h*0.34} z" fill="#ffffff" opacity=".75"/>`;
      out += `<circle cx="${w*0.66}" cy="${h*0.74}" r="${h*0.035}" fill="${BRAND}" opacity=".9"/>`;
    } else { // scene
      out += `<circle cx="${w*0.72}" cy="${h*0.3}" r="${h*0.28}" fill="#ffffff" opacity=".28"/>`;
      out += `<rect x="${w*0.08}" y="${h*0.55}" width="${w*0.42}" height="${h*0.4}" rx="12" fill="#ffffff" opacity=".22"/>`;
      out += `<path d="M${w*0.55} ${h} L${w*0.68} ${h*0.42} L${w*0.78} ${h*0.42} L${w*0.9} ${h} z" fill="#ffffff" opacity=".2"/>`;
      out += `<circle cx="${w*0.3}" cy="${h*0.3}" r="${h*0.09}" fill="${BRAND}" opacity=".35"/>`;
    }
    return out;
  }

  function makePlaceholder(kind, w = 800, h = 560, seed = 7) {
    const cfg = PH[kind] || PH.report;
    const id = 'g' + seed + kind.replace(/\W/g, '');
    return svgURI(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${cfg.bg[0]}"/><stop offset="1" stop-color="${cfg.bg[1]}"/></linearGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#${id})"/>` +
      motifMarkup(cfg.motif, cfg, w, h, seed) +
      `</svg>`
    );
  }

  function makeAvatar(i) {
    const bg = AVATAR_BG[i % AVATAR_BG.length];
    return svgURI(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">` +
      `<rect width="120" height="120" fill="${bg}"/>` +
      `<circle cx="60" cy="46" r="20" fill="#ffffff" opacity=".85"/>` +
      `<path d="M20 120c0-24 18-36 40-36s40 12 40 36z" fill="#ffffff" opacity=".85"/></svg>`
    );
  }

  let phSeed = 3;
  $$('img[data-ph]').forEach((img) => {
    const kind = img.dataset.ph;
    phSeed += 11;
    if (kind.startsWith('avatar')) {
      img.src = makeAvatar(parseInt(kind.split('-')[1], 10) || 1);
    } else {
      const big = kind === 'hero' || kind === 'slides' || kind === 'person';
      img.src = makePlaceholder(kind, big ? 1000 : 800, big ? 760 : 560, phSeed);
    }
    img.loading = 'lazy';
  });

  /* =======================================================
     2) HEADER: sombra ao rolar
     ======================================================= */
  const header = $('#header');
  const onScrollHeader = () => header.classList.toggle('stuck', window.scrollY > 12);
  onScrollHeader();

  /* =======================================================
     3) MENU MOBILE + DROPDOWNS
     ======================================================= */
  const nav = $('#mainNav');
  const burger = $('#hamburger');
  // Precisa bater com o breakpoint do hambúrguer no CSS (styles.css).
  const isMobile = () => window.matchMedia('(max-width: 1080px)').matches;

  function closeNav() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.querySelector('.ico-menu').style.display = '';
    burger.querySelector('.ico-close').style.display = '';
    document.body.classList.remove('nav-open');
    $$('.dropdown.open').forEach((d) => {
      d.classList.remove('open');
      const t = d.previousElementSibling;
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.ico-menu').style.display = open ? 'none' : '';
    burger.querySelector('.ico-close').style.display = open ? 'block' : 'none';
    document.body.classList.toggle('nav-open', open);
  });
  burger.querySelector('.ico-close').style.display = 'none';

  $$('.drop-toggle').forEach((btn) => {
    const drop = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !drop.classList.contains('open');
      $$('.dropdown.open').forEach((d) => {
        if (d !== drop) {
          d.classList.remove('open');
          d.previousElementSibling.setAttribute('aria-expanded', 'false');
        }
      });
      drop.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-drop')) {
      $$('.dropdown.open').forEach((d) => {
        d.classList.remove('open');
        d.previousElementSibling.setAttribute('aria-expanded', 'false');
      });
    }
    if (isMobile() && nav.classList.contains('open') && !e.target.closest('#mainNav') && !e.target.closest('#hamburger')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeNav();
    closeModal();
    closeInfo();
  });

  window.addEventListener('resize', () => { if (!isMobile()) closeNav(); });

  /* =======================================================
     4) SCROLL SUAVE + SCROLLSPY
     ======================================================= */
  const headerH = () => header.offsetHeight;

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      if (a.dataset.resource) return; // abre o modal de material, sem rolar
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeNav();
      const y = target.getBoundingClientRect().top + window.scrollY - headerH() + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  const sections = ['home', 'exames', 'veterinarios', 'casos', 'quem-somos', 'convenios', 'contato']
    .map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = $$('.nav-list .nav-link[href^="#"]');

  function spy() {
    const pos = window.scrollY + headerH() + 90;
    let current = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= pos) current = s; });
    navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + current.id));
  }

  /* =======================================================
     5) REVEAL ON SCROLL + CONTADOR
     ======================================================= */
  const revealables = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('in'), i * 70);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    revealables.forEach((el) => io.observe(el));

    const counters = $$('.count');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        let t0 = null;
        const step = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 1100, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else {
    revealables.forEach((el) => el.classList.add('in'));
  }

  /* =======================================================
     6) CARROSSEL DE DEPOIMENTOS
     ======================================================= */
  const track = $('#carTrack');
  const dotsWrap = $('#carDots');
  const carousel = $('#carousel');

  if (track) {
    const slides = $$('.t-card', track);
    let index = 0, perView = 3, maxIndex = 0, autoTimer = null;

    const calcPerView = () => {
      const w = window.innerWidth;
      return w <= 720 ? 1 : w <= 980 ? 2 : 3;
    };

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir para o grupo ' + (i + 1));
        b.addEventListener('click', () => { go(i); restartAuto(); });
        dotsWrap.appendChild(b);
      }
    }

    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex));
      const gap = parseFloat(getComputedStyle(track).gap) || 22;
      const step = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(${-index * step}px)`;
      $$('button', dotsWrap).forEach((d, k) => d.classList.toggle('active', k === index));
      $('.car-nav.prev', carousel).disabled = index === 0;
      $('.car-nav.next', carousel).disabled = index === maxIndex;
    }

    function layout() {
      perView = calcPerView();
      maxIndex = Math.max(0, slides.length - perView);
      buildDots();
      go(Math.min(index, maxIndex));
    }

    $('.car-nav.next', carousel).addEventListener('click', () => { go(index + 1); restartAuto(); });
    $('.car-nav.prev', carousel).addEventListener('click', () => { go(index - 1); restartAuto(); });

    function startAuto() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      autoTimer = setInterval(() => go(index >= maxIndex ? 0 : index + 1), 5200);
    }
    function stopAuto() { clearInterval(autoTimer); }
    function restartAuto() { stopAuto(); startAuto(); }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // arrastar / swipe
    let dragging = false, startX = 0, curX = 0, baseTransform = 0;
    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    function dragStart(e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true; startX = curX = getX(e);
      const tf = getComputedStyle(track).transform;
      baseTransform = tf && tf !== 'none' ? new DOMMatrixReadOnly(tf).m41 : 0;
      track.classList.add('dragging');
      stopAuto();
    }
    function dragMove(e) {
      if (!dragging) return;
      curX = getX(e);
      track.style.transform = `translateX(${baseTransform + (curX - startX)}px)`;
    }
    function dragEnd() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      const delta = curX - startX;
      if (Math.abs(delta) > 60) go(index + (delta < 0 ? 1 : -1));
      else go(index);
      startAuto();
    }

    track.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchstart', dragStart, { passive: true });
    track.addEventListener('touchmove', dragMove, { passive: true });
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('dragstart', (e) => e.preventDefault());

    layout();
    startAuto();
    window.addEventListener('resize', layout);
  }

  /* =======================================================
     7) TOAST
     ======================================================= */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  /* =======================================================
     8) MODAL — SOLICITAR EXAME
     ======================================================= */
  const modal = $('#modal');
  const examForm = $('#examForm');
  const modalSuccess = $('#modalSuccess');
  let lastFocused = null;

  function openModal(preset) {
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    examForm.hidden = false;
    modalSuccess.hidden = true;
    if (preset === 'convenio') {
      const chip = $('#examChips input[value="Convênio"]');
      if (chip) chip.checked = true;
    }
    setTimeout(() => $('#mf-nome').focus(), 60);
  }
  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  $$('[data-open-modal]').forEach((b) => b.addEventListener('click', () => {
    closeNav();
    openModal(b.dataset.preset);
  }));
  $$('[data-close-modal]').forEach((b) => b.addEventListener('click', closeModal));

  /* =======================================================
     9) MODAL — DETALHE (exames / materiais / casos)
     ======================================================= */
  const infoModal = $('#infoModal');

  const EXAM_INFO = {
    cito: {
      tag: 'Exame', ph: 'cyto', title: 'Citopatologia',
      text: 'Avaliação microscópica de células obtidas por punção aspirativa, imprint, raspado ou líquidos cavitários. É o caminho mais rápido para orientar a conduta clínica.',
      list: ['Prazo médio de 1 a 2 dias úteis', 'Punção aspirativa, imprint, swab e líquidos', 'Coloração de rotina e especiais quando indicado', 'Discussão do caso com a patologista']
    },
    histo: {
      tag: 'Exame', ph: 'histo', title: 'Histopatologia',
      text: 'Análise da arquitetura tecidual em fragmentos fixados em formol, com descrição de margens cirúrgicas, grau histológico e índice mitótico quando aplicável.',
      list: ['Prazo médio de 3 a 5 dias úteis', 'Avaliação de margens cirúrgicas', 'Graduação histológica de neoplasias', 'Colorações especiais sob demanda']
    },
    ihq: {
      tag: 'Exame', ph: 'ihc', title: 'Imuno-histoquímica',
      text: 'Painéis de marcadores para definir a linhagem celular em tumores indiferenciados e refinar prognóstico e conduta terapêutica.',
      list: ['Painéis personalizados por suspeita clínica', 'Diferenciação de tumores redondos e fusiformes', 'Marcadores prognósticos (ex.: Ki-67)', 'Laudo integrado à histopatologia']
    },
    necropsia: {
      tag: 'Exame', ph: 'necropsy', title: 'Necropsia',
      text: 'Exame completo com correlação entre achados macroscópicos, histopatológicos e o histórico clínico, para elucidação de óbitos e casos complexos.',
      list: ['Relatório macroscópico com registro fotográfico', 'Coleta e processamento de fragmentos', 'Correlação clínico-patológica', 'Orientação sobre conservação e transporte']
    },
    segunda: {
      tag: 'Exame', ph: 'report', title: 'Segunda opinião',
      text: 'Revisão de lâminas e laudos emitidos por outros laboratórios, com parecer independente para dar segurança à decisão terapêutica.',
      list: ['Revisão de lâminas ou blocos de parafina', 'Parecer técnico independente', 'Sugestão de exames complementares', 'Retorno por videochamada, se preferir']
    }
  };

  const RESOURCE_INFO = {
    manual: {
      tag: 'Material', ph: 'report', title: 'Manual de coleta',
      text: 'Passo a passo ilustrado para coleta e envio de cada tipo de amostra, com os erros mais comuns que comprometem o diagnóstico.',
      list: ['Punção aspirativa por agulha fina', 'Imprint e raspado cutâneo', 'Fragmentos para histopatologia', 'Identificação e rotulagem das lâminas']
    },
    formularios: {
      tag: 'Material', ph: 'report', title: 'Formulários para download',
      text: 'Requisições prontas para preencher e enviar junto com a amostra. Um histórico bem descrito melhora muito a qualidade do laudo.',
      list: ['Requisição de citopatologia', 'Requisição de histopatologia', 'Requisição de imuno-histoquímica', 'Termo de necropsia']
    },
    conservacao: {
      tag: 'Material', ph: 'slides', title: 'Conservação de amostras',
      text: 'Como fixar, acondicionar e transportar o material sem perder qualidade — inclusive em envios de outros estados.',
      list: ['Formol tamponado a 10% na proporção 1:10', 'Fragmentos com até 1 cm de espessura', 'Lâminas secas ao ar, sem fixador spray', 'Embalagem e prazos para transporte']
    },
    faq: {
      tag: 'Material', ph: 'report', title: 'Perguntas frequentes',
      text: 'As dúvidas mais comuns sobre prazos, coleta, envio e emissão de laudos.',
      list: ['Qual o prazo de cada exame?', 'Como enviar amostras de fora do DF?', 'Posso solicitar colorações especiais?', 'Como acessar laudos anteriores?']
    }
  };

  const CASE_INFO = {
    1: {
      tag: 'Caso clínico', ph: 'cyto', title: 'Massa cutânea em cão de 8 anos',
      text: 'Nódulo em região torácica lateral, móvel, com 2,4 cm e crescimento em três meses. A punção aspirativa revelou população de mastócitos bem diferenciados com granulação metacromática.',
      list: ['Citologia: mastocitoma provável, baixo grau', 'Conduta: exérese com margens de 2 cm e um plano fascial', 'Histopatologia confirmou grau I (Patnaik) e margens livres', 'Sem sinais de recidiva em 12 meses de acompanhamento']
    },
    2: {
      tag: 'Caso clínico', ph: 'histo', title: 'Linfonodomegalia generalizada em felino',
      text: 'Felino, 9 anos, com aumento simétrico de linfonodos e perda de peso. A biópsia excisional mostrou arquitetura apagada por infiltrado linfoide monomórfico.',
      list: ['Histopatologia: linfoma de células grandes', 'Imuno-histoquímica com CD20 positivo e CD3 negativo', 'Diagnóstico final: linfoma de células B', 'Definiu o protocolo quimioterápico e o prognóstico']
    },
    3: {
      tag: 'Caso clínico', ph: 'ihc', title: 'Neoplasia indiferenciada em cavidade oral',
      text: 'Massa gengival ulcerada em cão de 11 anos, sem pigmentação evidente. A histopatologia isolada não permitiu definir a linhagem celular.',
      list: ['Painel: Melan-A, citoqueratina e vimentina', 'Melan-A positivo definiu melanoma amelanótico', 'Estadiamento com avaliação de linfonodo regional', 'Mudança relevante no prognóstico e na conduta']
    }
  };

  function openInfo(data) {
    $('#infoTag').textContent = data.tag;
    $('#infoTitle').textContent = data.title;
    $('#infoText').textContent = data.text;
    $('#infoImg').src = makePlaceholder(data.ph, 900, 420, data.title.length * 7);
    $('#infoImg').alt = data.title;
    const ul = $('#infoList');
    ul.innerHTML = '';
    data.list.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
    infoModal.classList.add('open');
    infoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  function closeInfo() {
    if (!infoModal.classList.contains('open')) return;
    infoModal.classList.remove('open');
    infoModal.setAttribute('aria-hidden', 'true');
    if (!modal.classList.contains('open')) document.body.classList.remove('no-scroll');
  }

  $$('[data-exam-open]').forEach((b) =>
    b.addEventListener('click', () => openInfo(EXAM_INFO[b.dataset.examOpen])));
  $$('[data-case]').forEach((b) =>
    b.addEventListener('click', () => openInfo(CASE_INFO[b.dataset.case])));
  $$('.vcard[data-resource], .dropdown a[data-resource]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      closeNav();
      openInfo(RESOURCE_INFO[b.dataset.resource]);
    }));
  $$('[data-close-info]').forEach((b) => b.addEventListener('click', closeInfo));

  // Dropdown de exames -> rola até a seção e destaca o card
  $$('.dropdown a[data-exam]').forEach((a) => {
    a.addEventListener('click', () => {
      const key = a.dataset.exam;
      setTimeout(() => {
        const card = $(`.exam-card[data-exam="${key}"]`);
        if (!card) return;
        card.classList.add('flash');
        setTimeout(() => card.classList.remove('flash'), 1300);
      }, 620);
    });
  });

  /* =======================================================
     10) FORMULÁRIOS — máscara e validação
     ======================================================= */
  function maskPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  $$('input[type="tel"]').forEach((inp) => {
    inp.addEventListener('input', () => { inp.value = maskPhone(inp.value); });
  });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function setError(field, msg) {
    field.classList.toggle('invalid', Boolean(msg));
    const err = $('.err', field);
    if (err) err.textContent = msg || '';
  }

  function validateField(input) {
    const field = input.closest('.field');
    if (!field) return true;
    const v = input.value.trim();
    if (input.required && !v) { setError(field, 'Campo obrigatório.'); return false; }
    if (input.type === 'email' && v && !EMAIL_RE.test(v)) { setError(field, 'Informe um e-mail válido.'); return false; }
    if (input.type === 'tel' && v && v.replace(/\D/g, '').length < 10) { setError(field, 'Informe DDD + número.'); return false; }
    setError(field, '');
    return true;
  }

  function wireValidation(form) {
    $$('input, textarea, select', form).forEach((inp) => {
      inp.addEventListener('blur', () => validateField(inp));
      inp.addEventListener('input', () => {
        const f = inp.closest('.field');
        if (f && f.classList.contains('invalid')) validateField(inp);
      });
    });
  }

  function validateForm(form) {
    let ok = true;
    $$('input[required], textarea[required], select[required]', form).forEach((inp) => {
      if (!validateField(inp)) ok = false;
    });
    const chipsField = $('#examChips')?.closest('.field');
    if (form === examForm && chipsField) {
      const any = $$('#examChips input:checked').length > 0;
      setError(chipsField, any ? '' : 'Selecione ao menos um exame.');
      if (!any) ok = false;
    }
    if (!ok) {
      const first = $('.field.invalid', form);
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inp = $('input, textarea, select', first);
        if (inp) inp.focus({ preventScroll: true });
      }
    }
    return ok;
  }

  wireValidation(examForm);
  $$('#examChips input').forEach((c) => c.addEventListener('change', () => {
    const f = $('#examChips').closest('.field');
    if (f.classList.contains('invalid') && $$('#examChips input:checked').length) setError(f, '');
  }));

  examForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(examForm)) return;
    const btn = $('button[type="submit"]', examForm);
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    // TODO: trocar pelo envio real (fetch para o backend / e-mail / CRM)
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      examForm.hidden = true;
      modalSuccess.hidden = false;
      examForm.reset();
      $$('.field.invalid', examForm).forEach((f) => f.classList.remove('invalid'));
    }, 900);
  });

  const contactForm = $('#contactForm');
  if (contactForm) {
    wireValidation(contactForm);
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      const btn = $('button[type="submit"]', contactForm);
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
        contactForm.reset();
        toast('Mensagem enviada! Retornaremos em breve.');
      }, 900);
    });
  }

  /* =======================================================
     11) ÁREA DO VETERINÁRIO (placeholder)
     ======================================================= */
  $$('a[href="#area-vet"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      closeNav();
      toast('Área do Veterinário em construção — em breve com login e laudos.');
    });
  });

  /* =======================================================
     12) VOLTAR AO TOPO
     ======================================================= */
  const toTop = $('#backToTop');
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =======================================================
     13) SCROLL HANDLER ÚNICO
     ======================================================= */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollHeader();
      spy();
      toTop.classList.toggle('show', window.scrollY > 520);
      ticking = false;
    });
  }, { passive: true });

  /* =======================================================
     14) MISC
     ======================================================= */
  $('#year').textContent = new Date().getFullYear();
  spy();
})();
