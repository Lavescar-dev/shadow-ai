import type { ShellMode } from "./types";

export type Language = "en" | "tr";

export const LANGUAGE_STORAGE_KEY = "nx-lang";

const modeTranslations: Partial<
  Record<
    ShellMode,
    {
      label: string;
      description: string;
      placeholder: string;
    }
  >
> = {
  chat: {
    label: "Sohbet AI",
    description: "Akışlı asistan sohbeti",
    placeholder: "Bana istediğini sor...",
  },
  content: {
    label: "İçerik Üretici",
    description: "Akışlı çıktıyla yapılandırılmış içerik",
    placeholder: "İhtiyacın olan içeriği anlat...",
  },
  code: {
    label: "Kod Üretici",
    description: "Geliştirici odaklı kod üretimi",
    placeholder: "Ne geliştirmek istediğini anlat...",
  },
  canvas: {
    label: "Canvas",
    description: "Canlı önizlemeli frontend workspace",
    placeholder: "Nasıl bir arayüz oluşturmak istediğini anlat...",
  },
  email: {
    label: "E-posta Üretici",
    description: "Önizlemeli kısa e-posta taslakları",
    placeholder: "E-posta ne hakkında?",
  },
  video: {
    label: "Video Senaryosu",
    description: "Video içerikleri için senaryo üretimi",
    placeholder: "Video konusu ve hedef kitle...",
  },
  seo: {
    label: "SEO Analizörü",
    description: "Yapılandırılmış SEO denetim sonuçları",
    placeholder: "Analiz edilecek URL veya içeriği gir...",
  },
  image: {
    label: "Görsel Üretici",
    description: "Önizlemeli görsel prompt girişi",
    placeholder: "İstediğin görseli tarif et...",
  },
  voice: {
    label: "Metinden Sese",
    description: "Ses önizlemeli konuşma sentezi",
    placeholder: "Sese çevrilecek metni gir...",
  },
  resume: {
    label: "CV Oluşturucu",
    description: "Profil odaklı CV üretimi",
    placeholder: "Geçmişini ve hedef rolünü anlat...",
  },
  bot: {
    label: "Bot Oluşturucu",
    description: "Persona kurulumu ve canlı bot sohbeti",
    placeholder: "Botunun personasını tanımla...",
  },
};

const textTranslations: Record<string, string> = {
  "Checking session...": "Oturum kontrol ediliyor...",
  "Sign in to enable OpenRouter chat and long-term memory.":
    "OpenRouter sohbeti ve uzun süreli hafıza için giriş yap.",
  "Sign in to start your free beta workspace.":
    "Ücretsiz beta workspace'ini başlatmak için giriş yap.",
  "Connected to Cloudflare edge memory.": "Cloudflare edge hafızasına bağlı.",
  "API is unavailable.": "API kullanılamıyor.",
  "Signed out.": "Çıkış yapıldı.",
  "Account deleted.": "Hesap silindi.",
  "Preparing export...": "Dışa aktarma hazırlanıyor...",
  "Export ready": "Dışa aktarma hazır",
  "Export failed": "Dışa aktarma başarısız",
  "Deleting account...": "Hesap siliniyor...",
  "Delete failed": "Silme başarısız",
  "Backend error: the mode run failed.": "Backend hatası: mod çalıştırılamadı.",
  "Backend error: the stream ended unexpectedly.":
    "Backend hatası: akış beklenmedik şekilde bitti.",
  "Generating structured artifact...": "Yapılandırılmış çıktı üretiliyor...",
  "Preparing canvas workspace...": "Canvas workspace hazırlanıyor...",
  "Analyzing canvas brief...": "Canvas isteği analiz ediliyor...",
  "Planning page layout and sections...": "Sayfa düzeni ve bölümler planlanıyor...",
  "Writing canvas files...": "Canvas dosyaları yazılıyor...",
  "Preparing live preview...": "Canlı önizleme hazırlanıyor...",
  "Analyzing canvas request...": "Canvas isteği analiz ediliyor...",
  "Planning layout and sections...": "Düzen ve bölümler planlanıyor...",
  "Applying canvas changes...": "Canvas değişiklikleri uygulanıyor...",
  "Canvas is generating...": "Canvas üretiliyor...",
  "Live preview will refresh automatically when the files are ready.":
    "Dosyalar hazır olduğunda canlı önizleme otomatik yenilenecek.",
  "Canvas workspace ready.": "Canvas workspace hazır.",
  "Canvas imported from message.": "Canvas mesaja göre içe aktarıldı.",
  "Canvas saved locally.": "Canvas yerelde kaydedildi.",
  "Saving canvas...": "Canvas kaydediliyor...",
  "Canvas saved.": "Canvas kaydedildi.",
  "Could not auto-import this answer. Ask again in /canvas or paste the code into the editor.":
    "Bu yanıt otomatik içe aktarılamadı. /canvas içinde yeniden iste veya kodu editöre yapıştır.",
  "Base Shadow AI": "Temel Shadow AI",
  "Sign out": "Çıkış",
  "Sign in": "Giriş yap",
  "Create account": "Hesap oluştur",
  "Sign in with Google": "Google ile giriş yap",
  "Sign in with GitHub": "GitHub ile giriş yap",
  "Continue with Google": "Google ile devam et",
  "Continue with GitHub": "GitHub ile devam et",
  "Switch to English": "İngilizceye geç",
  "Switch to Turkish": "Türkçeye geç",
  "Chat with a saved bot persona": "Kayıtlı bot personasıyla sohbet et",
  "Clear conversation": "Sohbeti temizle",
  "Delete conversation": "Konuşmayı sil",
  Clear: "Temizle",
  "New conversation": "Yeni sohbet",
  "New chat": "Yeni sohbet",
  Recent: "Son sohbetler",
  "Sign in and send a message to start persistent memory.":
    "Kalıcı hafızayı başlatmak için giriş yapıp bir mesaj gönder.",
  Expand: "Genişlet",
  Collapse: "Daralt",
  Memory: "Hafıza",
  "D1 + Vector memory": "D1 + Vektör hafıza",
  "Switch mode (or type /command)": "Mod değiştir veya /komut yaz",
  "Attach / Tools": "Ekle / Araçlar",
  "Add files or photos": "Dosya veya fotoğraf ekle",
  "Documents (.pdf, .docx, .txt)": "Belgeler (.pdf, .docx, .txt)",
  "Images (.png, .jpg, .webp)": "Görseller (.png, .jpg, .webp)",
  "Code files (.js, .py, .ts…)": "Kod dosyaları (.js, .py, .ts...)",
  "Data (.csv, .json, .xlsx)": "Veri (.csv, .json, .xlsx)",
  "Take a screenshot": "Ekran görüntüsü al",
  "Add to project": "Projeye ekle",
  "New project": "Yeni proje",
  "Recent projects": "Son projeler",
  "Import from URL": "URL'den içe aktar",
  "Add from GitHub": "GitHub'dan ekle",
  "Link repository": "Depo bağla",
  "Import file": "Dosya içe aktar",
  "Paste Gist URL": "Gist URL yapıştır",
  Skills: "Yetenekler",
  "Web Search": "Web arama",
  "Code Execution": "Kod çalıştırma",
  Calculator: "Hesap makinesi",
  "Chart Maker": "Grafik oluşturucu",
  "Add connectors": "Bağlayıcı ekle",
  "Web search": "Web arama",
  "Use style": "Stil kullan",
  "Voice input": "Sesli giriş",
  "Memory context": "Hafıza bağlamı",
  "Send (Enter)": "Gönder (Enter)",
  send: "gönder",
  newline: "yeni satır",
  modes: "modlar",
  "AI Shell may make mistakes. Verify important information.":
    "AI Shell hata yapabilir. Önemli bilgileri doğrula.",
  "type a mode or command...": "bir mod veya komut yaz...",
  "type a mode or command…": "bir mod veya komut yaz...",
  "all modes": "tüm modlar",
  active: "aktif",
  "no match for": "eşleşme yok:",
  "try /chat, /code, /email...": "/chat, /code, /email dene...",
  "try /chat, /code, /email…": "/chat, /code, /email dene...",
  navigate: "gezin",
  select: "seç",
  filter: "filtrele",
  "MODE SWITCHER": "MOD SEÇİCİ",
  "SHADOW AI · MODE SWITCHER": "SHADOW AI · MOD SEÇİCİ",
  Copy: "Kopyala",
  "Copied!": "Kopyalandı!",
  "Open in Canvas": "Canvas'ta aç",
  Canvas: "Canvas",
  Chat: "Sohbet",
  Code: "Kod",
  Preview: "Önizleme",
  Layout: "Yerleşim",
  Split: "Bölünmüş",
  Template: "Şablon",
  File: "Dosya",
  Run: "Çalıştır",
  Desktop: "Masaustu",
  Tablet: "Tablet",
  Mobile: "Mobil",
  "Preview is clean.": "Önizleme temiz.",
  "Apply to Canvas": "Canvas'a uygula",
  "Free beta": "Ücretsiz beta",
  "Remaining today": "Bugün kalan",
  Resets: "Sıfırlanır",
  "Export data": "Verileri dışa aktar",
  "Delete account": "Hesabı sil",
  Privacy: "Gizlilik",
  Terms: "Şartlar",
  Help: "Yardım",
  Welcome: "Hoş geldin",
  "Canvas beta": "Canvas beta",
  "Continue to workspace": "Workspace'e devam et",
  "Start your Shadow AI workspace.":
    "Shadow AI workspace'ini başlat.",
  "Free beta access uses Google or GitHub sign-in. Your conversations, usage limits, and saved bots stay under one account.":
    "Ücretsiz beta erişimi Google veya GitHub girişi kullanır. Konuşmaların, kullanım limitlerin ve kayıtlı botların tek hesap altında kalır.",
  "By continuing, you agree to the":
    "Devam ederek şunları kabul etmiş olursun:",
  and: "ve",
  "Your free beta workspace is ready.":
    "Ücretsiz beta workspace'in hazır.",
  "Pick a starting lane now. You can switch modes any time from the command bar.":
    "Şimdi bir başlangıç yolu seç. Komut çubuğundan istediğin an mod değiştirebilirsin.",
  "General help and daily work": "Genel yardım ve günlük işler",
  "Live frontend preview and iteration":
    "Canlı frontend önizleme ve iterasyon",
  "Generate visuals with daily limits":
    "Günlük limitlerle görsel üret",
  "Canvas changes": "Canvas değişiklikleri",
  Model: "Model",
  Regenerate: "Yeniden üret",
  Retry: "Tekrar dene",
  Share: "Paylaş",
  "Preparing PDF...": "PDF hazırlanıyor...",
  "PDF downloaded": "PDF indirildi",
  "PDF download failed": "PDF indirilemedi",
  artifact: "çıktı",
  "ATS professional": "ATS profesyonel",
  "Modern visual": "Modern görsel",
  "Next actions": "Sonraki adımlar",
  "Image preview": "Görsel önizleme",
  Image: "Görsel",
  "Open image": "Görseli aç",
  "Download image": "Görseli indir",
  Open: "Aç",
  Download: "İndir",
  "Reset template": "Şablonu sıfırla",
  "Canvas starter refreshed.": "Canvas başlangıç şablonu yenilendi.",
  "Canvas reset to latest starter.":
    "Canvas en güncel başlangıç şablonuna sıfırlandı.",
  "AI is thinking...": "AI düşünüyor...",
  "AI is thinking…": "AI düşünüyor...",
  "Try:": "Dene:",
  Explain: "Açıkla",
  Refactor: "Refactor",
  Test: "Test",
  Document: "Belgele",
  Tone: "Ton",
  Length: "Uzunluk",
  Type: "Tip",
  Professional: "Profesyonel",
  Friendly: "Samimi",
  Formal: "Resmi",
  Casual: "Rahat",
  Brief: "Kısa",
  Standard: "Standart",
  Detailed: "Detaylı",
  "Cold outreach": "Soğuk erişim",
  "Follow-up": "Takip",
  Reply: "Yanıt",
  Newsletter: "Bülten",
  Announcement: "Duyuru",
  Audit: "Denetim",
  "Full audit": "Tam denetim",
  "On-page": "Sayfa içi",
  Technical: "Teknik",
  Backlinks: "Geri bağlantılar",
  "Content gap": "İçerik boşluğu",
  Keyword: "Anahtar kelime",
  Competitor: "Rakip",
  "e.g. best AI tools 2025": "örn. en iyi AI araçları 2025",
  Voice: "Ses",
  Speed: "Hız",
  Format: "Format",
  Style: "Stil",
  Photorealistic: "Fotogerçekçi",
  "Digital art": "Dijital sanat",
  "Oil painting": "Yağlı boya",
  Watercolor: "Suluboya",
  Sketch: "Eskiz",
  "3D render": "3D render",
  "Pixel art": "Piksel sanatı",
  Anime: "Anime",
  Ratio: "Oran",
  Quality: "Kalite",
  HD: "HD",
  Ultra: "Ultra",
  Count: "Adet",
  Platform: "Platform",
  Duration: "Süre",
  "5 min": "5 dk",
  "10 min": "10 dk",
  "15 min": "15 dk",
  "1 min": "1 dk",
  "30s": "30 sn",
  "Long-form": "Uzun format",
  Educational: "Eğitici",
  Entertainment: "Eğlence",
  Tutorial: "Öğretici",
  Vlog: "Vlog",
  Documentary: "Belgesel",
};

export function normalizeLanguage(value: unknown): Language {
  return value === "tr" ? "tr" : "en";
}

export function getStoredLanguage(): Language {
  try {
    if (typeof localStorage === "undefined") {
      return "en";
    }
    return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return "en";
  }
}

export function setStoredLanguage(language: Language) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    document.body.classList.toggle("tr-mode", language === "tr");
  } catch {
    // Storage may be disabled in private browsing contexts.
  }
}

export function t(text: string, language: Language) {
  return language === "tr" ? (textTranslations[text] ?? text) : text;
}

export function modeLabel(mode: ShellMode, fallback: string, language: Language) {
  return language === "tr" ? (modeTranslations[mode]?.label ?? fallback) : fallback;
}

export function modeDescription(
  mode: ShellMode,
  fallback: string,
  language: Language,
) {
  return language === "tr"
    ? (modeTranslations[mode]?.description ?? fallback)
    : fallback;
}

export function modePlaceholder(
  mode: ShellMode,
  fallback: string,
  language: Language,
) {
  return language === "tr"
    ? (modeTranslations[mode]?.placeholder ?? fallback)
    : fallback;
}

export function modeSearchText(
  mode: ShellMode,
  label: string,
  description: string,
) {
  const translation = modeTranslations[mode];
  return [label, description, translation?.label, translation?.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function resultCountText(count: number, language: Language) {
  if (language === "tr") {
    return `${count} sonuç`;
  }
  return `${count} result${count === 1 ? "" : "s"}`;
}
