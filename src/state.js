import { reactive } from 'vue'

let uidCounter = 1
export function uid() { return 'el_' + uidCounter++ + '_' + Math.random().toString(36).slice(2, 7) }
function defaultSpacing(padTop = 10, padRest = 10) { return { margin: { top: 0, right: 0, bottom: 0, left: 0 }, padding: { top: padTop, right: padRest, bottom: padTop, left: padRest }, marginLinked: true, paddingLinked: true } }

export const WIDGETS = [
  { type: 'section', icon: '▦', label: 'Section' }, { type: 'heading', icon: 'H', label: 'Heading' },
  { type: 'text', icon: '¶', label: 'Text Editor' }, { type: 'image', icon: '▧', label: 'Image' },
  { type: 'button', icon: '▭', label: 'Button' }, { type: 'video', icon: '▶', label: 'Video' },
  { type: 'divider', icon: '—', label: 'Divider' }, { type: 'spacer', icon: '↕', label: 'Spacer' },
]
export const LABELS = { section: 'Section', heading: 'Heading', text: 'Text Editor', image: 'Image', button: 'Button', video: 'Video', divider: 'Divider', spacer: 'Spacer' }
export const GLOBAL_COLORS = [
  { name: 'Primary', hex: '#6EC1E4' }, { name: 'Secondary', hex: '#54595F' }, { name: 'Text', hex: '#7A7A7A' },
  { name: 'Accent', hex: '#61CE70' }, { name: 'Dark', hex: '#1A1A1A' }, { name: 'White', hex: '#FFFFFF' },
]

export function createNode(type) {
  const base = { id: uid(), type, spacing: defaultSpacing() }
  switch (type) {
    case 'section': base.spacing = defaultSpacing(20, 20); base.content = {}; base.style = { bgColor: '#FFFFFF' }; base.layout = { direction: 'row', gap: 16, wrap: true }; base.children = []; break
    case 'heading': base.content = { text: 'Add Your Heading Text Here', tag: 'h2' }; base.style = { color: '#1A1A1A', fontSize: 30, fontWeight: '700', textAlign: 'left' }; break
    case 'text': base.content = { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Edit this text to add your own copy.' }; base.style = { color: '#54595F', fontSize: 16, fontWeight: '400', textAlign: 'left', lineHeight: 1.6 }; break
    case 'image': base.content = { src: 'https://placehold.co/640x360/e9e8e4/75726a?text=Image', alt: 'Image' }; base.style = { width: 100, borderRadius: 0 }; break
    case 'button': base.content = { text: 'Click Here', link: '#' }; base.style = { bgColor: '#6EC1E4', color: '#FFFFFF', fontSize: 15, fontWeight: '600', borderRadius: 4, textAlign: 'left' }; base.spacing = defaultSpacing(12, 24); break
    case 'video': base.content = { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }; base.style = {}; base.spacing = defaultSpacing(0, 0); break
    case 'divider': base.content = {}; base.style = { color: '#DCDAD4', thickness: 1 }; base.spacing = defaultSpacing(16, 0); break
    case 'spacer': base.content = {}; base.style = { height: 40 }; base.spacing = defaultSpacing(0, 0); break
  }
  return base
}
export function cloneNode(node) { const copy = JSON.parse(JSON.stringify(node)); const remap = n => { n.id = uid(); if (n.children) n.children.forEach(remap) }; remap(copy); return copy }

export const state = reactive({ elements: [], selectedId: null, activeTab: 'content', dragOverId: null })
export function findNode(list, id) { for (const n of list) { if (n.id === id) return n; if (n.children) { const found = findNode(n.children, id); if (found) return found } } return null }
export function findParentList(list, id) { for (const n of list) { if (n.id === id) return { list, node: n }; if (n.children) { const found = findParentList(n.children, id); if (found) return found } } return null }
function containsNode(node, id) { return !!node?.children?.some(child => child.id === id || containsNode(child, id)) }
export function selectNode(id) { state.selectedId = id; state.activeTab = 'content' }
export function addWidget(type) { const node = createNode(type); const sel = state.selectedId ? findNode(state.elements, state.selectedId) : null; if (sel?.type === 'section') sel.children.push(node); else state.elements.push(node); selectNode(node.id) }
export function addWidgetToSection(type, sectionId) { const section = findNode(state.elements, sectionId); if (!section || section.type !== 'section') return null; const node = createNode(type); section.children.push(node); selectNode(node.id); return node }
export function deleteNode(id) { const found = findParentList(state.elements, id); if (!found) return; found.list.splice(found.list.indexOf(found.node), 1); if (state.selectedId === id) state.selectedId = null }
export function duplicateNode(id) { const found = findParentList(state.elements, id); if (!found) return; const idx = found.list.indexOf(found.node); const copy = cloneNode(found.node); found.list.splice(idx + 1, 0, copy); selectNode(copy.id) }
export function moveNode(id, dir) { const found = findParentList(state.elements, id); if (!found) return; const idx = found.list.indexOf(found.node); const next = idx + dir; if (next < 0 || next >= found.list.length) return; const [item] = found.list.splice(idx, 1); found.list.splice(next, 0, item) }
export function moveNodeTo(id, targetId = null, position = 'inside') {
  if (!id || id === targetId) return false
  const source = findParentList(state.elements, id); if (!source) return false
  const target = targetId ? findNode(state.elements, targetId) : null
  if (target && (target.id === source.node.id || containsNode(source.node, target.id))) return false
  const node = source.node; source.list.splice(source.list.indexOf(node), 1)
  if (!target) { state.elements.push(node); selectNode(node.id); return true }
  if (position === 'inside' && target.type === 'section') { target.children.push(node); selectNode(node.id); return true }
  const parent = findParentList(state.elements, target.id); if (!parent) { state.elements.push(node); selectNode(node.id); return true }
  let index = parent.list.indexOf(target); if (position === 'after') index++
  parent.list.splice(index, 0, node); selectNode(node.id); return true
}
export function dropWidget(type, targetId = null, position = 'inside') {
  const node = createNode(type); const target = targetId ? findNode(state.elements, targetId) : null
  if (target && position === 'inside' && target.type === 'section') target.children.push(node)
  else if (target) { const parent = findParentList(state.elements, target.id); if (!parent) return null; let index = parent.list.indexOf(target); if (position === 'after') index++; parent.list.splice(index, 0, node) }
  else state.elements.push(node)
  selectNode(node.id); return node
}
export function clearDragState() { state.dragOverId = null }
export function clearAll() { if (!state.elements.length) return; if (confirm('Clear the entire canvas? This cannot be undone.')) { state.elements.splice(0); state.selectedId = null } }
export function updateSpacingSide(node, box, side, value) { const num = Number(value); const v = isNaN(num) ? 0 : num; if (node.spacing[box + 'Linked']) ['top','right','bottom','left'].forEach(s => node.spacing[box][s] = v); else node.spacing[box][side] = v }
export function toggleLink(node, box) { node.spacing[box + 'Linked'] = !node.spacing[box + 'Linked']; if (node.spacing[box + 'Linked']) { const v = node.spacing[box].top; ['right','bottom','left'].forEach(s => node.spacing[box][s] = v) } }

function px(v) { return v === undefined || v === null || v === '' ? '0px' : v + 'px' }
function spacingStyle(node) { const m = node.spacing.margin, p = node.spacing.padding; return { margin: `${px(m.top)} ${px(m.right)} ${px(m.bottom)} ${px(m.left)}`, padding: `${px(p.top)} ${px(p.right)} ${px(p.bottom)} ${px(p.left)}` } }
export function nodeStyle(node) {
  const s = spacingStyle(node)
  switch (node.type) {
    case 'section': return { ...s, display:'flex', flexDirection:node.layout.direction, flexWrap:node.layout.wrap?'wrap':'nowrap', gap:px(node.layout.gap), backgroundColor:node.style.bgColor, minHeight:node.children.length?'auto':'90px', borderRadius:'2px' }
    case 'heading': case 'text': return { ...s, color:node.style.color, fontSize:px(node.style.fontSize), fontWeight:node.style.fontWeight, textAlign:node.style.textAlign, lineHeight:node.style.lineHeight||1.4, whiteSpace:'pre-wrap', wordBreak:'break-word' }
    case 'image': return { ...s, width:(node.style.width||100)+'%', height:'auto', display:'block', borderRadius:px(node.style.borderRadius) }
    case 'button': return { ...s, display:'inline-block', backgroundColor:node.style.bgColor, color:node.style.color, fontSize:px(node.style.fontSize), fontWeight:node.style.fontWeight, borderRadius:px(node.style.borderRadius), textAlign:node.style.textAlign, textDecoration:'none', border:'none', cursor:'pointer' }
    case 'video': return { ...s, display:'block', width:'100%', height:'320px', backgroundColor:'#000' }
    case 'divider': return { ...s, border:'none', borderTop:`${node.style.thickness||1}px solid ${node.style.color}` }
    case 'spacer': return { ...s, height:px(node.style.height), width:'100%' }
    default: return s
  }
}

/* Exported Vue SFCs use classes + a scoped <style>, never inline style attributes. */
function kebab(k) { return k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()) }
function styleObjToCss(obj) { return Object.entries(obj).filter(([,v]) => v !== undefined && v !== null && v !== '').map(([k,v]) => `${kebab(k)}: ${v};`).join('\n  ') }
function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function cssClass(node) { return `pb-node-${node.id.replace(/[^a-zA-Z0-9_-]/g, '')}` }

function genNode(node, depth, cssRules) {
  const ind = '  '.repeat(depth), cls = cssClass(node)
  cssRules.push(`.${cls} {\n  ${styleObjToCss(nodeStyle(node))}\n}`)
  switch (node.type) {
    case 'section': { const inner = node.children.map(c => genNode(c, depth + 1, cssRules)).join('\n'); return `${ind}<div class="pb-section ${cls}">${inner ? '\n' + inner + '\n' + ind : ''}</div>` }
    case 'heading': return `${ind}<${node.content.tag} class="pb-heading ${cls}">${escapeHtml(node.content.text)}</${node.content.tag}>`
    case 'text': return `${ind}<p class="pb-text ${cls}">${escapeHtml(node.content.text)}</p>`
    case 'image': return `${ind}<img class="pb-image ${cls}" src="${escapeHtml(node.content.src)}" alt="${escapeHtml(node.content.alt)}" />`
    case 'button': return `${ind}<a class="pb-button ${cls}" href="${escapeHtml(node.content.link)}">${escapeHtml(node.content.text)}</a>`
    case 'video': return `${ind}<div class="pb-video ${cls}"><iframe src="${escapeHtml(node.content.src)}" allowfullscreen></iframe></div>`
    case 'divider': return `${ind}<hr class="pb-divider ${cls}" />`
    case 'spacer': return `${ind}<div class="pb-spacer ${cls}"></div>`
    default: return ''
  }
}

export function generateSFC() {
  const cssRules = []
  const body = state.elements.map(n => genNode(n, 2, cssRules)).join('\n')
  return `<template>\n  <div class="pb-page">\n${body}\n  </div>\n</template>\n\n<script setup>\n// Generated by Vue Page Builder.\n// Layout, spacing, typography and colors are generated as scoped component CSS.\n<\\/script>\n\n<style scoped>\n.pb-page {\n  width: 100%;\n}\n.pb-button {\n  text-decoration: none;\n  display: inline-block;\n}\n.pb-image {\n  max-width: 100%;\n}\n.pb-video iframe {\n  width: 100%;\n  height: 100%;\n  border: 0;\n  display: block;\n}\n${cssRules.join('\n\n')}\n</style>\n`
}
