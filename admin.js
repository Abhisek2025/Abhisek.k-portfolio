/**
  Abhisek Koyal Standalone Portfolios Administrator logic (GitHub Pages static storage sync compatible)
*/

// Identical static local caching references
const CACHE_PROJECTS_KEY = "abhisekkoyal_projects_data";
const CACHE_SETTINGS_KEY = "abhisekkoyal_settings_data";
const CACHE_VISITORS_KEY = "abhisekkoyal_visitors_data";

// Fallbacks
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
  }
];

const defaultVisitors = {
  total: 489,
  unique: 271,
  today: 18,
  logs: [
    { ip: "24.120.95.12", country: "United States", device: "Desktop", browser: "Chrome", visitTime: new Date().toISOString() },
    { ip: "103.44.112.5", country: "India", device: "Mobile/Tablet", browser: "Safari", visitTime: new Date().toISOString() },
    { ip: "182.11.23.45", country: "Canada", device: "Desktop", browser: "Firefox", visitTime: new Date().toISOString() }
  ]
};

// Local cache variables
let currentSettings = JSON.parse(localStorage.getItem(CACHE_SETTINGS_KEY)) || defaultSettings;
let currentProjects = JSON.parse(localStorage.getItem(CACHE_PROJECTS_KEY)) || defaultProjects;
let currentVisitors = JSON.parse(localStorage.getItem(CACHE_VISITORS_KEY)) || defaultVisitors;

document.addEventListener("DOMContentLoaded", () => {
  initLoginHandler();
  checkSessionStatus();
});

// Login handlers
function initLoginHandler() {
  const form = document.getElementById("login-form");
  const errEl = document.getElementById("login-error");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("login-username").value.trim();
    const p = document.getElementById("login-password").value.trim();

    if (u === "admin" && p === "admin123") {
      localStorage.setItem("standalone_admin_token", "active-personal-token");
      errEl.className = "hidden";
      form.reset();
      checkSessionStatus();
    } else {
      errEl.innerText = "Invalid administrator credentials package.";
      errEl.className = "p-3 rounded-xl border border-red-500/20 bg-red-950/30 text-xs text-red-300 block";
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("standalone_admin_token");
    checkSessionStatus();
  });
}

// Redirect view based on token status
function checkSessionStatus() {
  const token = localStorage.getItem("standalone_admin_token");
  const loginSection = document.getElementById("login-container");
  const dashSection = document.getElementById("admin-dashboard");

  if (token === "active-personal-token") {
    loginSection.classList.add("hidden");
    dashSection.classList.remove("hidden");
    
    // Refresh loaded datasets
    currentSettings = JSON.parse(localStorage.getItem(CACHE_SETTINGS_KEY)) || defaultSettings;
    currentProjects = JSON.parse(localStorage.getItem(CACHE_PROJECTS_KEY)) || defaultProjects;
    currentVisitors = JSON.parse(localStorage.getItem(CACHE_VISITORS_KEY)) || defaultVisitors;

    loadMetricsWidgets();
    loadProjectGridList();
    loadSettingsInputs();
    renderVisitorTable();
    initModalEvents();
  } else {
    loginSection.classList.remove("hidden");
    dashSection.classList.add("hidden");
  }
}

// Draw telemetry counts
function loadMetricsWidgets() {
  document.getElementById("total-hits").innerText = currentVisitors.total.toLocaleString();
  document.getElementById("unique-ips").innerText = currentVisitors.unique.toLocaleString();
  document.getElementById("projects-count").innerText = currentProjects.length.toLocaleString();
  document.getElementById("today-hits").innerText = currentVisitors.today.toLocaleString();
}

// Render dynamic elements inside dashboard project catalog
function loadProjectGridList() {
  const container = document.getElementById("admin-projects-list");
  if (!container) return;
  container.innerHTML = "";

  if (currentProjects.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-500 italic text-xs border border-slate-850/60 rounded-xl">
        No projects registered inside localized database. Click New Project.
      </div>
    `;
    return;
  }

  currentProjects.forEach(proj => {
    const listRow = document.createElement("div");
    listRow.className = "p-4 rounded-xl border border-slate-850 bg-slate-900/40 hover:border-slate-700 transition-colors flex items-center justify-between gap-4";
    
    listRow.innerHTML = `
      <div class="flex items-center gap-3.5 min-w-0">
        <img src="${proj.imageUrl || 'https://picsum.photos/seed/code/150/150'}" alt="${proj.title}" class="w-12 h-12 rounded bg-slate-800 object-cover">
        <div class="min-w-0">
          <h4 class="font-bold text-xs text-slate-200 truncate uppercase">${proj.title}</h4>
          <p class="text-[10.5px] text-slate-400 line-clamp-1">${proj.technologies.slice(0, 3).join(", ")}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="editProjectInModal('${proj.id}')" class="p-2 rounded-lg border border-slate-800 hover:border-cyan-400/50 hover:text-cyan-400 bg-slate-950 transition-colors text-slate-400 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
        <button onclick="deleteProjectPayload('${proj.id}')" class="p-2 rounded-lg border border-slate-800 hover:border-red-500/50 hover:text-red-400 bg-slate-950 transition-colors text-slate-400 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `;
    container.appendChild(listRow);
  });
}

// Prefill metadata forms
function loadSettingsInputs() {
  document.getElementById("sett-name").value = currentSettings.name;
  document.getElementById("sett-bio").value = currentSettings.bio;
  document.getElementById("sett-resume").value = currentSettings.resumeLink;
  document.getElementById("sett-email").value = currentSettings.socials.email;
  document.getElementById("sett-github").value = currentSettings.socials.github;
  document.getElementById("sett-linkedin").value = currentSettings.socials.linkedin;

  const settForm = document.getElementById("settings-form");
  settForm.onsubmit = (e) => {
    e.preventDefault();
    currentSettings.name = document.getElementById("sett-name").value.trim();
    currentSettings.bio = document.getElementById("sett-bio").value.trim();
    currentSettings.resumeLink = document.getElementById("sett-resume").value.trim();
    currentSettings.socials.email = document.getElementById("sett-email").value.trim();
    currentSettings.socials.github = document.getElementById("sett-github").value.trim();
    currentSettings.socials.linkedin = document.getElementById("sett-linkedin").value.trim();

    localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(currentSettings));
    alert("Brand metadata compiled and synchronized successfully in local caches!");
    checkSessionStatus();
  };
}

// Render IP list logs rows
function renderVisitorTable() {
  const tableBody = document.getElementById("visitors-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  currentVisitors.logs.slice(0, 10).forEach(log => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-900/30 text-slate-300 border-b border-slate-850/40";
    
    row.innerHTML = `
      <td class="p-3 font-mono font-bold text-slate-200">${log.ip}</td>
      <td class="p-3">🌍 ${log.country}</td>
      <td class="p-3 text-center">
        <span class="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono border border-slate-800 text-slate-400">${log.device}</span>
      </td>
      <td class="p-3 font-mono text-[11px] text-slate-400">${log.browser}</td>
      <td class="p-3 text-right font-mono text-[10px] text-slate-400">
        ${new Date(log.visitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Modal popup triggers
function initModalEvents() {
  const modal = document.getElementById("project-modal");
  const openBtn = document.getElementById("add-project-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const form = document.getElementById("project-form");

  openBtn.onclick = () => {
    document.getElementById("modal-title").innerText = "Add Project Element";
    document.getElementById("proj-id").value = "";
    form.reset();
    
    // Default link values
    document.getElementById("proj-github").value = "https://github.com/abhisekkoyal334/";
    document.getElementById("proj-live").value = "https://";
    modal.classList.remove("hidden");
  };

  closeBtn.onclick = () => {
    modal.classList.add("hidden");
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const pid = document.getElementById("proj-id").value;
    const title = document.getElementById("proj-title").value.trim();
    const desc = document.getElementById("proj-desc").value.trim();
    const techInput = document.getElementById("proj-tech").value.trim();
    const githubUrl = document.getElementById("proj-github").value.trim();
    const liveUrl = document.getElementById("proj-live").value.trim();
    const imageUrl = document.getElementById("proj-image").value.trim() || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800`;

    const techArray = techInput.split(",").map(t => t.trim()).filter(t => t.length > 0);

    const targetProjectData = {
      title,
      description: desc,
      technologies: techArray.length > 0 ? techArray : ["React", "JavaScript"],
      githubUrl,
      liveUrl,
      imageUrl
    };

    if (pid) {
      // Edit existing project item
      const idx = currentProjects.findIndex(p => p.id === pid);
      if (idx > -1) {
        currentProjects[idx] = { ...currentProjects[idx], ...targetProjectData };
      }
    } else {
      // Append brand-new project item
      const newProj = {
        id: "p-" + Date.now(),
        ...targetProjectData
      };
      currentProjects.unshift(newProj);
    }

    localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(currentProjects));
    modal.classList.add("hidden");
    checkSessionStatus();
  };
}

// Global functions rendered onto Window object for click events accessibility
window.editProjectInModal = function(id) {
  const modal = document.getElementById("project-modal");
  const form = document.getElementById("project-form");
  const proj = currentProjects.find(p => p.id === id);

  if (!proj) return;

  document.getElementById("modal-title").innerText = "Modify Selected Showcase";
  document.getElementById("proj-id").value = proj.id;
  document.getElementById("proj-title").value = proj.title;
  document.getElementById("proj-desc").value = proj.description;
  document.getElementById("proj-tech").value = proj.technologies.join(", ");
  document.getElementById("proj-github").value = proj.githubUrl;
  document.getElementById("proj-live").value = proj.liveUrl;
  document.getElementById("proj-image").value = proj.imageUrl;

  modal.classList.remove("hidden");
};

window.deleteProjectPayload = function(id) {
  if (confirm("Are you sure you want to delete this showcase item?")) {
    currentProjects = currentProjects.filter(p => p.id !== id);
    localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(currentProjects));
    checkSessionStatus();
  }
};
