// 모든 페이지가 함께 쓰는 머리말·바닥글·학교급 선택·복사 버튼.
(function () {
  const C = window.CONTENT;
  const NAV = [
    { href: '/', label: '첫 화면' },
    { href: '/guide.html', label: '단계별 안내' },
    { href: '/prompts.html', label: '복사할 프롬프트' },
    { href: '/terms.html', label: '용어 정리' },
    { href: '/downloads.html', label: '예비 자료' },
  ];
  const listeners = [];

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function readLevel() {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('level') || params.get('b');
    if (C.levels[fromUrl]) { store('level', fromUrl); return fromUrl; }
    const saved = store('level');
    return C.levels[saved] ? saved : 'middle';
  }

  let level = readLevel();

  function setLevel(next) {
    if (!C.levels[next] || next === level) return;
    level = next;
    store('level', next);
    renderHeader();
    listeners.forEach((fn) => fn(level));
  }

  function isPending(text) {
    return typeof text !== 'string' || /^\{\{.*\}\}$/.test(text.trim());
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const child of [].concat(children || [])) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function boardHref() { return '/board.html?b=' + level; }

  function renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const clean = (p) => p.replace(/(index)?(\.html)?$/, '') || '/';
    const path = clean(location.pathname);
    const navLink = (item) => el('a', { href: item.href, text: item.label, 'aria-current': path === clean(item.href) ? 'page' : null });
    const switcher = el('div', { class: 'level-switch', role: 'group', 'aria-label': '학교급' },
      Object.entries(C.levels).map(([key, info]) => el('button', {
        type: 'button', 'aria-pressed': String(key === level), text: info.label, onclick: () => setLevel(key),
      })));
    const board = el('a', { href: boardHref(), class: 'board-link', text: '공유 게시판', 'aria-current': path === '/board' ? 'page' : null });
    const nav = el('nav', { class: 'site-nav', 'aria-label': '사이트 메뉴' }, [
      ...NAV.slice(0, 1).map(navLink), board, ...NAV.slice(1).map(navLink),
    ]);
    header.className = 'site-header';
    header.replaceChildren(el('div', { class: 'wrap' }, [
      el('div', { class: 'top' }, [el('a', { class: 'brand', href: '/', text: '바이브코딩 연수' }), switcher]),
      nav,
    ]));
  }

  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    footer.className = 'site-footer';
    footer.replaceChildren(el('div', { class: 'wrap' }, [
      el('p', { text: C.title + ' · 강사 ' + C.instructor }),
      el('p', { text: '학생 이름·성적·생활기록부 원문 같은 개인정보는 AI에 넣지 않습니다.' }),
    ]));
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const area = el('textarea', { readonly: true, style: 'position:fixed;top:-1000px;opacity:0' });
      area.value = text;
      document.body.append(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      area.remove();
      return ok;
    }
  }

  function copyButton(text, label) {
    const btn = el('button', { type: 'button', class: 'btn small copy-btn', text: label || '복사' });
    btn.addEventListener('click', async () => {
      const ok = await copyText(text);
      btn.textContent = ok ? '복사했습니다' : '길게 눌러 직접 복사해 주세요';
      btn.classList.toggle('done', ok);
      setTimeout(() => { btn.textContent = label || '복사'; btn.classList.remove('done'); }, 1800);
    });
    return btn;
  }

  const STEP_NAMES = Object.fromEntries(C.flow.map((f) => [f.id, (f.no ? f.no + ' ' : '') + f.name]));

  // 프롬프트 상자. 정본이 아직 없으면 '준비 중'으로 보이고 복사 버튼을 막는다.
  function promptBox(p, { showStep = true } = {}) {
    const pending = isPending(p.text);
    return el('section', { class: 'prompt', id: p.id }, [
      el('div', { class: 'prompt-head' }, [
        el('div', { class: 'title' }, [
          el('span', { class: 'id', text: p.id }), p.name,
          showStep ? el('span', { class: 'where', text: STEP_NAMES[p.step] }) : null,
        ]),
        pending ? el('button', { type: 'button', class: 'btn small', disabled: true, text: '복사' }) : copyButton(p.text),
      ]),
      pending ? el('div', { class: 'pending', text: '문장을 준비하고 있습니다.' }) : el('pre', { text: p.text }),
    ]);
  }

  function shownText(text) { return isPending(text) ? '(준비 중)' : text; }

  window.SITE = {
    get level() { return level; },
    onLevel(fn) { listeners.push(fn); fn(level); },
    el, copyButton, copyText, promptBox, isPending, shownText, boardHref, store, STEP_NAMES,
  };

  renderHeader();
  renderFooter();
})();
