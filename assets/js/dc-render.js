// Minimal renderer for the Claude Design (.dc.html) template syntax used in /design.
// Supports {{path}} holes, <sc-for list as>, <sc-if value>. Works in Node and the browser.
(function (root) {
  const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function lookup(path, scopes) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return +path;
    const parts = path.split('.');
    for (const s of scopes) {
      if (s && Object.prototype.hasOwnProperty.call(s, parts[0])) {
        let v = s[parts[0]];
        for (const p of parts.slice(1)) v = v == null ? undefined : v[p];
        return v;
      }
    }
    return undefined;
  }

  function attr(open, name) {
    const m = open.match(new RegExp('\\s' + name + '="([^"]*)"'));
    return m ? m[1] : null;
  }

  function holeOf(value, scopes) {
    const m = value && value.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    return m ? lookup(m[1], scopes) : value;
  }

  function matchClose(tpl, tag, from) {
    const re = new RegExp('<' + tag + '[\\s>]|</' + tag + '>', 'g');
    re.lastIndex = from;
    let depth = 1, m;
    while ((m = re.exec(tpl))) {
      if (m[0][1] === '/') { if (--depth === 0) return { start: m.index, end: m.index + m[0].length }; }
      else depth++;
    }
    throw new Error('Unclosed <' + tag + '>');
  }

  function interp(s, scopes) {
    return s
      .replace(/\s(on[A-Z]\w*|disabled)="\{\{[^}]*\}\}"/g, '')
      .replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, p) => { const v = lookup(p, scopes); return v == null || v === false ? '' : esc(v); });
  }

  function render(tpl, scopes) {
    if (!Array.isArray(scopes)) scopes = [scopes];
    let out = '', i = 0;
    const re = /<(sc-for|sc-if)[\s>]/g;
    let m;
    while ((re.lastIndex = i), (m = re.exec(tpl))) {
      out += interp(tpl.slice(i, m.index), scopes);
      const tag = m[1];
      const openEnd = tpl.indexOf('>', m.index) + 1;
      const open = tpl.slice(m.index, openEnd);
      const close = matchClose(tpl, tag, openEnd);
      const inner = tpl.slice(openEnd, close.start);
      if (tag === 'sc-for') {
        const list = holeOf(attr(open, 'list'), scopes) || [];
        const as = attr(open, 'as') || 'item';
        list.forEach((item, k) => { out += render(inner, [{ [as]: item, $index: k }].concat(scopes)); });
      } else if (holeOf(attr(open, 'value'), scopes)) {
        out += render(inner, scopes);
      }
      i = close.end;
    }
    return out + interp(tpl.slice(i), scopes);
  }

  // Split a .dc.html source into its parts.
  function parse(src) {
    const x = src.slice(src.indexOf('<x-dc>') + 6, src.lastIndexOf('</x-dc>'));
    const h0 = x.indexOf('<helmet>'), h1 = x.indexOf('</helmet>');
    const helmet = h0 >= 0 ? x.slice(h0 + 8, h1) : '';
    const body = h0 >= 0 ? x.slice(0, h0) + x.slice(h1 + 9) : x;
    const sm = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
    const tm = src.match(/<title>([\s\S]*?)<\/title>/);
    return { helmet, body: body.trim(), script: sm ? sm[1] : '', title: tm ? tm[1] : '' };
  }

  // Patch live DOM `a` to match new DOM `b` in place, so CSS transitions keep running.
  function morph(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { a.replaceWith(b.cloneNode(true)); return; }
    if (a.nodeType === 3 || a.nodeType === 8) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
    if (a.nodeType !== 1) return;
    for (const { name } of [...a.attributes]) if (!b.hasAttribute(name)) a.removeAttribute(name);
    for (const { name, value } of [...b.attributes]) if (a.getAttribute(name) !== value) a.setAttribute(name, value);
    const ac = [...a.childNodes], bc = [...b.childNodes];
    bc.forEach((n, i) => { if (ac[i]) morph(ac[i], n); else a.appendChild(n.cloneNode(true)); });
    for (let i = bc.length; i < ac.length; i++) ac[i].remove();
  }

  const api = { render, parse, lookup, morph };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DCRender = api;
})(typeof window !== 'undefined' ? window : globalThis);
