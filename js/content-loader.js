// brauns-novel-cms/js/content-loader.js

document.addEventListener("DOMContentLoaded", async () => {
  // 1. URL'den hangi bölümün istendiğini al (Örn: read.html?ch=1)
  const urlParams = new URLSearchParams(window.location.search);
  const chapterNum = parseInt(urlParams.get("ch")) || 1;

  // 2. İlgili Markdown Dosyasını Fetch Et (Çek)
  const filePath = `content/chapters/bolum-${chapterNum}.md`;

  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error("Bölüm bulunamadı.");
    }

    const fileContent = await response.text();

    // 3. Front Matter (YAML) ve İçeriği Ayrıştır
    const parsedData = parseMarkdown(fileContent);
    const meta = parsedData.metadata;
    const markdownBody = parsedData.body;

    // 4. Ekrana Verileri Yazdır
    document.title = `${meta.title || 'Bölüm ' + chapterNum} | Braun Novel`;
    
    const chapterTitleEl = document.getElementById("chapterTitle");
    if (chapterTitleEl) chapterTitleEl.innerText = meta.title || `Bölüm ${chapterNum}`;

    // Çevirmen Notu Varsa Göster
    const noteEl = document.getElementById("translatorNote");
    if (noteEl && meta.translator_note) {
      noteEl.innerText = `💬 Çevirmen Notu: ${meta.translator_note}`;
      noteEl.style.display = "block";
    }

    // Markdown Metnini HTML'e Çevirip Gövdeye Ekle (Marked.js Kütüphanesi İle)
    const contentEl = document.getElementById("novelContent");
    if (contentEl && typeof marked !== "undefined") {
      contentEl.innerHTML = marked.parse(markdownBody);
    }

    // 5. Önceki / Sonraki Bölüm Butonlarını Güncelle
    updateNavButtons(chapterNum);

    // 6. Otomatik Olarak Okuma Geçmişine Kaydet
    if (typeof saveProgress === "function") {
      saveProgress("yuce-ejderha", chapterNum, meta.title || `Bölüm ${chapterNum}`, window.location.href);
    }

  } catch (error) {
    console.error(error);
    document.getElementById("novelContent").innerHTML = `
      <div style="text-align:center; padding: 50px 0;">
        <h2>⚠️ Bölüm Bulunamadı</h2>
        <p>Aradığınız bölüm henüz yayınlanmamış veya kaldırılmış olabilir.</p>
        <a href="index.html" class="btn" style="margin-top:15px; display:inline-block;">Ana Sayfaya Dön</a>
      </div>
    `;
  }
});

// --- Yardımcı Fonksiyonlar ---

// Front Matter Parsing (YAML başlığını ayıklama)
function parseMarkdown(text) {
  const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = text.match(regex);

  if (!match) return { metadata: {}, body: text };

  const yamlText = match[1];
  const body = match[2];
  const metadata = {};

  yamlText.split('\n').forEach(line => {
    const [key, ...valParts] = line.split(':');
    if (key && valParts.length > 0) {
      let val = valParts.join(':').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      metadata[key.trim()] = val;
    }
  });

  return { metadata, body };
}

// Önceki / Sonraki Buton Mantığı
function updateNavButtons(currentCh) {
  const prevBtn = document.getElementById("prevChapterBtn");
  const nextBtn = document.getElementById("nextChapterBtn");

  if (prevBtn) {
    if (currentCh <= 1) {
      prevBtn.style.visibility = "hidden";
    } else {
      prevBtn.href = `read.html?ch=${currentCh - 1}`;
      prevBtn.style.visibility = "visible";
    }
  }

  if (nextBtn) {
    nextBtn.href = `read.html?ch=${currentCh + 1}`;
  }
}
