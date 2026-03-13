function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function requireAuth() {
  const u = sessionStorage.getItem("username");
  if (!u) location.href = "index.html";
  return u;
}

function login(username, password) {
  const match = USERS.find(x => x.username === username && x.password === password);
  if (!match) return false;
  sessionStorage.setItem("username", username);
  return true;
}

function logout() {
  sessionStorage.removeItem("username");
  location.href = "index.html";
}

async function apiGetStatus(username) {
  const url = `${APP_SCRIPT_URL}?action=getStatus&username=${encodeURIComponent(username)}`;
  const r = await fetch(url, { method: "GET" });
  return await r.json();
}

async function apiLogModule(username, moduleId) {
  const r = await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "logModule", username, moduleId })
  });
  return await r.json();
}

async function apiLogTest(username, complete, score) {
  const r = await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "logTest", username, complete, score })
  });
  return await r.json();
}

function allModulesComplete(status) {
  for (let i = 1; i <= 10; i++) {
    if (!status.modules["m" + i]) return false;
  }
  return true;
}
