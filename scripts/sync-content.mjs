// 실습자료 정본(프롬프트, 용어정리, 막힐때, 학운위심의, 예비스킬 zip)을 읽어 site/public/js/source.js 와 예비 스킬 zip을 만든다.
// 프롬프트는 코드 블록 안 글자를 그대로 옮긴다. 정본이 바뀌면 다시 실행하고 커밋한다.
//   사용: npm run sync   (실습자료 폴더 위치를 바꾸려면: node scripts/sync-content.mjs <실습자료 경로>)
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(process.argv[2] || join(ROOT, '..', '실습자료'));
const read = (name) => readFileSync(join(SRC, name), 'utf8').normalize('NFC').replace(/\r\n/g, '\n');

const STEP_BY_MARK = { '①': 'intro', '②': 'terms', '③': 'setup', '④': 'plan', '⑤': 'build', '⑥': 'deploy', '⑦': 'share' };

// ---- 작은 markdown 변환기(정본에 쓰인 문법만: 제목, 문단, 목록, 표, 코드 블록, 굵게, 코드, 주소)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(text) {
  let s = esc(text);
  // 붙여 넣을 문장(공백이 있고 긴 코드)에는 작은 복사 버튼을 붙인다.
  s = s.replace(/`([^`]+)`/g, (m, code) => (code.length > 25 && code.includes(' ')
    ? `<code>${code}</code> <button type="button" class="btn small copy-btn" data-copy-text="${code}">복사</button>`
    : `<code>${code}</code>`));
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/https?:\/\/[A-Za-z0-9._~:/?#@!$&'*+,;=%-]+[A-Za-z0-9/]/g, (url) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
  return s;
}

function cells(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
}

// 표 칸 안의 "1. ... 2. ..." 차례는 줄을 나눠 보여 준다.
const cellHtml = (c) => inline(c).replace(/ (?=\d\. )/g, '<br>');

export function markdown(lines) {
  const out = [];
  let para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flush();
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i]);
      out.push(copyBox(code.join('\n')));
    } else if (line.startsWith('|')) {
      flush();
      const rows = [];
      for (; i < lines.length && lines[i].startsWith('|'); i++) rows.push(cells(lines[i]));
      i--;
      const [head, , ...body] = rows;
      out.push('<div class="table-wrap"><table><thead><tr>' + head.map((h) => `<th>${inline(h)}</th>`).join('')
        + '</tr></thead><tbody>' + body.map((r) => '<tr>' + r.map((c) => `<td>${cellHtml(c)}</td>`).join('') + '</tr>').join('')
        + '</tbody></table></div>');
    } else if (/^\d+\. /.test(line) || line.startsWith('- ')) {
      flush();
      const ordered = /^\d+\. /.test(line);
      const items = [];
      for (; i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith('- ')); i++) {
        items.push(lines[i].replace(ordered ? /^\d+\. / : /^- /, ''));
      }
      i--;
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>` + items.map((t) => `<li>${inline(t)}</li>`).join('') + `</${tag}>`);
    } else if (line.startsWith('### ')) {
      flush();
      out.push(`<h4>${inline(cleanTitle(line.slice(4)))}</h4>`);
    } else if (!line.trim() || line.trim() === '---') {
      flush();
    } else {
      para.push(line.trim());
    }
  }
  flush();
  return out.join('\n');
}

const cleanTitle = (t) => t.replace(/\s*\(PPT \d+장\)/, '').trim();

function copyBox(text) {
  return `<div class="prompt"><div class="prompt-head"><span class="title">복사해서 붙여 넣기</span>`
    + `<button type="button" class="btn small copy-btn" data-copy>복사</button></div><pre>${esc(text)}</pre></div>`;
}

// "## " 제목으로 나눈다. 첫 덩어리(제목 앞)는 head.
function sections(text) {
  const result = [];
  let current = { title: null, lines: [] };
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) { result.push(current); current = { title: line.slice(3).trim(), lines: [] }; }
    else current.lines.push(line);
  }
  result.push(current);
  return result.filter((s) => s.title);
}

function stepOf(title) {
  const mark = Object.keys(STEP_BY_MARK).find((m) => title.includes(m));
  return mark ? STEP_BY_MARK[mark] : null;
}

// ---- 프롬프트
function parsePrompts() {
  return sections(read('프롬프트.md')).filter((s) => /^P\d+\./.test(s.title)).map((s) => {
    const [, id, name] = s.title.match(/^(P\d+)\.\s*(.+?)\s*·/);
    const blocks = [];
    const rest = [];
    let when = '';
    for (let i = 0; i < s.lines.length; i++) {
      const line = s.lines[i];
      if (line.startsWith('```')) {
        const code = [];
        for (i++; i < s.lines.length && !s.lines[i].startsWith('```'); i++) code.push(s.lines[i]);
        // 코드 블록 바로 앞의 "커밋할 때:" 같은 줄은 이름표로 쓴다.
        let label = '';
        while (rest.length && !rest[rest.length - 1].trim()) rest.pop();
        if (rest.length && /:$/.test(rest[rest.length - 1].trim())) label = rest.pop().trim().replace(/:$/, '');
        blocks.push({ label, text: code.join('\n') });
      } else if (line.startsWith('**쓰는 때**')) {
        when = inline(line.replace(/^\*\*쓰는 때\*\*\s*:\s*/, ''));
      } else {
        rest.push(line);
      }
    }
    if (!blocks.length) throw new Error(`${id}에 코드 블록이 없습니다`);
    return { id, name, step: stepOf(s.title), blocks, when, details: markdown(rest) };
  });
}

// ---- 용어
function parseTerms() {
  return sections(read('용어정리.md')).filter((s) => /^\d+\./.test(s.title)).map((s) => {
    const group = s.title.replace(/^\d+\.\s*/, '').split(':')[0].trim();
    const items = [];
    const rest = [];
    for (const line of s.lines) {
      if (line.startsWith('|')) {
        const c = cells(line);
        if (c[0] === '용어' || /^-+$/.test(c[0])) continue;
        items.push({ term: c[0], desc: inline(c[1]), analogy: inline(c[2]) });
      } else rest.push(line);
    }
    return { group, items, notes: markdown(rest) };
  });
}

// ---- 막힐 때: 꼭지별 표(stuck)와 "### " 소절(subs). 소절은 다음 "### " 또는 "| 상황" 표 앞에서 끝난다.
function parseStuck() {
  const stuck = {};
  const subs = {};
  let studio = '';
  for (const s of sections(read('막힐때.md'))) {
    if (s.title.startsWith('Google AI Studio')) { studio = markdown(s.lines); continue; }
    const step = stepOf(s.title);
    if (!step) continue;
    const main = [];
    let sub = null;
    for (const line of s.lines) {
      if (line.startsWith('### ')) { sub = cleanTitle(line.slice(4)); subs[sub] = []; continue; }
      if (sub && line.startsWith('| 상황')) sub = null;
      (sub ? subs[sub] : main).push(line);
    }
    stuck[step] = markdown(main);
  }
  for (const title of Object.keys(subs)) subs[title] = markdown(subs[title]);
  return { stuck, subs, studio };
}

// ---- 학운위 심의: 1장 화면 문장(목록만), 2장 설명
function parseCommittee() {
  const all = sections(read('학운위심의.md'));
  const one = all.find((s) => s.title.startsWith('1.'));
  const two = all.find((s) => s.title.startsWith('2.'));
  return { points: markdown(one.lines.filter((l) => l.startsWith('- '))), body: markdown(two.lines) };
}

const prompts = parsePrompts();
const terms = parseTerms();
const { stuck, subs, studio } = parseStuck();
const committee = parseCommittee();

const downloads = join(ROOT, 'site', 'public', 'downloads');
mkdirSync(downloads, { recursive: true });
for (const zip of ['skills_agents.zip', 'skills_claude.zip']) copyFileSync(join(SRC, '예비스킬', zip), join(downloads, zip));

const data = { syncedAt: new Date().toISOString().slice(0, 10), prompts, terms, stuck, subs, studio, committee };
const header = '// 자동 생성: scripts/sync-content.mjs 가 ../실습자료 정본에서 만든다. 직접 고치지 않는다.\n';
writeFileSync(join(ROOT, 'site', 'public', 'js', 'source.js'), `${header}window.SOURCE = ${JSON.stringify(data, null, 1)};\n`);
console.log(`프롬프트 ${prompts.length}개(블록 ${prompts.reduce((n, p) => n + p.blocks.length, 0)}), 용어 묶음 ${terms.length}개, 막힐 때 꼭지 ${Object.keys(stuck).join(', ')}, 소절 ${Object.keys(subs).join(' / ')}, zip 2개`);
