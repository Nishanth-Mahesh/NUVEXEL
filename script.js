/* ============================================================
   CONFIGURATION: edit contact details and links here only
   Leave a social link as "" to keep its icon visible but inactive.
   ============================================================ */
const CONFIG = {
  phone: "+91 8861004954",            // display format
  phoneDigits: "918861004954",        // for wa.me and tel: (country code, no +)
  email: "hello@nuvexel.com",         // placeholder until confirmed
  whatsappMessage: "Hello NUVEXEL, I would like to discuss digital solutions for my business.",
  social: {                           // add links later; icons are already on the page
    instagram: "https://www.instagram.com/nuvexeldigital/",
    linkedin:  "",                    // TODO: official LinkedIn URL
    facebook:  "",
    x:         "",
    youtube:   "",
    whatsapp:  ""                     // auto-filled from phone + message if empty
  },
  services: [
    ["Website Design & Development", "Fast, responsive websites that present your business with confidence.", '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'],
    ["Branding & Visual Identity", "Logos, colour and type systems that make you instantly recognisable.", '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.6l1.1-6L3.4 9.4l6-.8z"/>'],
    ["Social Media Management", "Consistent, on-brand content that keeps your audience engaged.", '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/>'],
    ["Digital Marketing", "Campaigns that put your business in front of the right customers.", '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>'],
    ["E-commerce & Shopify", "Online stores that are simple to run and easy to buy from.", '<path d="M5 7h14l-1.5 12h-11zM9 7a3 3 0 0 1 6 0"/>'],
    ["Creative Content Production", "Photography, video and design assets made for your brand.", '<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>']
  ]
};
/* ============================ END CONFIG ============================ */

const ICONS = {
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/>',
  linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13a2.5 2.5 0 0 1 5 0v3"/>',
  facebook:'<path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
  x:'<path d="M4 4l16 16M20 4L4 20"/>',
  youtube:'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
  whatsapp:'<path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.5z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7c-1-.4-2-1.4-2-2.3-2.4l.7-1-1-2z"/>'
};
const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const enc = encodeURIComponent;
const waLink = (msg = CONFIG.whatsappMessage) => `https://wa.me/${CONFIG.phoneDigits}?text=${enc(msg)}`;
CONFIG.social.whatsapp = CONFIG.social.whatsapp || waLink();

// Bind contact links
const bind = {
  phone: a => { a.href = "tel:+" + CONFIG.phoneDigits; a.textContent = CONFIG.phone; },
  call:  a => a.href = "tel:+" + CONFIG.phoneDigits,
  email: a => { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; },
  mail:  a => a.href = "mailto:" + CONFIG.email,
  instagram: a => a.href = CONFIG.social.instagram,
  wa: a => a.href = waLink()
};
document.querySelectorAll("[data-bind]").forEach(a => bind[a.dataset.bind](a));
document.querySelector(".wa-float").innerHTML = svg(ICONS.whatsapp);

// Social icons (all shown; empty links stay inactive)
const names = {instagram:"Instagram",linkedin:"LinkedIn",facebook:"Facebook",x:"X",youtube:"YouTube",whatsapp:"WhatsApp"};
document.getElementById("social").innerHTML = Object.keys(ICONS).map(k => {
  const url = CONFIG.social[k];
  return url ? `<a href="${url}" target="_blank" rel="noopener" aria-label="${names[k]}">${svg(ICONS[k])}</a>`
             : `<a class="pending" href="#" aria-label="${names[k]} (link coming soon)" onclick="return false">${svg(ICONS[k])}</a>`;
}).join("");

// Services
document.getElementById("serviceList").innerHTML = CONFIG.services.map(s =>
  `<div class="svc reveal"><svg viewBox="0 0 24 24" aria-hidden="true">${s[2]}</svg><div><h3>${s[0]}</h3><p>${s[1]}</p></div></div>`).join("");
const sel = document.querySelector("select");
CONFIG.services.forEach(s => sel.add(new Option(s[0], s[0])));

// Mobile menu
const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
menu.onclick = e => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } };

// Scroll reveal
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.15}) : null;
document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

// Image fallback
document.querySelectorAll("img[data-fb]").forEach(i => i.onerror = () => { i.removeAttribute("src"); i.style.minHeight = "300px"; });

// Contact form -> WhatsApp
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target), err = document.getElementById("err");
  const name = f.get("name").trim(), phone = f.get("phone").trim(), service = f.get("service");
  if (!name) return err.textContent = "Please enter your name.";
  if (!/^[+\d][\d\s-]{7,15}$/.test(phone)) return err.textContent = "Please enter a valid phone number.";
  if (!service) return err.textContent = "Please choose a service.";
  err.textContent = "";
  const msg = `Hello NUVEXEL,\nName: ${name}\nPhone: ${phone}\nBusiness: ${f.get("business").trim() || "-"}\nService: ${service}\nMessage: ${f.get("message").trim() || "-"}`;
  window.open(waLink(msg), "_blank", "noopener");
});
document.getElementById("yr").textContent = new Date().getFullYear();
