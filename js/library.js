// brauns-novel-cms/js/library.js

// 1. Favorilere Ekle / Çıkar
function toggleFavorite(novelId, title, cover) {
  let favorites = JSON.parse(localStorage.getItem("bn_favorites")) || {};

  if (favorites[novelId]) {
    delete favorites[novelId];
    showToast("Favorilerden çıkarıldı.");
  } else {
    favorites[novelId] = {
      title: title,
      cover: cover,
      addedAt: new Date().toLocaleDateString("tr-TR")
    };
    showToast("Favorilere eklendi! ♥");
  }

  localStorage.setItem("bn_favorites", JSON.stringify(favorites));
  updateFavButton(novelId);
}

// 2. Okuma Geçmişini (Kaldığım Yeri) Kaydet
function saveProgress(novelId, chapterNum, chapterTitle, chapterUrl) {
  let progress = JSON.parse(localStorage.getItem("bn_progress")) || {};

  progress[novelId] = {
    chapterNum: chapterNum,
    chapterTitle: chapterTitle,
    chapterUrl: chapterUrl,
    lastReadAt: new Date().toLocaleDateString("tr-TR")
  };

  localStorage.setItem("bn_progress", JSON.stringify(progress));
}

// 3. Favori Butonunun Görünümünü Güncelle
function updateFavButton(novelId) {
  const favBtn = document.getElementById("favBtn");
  if (!favBtn) return;

  let favorites = JSON.parse(localStorage.getItem("bn_favorites")) || {};
  if (favorites[novelId]) {
    favBtn.innerHTML = "♥ Favorilerimde";
    favBtn.style.background = "var(--accent-color)";
    favBtn.style.color = "#ffffff";
  } else {
    favBtn.innerHTML = "♡ Favorilere Ekle";
    favBtn.style.background = "var(--card-bg)";
    favBtn.style.color = "var(--text-color)";
  }
}

// 4. Küçük Bilgilendirme Balonu (Toast Notification)
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "bn-toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
