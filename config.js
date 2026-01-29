// ====== EDIT THESE ======
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwecN0FKWSzjEHGWCwRuUIiHFWAlve5Ax9M1B9BJ_rsdp2C-qOYfD32UKR6oDNqvmRE-Q/exec";

// simple demo users (NOT SECURE — client-side only)
const USERS = [
  { username: "student1", password: "1234" },
  { username: "student2", password: "1234" },
];

// Your YouTube link: https://youtu.be/6DSvlh-zHu4
const MODULES = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Module ${i + 1}`,
  youtubeId: "6DSvlh-zHu4"
}));

// percent watched required to count complete (0.95 = 95%)
const REQUIRED_WATCH_PERCENT = 0.95;
