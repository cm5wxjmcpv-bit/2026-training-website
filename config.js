// ==============================
// TRAINING SITE CONFIG
// ==============================

// Google Apps Script API
const APP_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwJ3g5XJ6cn-W5Dfc7kU0WnMuy6kUcHYbfNvL21uZ2CTwT7lN75lptjS78MlL6LiJZvYA/exec";

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
  { id: 1, title: "Module 1", youtubeId: "VIDEO_ID_HERE" },
  { id: 2, title: "Module 2", youtubeId: "VIDEO_ID_HERE" },
  { id: 3, title: "Module 3", youtubeId: "VIDEO_ID_HERE" },
  { id: 4, title: "Module 4", youtubeId: "VIDEO_ID_HERE" },
  { id: 5, title: "Module 5", youtubeId: "VIDEO_ID_HERE" },
  { id: 6, title: "Module 6", youtubeId: "VIDEO_ID_HERE" },
  { id: 7, title: "Module 7", youtubeId: "VIDEO_ID_HERE" },
  { id: 8, title: "Module 8", youtubeId: "VIDEO_ID_HERE" },
  { id: 9, title: "Module 9", youtubeId: "VIDEO_ID_HERE" },
  { id: 10, title: "Module 10", youtubeId: "VIDEO_ID_HERE" }
];


// percent of video required before completion
const REQUIRED_WATCH_PERCENT = 0.9;
