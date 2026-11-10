// 실습자료 정본에서 복사 문장(프롬프트 P1~P8, 막힐때.md의 P 번호 없는 문장 세 개)과 용어(용어정리.md)를 뽑아
// site/public/js/source.js 를 만들고, 예비 스킬 zip을 site/public/downloads/ 로 옮긴다.
// 복사 문장은 코드 블록(또는 인라인 코드) 안 글자를 그대로 옮긴다. 정본이 바뀌면 다시 실행하고 커밋한다.
//   사용: npm run sync   (실습자료 폴더 위치를 바꾸려면: node scripts/sync-content.mjs <실습자료 경로>)
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(process.argv[2] || join(ROOT, '..', '실습자료'));
const read = (name) => readFileSync(join(SRC, name), 'utf8').normalize('NFC').replace(/\r\n/g, '\n');

// 막힐때.md의 소절 제목 → 사이트에 보일 짧은 이름
const EXTRAS = [
  ['예비 스킬 파일(zip) 쓰는 법', 'zip 풀기'],
  ['오류가 나면 오류 문구를 그대로 AI에게 보여 줍니다', '오류 보고'],
  ['올리기 전에 세 가지를 확인합니다', '올리기 전 점검'],
];

// "## " 제목으로 나눈다.
function sections(text, mark = '## ') {
  const result = [];
  let current = null;
  for (const line of text.split('\n')) {
    if (line.startsWith(mark)) { current = { title: line.slice(mark.length).trim(), lines: [] }; result.push(current); }
    else if (current) current.lines.push(line);
  }
  return result;
}

// 코드 블록(``` ... ```)들과 그 바로 앞 줄("커밋할 때:" 같은 이름표)
function fences(lines) {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('```')) continue;
    let k = i - 1;
    while (k >= 0 && !lines[k].trim()) k--;
    const before = k >= 0 ? lines[k].trim() : '';
    const code = [];
    for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i]);
    blocks.push({ label: /:$/.test(before) ? before.replace(/:$/, '') : '', text: code.join('\n') });
  }
  return blocks;
}

function parsePrompts() {
  return sections(read('프롬프트.md')).filter((s) => /^P\d+\./.test(s.title)).map((s) => {
    const [, id, name] = s.title.match(/^(P\d+)\.\s*(.+?)\s+·\s/);
    const blocks = fences(s.lines);
    if (!blocks.length) throw new Error(`${id}에 코드 블록이 없습니다`);
    if (blocks.length === 1) blocks[0].label = '';
    return { id, name, blocks };
  });
}

// 소절 안의 첫 코드 블록, 없으면 붙여 넣을 문장(공백이 있는 긴 인라인 코드)
function parseExtras() {
  const subs = sections(read('막힐때.md'), '### ');
  return EXTRAS.map(([title, name]) => {
    const sub = subs.find((s) => s.title === title);
    if (!sub) throw new Error(`막힐때.md에 '${title}' 소절이 없습니다`);
    const lines = sub.lines.slice(0, sub.lines.findIndex((l) => l.startsWith('## ')) >>> 0);
    const block = fences(lines)[0];
    let text = block && block.text;
    if (!text) {
      const inline = [...lines.join('\n').matchAll(/`([^`]+)`/g)].map((m) => m[1]).find((c) => c.length > 25 && c.includes(' '));
      text = inline;
    }
    if (!text) throw new Error(`'${title}'에 복사 문장이 없습니다`);
    return { name, text };
  });
}

// 용어정리.md: "## 1. 대화와 기억" 같은 번호 묶음. 표 줄은 용어(교실 비유 칸은 비어 있을 수 있다), 나머지 글은 "기억할 것" 문단.
// 문단 안의 **굵게**와 `코드`만 HTML로 바꾼다.
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

function parseTerms() {
  const terms = sections(read('용어정리.md')).filter((s) => /^\d+\./.test(s.title)).map((s) => {
    const group = s.title.replace(/^\d+\.\s*/, '').split(':')[0].trim();
    const items = [];
    const notes = [];
    for (const line of s.lines) {
      if (line.startsWith('|')) {
        const c = cells(line);
        if (c[0] === '용어' || /^-+$/.test(c[0])) continue;
        items.push({ term: c[0], desc: inline(c[1]), analogy: c[2] ? inline(c[2]) : '' });
      } else if (line.trim()) notes.push(`<p>${inline(line.trim())}</p>`);
    }
    if (!items.length) throw new Error(`용어정리.md '${s.title}'에 용어 표가 없습니다`);
    return { group, items, notes: notes.join('') };
  });
  if (!terms.length) throw new Error('용어정리.md에서 용어 묶음을 찾지 못했습니다');
  return terms;
}

const prompts = parsePrompts();
const extras = parseExtras();
const terms = parseTerms();

const downloads = join(ROOT, 'site', 'public', 'downloads');
mkdirSync(downloads, { recursive: true });
for (const zip of ['skills_agents.zip', 'skills_claude.zip']) copyFileSync(join(SRC, '예비스킬', zip), join(downloads, zip));

const data = { syncedAt: new Date().toISOString().slice(0, 10), prompts, extras, terms };
const header = '// 자동 생성: scripts/sync-content.mjs 가 ../실습자료 정본에서 만든다. 직접 고치지 않는다.\n';
writeFileSync(join(ROOT, 'site', 'public', 'js', 'source.js'), `${header}window.SOURCE = ${JSON.stringify(data, null, 1)};\n`);
console.log(`프롬프트 ${prompts.length}개(블록 ${prompts.reduce((n, p) => n + p.blocks.length, 0)}), 그 밖의 문장 ${extras.map((e) => e.name).join(' / ')}, 용어 ${terms.length}묶음 ${terms.reduce((n, g) => n + g.items.length, 0)}개, zip 2개`);
