const SPREADSHEET_ID = "1bf3KX4t0xdduF_l8yCnMhOrlixK5hEmcp_br2U91Y30";
const STATUS_SHEET = "Status";
const STUDENTS_SHEET = "Students";
const ADMINS_SHEET = "Admins";

const PASSWORD_SCHEME_PREFIX = "v1$";

function doGet(e) {
  try {
    const action = ((e.parameter && e.parameter.action) || "").toLowerCase();

    if (action === "getstatus") {
      return json_(getStatus_(e.parameter.username));
    }

    if (action === "testlogmodule") {
      return json_(logModule_(e.parameter.username || "student1", Number(e.parameter.moduleId || 1)));
    }

    if (action === "liststudents") {
      return json_(listStudents_());
    }

    if (action === "adminlogin" || action === "validatelogin") {
      return json_({ ok: false, error: "Use POST for login" });
    }

    return json_({
      ok: false,
      error: "Unknown action"
    });
  } catch (err) {
    return json_({
      ok: false,
      error: String(err)
    });
  }
}

function doPost(e) {
  try {
    const raw = (e.postData && e.postData.contents) ? e.postData.contents : "{}";
    const data = JSON.parse(raw);
    const action = (data.action || "").toLowerCase();

    if (action === "logmodule") {
      return json_(logModule_(data.username, Number(data.moduleId)));
    }

    if (action === "logtest") {
      return json_(logTest_(data.username, data.complete === true || data.complete === "true", Number(data.score)));
    }

    if (action === "addstudent") {
      return json_(addStudent_(data.username, data.password));
    }

    if (action === "updatestudent") {
      return json_(updateStudent_(data.username, data.newUsername, data.password));
    }

    if (action === "deletestudent") {
      return json_(deleteStudent_(data.username));
    }

    if (action === "adminlogin") {
      return json_(adminLogin_(data.username, data.password));
    }

    if (action === "validatelogin") {
      return json_(validateLogin_(data.username, data.password));
    }

    return json_({
      ok: false,
      error: "Unknown action"
    });
  } catch (err) {
    return json_({
      ok: false,
      error: String(err)
    });
  }
}

function getSheetByName_(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Missing sheet tab named "' + name + '"');
  return sh;
}

function getHeaders_(sh) {
  const lastColumn = sh.getLastColumn();
  if (lastColumn < 1) throw new Error("Sheet has no header row");
  return sh.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(header) {
    return (header || "").toString().trim();
  });
}

function requireHeader_(headers, name) {
  const index = headers.indexOf(name);
  if (index === -1) throw new Error("Missing header: " + name);
  return index + 1;
}

function getStatusSheet_() {
  return getSheetByName_(STATUS_SHEET);
}

function getStudentsSheet_() {
  return getSheetByName_(STUDENTS_SHEET);
}

function getAdminsSheet_() {
  return getSheetByName_(ADMINS_SHEET);
}

function makeSalt_() {
  return Utilities.getUuid().replace(/-/g, "").slice(0, 16);
}

function sha256Hex_(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8
  );

  return bytes.map(function(b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("");
}

function hashPassword_(plainPassword, salt) {
  const normalized = (plainPassword || "").toString();
  const s = (salt || makeSalt_()).toString();
  const digest = sha256Hex_(s + "|" + normalized);
  return PASSWORD_SCHEME_PREFIX + s + "$" + digest;
}

function isHashedPassword_(storedValue) {
  return (storedValue || "").toString().indexOf(PASSWORD_SCHEME_PREFIX) === 0;
}

function verifyPassword_(plainPassword, storedValue) {
  const stored = (storedValue || "").toString();

  if (!isHashedPassword_(stored)) {
    return (plainPassword || "").toString() === stored;
  }

  const parts = stored.split("$");
  if (parts.length !== 3) return false;

  const salt = parts[1];
  const expected = parts[2];
  const actual = sha256Hex_(salt + "|" + (plainPassword || "").toString());
  return actual === expected;
}

function findUserRowByUsername_(sh, username) {
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return -1;

  const rows = sh.getRange(2, 1, lastRow - 1, 1).getValues();
  const target = (username || "").toString().trim().toLowerCase();

  for (let i = 0; i < rows.length; i++) {
    const existing = (rows[i][0] || "").toString().trim().toLowerCase();
    if (existing === target) {
      return i + 2;
    }
  }

  return -1;
}

function ensureUserRow_(username) {
  if (!username) throw new Error("Missing username");

  const sh = getStatusSheet_();
  const lastRow = sh.getLastRow();
  const width = Math.max(sh.getLastColumn(), 14);

  if (lastRow < 2) {
    const newRow = new Array(width).fill("");
    newRow[0] = username;
    sh.appendRow(newRow);
    return sh.getLastRow();
  }

  const usernames = sh.getRange(2, 1, lastRow - 1, 1).getValues();

  for (let i = 0; i < usernames.length; i++) {
    const existing = (usernames[i][0] || "").toString().trim().toLowerCase();
    if (existing === username.toLowerCase()) {
      return i + 2;
    }
  }

  const newRow = new Array(width).fill("");
  newRow[0] = username;
  sh.appendRow(newRow);
  return sh.getLastRow();
}

function getStatus_(username) {
  const sh = getStatusSheet_();
  const row = ensureUserRow_(username);
  const headers = getHeaders_(sh);
  const vals = sh.getRange(row, 1, 1, sh.getLastColumn()).getValues()[0];

  const out = {
    ok: true,
    username: vals[0] || username,
    modules: {},
    testComplete: false,
    testScore: ""
  };

  for (let m = 1; m <= 10; m++) {
    const idx = headers.indexOf("m" + m);
    out.modules["m" + m] = idx !== -1
      ? (vals[idx] || "").toString().toLowerCase() === "complete"
      : false;
  }

  const testCompleteIdx = headers.indexOf("testComplete");
  const testScoreIdx = headers.indexOf("testScore");

  out.testComplete = testCompleteIdx !== -1
    ? (vals[testCompleteIdx] || "").toString().toLowerCase() === "complete"
    : false;

  out.testScore = testScoreIdx !== -1
    ? (vals[testScoreIdx] || "")
    : "";

  return out;
}

function logModule_(username, moduleId) {
  if (!username) throw new Error("Missing username");
  if (!moduleId || moduleId < 1 || moduleId > 10) throw new Error("moduleId must be 1..10");

  const sh = getStatusSheet_();
  const row = ensureUserRow_(username);
  const headers = getHeaders_(sh);

  const moduleCol = requireHeader_(headers, "m" + moduleId);
  const updatedAtCol = requireHeader_(headers, "updatedAt");

  sh.getRange(row, moduleCol).setValue("complete");
  sh.getRange(row, updatedAtCol).setValue(new Date());
  SpreadsheetApp.flush();

  return getStatus_(username);
}

function logTest_(username, complete, score) {
  if (!username) throw new Error("Missing username");

  const sh = getStatusSheet_();
  const row = ensureUserRow_(username);
  const headers = getHeaders_(sh);

  const testCompleteCol = requireHeader_(headers, "testComplete");
  const testScoreCol = requireHeader_(headers, "testScore");
  const updatedAtCol = requireHeader_(headers, "updatedAt");

  sh.getRange(row, testCompleteCol).setValue(complete ? "complete" : "");
  sh.getRange(row, testScoreCol).setValue(isNaN(score) ? "" : score);
  sh.getRange(row, updatedAtCol).setValue(new Date());
  SpreadsheetApp.flush();

  return getStatus_(username);
}

function validateCredentialsAndMaybeMigrate_(sh, username, password) {
  const row = findUserRowByUsername_(sh, username);
  if (row === -1) {
    return { ok: false };
  }

  const values = sh.getRange(row, 1, 1, 2).getValues()[0];
  const storedUsername = values[0] || username;
  const storedPassword = (values[1] || "").toString();
  const plainPassword = (password || "").toString();

  if (!verifyPassword_(plainPassword, storedPassword)) {
    return { ok: false };
  }

  if (!isHashedPassword_(storedPassword)) {
    sh.getRange(row, 2).setValue(hashPassword_(plainPassword));
  }

  return { ok: true, username: storedUsername };
}

function adminLogin_(username, password) {
  if (!username || !password) {
    return { ok: false, error: "Missing username or password" };
  }

  const sh = getAdminsSheet_();
  const result = validateCredentialsAndMaybeMigrate_(sh, username, password);

  if (result.ok) {
    return { ok: true, username: result.username };
  }

  return { ok: false, error: "Invalid admin login" };
}

function validateLogin_(username, password) {
  if (!username || !password) {
    return { ok: false, error: "Missing username or password" };
  }

  const sh = getStudentsSheet_();
  const result = validateCredentialsAndMaybeMigrate_(sh, username, password);

  if (result.ok) {
    return { ok: true, username: result.username };
  }

  return { ok: false, error: "Invalid username or password" };
}

function listStudents_() {
  const studentsSh = getStudentsSheet_();
  const studentsLastRow = studentsSh.getLastRow();

  if (studentsLastRow < 2) {
    return { ok: true, students: [] };
  }

  const studentRows = studentsSh.getRange(2, 1, studentsLastRow - 1, 3).getValues();

  const statusSh = getStatusSheet_();
  const statusLastRow = statusSh.getLastRow();
  const statusHeaders = getHeaders_(statusSh);

  const usernameIdx = statusHeaders.indexOf("username");
  const testScoreIdx = statusHeaders.indexOf("testScore");

  const scoreMap = {};

  if (statusLastRow >= 2 && usernameIdx !== -1 && testScoreIdx !== -1) {
    const statusRows = statusSh.getRange(2, 1, statusLastRow - 1, statusSh.getLastColumn()).getValues();

    statusRows.forEach(function(r) {
      const uname = (r[usernameIdx] || "").toString().trim().toLowerCase();
      if (uname) {
        scoreMap[uname] = r[testScoreIdx] || "";
      }
    });
  }

  const students = studentRows
    .filter(function(r) { return r[0]; })
    .map(function(r) {
      const uname = r[0];
      return {
        username: uname,
        updatedAt: r[2] || "",
        testScore: scoreMap[(uname || "").toString().trim().toLowerCase()] || ""
      };
    });

  return { ok: true, students: students };
}

function addStudent_(username, password) {
  if (!username || !password) {
    return { ok: false, error: "Missing username or password" };
  }

  const sh = getStudentsSheet_();
  const lastRow = sh.getLastRow();

  if (lastRow >= 2) {
    const rows = sh.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < rows.length; i++) {
      const existing = (rows[i][0] || "").toString().trim().toLowerCase();
      if (existing === username.toLowerCase()) {
        return { ok: false, error: "Student already exists" };
      }
    }
  }

  const hashedPassword = hashPassword_(password);
  sh.appendRow([username, hashedPassword, new Date()]);
  ensureUserRow_(username);

  return { ok: true };
}

function updateStudent_(username, newUsername, password) {
  if (!username || !newUsername) {
    return { ok: false, error: "Missing fields" };
  }

  const sh = getStudentsSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return { ok: false, error: "No students found" };

  const rows = sh.getRange(2, 1, lastRow - 1, 3).getValues();

  for (let i = 0; i < rows.length; i++) {
    const existing = (rows[i][0] || "").toString().trim();
    if (existing === username) {
      const nextPassword = (password || "").toString();
      sh.getRange(i + 2, 1).setValue(newUsername);

      if (nextPassword) {
        sh.getRange(i + 2, 2).setValue(hashPassword_(nextPassword));
      }

      sh.getRange(i + 2, 3).setValue(new Date());
      ensureUserRow_(newUsername);
      return { ok: true };
    }
  }

  return { ok: false, error: "Student not found" };
}

function deleteStudent_(username) {
  if (!username) return { ok: false, error: "Missing username" };

  const sh = getStudentsSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return { ok: false, error: "No students found" };

  const rows = sh.getRange(2, 1, lastRow - 1, 1).getValues();

  for (let i = 0; i < rows.length; i++) {
    const existing = (rows[i][0] || "").toString().trim();
    if (existing === username) {
      sh.deleteRow(i + 2);
      return { ok: true };
    }
  }

  return { ok: false, error: "Student not found" };
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
