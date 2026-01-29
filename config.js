// Google Apps Script Web App (Sheets API)
const SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbwecN0FKWSzjEHGWCwRuUIiHFWAlve5Ax9M1B9BJ_rsdp2C-qOYfD32UKR6oDNqvmRE-Q/exec";

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
