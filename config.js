// ==============================
// TRAINING SITE CONFIG
// ==============================

// Google Apps Script API
const APP_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycby-xfirOFVh_RAS3CdkM6TQsR9oR5rRuo-hzrqcmyhG8ktRZjE2MDFWXRhwQxSkUtj8Pw/exec";

// backward compatibility
const SHEETS_API_URL = APP_SCRIPT_URL;


// ==============================
// DEMO USERS
// ==============================

const USERS = [
  {
    username: "student1",
    password: "1234",
    role: "student"
  },
  {
    username: "student2",
    password: "1234",
    role: "student"
  }
];


// ==============================
// MODULES
// ==============================

const MODULES = [
  {
    id: 1,
    title: "Module 1",
    youtubeId: "bDv3-0drOSQ"
  },
  {
    id: 2,
    title: "Module 2",
    youtubeId: "6DSvlh-zHu4"
  },
  {
    id: 3,
    title: "Module 3",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 4,
    title: "Module 4",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 5,
    title: "Module 5",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 6,
    title: "Module 6",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 7,
    title: "Module 7",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 8,
    title: "Module 8",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 9,
    title: "Module 9",
    youtubeId: "aqz-KE-bpKQ"
  },
  {
    id: 10,
    title: "Module 10",
    youtubeId: "aqz-KE-bpKQ"
  }
];


// percent of video required before completion
const REQUIRED_WATCH_PERCENT = 0.9;
