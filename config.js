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
    title: "Module 1-3 (12 mins)",
    youtubeId: "-qXt8htJ9h4"
  },
  {
    id: 2,
    title: "Module 4-7 (15.5 mins)",
    youtubeId: "RS4K5FCL988"
  },
  {
    id: 3,
    title: "Module 8-10 (14 mins)",
    youtubeId: "TLeq0WikSmU"
  },
  {
    id: 4,
    title: "Module 11-13 (15.5mins)",
    youtubeId: "cMML4tQdVvY"
  },
  {
    id: 5,
    title: "Module 4 (12 mins)",
    youtubeId: "2uCIkj693I8"
  },
  {
    id: 6,
    title: "Module 5 (25.25 mins)",
    youtubeId: "Od5tJW7NZK8"
  },
  {
    id: 7,
    title: "Module 6 (7.41 mins)",
    youtubeId: "Ch9WP4p5vGs"
  }
];


// percent of video required before completion
const REQUIRED_WATCH_PERCENT = 0.9;
