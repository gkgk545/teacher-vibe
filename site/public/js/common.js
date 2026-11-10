// 모든 페이지가 함께 쓰는 머리말과 복사 버튼.
(function () {
  const C = window.CONTENT;
  const NAV = [
    { href: '/prompts', label: '참고용 프롬프트 예시' },
    { href: '/downloads', label: '예비 자료' },
    ...Object.entries(C.boards).map(([key, label]) => ({ href: '/board?b=' + key, label: '게시판(' + label + ')' })),
  ];

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

  function renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const clean = (p) => p.replace(/(\.html)?$/, '');
    const here = clean(location.pathname) + location.search.replace(/&.*$/, '');
    const nav = el('nav', { class: 'site-nav', 'aria-label': '사이트 메뉴' }, NAV.map((item) => el('a', {
      href: item.href, text: item.label, 'aria-current': here === item.href || (clean(location.pathname) === item.href) ? 'page' : null,
    })));
    header.className = 'site-header';
    header.replaceChildren(el('div', { class: 'wrap' }, [
      el('div', { class: 'top' }, [el('a', { class: 'brand', href: '/prompts', text: '바이브코딩 연수' })]),
      nav,
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

  // 복사 상자. 블록이 여럿이면(P6 커밋할 때 / 되돌릴 때) 블록마다 복사 버튼을 단다.
  //   p: { id?, name, blocks: [{ label, text }] }
  function promptBox(p) {
    const single = p.blocks.length === 1;
    const head = el('div', { class: 'prompt-head' }, [
      el('div', { class: 'title' }, [p.id ? el('span', { class: 'id', text: p.id }) : null, p.name]),
      single ? copyButton(p.blocks[0].text) : null,
    ]);
    const blocks = p.blocks.flatMap((b) => [
      single ? null : el('div', { class: 'block-head' }, [el('span', { text: b.label }), copyButton(b.text)]),
      el('pre', { text: b.text }),
    ]);
    return el('section', { class: 'prompt', id: p.id || null }, [head, ...blocks]);
  }

  window.SITE = { el, copyButton, copyText, promptBox };

  renderHeader();
})();
