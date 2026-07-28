// brauns-novel-cms/js/index-loader.js

document.addEventListener("DOMContentLoaded", async () => {
  const chapterContainer = document.getElementById("chapterContainer");
  const totalChaptersEl = document.getElementById("totalChaptersCount");
  
  if (!chapterContainer) return;

  // Yükleniyor Mesajı
  chapterContainer.innerHTML = '<p style="text-align:center; opacity:0.6; padding: 30px 0;">Bölümler yükleniyor...</p>';

  const chapters = [];
  let chapterNum = 1;
  let consecutiveFailures = 0;
  const MAX_FAILURES = 2; // Üst üste 2 bölüm bulunamazsa taramayı bitir

  // Ardışık Bölüm Taraması (bolum-1.md, bolum-2.md ...)
  while (consecutiveFailures < MAX_FAILURES) {
    const filePath = `content/chapters/bolum-${chapterNum}.md`;

    try {
      const response = await fetch(filePath);

      if (response.ok) {
        const text = await response.text();
        const meta = parseMarkdownMeta(text);

        chapters.push({
          number: chapterNum,
          title: meta.title || `Bölüm ${chapterNum}`,
          date: meta.date || 'Tarih Belirtilmedi',
          url: `read.html?ch=${chapterNum}`
        });

        consecutiveFailures = 0; // Başarılı istekte sayacı sıfırla
      } else {
        consecutiveFailures++;
      }
    } catch (e) {
      consecutiveFailures++;
    }

    chapterNum++;
    if (chapterNum > 500) break; // Güvenlik sınırı (Max 500 bölüm)
  }

  // Toplam Bölüm İstatistiğini Güncelle
  if (totalChaptersEl) {
    totalChaptersEl.innerText = chapters.length > 0 ? `${chapters.length}` : "0";
  }

  // Hiç Bölüm Yoksa
  if (chapters.length === 0) {
    chapterContainer.innerHTML = '<p style="text-align:center; opacity:0.6; padding: 30px 0;">Henüz yayınlanmış bir bölüm bulunmuyor.</p>';
    return;
  }

  // Bölüm Listesini Ekrana Çiz
  renderChapterList(chapters);

  // Arama ve Sıralama Fonksiyonunu Etkinleştir
  setupSearchAndSort(chapters);
});

// Front Matter Meta Verisi Ayrıştırıcı (YAML)
function parseMarkdownMeta(text) {
  const regex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = text.match(regex);
  const metadata = {};

  if (match) {
    const yamlText = match[1];
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
  }
  return metadata;
}

// Bölüm Öğelerini DOM'a Ekleme
function renderChapterList(chaptersList) {
  const chapterContainer = document.getElementById("chapterContainer");
  chapterContainer.innerHTML = chaptersList.map(ch => `
    <a href="${ch.url}" class="chapter-item" data-chapter="${ch.number}">
      <span class="chapter-name">${ch.title}</span>
      <span class="chapter-date">${ch.date}</span>
    </a>
  `).join('');
}

// Dinamik Arama ve Sıralama Mantığı
function setupSearchAndSort(allChapters) {
  const searchInput = document.getElementById("chapterSearch");
  const sortToggle = document.getElementById("sortToggle");
  let currentChapters = [...allChapters];

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = currentChapters.filter(ch => 
        ch.title.toLowerCase().includes(query) || ch.number.toString() === query
      );
      renderChapterList(filtered);
    });
  }

  if (sortToggle) {
    sortToggle.addEventListener("click", () => {
      currentChapters.reverse();
      renderChapterList(currentChapters);
    });
  }
}
