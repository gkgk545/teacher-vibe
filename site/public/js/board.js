// 공유 게시판 화면. 입장 코드는 이 기기 브라우저에만 저장한다.
(function () {
  const C = window.CONTENT, S = window.SITE, el = S.el;
  const params = new URLSearchParams(location.search);
  const board = C.levels[params.get('b')] ? params.get('b') : S.level;
  const label = C.levels[board].label;
  const POLL_MS = 15000;
  const MAX_FILE = 1024 * 1024;

  const $ = (id) => document.getElementById(id);
  let version = null;
  let posts = [];
  let pollTimer = null;
  let renderWaiting = false;
  const openComments = new Set();
  const drafts = {};

  function session(key, value) {
    try {
      if (value === undefined) return sessionStorage.getItem(key);
      if (value === null) sessionStorage.removeItem(key); else sessionStorage.setItem(key, value);
    } catch (e) { return null; }
  }
  function local(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  const entryKey = 'entry:' + board;
  let entryCode = local(entryKey) || '';
  let adminCode = session('admin') || '';

  function headers(extra) {
    const h = Object.assign({}, extra);
    if (entryCode) h['x-entry-code'] = entryCode;
    if (adminCode) h['x-admin-code'] = adminCode;
    return h;
  }

  async function api(path, options) {
    const res = await fetch(path, Object.assign({}, options, { headers: headers(options && options.headers) }));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || '잠시 뒤 다시 시도해 주세요.');
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function toast(text) {
    const t = el('div', { class: 'toast', role: 'status', text });
    document.body.append(t);
    setTimeout(() => t.remove(), 2200);
  }

  function ago(ms) {
    const sec = Math.max(0, Math.round((Date.now() - ms) / 1000));
    if (sec < 60) return '방금';
    if (sec < 3600) return Math.floor(sec / 60) + '분 전';
    if (sec < 86400) return Math.floor(sec / 3600) + '시간 전';
    const d = new Date(ms);
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
  }

  // 입장
  function showEntry(message) {
    $('board').hidden = true;
    $('entry').hidden = false;
    $('entry-title').textContent = label + (adminLogin ? ' 게시판 관리' : ' 공유 게시판');
    $('entry-error').textContent = message || '';
    stopPolling();
  }

  // 주소 끝에 &admin 을 붙이면 같은 상자에서 관리 코드를 받는다.
  const adminLogin = params.has('admin') && !adminCode;
  if (adminLogin) {
    $('entry-label').textContent = '관리 코드';
    $('entry-help').textContent = '강사용 관리 모드입니다.';
    $('entry-code').type = 'password';
    $('entry-code').removeAttribute('inputmode');
  }

  $('entry-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = $('entry-code').value.trim();
    if (adminLogin) adminCode = code; else entryCode = code;
    try {
      const data = await api('/api/enter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ board }) });
      if (adminLogin) {
        if (!data.admin) throw new Error('관리 코드가 맞지 않습니다.');
        session('admin', adminCode);
      } else {
        local(entryKey, entryCode);
      }
      showBoard();
    } catch (err) {
      if (adminLogin) adminCode = ''; else entryCode = '';
      $('entry-error').textContent = err.message;
    }
  });

  function showBoard() {
    $('entry').hidden = true;
    $('board').hidden = false;
    $('board-title').textContent = label + ' 공유 게시판';
    $('admin-bar').hidden = !adminCode;
    version = null;
    load();
    startPolling();
  }

  // 목록 불러오기와 새로고침
  async function load() {
    try {
      const data = await api('/api/posts?board=' + board + (version === null ? '' : '&v=' + version));
      if (data.unchanged) return;
      version = data.version;
      posts = data.posts;
      requestRender();
    } catch (err) {
      if (err.status === 403) {
        if (adminCode) { adminCode = ''; session('admin', null); }
        entryCode = '';
        local(entryKey, null);
        showEntry('입장 코드를 다시 넣어 주세요.');
      }
    }
  }

  function startPolling() {
    stopPolling();
    pollTimer = setInterval(() => { if (!document.hidden) load(); }, POLL_MS);
  }
  function stopPolling() { if (pollTimer) clearInterval(pollTimer); pollTimer = null; }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !$('board').hidden) load(); });

  // 댓글을 쓰는 중에는 화면을 다시 그리지 않고, 입력을 마친 뒤 그린다.
  function typingInPosts() {
    const a = document.activeElement;
    return a && $('posts').contains(a) && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA');
  }
  function requestRender() {
    if (typingInPosts()) { renderWaiting = true; return; }
    render();
  }
  $('posts').addEventListener('focusout', () => {
    setTimeout(() => { if (renderWaiting && !typingInPosts()) { renderWaiting = false; render(); } }, 0);
  });

  function render() {
    $('empty').hidden = posts.length > 0;
    $('posts').replaceChildren(...posts.map(postCard));
  }

  function postCard(p) {
    const open = openComments.has(p.id);
    const commentsBox = el('div', { class: 'comments', hidden: !open }, [
      ...p.comments.map((c) => el('div', { class: 'comment' }, [
        el('b', { text: c.name }), c.body,
        el('span', { class: 'when', text: ago(c.created_at) }),
        adminCode ? el('button', { type: 'button', class: 'btn small danger', style: 'margin-left:6px', text: '삭제', onclick: () => removeComment(c) }) : null,
      ])),
      commentForm(p),
    ]);
    const toggle = el('button', {
      type: 'button', class: 'btn small', 'aria-expanded': String(open),
      text: '댓글 ' + p.comments.length,
      onclick: () => {
        const nowOpen = commentsBox.hidden;
        commentsBox.hidden = !nowOpen;
        toggle.setAttribute('aria-expanded', String(nowOpen));
        if (nowOpen) openComments.add(p.id); else openComments.delete(p.id);
      },
    });
    const actions = [];
    if (p.link) actions.push(el('a', { class: 'btn small primary', href: p.link, target: '_blank', rel: 'noopener noreferrer', text: '앱 열기' }));
    if (p.file_url) actions.push(el('a', { class: 'btn small' + (p.link ? '' : ' primary'), href: p.file_url, target: '_blank', rel: 'noopener noreferrer', text: p.link ? 'HTML 파일 열기' : '앱 열기' }));
    actions.push(toggle);
    if (adminCode) actions.push(el('button', { type: 'button', class: 'btn small danger', text: '글 삭제', onclick: () => removePost(p) }));

    return el('article', { class: 'card post' }, [
      el('h2', { class: 'app', text: p.app_name }),
      el('span', { class: 'chip', text: p.subject }),
      el('p', { class: 'intro', text: p.intro }),
      el('div', { class: 'meta', text: p.name + ' · ' + ago(p.created_at) }),
      el('div', { class: 'actions' }, actions),
      commentsBox,
    ]);
  }

  function commentForm(p) {
    const d = drafts[p.id] || {};
    const name = el('input', { type: 'text', maxlength: '20', placeholder: '이름', 'aria-label': '이름', required: true });
    const body = el('input', { type: 'text', maxlength: '300', placeholder: '댓글', 'aria-label': '댓글', required: true });
    name.value = d.name || local('myName') || '';
    body.value = d.body || '';
    const save = () => { drafts[p.id] = { name: name.value, body: body.value }; };
    name.addEventListener('input', save);
    body.addEventListener('input', save);
    const submit = el('button', { type: 'submit', class: 'btn small primary', text: '남기기' });
    const form = el('form', { class: 'comment-form' }, [el('div', { class: 'row' }, [name]), el('div', { class: 'row' }, [body, submit])]);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submit.disabled = true;
      try {
        await api('/api/comments', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ post_id: p.id, name: name.value, body: body.value }),
        });
        local('myName', name.value.trim());
        delete drafts[p.id];
        document.activeElement && document.activeElement.blur();
        renderWaiting = false;
        await load();
      } catch (err) {
        toast(err.message);
      } finally {
        submit.disabled = false;
      }
    });
    return form;
  }

  // 글 올리기
  const compose = $('compose');
  function setKind(kind) {
    $('link-field').hidden = kind !== 'link';
    $('file-field').hidden = kind !== 'file';
  }
  compose.querySelectorAll('input[name="kind"]').forEach((r) => r.addEventListener('change', () => setKind(r.value)));
  $('open-compose').addEventListener('click', () => {
    compose.hidden = false;
    if (!$('f-name').value) $('f-name').value = local('myName') || '';
    compose.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('f-app').focus({ preventScroll: true });
  });
  $('compose-cancel').addEventListener('click', () => { compose.hidden = true; });

  compose.addEventListener('submit', async (e) => {
    e.preventDefault();
    const error = $('compose-error');
    error.textContent = '';
    const kind = compose.querySelector('input[name="kind"]:checked').value;
    const fd = new FormData();
    fd.append('board', board);
    for (const name of ['name', 'app_name', 'subject', 'intro']) fd.append(name, compose.elements[name].value);
    if (kind === 'link') {
      const link = $('f-link').value.trim();
      if (!link) { error.textContent = '배포 주소를 적어 주세요.'; return; }
      fd.append('link', link);
    } else {
      const file = $('f-file').files[0];
      if (!file) { error.textContent = 'HTML 파일을 골라 주세요.'; return; }
      if (!/\.html$/i.test(file.name)) { error.textContent = '.html 파일만 올릴 수 있습니다.'; return; }
      if (file.size > MAX_FILE) { error.textContent = '파일은 1MB까지 올릴 수 있습니다.'; return; }
      fd.append('file', file, file.name);
    }
    const submit = $('compose-submit');
    submit.disabled = true;
    submit.textContent = '올리는 중';
    try {
      await api('/api/posts', { method: 'POST', body: fd });
      local('myName', compose.elements.name.value.trim());
      for (const id of ['f-app', 'f-subject', 'f-intro', 'f-link', 'f-file']) $(id).value = '';
      compose.hidden = true;
      toast('올렸습니다');
      await load();
      window.scrollTo({ top: $('board').offsetTop - 80, behavior: 'smooth' });
    } catch (err) {
      error.textContent = err.message;
    } finally {
      submit.disabled = false;
      submit.textContent = '올리기';
    }
  });

  // 관리 모드
  async function removePost(p) {
    if (!confirm("'" + p.app_name + "' 글을 지울까요? 댓글과 파일도 함께 지워집니다.")) return;
    try { await api('/api/posts/' + p.id, { method: 'DELETE' }); await load(); } catch (err) { toast(err.message); }
  }
  async function removeComment(c) {
    if (!confirm('이 댓글을 지울까요?')) return;
    try { await api('/api/comments/' + c.id, { method: 'DELETE' }); await load(); } catch (err) { toast(err.message); }
  }
  $('clear-board').addEventListener('click', async () => {
    const typed = prompt(label + ' 게시판의 글과 댓글을 모두 지웁니다. 계속하려면 ' + board + ' 를 입력하세요.');
    if (typed !== board) return;
    try {
      await api('/api/posts?board=' + board + '&confirm=' + board, { method: 'DELETE' });
      toast('게시판을 비웠습니다');
      await load();
    } catch (err) { toast(err.message); }
  });
  $('admin-exit').addEventListener('click', () => {
    session('admin', null);
    location.href = S.boardHref();
  });

  function start() {
    if (adminLogin) showEntry();
    else if (entryCode || adminCode) showBoard();
    else showEntry();
  }

  // 머리말에서 학교급을 바꾸면 그 학교급 게시판으로 옮긴다.
  S.onLevel((level) => { if (level !== board) location.href = S.boardHref(); });
  start();
})();
