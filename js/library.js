// brauns-novel-cms/js/library.js

// --- 1. Favorilere Ekle / Çıkar ---
function toggleFavorite(novelId, novelData) {
  let favorites = JSON.parse(localStorage.getItem("user_favorites")) || {};
  
  if (favorites[novelId]) {
    delete favorites[novelId];
  } else {
    favorites[novelId] = {
      title: novelData.title,
      cover: novelData.cover,
      addedAt: new Date().toLocaleDateString("tr-TR")
    };
  }
  
  localStorage.setItem("user_favorites", JSON.stringify(favorites));
  updateFavoriteButtonState(novelId);
}

// --- 2. Son Okunan Bölümü Kaydet (Kaldığım Yer) ---
function saveReadingProgress(novelId, chapterId, chapterTitle) {
  let progress = JSON.parse(localStorage.getItem("user_progress")) || {};
  
  progress[novelId] = {
    chapterId: chapterId,
    chapterTitle: chapterTitle,
    updatedAt: new Date().toLocaleDateString("tr-TR")
  };
  
  localStorage.setItem("user_progress", JSON.stringify(progress));
}

// --- 3. Favori Butonunun Durumunu Güncelle ---
function updateFavoriteButtonState(novelId) {
  const btn = document.getElementById("favBtn");
  if (!btn) return;
  
  let favorites = JSON.parse(localStorage.getItem("user_favorites")) || {};
  if (favorites[novelId]) {
    btn.innerHTML = "♥ Favorilerde";
    btn.classList.add("active");
  } else {
    btn.innerHTML = "♡ Favorilere Ekle";
    btn.classList.remove("active");
  }
}
