/* Buduje style Tailwinda wbudowane w panel i plik do wklejenia w Elementora.
   Uruchom po każdej zmianie klas w panelu:
     cd funnel/build && npm install && npm run build
   1. skanuje klasy w ../panel-wdrozeniowy.html,
   2. wstawia skompilowany CSS do <style id="onb-tailwind">,
   3. zapisuje fragment od pierwszego <link> do ostatniego </script> jako ../panel-elementor.html. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const FUNNEL = path.resolve(__dirname, '..');
const SOURCE = path.join(FUNNEL, 'panel-wdrozeniowy.html');
const ELEMENTOR = path.join(FUNNEL, 'panel-elementor.html');
const STYLE_BLOCK = /(<style id="onb-tailwind">)([\s\S]*?)(<\/style>)/;
const START = '<!-- ELEMENTOR:START -->';
const END = '<!-- ELEMENTOR:END -->';

let html = fs.readFileSync(SOURCE, 'utf8');
if (!STYLE_BLOCK.test(html)) throw new Error('Brak <style id="onb-tailwind"> w ' + SOURCE);

/* Skanujemy panel bez starego CSS, żeby nie zbierać klas z poprzedniej kompilacji. */
const scanFile = path.join(os.tmpdir(), 'onb-scan-' + process.pid + '.html');
fs.writeFileSync(scanFile, html.replace(STYLE_BLOCK, (m, open, css, close) => open + close));
let css;
try {
  css = execFileSync(process.execPath, [
    require.resolve('tailwindcss/lib/cli.js'),
    '-c', path.join(__dirname, 'tailwind.config.js'),
    '-i', path.join(__dirname, 'input.css'),
    '--content', scanFile,
    '--minify'
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
} finally {
  fs.unlinkSync(scanFile);
}

html = html.replace(STYLE_BLOCK, (m, open, old, close) => open + css + close);
fs.writeFileSync(SOURCE, html);

const from = html.indexOf(START);
const to = html.indexOf(END);
if (from < 0 || to < 0) throw new Error('Brak znaczników ' + START + ' / ' + END);
const snippet = html.slice(from + START.length, to).trim() + '\n';
fs.writeFileSync(ELEMENTOR, snippet);

console.log('CSS: ' + css.length + ' B, panel-elementor.html: ' + snippet.length + ' B');
