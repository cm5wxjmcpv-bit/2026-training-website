// ===== CONFIG =====

// Google Apps Script API
const SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbxJkZGJSTUCTH-Z_1JJP1u8SOZiLyJBMurK8HML2ICuYsCJKWQJCNQ2pjy68wQ2GOU32w/exec";


// ===== DEMO USERS (for login) =====
const USERS = {
  student1: {
    password: "1234",
    role: "student"
  },
  student2: {
    password: "1234",
    role: "student"
  },
  instructor1: {
    password: "1234",
    role: "instructor"
  }
};


// ===== MODULE LIST =====
const MODULES = [
  {
    id: 1,
    title: "Module 1",
    videoId: ""
  },
  {
    id: 2,
    title: "Module 2",
    videoId: ""
  },
  {
    id: 3,
    title: "Module 3",
    videoId: ""
  },
  {
    id: 4,
    title: "Module 4",
    videoId: ""
  },
  {
    id: 5,
    title: "Module 5",
    videoId: ""
  },
  {
    id: 6,
    title: "Module 6",
    videoId: ""
  },
  {
    id: 7,
    title: "Module 7",
    videoId: ""
  },
  {
    id: 8,
    title: "Module 8",
    videoId: ""
  },
  {
    id: 9,
    title: "Module 9",
    videoId: ""
  },
  {
    id: 10,
    title: "Module 10",
    videoId: ""
  }
];
