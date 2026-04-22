import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const landingHtml = String.raw`

<!-- ===== STICKY NAV ===== -->
<nav id="topnav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M2 4h10v7H2v8h10" stroke="#4ade80" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 8h10v6H7v5h10" stroke="#4ade80" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" opacity="0.42"/>
      </svg>
      <div class="nav-wordmark">
        <span class="nav-brand">Shadow</span><span class="nav-ai">AI</span>
      </div>
    </a>
    <div class="nav-links">
      <a href="#features"><span class="le">Features</span><span class="lt">Özellikler</span></a>
      <a href="#modes"><span class="le">Modes</span><span class="lt">Modlar</span></a>
      <a href="#stack"><span class="le">Stack</span><span class="lt">Altyapı</span></a>
    </div>
    <button id="lang-btn" class="lang-btn-ui" type="button">TR</button>
    <a href="/chat?auth=1" class="nav-cta">
      <span class="le">Start Free Beta</span><span class="lt">Ücretsiz Betayı Başlat</span>
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </a>
  </div>
</nav>

<!-- ===== MAIN ===== -->
<main class="flex-1 w-full max-w-[1240px] mx-auto px-6 lg:px-8 relative z-10 pt-[52px] pb-32">

  <!-- ===== HERO ===== -->
  <div class="relative w-full min-h-[540px] flex items-center">
    <div class="w-full lg:w-[58%] z-10 pr-8">

      <div class="hero-eyebrow" style="animation:fadeUp .5s both 0s">
        <span class="eyebrow-label">Shadow AI</span>
        <span class="eyebrow-sep">·</span>
        <span class="eyebrow-badge">
          <span class="badge-dot"></span>
          <span class="le">v1.0 — workspace</span><span class="lt">v1.0 — çalışma alanı</span>
        </span>
      </div>

      <h1 class="hero-h1" style="animation:fadeUp .7s both .1s">
        <span class="le">Ten AI modes.<br>One workspace.<br><span class="hero-accent">Free beta access.</span></span>
        <span class="lt">On AI modu.<br>Tek workspace.<br><span class="hero-accent">Ücretsiz beta erişimi.</span></span>
      </h1>

      <p class="hero-sub" style="animation:fadeUp .7s both .25s">
        <span class="le">Shadow AI is a keyboard-first workspace for chat, code, SEO, resume, image, and canvas workflows. Social sign-in unlocks synced conversations, saved bots, and daily free limits.</span>
        <span class="lt">Shadow AI; sohbet, kod, SEO, CV, görsel ve canvas akışları için klavye odaklı bir workspace'tir. Sosyal giriş; senkronize konuşmaları, kayıtlı botları ve günlük ücretsiz limitleri açar.</span>
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:36px;animation:fadeUp .7s both .38s">
        <a href="/chat?auth=1" class="btn-primary">
          <span class="le">Start free beta</span><span class="lt">Ücretsiz betayı başlat</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
        <a href="#features" class="btn-ghost"><span class="le">Explore features</span><span class="lt">Özellikleri Keşfet</span></a>
      </div>

      <div class="stats-row" style="animation:fadeUp .7s both .5s">
        <div class="stat-item">
          <div class="stat-num">10</div>
          <div class="stat-label"><span class="le">AI Modes</span><span class="lt">AI Modu</span></div>
        </div>
        <div class="stat-div"></div>
        <div class="stat-item">
          <div class="stat-num">10+</div>
          <div class="stat-label"><span class="le">Models</span><span class="lt">Model</span></div>
        </div>
        <div class="stat-div"></div>
        <div class="stat-item">
          <div class="stat-num" style="color:#4ade80">2</div>
          <div class="stat-label"><span class="le">Social Sign-in</span><span class="lt">Sosyal Giriş</span></div>
        </div>
        <div class="stat-div"></div>
        <div class="stat-item">
          <div class="stat-num">∞</div>
          <div class="stat-label"><span class="le">Context</span><span class="lt">Bağlam</span></div>
        </div>
      </div>
    </div>

    <!-- JB decoration + Logo card -->
    <div class="mesh-container landing-mesh hidden lg:block">
      <div class="jb-layer jb-l1"></div>
      <div class="jb-layer jb-l2"></div>
      <div class="jb-layer jb-l3"></div>
      <div class="jb-layer jb-l4"></div>
      <div class="jb-layer jb-l5"></div>
      <div class="jb-layer jb-l6"></div>
      <div class="logo-card-wrap landing-logo-card" style="animation:fadeIn .9s both .3s">
        <div class="logo-card" style="animation:float 5s ease-in-out 1.3s infinite">
          <svg width="88" height="88" viewBox="0 0 100 100" fill="none">
            <path d="M8 16h42v30H8v38h42" stroke="#4ade80" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 30h42v28H28v22h42" stroke="#4ade80" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.42"/>
          </svg>
          <div class="logo-text">
            <span class="logo-name">SHADOW</span>
            <div class="logo-ai-row">
              <div class="logo-line"></div>
              <span class="logo-ai-label">AI</span>
              <div class="logo-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TICKER ===== -->
  <div class="ticker-wrap reveal">
    <span class="ticker-label"><span class="le">modes</span><span class="lt">modlar</span></span>
    <div class="ticker-overflow">
      <div class="ticker-track">
        <span class="t-chip" style="--mc:#6366f1">/chat</span>
        <span class="t-chip" style="--mc:#22d3ee">/content</span>
        <span class="t-chip" style="--mc:#34d399">/code</span>
        <span class="t-chip" style="--mc:#f472b6">/email</span>
        <span class="t-chip" style="--mc:#fb923c">/video</span>
        <span class="t-chip" style="--mc:#a78bfa">/seo</span>
        <span class="t-chip" style="--mc:#f59e0b">/image</span>
        <span class="t-chip" style="--mc:#ec4899">/voice</span>
        <span class="t-chip" style="--mc:#14b8a6">/resume</span>
        <span class="t-chip" style="--mc:#8b5cf6">/bot</span>
        <span class="t-chip" style="--mc:#6366f1">/chat</span>
        <span class="t-chip" style="--mc:#22d3ee">/content</span>
        <span class="t-chip" style="--mc:#34d399">/code</span>
        <span class="t-chip" style="--mc:#f472b6">/email</span>
        <span class="t-chip" style="--mc:#fb923c">/video</span>
        <span class="t-chip" style="--mc:#a78bfa">/seo</span>
        <span class="t-chip" style="--mc:#f59e0b">/image</span>
        <span class="t-chip" style="--mc:#ec4899">/voice</span>
        <span class="t-chip" style="--mc:#14b8a6">/resume</span>
        <span class="t-chip" style="--mc:#8b5cf6">/bot</span>
      </div>
    </div>
  </div>

  <!-- ===== MODES GRID ===== -->
  <section id="modes" class="mt-[130px]">
    <div class="reveal mb-10">
      <p class="section-eyebrow"><span class="le">All modes</span><span class="lt">Tüm modlar</span></p>
      <h2 class="section-h2"><span class="le">One shell.<br><span style="color:#4ade80">Ten superpowers.</span></span><span class="lt">Tek arayüz.<br><span style="color:#4ade80">On süper güç.</span></span></h2>
    </div>
    <div class="modes-grid">

      <div class="mode-card reveal reveal-d1" style="--mc:#6366f1">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/chat</span><span class="mode-name"><span class="le">Chat AI</span><span class="lt">Sohbet AI</span></span><span class="mode-desc"><span class="le">Streaming conversation</span><span class="lt">Akışlı sohbet</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d2" style="--mc:#22d3ee">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/content</span><span class="mode-name"><span class="le">Content</span><span class="lt">İçerik</span></span><span class="mode-desc"><span class="le">Structured long-form</span><span class="lt">Yapılandırılmış uzun içerik</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d3" style="--mc:#34d399">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/code</span><span class="mode-name"><span class="le">Code</span><span class="lt">Kod</span></span><span class="mode-desc"><span class="le">Dev-focused generation</span><span class="lt">Geliştirici odaklı üretim</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d4" style="--mc:#f472b6">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/email</span><span class="mode-name"><span class="le">Email</span><span class="lt">E-posta</span></span><span class="mode-desc"><span class="le">Professional drafting</span><span class="lt">Profesyonel taslak</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d1" style="--mc:#fb923c">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/video</span><span class="mode-name">Video</span><span class="mode-desc"><span class="le">Script generation</span><span class="lt">Senaryo üretimi</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d2" style="--mc:#a78bfa">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/seo</span><span class="mode-name">SEO</span><span class="mode-desc"><span class="le">Structured audit</span><span class="lt">Yapılandırılmış denetim</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d3" style="--mc:#f59e0b">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/image</span><span class="mode-name"><span class="le">Image</span><span class="lt">Görsel</span></span><span class="mode-desc"><span class="le">Visual synthesis</span><span class="lt">Görsel sentez</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d4" style="--mc:#ec4899">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/voice</span><span class="mode-name"><span class="le">Voice</span><span class="lt">Ses</span></span><span class="mode-desc"><span class="le">Text-to-speech</span><span class="lt">Metinden sese</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d1" style="--mc:#14b8a6">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/resume</span><span class="mode-name"><span class="le">Resume</span><span class="lt">CV</span></span><span class="mode-desc"><span class="le">Profile-driven CV</span><span class="lt">Profil odaklı CV</span></span></div>
      </div>

      <div class="mode-card reveal reveal-d2" style="--mc:#8b5cf6">
        <div class="mode-icon"><svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg></div>
        <div class="mode-info"><span class="mode-cmd">/bot</span><span class="mode-name"><span class="le">Bot Builder</span><span class="lt">Bot Oluşturucu</span></span><span class="mode-desc"><span class="le">Persona &amp; live chat</span><span class="lt">Persona ve canlı sohbet</span></span></div>
      </div>

    </div>
  </section>

  <!-- ===== FEATURES ===== -->
  <div id="features" class="mt-[140px]">
    <div class="reveal mb-10">
      <p class="section-eyebrow"><span class="le">Why Shadow AI</span><span class="lt">Neden Shadow AI</span></p>
      <h2 class="section-h2"><span class="le">Built for power users.<br><span style="color:#4ade80">No bloat. No noise.</span></span><span class="lt">Güçlü kullanıcılar için.<br><span style="color:#4ade80">Şişirilmemiş. Gürültüsüz.</span></span></h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div class="feat-card reveal reveal-d1">
        <div class="feat-icon" style="color:#4ade80">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
        </div>
        <h3 class="feat-h3"><span class="le">Free-model routing</span><span class="lt">Ücretsiz model yönlendirmesi</span></h3>
        <p class="feat-p"><span class="le">Shadow AI routes chat, code, and structured modes across free OpenRouter models, while image generation runs on Workers AI.</span><span class="lt">Shadow AI; sohbet, kod ve yapılandırılmış modları ücretsiz OpenRouter modelleri arasında yönlendirir, görsel üretimini ise Workers AI üzerinde çalıştırır.</span></p>
        <div class="feat-tags">
          <span class="feat-tag">gpt-oss</span>
          <span class="feat-tag">Qwen</span>
          <span class="feat-tag">GLM</span>
          <span class="feat-tag">Workers AI</span>
          <span class="feat-tag" style="color:#444d6b"><span class="le">Flux image</span><span class="lt">Flux görsel</span></span>
        </div>
      </div>

      <div class="feat-card reveal reveal-d2">
        <div class="feat-icon" style="color:#7d52fa">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
        </div>
        <h3 class="feat-h3"><span class="le">10 purpose-built workspaces</span><span class="lt">10 amaca özel çalışma alanı</span></h3>
        <p class="feat-p"><span class="le">Every mode is purpose-engineered — not a generic chat box with a different prompt. Each has its own controls, output format, and toolbar.</span><span class="lt">Her mod özelleştirilmiş mühendislik içerir — farklı komut istemli genel bir sohbet kutusu değil. Her birinin kendi kontrolleri, çıktı formatı ve araç çubuğu vardır.</span></p>
        <div class="feat-mini-modes">
          <span style="color:#6366f1"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></span>
          <span style="color:#34d399"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>
          <span style="color:#f472b6"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
          <span style="color:#a78bfa"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <span style="color:#ec4899"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/></svg></span>
          <span style="color:#f59e0b"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>
          <span style="color:#14b8a6"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></span>
        </div>
      </div>

      <div class="feat-card reveal reveal-d3">
        <div class="feat-icon" style="color:#4ade80">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
        </div>
        <h3 class="feat-h3"><span class="le">Real-time streaming inference</span><span class="lt">Gerçek zamanlı akış çıkarımı</span></h3>
        <p class="feat-p"><span class="le">Token-by-token output with deep context awareness. Responses stream instantly — no waiting for completion before you see results.</span><span class="lt">Derin bağlam farkındalığıyla token-by-token çıktı. Yanıtlar anında akar — tamamlanmasını beklemenize gerek yok.</span></p>
        <div class="stream-vis">
          <div class="sbar" style="height:16px;animation-delay:0ms"></div>
          <div class="sbar" style="height:22px;animation-delay:110ms"></div>
          <div class="sbar" style="height:18px;animation-delay:220ms"></div>
          <div class="sbar" style="height:28px;animation-delay:330ms"></div>
          <div class="sbar" style="height:14px;animation-delay:440ms"></div>
          <div class="sbar" style="height:20px;animation-delay:550ms"></div>
          <div class="sbar" style="height:24px;animation-delay:660ms"></div>
          <span class="stream-label"><span class="le">streaming live</span><span class="lt">canlı akış</span></span>
        </div>
      </div>

      <div class="feat-card reveal reveal-d4">
        <div class="feat-icon" style="color:#f59e0b">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
        </div>
        <h3 class="feat-h3"><span class="le">Complete data sovereignty</span><span class="lt">Tam veri egemenliği</span></h3>
        <p class="feat-p"><span class="le">Public beta guardrails are visible. Social sign-in, daily quotas, exportable data, and clear support links are built into the workspace.</span><span class="lt">Açık beta korumaları görünürdür. Sosyal giriş, günlük kotalar, dışa aktarılabilir veri ve net destek bağlantıları workspace içine yerleştirilmiştir.</span></p>
        <div class="check-list">
          <div class="check-item"><svg width="12" height="12" fill="none" stroke="#4ade80" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg><span class="le">Google + GitHub sign-in</span><span class="lt">Google + GitHub girişi</span></div>
          <div class="check-item"><svg width="12" height="12" fill="none" stroke="#4ade80" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg><span class="le">Daily free usage limits</span><span class="lt">Günlük ücretsiz kullanım limitleri</span></div>
          <div class="check-item"><svg width="12" height="12" fill="none" stroke="#4ade80" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg><span class="le">Account export and deletion tools</span><span class="lt">Hesap dışa aktarma ve silme araçları</span></div>
        </div>
      </div>

    </div>
  </div>

  <!-- ===== STACK ===== -->
  <section id="stack" class="mt-[160px] relative z-20 pb-[80px]">
    <div class="reveal mb-10">
      <p class="section-eyebrow"><span class="le">Under the hood</span><span class="lt">Altyapıda</span></p>
      <h2 class="section-h2" style="color:#4ade80"><span class="le">Engineered for control.</span><span class="lt">Kontrol için tasarlandı.</span></h2>
      <h2 class="section-h2"><span class="le">Not just for chat.</span><span class="lt">Sadece sohbet için değil.</span></h2>
    </div>

    <div class="stack-card reveal reveal-d1">
      <div class="stack-left">
        <h3 class="text-[26px] font-bold text-white mb-4 tracking-tight leading-tight"><span class="le">Free-model stack</span><span class="lt">Ücretsiz model stack'i</span></h3>
        <p class="text-[14px] text-[#d4ccff] leading-[1.7]"><span class="le">Structured modes run through the actual free OpenRouter models currently in rotation, while the image lane uses Workers AI and the canvas lane stays preview-safe.</span><span class="lt">Yapılandırılmış modlar şu anda gerçekten rotasyonda olan ücretsiz OpenRouter modellerinden çalışır; görsel yolu Workers AI kullanır, canvas yolu ise önizleme güvenli kalır.</span></p>
        <div class="stack-meta">
          <span><span class="le">OpenRouter</span><span class="lt">OpenRouter</span></span><span class="stack-sep"></span>
          <span><span class="le">Workers AI</span><span class="lt">Workers AI</span></span><span class="stack-sep"></span>
          <span><span class="le">Canvas beta</span><span class="lt">Canvas beta</span></span>
        </div>
      </div>
      <div class="model-grid">
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-openai">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4.6 8.7 6.5v3.8L12 12.2l3.3-1.9V6.5L12 4.6Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.7 6.5 5.5 8.4v3.7l3.2 1.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".86"/>
                <path d="M15.3 6.5 18.5 8.4v3.7l-3.2 1.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".86"/>
                <path d="M5.5 12.1v3.7l3.2 1.8L12 15.8l3.3 1.8 3.2-1.8v-3.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".72"/>
              </svg>
            </div>
            <span class="model-provider">OpenAI</span>
          </div>
          <div class="model-copy">
            <strong>GPT OSS 120B</strong>
            <span><span class="le">Chat · Resume</span><span class="lt">Sohbet · CV</span></span>
          </div>
        </div>
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-openai">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4.6 8.7 6.5v3.8L12 12.2l3.3-1.9V6.5L12 4.6Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.7 6.5 5.5 8.4v3.7l3.2 1.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".86"/>
                <path d="M15.3 6.5 18.5 8.4v3.7l-3.2 1.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".86"/>
                <path d="M5.5 12.1v3.7l3.2 1.8L12 15.8l3.3 1.8 3.2-1.8v-3.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".72"/>
              </svg>
            </div>
            <span class="model-provider">OpenAI</span>
          </div>
          <div class="model-copy">
            <strong>GPT OSS 20B</strong>
            <span><span class="le">Email · Voice</span><span class="lt">E-posta · Ses</span></span>
          </div>
        </div>
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-qwen">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="5.2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M14.8 14.8 18.7 18.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M11 8.2c1.8 0 3.1 1.2 3.1 2.8S12.8 13.8 11 13.8 7.9 12.6 7.9 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="model-provider">Qwen</span>
          </div>
          <div class="model-copy">
            <strong>Qwen3 Next 80B</strong>
            <span><span class="le">Content · Video · Bot</span><span class="lt">İçerik · Video · Bot</span></span>
          </div>
        </div>
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-qwen">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="5.2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M14.8 14.8 18.7 18.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M11 8.2c1.8 0 3.1 1.2 3.1 2.8S12.8 13.8 11 13.8 7.9 12.6 7.9 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="model-provider">Qwen</span>
          </div>
          <div class="model-copy">
            <strong>Qwen3 Coder</strong>
            <span><span class="le">Code · Canvas</span><span class="lt">Kod · Canvas</span></span>
          </div>
        </div>
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-glm">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4.6 14.4 9.2 19.4 9.9 15.8 13.3 16.7 18.2 12 15.9 7.3 18.2 8.2 13.3 4.6 9.9 9.6 9.2 12 4.6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M12 7.8v8.3M8.6 12h6.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
              </svg>
            </div>
            <span class="model-provider">Z.AI</span>
          </div>
          <div class="model-copy">
            <strong>GLM 4.5 Air</strong>
            <span><span class="le">SEO lane</span><span class="lt">SEO yolu</span></span>
          </div>
        </div>
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-nvidia">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.5 12c2.6-3.2 5.8-4.9 9.7-4.9 3.1 0 5.6 1 7.3 2.1-2.1 1.4-4.4 3.6-5.7 6.3-1.2 1.2-2.9 1.9-4.9 1.9-2.5 0-4.8-.9-6.4-2.3 1.4-1.1 3.4-2.4 5.8-2.4 2.5 0 4.3 1 5.4 2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="11.8" cy="12.2" r="2.15" stroke="currentColor" stroke-width="1.55"/>
              </svg>
            </div>
            <span class="model-provider">NVIDIA</span>
          </div>
          <div class="model-copy">
            <strong>Nemotron 30B</strong>
            <span><span class="le">Free fallback</span><span class="lt">Free fallback</span></span>
          </div>
        </div>
        <div class="model-tile">
          <div class="model-top">
            <div class="model-mark model-mark-nvidia">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.5 12c2.6-3.2 5.8-4.9 9.7-4.9 3.1 0 5.6 1 7.3 2.1-2.1 1.4-4.4 3.6-5.7 6.3-1.2 1.2-2.9 1.9-4.9 1.9-2.5 0-4.8-.9-6.4-2.3 1.4-1.1 3.4-2.4 5.8-2.4 2.5 0 4.3 1 5.4 2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="11.8" cy="12.2" r="2.15" stroke="currentColor" stroke-width="1.55"/>
              </svg>
            </div>
            <span class="model-provider">NVIDIA</span>
          </div>
          <div class="model-copy">
            <strong>Nemotron Nano 9B</strong>
            <span><span class="le">Free fallback</span><span class="lt">Free fallback</span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="stack-card reveal reveal-d2" style="margin-top:16px">
      <div class="code-block">
        <div class="code-titlebar">
          <div class="code-dots"><span></span><span></span><span></span></div>
          <span style="color:#dfe1e5;font-size:10px">shadow_agent.rs</span>
        </div>
        <div class="code-body">
          <div class="code-lines">16<br>17<br>18<br>19<br>20<br>21<br>22<br>23<br>24</div>
          <pre class="code-pre"><span class="ck">fn</span> <span class="cf">execute_toolchain</span>(payload: &amp;Payload) -&gt; <span class="ck">Result</span>&lt;(), Error&gt; {
    <span class="cc">// Spawn an isolated thread for the agent</span>
    <span class="ck">for</span> tool <span class="ck">in</span> payload.routes.iter() {
        thread::spawn(<span class="ck">move</span> || {
            tool.<span class="cf">invoke_local</span>()
        });
    }

    <span class="cc">// Await completion without dashboard overhead</span></pre>
        </div>
        <div class="code-popup">
          <div class="popup-head"><span style="color:#cc7832">v</span> tool = {<span style="color:#a9b7c6">Shadow::Route</span>}</div>
          <div class="popup-row"><span class="popup-dot"></span><span style="color:#a9b7c6">Id =</span> <span style="color:#6aab73">"chat_ai"</span></div>
          <div class="popup-row"><span class="popup-dot"></span><span style="color:#a9b7c6">Auth =</span> <span style="color:#cc7832">false</span></div>
          <div class="popup-row"><span class="popup-dot"></span><span style="color:#a9b7c6">Mode =</span> <span style="color:#6aab73">"Streaming"</span></div>
        </div>
      </div>
      <div class="stack-right">
        <h3 class="text-[26px] font-bold text-white mb-4 tracking-tight leading-tight"><span class="le">Developer-first by design</span><span class="lt">Geliştirici öncelikli tasarım</span></h3>
        <p class="text-[14px] text-[#d4ccff] leading-[1.7]"><span class="le">Shadow AI keeps controls visible without pretending unsupported features exist. Quotas, export, account actions, and live canvas preview stay inside the same shell.</span><span class="lt">Shadow AI, desteklenmeyen özellikler varmış gibi davranmadan kontrolleri görünür tutar. Kotalar, dışa aktarma, hesap işlemleri ve canlı canvas önizlemesi aynı shell içinde kalır.</span></p>
        <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:10px"><span class="dev-dot"></span><span class="text-[12px] text-[#a99af5] font-mono"><span class="le">Language-aware code generation</span><span class="lt">Dil farkındalıklı kod üretimi</span></span></div>
          <div style="display:flex;align-items:center;gap:10px"><span class="dev-dot"></span><span class="text-[12px] text-[#a99af5] font-mono"><span class="le">Multi-agent orchestration</span><span class="lt">Çok ajanlı orkestrasyon</span></span></div>
          <div style="display:flex;align-items:center;gap:10px"><span class="dev-dot"></span><span class="text-[12px] text-[#a99af5] font-mono"><span class="le">Inline audio + image synthesis</span><span class="lt">Satır içi ses + görsel sentezi</span></span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CTA FOOTER ===== -->
  <section class="mt-[100px] relative z-20 pb-20">
    <div class="cta-box reveal">
      <div class="cta-glow"></div>
      <div style="position:relative;z-index:10;text-align:center;max-width:760px;margin:0 auto;display:flex;flex-direction:column;align-items:center">
        <p class="section-eyebrow" style="text-align:center;margin-bottom:14px"><span class="le">Free beta</span><span class="lt">Ücretsiz beta</span></p>
        <h2 class="text-[clamp(32px,4vw,44px)] font-[800] tracking-[-0.03em] text-white mb-4 leading-tight" style="text-align:center;max-width:700px;margin-left:auto;margin-right:auto">
          <span class="le">Start in <span style="color:#4ade80">seconds</span>.<br>Google or GitHub sign-in.</span>
          <span class="lt"><span style="color:#4ade80">Saniyeler</span> içinde başlayın.<br>Google veya GitHub girişiyle.</span>
        </h2>
        <p class="text-[15px] text-[#8e8e99] mb-8 max-w-[440px] mx-auto leading-relaxed text-center" style="text-align:center;max-width:560px;margin-left:auto;margin-right:auto">
          <span class="le">Open the workspace, pick a mode, and start generating with clear daily limits, account controls, and export support.</span>
          <span class="lt">Workspace'i aç, bir mod seç ve net günlük limitler, hesap kontrolleri ve dışa aktarma desteğiyle üretime başla.</span>
        </p>
        <a href="/chat?auth=1" class="btn-primary btn-lg">
          <span class="le">Launch Shadow AI</span><span class="lt">Shadow AI'yi Başlat</span>
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
        <p style="margin-top:18px;font-size:11px;font-family:var(--font-mono);color:#444d6b;text-align:center"><span class="le">Free beta · Social sign-in · Daily limits</span><span class="lt">Ücretsiz beta · Sosyal giriş · Günlük limitler</span></p>
        <p style="margin-top:10px;font-size:12px;color:#6b738f;text-align:center">
          <a href="/help/" style="color:inherit;text-decoration:none">Help</a>
          <span style="margin:0 8px">·</span>
          <a href="/privacy/" style="color:inherit;text-decoration:none">Privacy</a>
          <span style="margin:0 8px">·</span>
          <a href="/terms/" style="color:inherit;text-decoration:none">Terms</a>
        </p>
      </div>
    </div>
  </section>

</main>

<style>
/* LANGUAGE TOGGLE */
.lt { display: none; }
body.tr-mode .le { display: none; }
body.tr-mode .lt { display: inline; }
.lang-btn-ui {
  background: transparent;
  border: 1px solid var(--border-mid);
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: all .15s;
  flex-shrink: 0;
}
.lang-btn-ui:hover {
  border-color: var(--border-lit);
  color: var(--text-base);
  background: var(--bg-hover);
}

/* NAV */
#topnav {
  position: sticky; top: 0; z-index: 90;
  background: rgba(8,9,13,0);
  border-bottom: 1px solid rgba(30,33,52,0);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: background .3s, border-color .3s;
}
#topnav.scrolled {
  background: rgba(8,9,13,0.92);
  border-bottom-color: rgba(30,33,52,1);
}
.nav-inner { max-width:1240px; margin:0 auto; padding:0 28px; display:flex; align-items:center; justify-content:space-between; height:56px; }
.nav-logo  { display:flex; align-items:center; gap:8px; text-decoration:none; }
.nav-wordmark { display:flex; align-items:baseline; gap:3px; }
.nav-brand { font-weight:800; font-size:15px; color:#f0f2ff; letter-spacing:-.02em; }
.nav-ai    { font-weight:700; font-size:12px; color:#4ade80; letter-spacing:.05em; }
.nav-links { display:flex; align-items:center; gap:24px; }
.nav-links a { font-size:13px; color:#7880a0; text-decoration:none; transition:color .15s; }
.nav-links a:hover { color:#c2c8e8; }
.nav-cta {
  display:inline-flex; align-items:center; gap:6px;
  padding:7px 15px; background:#4ade80; color:#08090d;
  font-size:13px; font-weight:700; text-decoration:none;
  border-radius:4px; transition:background .15s;
}
.nav-cta:hover { background:#22c55e; }

/* HERO */
.landing-mesh { right: -380px; }
.logo-card-wrap.landing-logo-card { left:auto; right:420px; transform:translateY(-50%); }
.hero-eyebrow { display:flex; align-items:center; gap:8px; margin-bottom:20px; }
.eyebrow-label { font-size:12px; font-family:var(--font-mono); color:#8e8e99; letter-spacing:.12em; text-transform:uppercase; }
.eyebrow-sep   { color:#1f1738; }
.eyebrow-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-family:var(--font-mono); color:#4ade80; letter-spacing:.1em; text-transform:uppercase; }
.badge-dot     { width:6px; height:6px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px #4ade80; display:inline-block; }
.hero-h1  { font-size:clamp(46px,5.5vw,70px); font-weight:800; line-height:1.06; margin-bottom:18px; letter-spacing:-.03em; color:white; }
.hero-accent { color:#4ade80; }
.hero-sub { font-size:18px; color:#8e8e99; margin-bottom:28px; line-height:1.65; max-width:500px; }

/* BUTTONS */
.btn-primary {
  display:inline-flex; align-items:center; gap:7px; padding:11px 20px;
  background:#4ade80; color:#08090d; font-size:14px; font-weight:700;
  text-decoration:none; border-radius:4px; transition:background .15s, box-shadow .15s;
}
.btn-primary:hover { background:#22c55e; box-shadow:0 0 0 3px rgba(74,222,128,.2); }
.btn-primary.btn-lg { padding:13px 28px; font-size:15px; }
.btn-ghost {
  display:inline-flex; align-items:center; padding:11px 20px;
  background:transparent; color:#d4ccff; font-size:14px; font-weight:500;
  text-decoration:none; border-radius:4px; border:1px solid #231e3d; transition:all .15s;
}
.btn-ghost:hover { background:#110d26; border-color:#382b66; }

/* STATS */
.stats-row { display:flex; align-items:center; gap:20px; padding-top:20px; border-top:1px solid #1f1738; }
.stat-item { display:flex; flex-direction:column; }
.stat-num  { font-size:26px; font-weight:800; color:white; letter-spacing:-.02em; line-height:1; }
.stat-label { font-size:11px; font-family:var(--font-mono); color:#8e8e99; letter-spacing:.08em; text-transform:uppercase; margin-top:3px; }
.stat-div  { width:1px; height:34px; background:#1f1738; }

/* LOGO CARD */
.logo-card-wrap {
  position:absolute; top:50%; left:62%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.logo-card {
  display:flex; flex-direction:column; align-items:center; gap:16px;
  padding:34px 38px;
  background:rgba(6,7,11,0.84);
  border:1px solid rgba(74,222,128,0.14);
  border-radius:14px;
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
  box-shadow:0 32px 72px rgba(0,0,0,.80), 0 0 0 1px rgba(255,255,255,.03), inset 0 1px 0 rgba(74,222,128,.09);
  min-width:186px;
}
.logo-text    { display:flex; flex-direction:column; align-items:center; gap:5px; }
.logo-name    { color:white; font-weight:800; letter-spacing:.12em; font-size:16px; }
.logo-ai-row  { display:flex; align-items:center; gap:10px; }
.logo-line    { width:20px; height:1px; background:#4ade80; opacity:.7; }
.logo-ai-label { color:#4ade80; font-weight:700; letter-spacing:.22em; font-size:10px; }

/* TICKER */
.ticker-wrap     { display:flex; align-items:center; gap:16px; margin-top:48px; border-top:1px solid #1e2130; border-bottom:1px solid #1e2130; padding:13px 0; overflow:hidden; }
.ticker-label    { font-size:10px; font-family:var(--font-mono); color:#444d6b; letter-spacing:.12em; text-transform:uppercase; flex-shrink:0; }
.ticker-overflow { flex:1; overflow:hidden; }
.ticker-track    { display:flex; gap:8px; width:max-content; animation:marquee 30s linear infinite; }
.t-chip {
  display:inline-flex; align-items:center; padding:4px 12px; border-radius:3px;
  font-size:11px; font-family:var(--font-mono); font-weight:500; letter-spacing:.04em;
  background:color-mix(in srgb, var(--mc) 10%, transparent);
  border:1px solid color-mix(in srgb, var(--mc) 20%, transparent);
  color:var(--mc); white-space:nowrap;
}

/* MODES GRID */
.modes-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
.mode-card {
  display:flex; flex-direction:column; gap:10px; padding:16px 14px;
  background:rgba(20,22,32,.6); border:1px solid #1e2130; border-radius:6px;
  cursor:default; transition:all .2s; position:relative; overflow:hidden;
}
.mode-card::before {
  content:''; position:absolute; inset:0; border-radius:6px;
  background:color-mix(in srgb, var(--mc) 6%, transparent);
  opacity:0; transition:opacity .2s;
}
.mode-card:hover::before { opacity:1; }
.mode-card:hover {
  border-color:color-mix(in srgb, var(--mc) 30%, transparent);
  box-shadow:0 0 20px color-mix(in srgb, var(--mc) 12%, transparent);
}
.mode-icon {
  width:32px; height:32px; border-radius:4px; display:flex; align-items:center; justify-content:center;
  background:color-mix(in srgb, var(--mc) 12%, transparent);
  border:1px solid color-mix(in srgb, var(--mc) 18%, transparent);
  color:var(--mc); flex-shrink:0;
}
.mode-info { display:flex; flex-direction:column; gap:2px; }
.mode-cmd  { font-size:10px; font-family:var(--font-mono); color:var(--mc); letter-spacing:.04em; }
.mode-name { font-size:13px; font-weight:600; color:#c2c8e8; }
.mode-desc { font-size:11px; color:#444d6b; line-height:1.4; }

/* SECTION HEADERS */
.section-eyebrow { font-size:12px; font-family:var(--font-mono); color:#444d6b; letter-spacing:.12em; text-transform:uppercase; margin-bottom:10px; }
.section-h2 { font-size:clamp(36px,4vw,50px); font-weight:800; letter-spacing:-.03em; color:white; line-height:1.1; }

/* FEATURE CARDS */
.feat-card {
  background:linear-gradient(140deg,#0e0b1e 0%,#0b0917 100%);
  border:1px solid #221c3e; border-radius:14px; padding:28px;
  transition:border-color .2s, box-shadow .2s;
}
.feat-card:hover { border-color:#352b62; box-shadow:0 8px 32px rgba(89,63,243,.09); }
.feat-icon { width:40px; height:40px; border-radius:8px; background:rgba(129,140,248,.1); border:1px solid rgba(129,140,248,.15); display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
.feat-h3 { font-size:21px; font-weight:700; color:white; margin-bottom:10px; letter-spacing:-.02em; line-height:1.3; }
.feat-p  { font-size:14px; color:#8e8e99; line-height:1.7; }
.feat-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; }
.feat-tag  { background:#0f0c1a; border:1px solid #1f1738; border-radius:3px; padding:3px 10px; font-size:12px; color:#d4d4d8; }
.feat-mini-modes { display:flex; gap:10px; align-items:center; margin-top:14px; opacity:.85; }
.stream-vis { display:flex; align-items:center; gap:3px; margin-top:14px; }
.sbar { width:5px; background:#4ade80; border-radius:2px; opacity:.7; animation:barPulse 1.1s ease-in-out infinite; }
.stream-label { font-size:11px; font-family:var(--font-mono); color:#8e8e99; margin-left:8px; }
.check-list { display:flex; flex-direction:column; gap:7px; margin-top:14px; }
.check-item { display:flex; align-items:center; gap:8px; font-size:12px; color:#8e8e99; }

/* STACK SECTION */
.stack-card {
  background:linear-gradient(145deg,#0d0b1e 0%,#100d22 100%);
  border:1px solid rgba(89,63,243,.18);
  border-radius:18px; padding:32px 36px;
  display:flex; gap:28px; align-items:center;
  box-shadow:0 20px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.02), inset 0 1px 0 rgba(129,140,248,.05);
}
.stack-left  { width:38%; padding-right:8px; flex-shrink:0; }
.stack-right { width:46%; padding-left:4px; flex-shrink:0; }
.stack-meta  { margin-top:14px; padding-top:14px; border-top:1px solid rgba(89,63,243,.22); display:flex; align-items:center; gap:12px; font-size:11px; font-family:var(--font-mono); color:#a99af5; }
.stack-sep   { width:1px; height:14px; background:rgba(89,63,243,.35); }
.model-grid  { flex:1; display:grid; grid-template-columns:repeat(4,1fr); gap:10px; align-content:start; }
.model-tile  {
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:8px; min-height:122px;
  display:flex; flex-direction:column; align-items:flex-start; justify-content:flex-start; gap:10px;
  padding:14px 12px;
  transition:all .18s; cursor:pointer;
}
.model-tile:hover { background:rgba(255,255,255,.08); border-color:rgba(129,140,248,.25); }
.model-top { display:flex; align-items:center; gap:10px; }
.model-mark {
  width:38px; height:38px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center;
  border:1px solid rgba(255,255,255,.08); background:rgba(8,9,13,.75); flex-shrink:0;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
  color:#f6f7ff;
}
.model-mark svg { width:24px; height:24px; display:block; overflow:visible; }
.model-mark-openai { border-color:rgba(255,255,255,.14); background:rgba(15,17,25,.9); }
.model-mark-qwen { color:#ffb86b; border-color:rgba(255,184,107,.24); background:rgba(255,184,107,.08); }
.model-mark-glm { color:#56a8f5; border-color:rgba(86,168,245,.24); background:rgba(86,168,245,.08); }
.model-mark-nvidia { color:#88d61a; border-color:rgba(118,185,0,.26); background:rgba(118,185,0,.08); }
.model-provider {
  font-size:10px; font-family:var(--font-mono); font-weight:700; letter-spacing:.08em;
  color:#8e8e99; text-transform:uppercase;
}
.model-copy { display:flex; flex-direction:column; gap:4px; }
.model-copy strong { font-size:12px; font-weight:700; color:#f6f7ff; line-height:1.3; }
.model-copy span { font-size:10px; font-weight:600; color:#9298b4; line-height:1.4; }
.dev-dot { width:6px; height:6px; border-radius:50%; background:#a99af5; flex-shrink:0; }
.code-block {
  width:54%; background:#1e1f22; border-radius:8px; overflow:hidden;
  border:1px solid #393b40; box-shadow:0 20px 40px rgba(0,0,0,.5);
  font-family:var(--font-mono); font-size:10px; position:relative; flex-shrink:0;
}
.code-titlebar { display:flex; align-items:center; background:#2b2d30; border-bottom:1px solid #393b40; padding:7px 12px; }
.code-dots { display:flex; gap:5px; margin-right:12px; }
.code-dots span { width:10px; height:10px; border-radius:50%; }
.code-dots span:nth-child(1){background:#ff5f56} .code-dots span:nth-child(2){background:#ffbd2e} .code-dots span:nth-child(3){background:#27c93f}
.code-body { display:flex; padding:8px 0 14px; }
.code-lines { width:34px; text-align:right; padding-right:10px; color:#4b5059; line-height:1.6; user-select:none; }
.code-pre   { flex:1; color:#a9b7c6; line-height:1.6; white-space:pre; overflow:hidden; padding-right:12px; margin:0; }
.ck  { color:#cc7832; font-weight:700; }
.cf  { color:#ffc66d; }
.cc  { color:#808080; font-style:italic; }
.code-popup { position:absolute; top:66px; left:110px; width:240px; background:#2b2d30; border:1px solid #43454a; border-radius:4px; box-shadow:0 8px 20px rgba(0,0,0,.6); overflow:hidden; font-size:10px; }
.popup-head { display:flex; align-items:center; padding:5px 8px; background:#333537; color:white; }
.popup-row  { display:flex; align-items:center; gap:6px; padding:3px 8px; border-bottom:1px solid #393b40; }
.popup-dot  { width:8px; height:8px; border-radius:50%; background:#cc7832; flex-shrink:0; }

/* CTA */
.cta-box  { border:1px solid #1f1738; border-radius:18px; padding:52px; position:relative; overflow:hidden; background:linear-gradient(135deg,#0d0b1a,#110d26,#0d0b1a); }
.cta-glow { position:absolute; top:0; left:50%; transform:translateX(-50%); width:500px; height:200px; background:#7d52fa; opacity:.08; filter:blur(80px); border-radius:50%; pointer-events:none; }

/* SCROLL REVEAL */
.reveal           { opacity:0; transform:translateY(22px); transition:opacity .65s ease, transform .65s ease; }
.reveal.in-view   { opacity:1; transform:none; }
.reveal-d1 { transition-delay:.07s; }
.reveal-d2 { transition-delay:.14s; }
.reveal-d3 { transition-delay:.21s; }
.reveal-d4 { transition-delay:.28s; }

/* ANIMATIONS */
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes barPulse { 0%,100%{transform:scaleY(.55);opacity:.5} 50%{transform:scaleY(1);opacity:1} }

/* RESPONSIVE */
@media (max-width:900px) {
  .modes-grid { grid-template-columns:repeat(2,1fr); }
  .stack-card { flex-direction:column; }
  .model-grid,.stack-left,.stack-right,.code-block { width:100%; }
  .nav-links { display:none; }
}

@media (max-width:1440px) {
  .logo-card-wrap.landing-logo-card { right:390px; transform:translateY(-50%) scale(.94); }
}

@media (max-width:1120px) {
  .logo-card-wrap.landing-logo-card { right:330px; transform:translateY(-50%) scale(.84); }
  .logo-card-wrap.landing-logo-card .logo-card { min-width:170px; padding:30px 32px; }
}
</style>

<script>
(function(){
  var nav = document.getElementById('topnav');
  if(nav) {
    window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 24); }, {passive:true});
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, {threshold:0.07});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // Language toggle
  var langBtn = document.getElementById('lang-btn');
  var body = document.body;
  var savedLang = null;
  try {
    savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('nx-lang') : null;
  } catch(e) {}
  if (savedLang === 'tr') {
    body.classList.add('tr-mode');
    if (langBtn) langBtn.textContent = 'EN';
  }
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      var isTr = body.classList.toggle('tr-mode');
      langBtn.textContent = isTr ? 'EN' : 'TR';
      try { localStorage.setItem('nx-lang', isTr ? 'tr' : 'en'); } catch(e) {}
    });
  }
})();
</script>
`;

export default component$(() => {
  return <div dangerouslySetInnerHTML={landingHtml} />;
});

export const head: DocumentHead = {
  title: "Shadow AI",
  meta: [
    {
      name: "description",
      content:
        "Shadow AI is a keyboard-first workspace for chat, code, SEO, resume, image, and canvas workflows.",
    },
    { name: "theme-color", content: "#08090d" },
  ],
};
