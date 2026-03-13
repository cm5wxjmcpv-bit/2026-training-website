// ====== EDIT THESE ======
// These globals are consumed directly by page scripts and app.js.
const APP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwecN0FKWSzjEHGWCwRuUIiHFWAlve5Ax9M1B9BJ_rsdp2C-qOYfD32UKR6oDNqvmRE-Q/exec";

// Backward-compatible alias used by the newer Sheets helper functions below.
const SHEETS_API_URL = APP_SCRIPT_URL;

// simple demo users (NOT SECURE — client-side only)
const USERS = [
  { username: "student1", password: "1234" },
  { username: "student2", password: "1234" }
];

// Your YouTube link: https://youtu.be/6DSvlh-zHu4
const MODULES = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Module ${i + 1}`,
  youtubeId: "6DSvlh-zHu4"
}));

// percent watched required to count complete (0.95 = 95%)
const REQUIRED_WATCH_PERCENT = 0.95;

// ---- READ STATUS ----
async function sheetsGetStatus(username) {
  const url =
    SHEETS_API_URL +
    "?action=getStatus&username=" +
    encodeURIComponent(username);

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  return await res.json();
}

// ---- LOG MODULE COMPLETION ----
async function sheetsLogModule(username, moduleId) {
  const res = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "logModule",
      username: username,
      moduleId: moduleId
    })
  });

  return await res.json();
}

// ---- LOG TEST RESULT ----
async function sheetsLogTest(username, score) {
  const res = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "logTest",
      username: username,
      complete: true,
      score: score
    })
  });

  return await res.json();
}
