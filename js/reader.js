// brauns-novel-cms/js/reader.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Ayarları Hafızadan Yükle
  loadSettings();

  // 2. Event Listener'ları Bağla (Eğer butonlar varsa)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  const fontIncrease = document.getElementById("fontIncrease");
  if (fontIncrease) {
    fontIncrease.addEventListener("click", () => changeFontSize(1));
  }

  const fontDecrease = document.getElementById("fontDecrease");
  if (fontDecrease) {
    fontDecrease.addEventListener("click", () => changeFontSize(-1));
  }
});

// --- Fonksiyonlar ---

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function changeFontSize(delta) {
  // Mevcut font boyutunu piksel olarak al
  const currentSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--font-size-base")) || 19;
  
  // Yeni boyutu hesapla (14px ile 30px arası sınırla)
  const newSize = Math.min(Math.max(currentSize + delta, 14), 30);
  
  // Yeni boyutu CSS değişkenine uygula
  document.documentElement.style.setProperty("--font-size-base", newSize + "px");
  
  // Hafızaya kaydet
  localStorage.setItem("fontSize", newSize);
}

function loadSettings() {
  const savedTheme = localStorage.getItem("theme");
  const savedFontSize = localStorage.getItem("fontSize");

  // Tema yükle
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  // Font boyutu yükle
  if (savedFontSize) {
    document.documentElement.style.setProperty("--font-size-base", savedFontSize + "px");
  }
}
