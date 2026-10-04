/* ===== Datos del viaje ===== */
const DAYS = [
  { id: 1, tab: "Santiago", stamp: "Santiago", color: "#1f5c63",
    title: "Santiago de Compostela",
    intro: "Piedra, lluvia y peregrinos. Un día a pie por el casco histórico.",
    zones: [
      { name: "Casco histórico", place: "Santiago de Compostela", stops: [
        { n: "Catedral y Praza do Obradoiro" },
        { n: "Rúa do Franco" }, { n: "Rúa da Raíña" },
        { n: "Praza de Platerías" }, { n: "Praza da Quintana" }, { n: "Praza de Cervantes" },
        { n: "Mosteiro de San Martiño Pinario" },
        { n: "Convento de San Francisco" },
        { n: "Mercado de Abastos" },
        { n: "Praza do Toural" } ] },
      { name: "Verde y vistas", place: "Santiago de Compostela", stops: [
        { n: "Parque de San Domingos de Bonaval" },
        { n: "Paseo fluvial por el río Sarela" },
        { n: "Monte Pedroso" },
        { n: "Monte do Gozo", d: "Monumento al caminante" } ] }
    ],
    eat: [{ n: "Abastos 2.0" }, { n: "Bar La Tita" }, { n: "Taberna O Gato Negro" }, { n: "A Noiesa" }, { n: "Mesón 42" }],
    eatPlace: "Santiago de Compostela" },

  { id: 2, tab: "Rías Baixas", stamp: "Pontevedra", color: "#2d6a4f",
    title: "Lourizán, Pontevedra y Combarro",
    intro: "Un pazo, una ciudad de plazas y un pueblo de hórreos frente al mar.",
    zones: [
      { name: "Pazo de Lourizán", place: "Poio, Pontevedra", stops: [{ n: "Pazo de Lauriñán" }] },
      { name: "Pontevedra", place: "Pontevedra", stops: [
        { n: "Ruínas de Santo Domingo" }, { n: "Praza da Peregrina" }, { n: "Convento de San Francisco" },
        { n: "Rúa Soportales" }, { n: "Praza da Verdura" }, { n: "Praza da Leña" }, { n: "Praza da Ferrería" },
        { n: "Cruzar el Ponte do Burgo" }, { n: "Praza das Cinco Rúas" }, { n: "Basílica de Santa María a Maior" } ],
        eat: [{ n: "Loaira Xantares" }, { n: "Casa Fidel - O Pulpeiro" }] },
      { name: "Combarro", place: "Combarro, Poio", stops: [
        { n: "Rúa San Roque", d: "Praza da Fonte" }, { n: "Praia do Padrón" }, { n: "Rúa do Mar" } ] }
    ] },

  { id: 3, tab: "Arousa", stamp: "Arousa", color: "#7a4e8a",
    title: "Isla de Arousa y Cambados",
    intro: "Faros, dunas y la capital del albariño.",
    zones: [
      { name: "Isla de Arousa", place: "Illa de Arousa", stops: [
        { n: "Faro de Punta Cabalo" }, { n: "Parque Natural Carreirón" } ] },
      { name: "Cambados", place: "Cambados", note: "Capital del albariño.", stops: [
        { n: "Ruínas de Santa Mariña" } ] },
      { name: "San Vicente do Mar", place: "San Vicente do Mar, O Grove", stops: [
        { n: "Praia de Pedras Negras" }, { n: "Náutico de San Vicente" } ] }
    ] },

  { id: 4, tab: "A Coruña", stamp: "A Coruña", color: "#b5533c",
    title: "A Coruña",
    intro: "Ciudad de cristal frente al Atlántico: del puerto a la Torre de Hércules.",
    zones: [
      { name: "Centro y ciudad vieja", place: "A Coruña", stops: [
        { n: "Avenida de la Marina" }, { n: "Plaza de María Pita" }, { n: "Mercado de San Agustín" },
        { n: "Iglesia de Santiago" }, { n: "Plaza del General Azcárraga" },
        { n: "Jardines de San Carlos" }, { n: "Castillo de San Antón" } ] },
      { name: "Torre de Hércules", place: "A Coruña", stops: [
        { n: "Torre de Hércules" }, { n: "Parque Escultórico de la Torre de Hércules" } ] },
      { name: "Calle Real, playas y miradores", place: "A Coruña", stops: [
        { n: "Calle Real" }, { n: "Playas de Riazor y Orzán" },
        { n: "Monte de San Pedro" }, { n: "Parque de Santa Margarita" } ] }
    ],
    eat: [{ n: "Taberna da Galera" }, { n: "Bar Tarabelo" }], eatPlace: "A Coruña",
    shop: { n: "Feitizos de Sabor", place: "Mercado Plaza de Lugo, A Coruña",
      t: "Vinos, quesos y conservas gallegas. Mercado de la Plaza de Lugo, 2.ª planta, puesto V13. Abre de lunes a sábado de 9:00 a 15:00: ve por la mañana." } }
];

/* ===== Utilidades ===== */
const $ = (s, r = document) => r.querySelector(s);
const mapsUrl = (n, p) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(n + ", " + p);
const KEY = "galicia-progress-v1";

let state = {};
try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { state = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
const isDone = id => !!state[id];
// Pide al navegador que no borre los datos del sitio
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

DAYS.forEach(day => {
  let i = 0;
  day.zones.forEach(z => {
    z.stops.forEach(s => s.id = `d${day.id}-s${i++}`);
    (z.eat || []).forEach(e => e.id = `d${day.id}-e${i++}`);
  });
  (day.eat || []).forEach(e => e.id = `d${day.id}-e${i++}`);
  if (day.shop) day.shop.id = `d${day.id}-shop`;
});
const stopsOf = d => d.zones.flatMap(z => z.stops);
const dayComplete = d => stopsOf(d).every(s => isDone(s.id));
const totalStops = DAYS.reduce((a, d) => a + stopsOf(d).length, 0);

/* ===== Render ===== */
let current = 1;

function renderTabs() {
  $("#tabbar").innerHTML = DAYS.map(d => `
    <button class="tab" role="tab" data-day="${d.id}" aria-selected="${d.id === current}">
      Día ${d.id}<small>${d.tab}</small></button>`).join("");
}

const eatCard = (e, place) => `
  <div class="eat-card ${isDone(e.id) ? "done" : ""}">
    <strong>${e.n}</strong>
    <a href="${mapsUrl(e.n, place)}" target="_blank" rel="noopener">Ver en el mapa</a>
    <button data-toggle="${e.id}">${isDone(e.id) ? "Ya comimos aquí ✓" : "Marcar como visitado"}</button>
  </div>`;

const eatBlock = (list, place, title) => `
  <div class="eat-block"><h4>${title}</h4><div class="eat-scroll">${list.map(e => eatCard(e, place)).join("")}</div></div>`;

function renderStop(s, place) {
  const d = isDone(s.id);
  return `<li class="stop ${d ? "done" : ""}"><div class="stop-card">
    <button class="stop-main" data-toggle="${s.id}" role="checkbox" aria-checked="${d}">
      <i class="box">✓</i><span class="txt"><span>${s.n}</span>${s.d ? `<small>${s.d}</small>` : ""}</span>
    </button>
    <a class="pin" href="${mapsUrl(s.n, place)}" target="_blank" rel="noopener" aria-label="Abrir ${s.n} en el mapa">📍</a>
  </div></li>`;
}

function render() {
  const day = DAYS.find(d => d.id === current);
  document.documentElement.style.setProperty("--day", day.color);
  const stops = stopsOf(day), done = stops.filter(s => isDone(s.id)).length;

  $("#dayHead").innerHTML = `
    <div class="when">Día ${day.id} de ${DAYS.length}</div>
    <h2>${day.title}</h2><p>${day.intro}</p>
    <div class="day-bar"><i style="width:${done / stops.length * 100}%"></i></div>
    <div class="day-meta">${done === stops.length ? "¡Día completado! Sello conseguido" : `${done} de ${stops.length} paradas`}</div>`;

  $("#dayContent").innerHTML = `<div class="fade">` + day.zones.map(z => {
    const zd = z.stops.filter(s => isDone(s.id)).length;
    return `<section class="zone">
      <div class="zone-title ${zd === z.stops.length ? "full" : ""}"><h3>${z.name}</h3><span class="zc">${zd}/${z.stops.length}</span></div>
      ${z.note ? `<p class="zone-note">${z.note}</p>` : ""}
      <ol class="route">${z.stops.map(s => renderStop(s, z.place)).join("")}</ol>
      ${z.eat ? eatBlock(z.eat, z.place, "Dónde comer en " + z.name) : ""}
    </section>`;
  }).join("") +
  (day.eat ? `<section class="zone">${eatBlock(day.eat, day.eatPlace, "Dónde comer en " + day.tab)}</section>` : "") +
  (day.shop ? `<section class="zone"><div class="shop ${isDone(day.shop.id) ? "done" : ""}">
      <h4>Para llevar: ${day.shop.n}</h4><p>${day.shop.t}</p>
      <div class="row"><a href="${mapsUrl(day.shop.n, day.shop.place)}" target="_blank" rel="noopener">Ver en el mapa</a>
      <button data-toggle="${day.shop.id}">${isDone(day.shop.id) ? "Comprado ✓" : "Marcar como comprado"}</button></div></div></section>` : "") +
  `</div>`;

  updateOverall();
}

function updateOverall() {
  const done = DAYS.reduce((a, d) => a + stopsOf(d).filter(s => isDone(s.id)).length, 0);
  const pct = Math.round(done / totalStops * 100);
  $("#ring").style.setProperty("--p", pct);
  $("#ringPct").textContent = pct + "%";
  $("#doneCount").textContent = done;
  $("#totalCount").textContent = totalStops;
  $("#credencial").innerHTML = DAYS.map(d => `
    <div class="sello ${dayComplete(d) ? "on" : ""}" title="Día ${d.id}"><span><b>${d.id}</b>${d.stamp}</span></div>`).join("");
}

/* ===== Eventos ===== */
function toast(msg) { const t = $("#toast"); t.textContent = msg; setTimeout(() => { t.textContent = ""; }, 4000); }

function keepScroll(fn) {
  const y = window.scrollY, sc = [...document.querySelectorAll(".eat-scroll")].map(e => e.scrollLeft);
  fn();
  document.querySelectorAll(".eat-scroll").forEach((e, i) => e.scrollLeft = sc[i] || 0);
  window.scrollTo(0, y);
}

document.addEventListener("click", ev => {
  const tab = ev.target.closest(".tab");
  if (tab) { current = +tab.dataset.day; renderTabs(); render(); $("#guia").scrollIntoView(); return; }
  const t = ev.target.closest("[data-toggle]");
  if (t) {
    const id = t.dataset.toggle;
    state[id] = !state[id];
    if (!state[id]) delete state[id];
    save();
    if (navigator.vibrate) navigator.vibrate(15);
    keepScroll(render);
  }
});

$("#btnCopy").addEventListener("click", async () => {
  const code = btoa(JSON.stringify(Object.keys(state)));
  try { await navigator.clipboard.writeText(code); toast("Progreso copiado. Pégalo en el otro móvil con “Restaurar”."); }
  catch (e) { prompt("Copia este código:", code); }
});
$("#btnPaste").addEventListener("click", () => {
  const code = prompt("Pega aquí el código de progreso:");
  if (!code) return;
  try {
    const ids = JSON.parse(atob(code.trim()));
    state = {}; ids.forEach(i => state[i] = true);
    save(); render(); toast("Progreso restaurado.");
  } catch (e) { toast("Ese código no es válido."); }
});
$("#btnReset").addEventListener("click", () => {
  if (confirm("¿Borrar todas las marcas y empezar de cero?")) { state = {}; save(); render(); toast("Todo desmarcado."); }
});

const toTop = $("#toTop");
window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > window.innerHeight));
toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

renderTabs();
render();
