/**
  Abhisek Koyal Standalone Portfolios Logic (GitHub Pages client integration support)
*/

// Identical Local Cache keys
const CACHE_PROJECTS_KEY = "abhisekkoyal_projects_data";
const CACHE_SETTINGS_KEY = "abhisekkoyal_settings_data";
const CACHE_VISITORS_KEY = "abhisekkoyal_visitors_data";

// Default seed structures
const defaultSettings = {
  name: "Abhisek Koyal",
  bio: "Passionate Full Stack Developer specializing in MongoDB, Express.js, React.js, Node.js, JavaScript, REST APIs, and modern web technologies. I build scalable web applications, responsive websites, and interactive user experiences.",
  resumeLink: "https://example.com/abhisek_resume.pdf",
  socials: {
    github: "https://github.com/abhisekkoyal334",
    linkedin: "https://linkedin.com/in/abhisek-koyal",
    email: "abhisekkoyal334@gmail.com"
  }
};

const defaultProjects = [
  {
    id: "p-1",
    title: "DevSync Collab Workspace",
    description: "A real-time collaborative workspace platform featuring document editors, collaborative whiteboard canvas, and instant chat synchronizers.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Tailwind CSS"],
    githubUrl: "https://github.com/abhisekkoyal334/devsync-collab",
    liveUrl: "https://devsync-collab.demo.app",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p-2",
    title: "Apex Analytics Dashboard",
    description: "High-fidelity responsive business intelligence dashboard. Features customizable layout widgets, cross-filtered chart integrations, and beautiful visual animation routines.",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Recharts", "Tailwind CSS"],
    githubUrl: "https://github.com/abhisekkoyal334/apex-dashboard",
    liveUrl: "https://apex-analytics.demo.app",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p-3",
    title: "Zenith Headless E-Commerce",
    description: "Extremely fast, modern online storefront featuring optimized listing animations, intuitive cart state sync, customized search filters, and smooth payment proxy flows.",
    technologies: ["React.js", "Redux", "Node.js", "Express.js", "MongoDB", "Stripe API", "Tailwind CSS"],
    githubUrl: "https://github.com/abhisekkoyal334/zenith-commerce",
    liveUrl: "https://zenith-commerce.demo.app",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  }
];

const defaultVisitors = {
  total: 489,
  unique: 271,
  today: 18,
  logs: [
    { ip: "24.120.95.12", country: "United States", device: "Desktop", browser: "Chrome", visitTime: new Date().toISOString() },
    { ip: "103.44.112.5", country: "India", device: "Mobile/Tablet", browser: "Safari", visitTime: new Date().toISOString() }
  ]
};

// State caches variables
let currentSettings = JSON.parse(localStorage.getItem(CACHE_SETTINGS_KEY)) || defaultSettings;
let currentProjects = JSON.parse(localStorage.getItem(CACHE_PROJECTS_KEY)) || defaultProjects;
let currentVisitors = JSON.parse(localStorage.getItem(CACHE_VISITORS_KEY)) || defaultVisitors;

// Core initializer
document.addEventListener("DOMContentLoaded", () => {
  initSettings();
  initVisitorCounting();
  initTypingEffect();
  initMouseFollowGlow();
  renderProjects();
  initGithubAPI("abhisekkoyal334");
  initContactForm();
  initScrollAnimations();
});

// Update customized metadata elements
function initSettings() {
  document.getElementById("brand-name").innerText = currentSettings.name;
  document.getElementById("brand-bio").innerText = currentSettings.bio;
  document.getElementById("resume-link").href = currentSettings.resumeLink;
  document.getElementById("contact-brand-email").innerText = currentSettings.socials.email;
  
  document.getElementById("social-github").href = currentSettings.socials.github;
  document.getElementById("social-linkedin").href = currentSettings.socials.linkedin;
  document.getElementById("social-email").href = `mailto:${currentSettings.socials.email}`;
}

// Log traffic triggers locally and increment gauges
function initVisitorCounting() {
  const sessionLogged = sessionStorage.getItem("standalone_session_logged");
  
  if (!sessionLogged) {
    currentVisitors.total += 1;
    currentVisitors.today += 1;
    
    // Simulate current visitor log item
    const userAgent = navigator.userAgent;
    let browser = "Chrome";
    if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";

    const device = /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "Mobile/Tablet" : "Desktop";
    const sampleCountries = ["India", "United States", "Germany", "Singapore", "Canada", "Australia"];
    const country = sampleCountries[Math.floor(Math.random() * sampleCountries.length)];

    const simulatedIp = "106." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 254 + 1);

    currentVisitors.logs.unshift({
      ip: simulatedIp,
      country,
      device,
      browser,
      visitTime: new Date().toISOString()
    });

    const uniqueIps = new Set(currentVisitors.logs.map(l => l.ip));
    currentVisitors.unique = uniqueIps.size;

    localStorage.setItem(CACHE_VISITORS_KEY, JSON.stringify(currentVisitors));
    sessionStorage.setItem("standalone_session_logged", "true");
  }

  // Bind digits dynamically inside count nodes
  animateCounter("metric-total", currentVisitors.total);
  animateCounter("metric-unique", currentVisitors.unique);
  animateCounter("metric-today", currentVisitors.today);
}

function animateCounter(id, targetVal) {
  const el = document.getElementById(id);
  if (!el) return;
  let curr = 0;
  const steps = 40;
  const incr = Math.ceil(targetVal / steps);
  const interval = setInterval(() => {
    curr += incr;
    if (curr >= targetVal) {
      el.innerText = targetVal.toLocaleString();
      clearInterval(interval);
    } else {
      el.innerText = curr.toLocaleString();
    }
  }, 20);
}

// Typing engine Simulation
function initTypingEffect() {
  const roles = ["MERN Stack Developer", "Full Stack Web Developer", "SaaS Builder", "Clean Code Specialist"];
  const el = document.getElementById("typewriting-text");
  if (!el) return;

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 100;

  function run() {
    const textTarget = roles[roleIdx];
    if (isDeleting) {
      el.innerText = textTarget.substring(0, charIdx--);
      speed = 50;
    } else {
      el.innerText = textTarget.substring(0, charIdx++);
      speed = 100;
    }

    if (!isDeleting && charIdx === textTarget.length + 1) {
      isDeleting = true;
      speed = 2200; // Pause at end representation
    } else if (isDeleting && charIdx === -1) {
      isDeleting = false;
      charIdx = 0;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400; // Pause before rewriting
    }
    setTimeout(run, speed);
  }
  setTimeout(run, 500);
}

// Coordinate coordinate tracker for lighting
function initMouseFollowGlow() {
  const element = document.getElementById("mouse-glow");
  if (!element) return;

  window.addEventListener("mousemove", (e) => {
    element.style.left = e.clientX + "px";
    element.style.top = e.clientY + window.scrollY + "px";
    element.style.opacity = "1";
  });

  document.body.addEventListener("mouseleave", () => {
    element.style.opacity = "0";
  });
}

// Dynamic project rendering grids
function renderProjects() {
  const gridContainer = document.getElementById("projects-container");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  if (currentProjects.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-span-full p-12 text-center text-slate-500 italic text-sm">
        No projects active at the current moment. Configure via admin module.
      </div>
    `;
    return;
  }

  currentProjects.forEach((proj) => {
    const card = document.createElement("div");
    card.className = "group rounded-2xl border border-slate-800 bg-slate-950/60 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/10 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden";
    
    // Tech pill elements array
    const techPills = proj.technologies.slice(0, 4).map(t => `
      <span class="px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-[10px] font-mono text-slate-400">${t}</span>
    `).join("");

    card.innerHTML = `
      <div>
        <div class="relative h-48 w-full bg-slate-900 border-b border-slate-950 overflow-hidden">
          <img src="${proj.imageUrl || 'https://picsum.photos/seed/code/600/400'}" alt="${proj.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
          <div class="absolute top-4 left-4 bg-slate-900/90 backdrop-blur px-2.5 py-1 border border-slate-800 rounded-lg text-[9px] uppercase font-mono tracking-widest font-bold text-cyan-400">
            ${proj.technologies[0] || "Code"}
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-bold text-lg text-slate-200 group-hover:text-cyan-400 transition-colors tracking-tight uppercase">${proj.title}</h3>
          <p class="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3 h-14 overflow-hidden text-ellipsis">${proj.description}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            ${techPills}
          </div>
        </div>
      </div>
      <div class="p-6 pt-0 flex gap-4 mt-auto">
        <a href="${proj.liveUrl}" target="_blank" class="flex-1 py-2.5 rounded-xl text-center bg-cyan-950/40 hover:bg-cyan-455 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-500/20 text-xs font-semibold text-cyan-400 transition-all flex items-center justify-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          Demo Link
        </a>
        <a href="${proj.githubUrl}" target="_blank" class="flex-1 py-2.5 rounded-xl text-center bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Source Code
        </a>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

// GitHub Sync profile API client
async function initGithubAPI(username) {
  const profileBox = document.getElementById("git-profile-box");
  const reposBox = document.getElementById("git-repos-box");
  if (!profileBox || !reposBox) return;

  // Set default beautiful structure while compiling
  const defaultProfile = {
    avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
    name: "Abhisek Koyal",
    bio: "Passionate Full Stack Developer specializing in MongoDB, Express.js, React.js, Node.js, JavaScript, REST APIs, and modern web technologies.",
    followers: 84,
    public_repos: currentProjects.length,
    html_url: "https://github.com/abhisekkoyal334"
  };

  const defaultRepos = [
    { name: "devsync-collab", description: "Real-time collaborative whiteboard workspace. MERN Stack build.", stars: 14, lang: "JavaScript", link: "https://github.com/abhisekkoyal334/devsync-collab" },
    { name: "apex-dashboard", description: "High-fidelity custom dashboard charts metrics. Recharts setup.", stars: 19, lang: "TypeScript", link: "https://github.com/abhisekkoyal334/apex-dashboard" },
    { name: "zenith-commerce", description: "Headless e-commerce listing animations, payments API.", stars: 22, lang: "JavaScript", link: "https://github.com/abhisekkoyal334/zenith-commerce" }
  ];

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (res.ok) {
      const data = await res.json();
      displayProfile(data);
      
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        displayRepos(reposData);
      } else {
        displayFallbackRepos(defaultRepos);
      }
    } else {
      displayFallbackProfile(defaultProfile);
      displayFallbackRepos(defaultRepos);
    }
  } catch (err) {
    displayFallbackProfile(defaultProfile);
    displayFallbackRepos(defaultRepos);
  }

  function displayProfile(p) {
    profileBox.innerHTML = `
      <img src="${p.avatar_url}" alt="GitHub Avatar" class="w-12 h-12 rounded-xl border border-slate-850 object-cover">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-slate-100 truncate uppercase mt-0.5">${p.name || p.login}</h4>
        <p class="text-[11px] text-slate-400 line-clamp-1">${p.bio || "Full stack engineer creating solutions."}</p>
        <div class="flex items-center gap-3 text-[10px] text-slate-500 mt-1.5 font-mono">
          <span>👥 ${p.followers} followers</span>
          <span>📁 ${p.public_repos} public repos</span>
        </div>
      </div>
      <a href="${p.html_url}" target="_blank" class="p-2 sm:px-3 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-350 hover:text-cyan-300 flex items-center gap-1.5">
        Target <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
      </a>
    `;
  }

  function displayFallbackProfile(p) {
    profileBox.innerHTML = `
      <img src="${p.avatar_url}" alt="GitHub Avatar" class="w-12 h-12 rounded-xl border border-slate-850 object-cover">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-slate-100 truncate uppercase mt-0.5">${p.name}</h4>
        <p class="text-[11px] text-slate-400 line-clamp-1">${p.bio}</p>
        <div class="flex items-center gap-3 text-[10px] text-slate-500 mt-1.5 font-mono">
          <span>👥 ${p.followers} followers</span>
          <span>📁 ${p.public_repos} public repos</span>
        </div>
      </div>
      <a href="${p.html_url}" target="_blank" class="p-2 sm:px-3 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-350 hover:text-cyan-300 flex items-center gap-1.5">
        Target <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
      </a>
    `;
  }

  function displayRepos(repos) {
    reposBox.innerHTML = "";
    repos.forEach(r => {
      const card = document.createElement("div");
      card.className = "p-4 rounded-xl border border-slate-850 bg-slate-900/30 hover:border-purple-500/40 transition-colors flex flex-col justify-between";
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-slate-200 truncate pr-2 uppercase font-display">${r.name}</span>
            <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 border border-slate-800 rounded bg-slate-900 text-slate-400">${r.language || "JS/HTML"}</span>
          </div>
          <p class="mt-2 text-[10.5px] text-slate-400 leading-relaxed line-clamp-2">${r.description || "Project source code repository."}</p>
        </div>
        <div class="mt-4 flex items-center justify-between text-[10px] border-t border-slate-900/45 pt-2 text-slate-500">
          <span class="font-mono text-cyan-400/80">✨ ${r.stargazers_count} stars</span>
          <a href="${r.html_url}" target="_blank" class="hover:text-purple-400 flex items-center gap-0.5 font-semibold">
            View Code
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
      `;
      reposBox.appendChild(card);
    });
  }

  function displayFallbackRepos(repos) {
    reposBox.innerHTML = "";
    repos.forEach(r => {
      const card = document.createElement("div");
      card.className = "p-4 rounded-xl border border-slate-850 bg-slate-900/30 hover:border-purple-500/40 transition-colors flex flex-col justify-between";
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-slate-200 truncate uppercase font-display">${r.name}</span>
            <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 border border-slate-800 rounded bg-slate-900 text-slate-400">${r.lang}</span>
          </div>
          <p class="mt-2 text-[10.5px] text-slate-400 leading-relaxed line-clamp-2">${r.description}</p>
        </div>
        <div class="mt-4 flex items-center justify-between text-[10px] border-t border-slate-900/45 pt-2 text-slate-500">
          <span class="font-mono text-cyan-400/80">✨ ${r.stars} stargazers</span>
          <a href="${r.link}" target="_blank" class="hover:text-purple-400 flex items-center gap-0.5 font-semibold">
            View Code
          </a>
        </div>
      `;
      reposBox.appendChild(card);
    });
  }

  // Handle Search Input submissions
  document.getElementById("git-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("git-search-input").value.trim();
    if (query) {
      initGithubAPI(query);
    }
  });
}

// Contact Form feedback simulation
function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-status-box");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const n = document.getElementById("contact-name").value.trim();
    const em = document.getElementById("contact-email").value.trim();
    const msg = document.getElementById("contact-msg").value.trim();

    if (!n || !em || !msg) return;

    const btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.innerText = "Routing message packets...";

    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = "Submit Proposals Package";
      
      statusEl.className = "p-4 rounded-xl border text-xs leading-relaxed bg-emerald-950/40 border-emerald-500/30 text-emerald-300 block";
      statusEl.innerText = `Thank you, ${n}! Your proposal packet was simulated successfully. Live storage packet cached.`;
      
      form.reset();
      
      setTimeout(() => {
        statusEl.className = "hidden";
      }, 5000);
    }, 1100);
  });
}

// Shrinking Header bar animations on scroll
function initScrollAnimations() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.className = "fixed top-0 left-0 w-full z-50 bg-[#0F172A]/85 backdrop-blur-md py-4 border-b border-slate-800/80 shadow-lg shadow-cyan-950/20 transition-all duration-300";
    } else {
      navbar.className = "fixed top-0 left-0 w-full z-50 bg-transparent py-6 border-b border-transparent transition-all duration-300";
    }
  });

  // Current year display in footer
  document.getElementById("current-year").innerText = new Date().getFullYear();
}
