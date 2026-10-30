/* SECTION: app-init */
(function () {
  'use strict';
  var WORKS = window.QX_PORTFOLIO || [];
  var STYLES = window.QX_STYLES || [];
  var byId = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAIL_TO = '2841552891@qq.com';

  var STYLE_INFO = {
    '原木风': { en: 'Natural Wood', note: '木色与米白' },
    '新中式': { en: 'New Chinese', note: '东方留白' },
    '极简': { en: 'Minimalism', note: '克制秩序' },
    '法式': { en: 'French', note: '轻盈优雅' },
    '静奢': { en: 'Quiet Luxury', note: '材质层次' }
  };

  function pickLandscape(minW) {
    return WORKS.filter(function (it) { return it.w >= it.h && it.w >= (minW || 0); });
  }
  var heroPool = pickLandscape(5000);
  var heroSet = heroPool.slice(0, 5);
  if (!heroSet.length && WORKS.length) heroSet = WORKS.slice(0, 3);

  /* SECTION: image-load
     mountImage(img, src, alt, eager) —— 列表用 thumb，大图/首屏用 medium */
  function mountImage(img, src, alt, eager) {
    img.alt = alt || '千寻设计作品';
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    img.addEventListener('error', function () {
      img.style.display = 'none';
      var box = img.parentNode;
      if (box) box.classList.add('img-failed');
    });
    img.src = src; /* 运行时赋值，源码不写远程 URL 字面量 */
  }

  /* SECTION: hero-slideshow */
  var stage = byId('heroStage'), dotsBox = byId('heroDots'), heroMeta = byId('heroMeta');
  var heroIdx = 0, heroTimer = null;
  if (stage && heroSet.length) {
    heroSet.forEach(function (item, i) {
      var fig = document.createElement('div');
      fig.className = 'hero-slide' + (i === 0 ? ' is-on' : '');
      var img = document.createElement('img');
      mountImage(img, item.medium, item.alt, i === 0);
      fig.appendChild(img);
      stage.appendChild(fig);
      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' is-on' : '');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 张：' + item.style);
      dot.addEventListener('click', function () { showHero(i, true); });
      dotsBox && dotsBox.appendChild(dot);
    });
    var slides = stage.querySelectorAll('.hero-slide');
    var dots = dotsBox ? dotsBox.querySelectorAll('.hero-dot') : [];
    function showHero(i, manual) {
      heroIdx = (i + heroSet.length) % heroSet.length;
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle('is-on', k === heroIdx);
        dots[k] && dots[k].classList.toggle('is-on', k === heroIdx);
      }
      var it = heroSet[heroIdx];
      if (heroMeta) heroMeta.textContent = it.style + ' · ' + (STYLE_INFO[it.style] ? STYLE_INFO[it.style].note : '') + ' · 0' + (heroIdx + 1) + ' / 0' + heroSet.length;
      if (manual) restartHero();
    }
    function restartHero() {
      if (heroTimer) clearInterval(heroTimer);
      if (!reduceMotion && heroSet.length > 1) heroTimer = setInterval(function () { showHero(heroIdx + 1); }, 5200);
    }
    restartHero();
    showHero(0);
  }

  /* SECTION: about-figure */
  var aboutFrame = byId('aboutFrame');
  if (aboutFrame) {
    var aboutItem = WORKS.filter(function (it) { return it.style === '新中式'; })[0] || WORKS[0];
    if (aboutItem) {
      var aimg = document.createElement('img');
      mountImage(aimg, aboutItem.medium, aboutItem.alt, false);
      aboutFrame.appendChild(aimg);
    }
  }

  /* SECTION: stats */
  var STATS = [
    { k: 43, suffix: ' 组', label: '实景落地作品' },
    { k: 5, suffix: ' 类', label: '成熟设计方向' },
    { k: 100, suffix: ' %', label: '施工节点跟进' }
  ];
  var statsBox = byId('stats');
  if (statsBox) {
    STATS.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'stat';
      d.innerHTML = '<p class="stat-k"><i data-count="' + s.k + '">0</i><span>' + s.suffix + '</span></p><p class="stat-l">' + s.label + '</p>';
      statsBox.appendChild(d);
    });
  }
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* SECTION: services */
  var SERVICES = [
    { n: '01', t: '住宅空间设计', d: '平层、复式、别墅与老宅改造。围绕家庭成员的生活习惯规划动线、收纳与采光，再确定材质与灯光。' },
    { n: '02', t: '商业与餐饮空间', d: '零售、餐饮、展厅与民宿。从客流动线与经营需求出发，兼顾氛围记忆点和后期维护成本。' },
    { n: '03', t: '办公空间设计', d: '从工位排布与会议需求反推平面，用隔断高度、声学处理与色温营造松弛而高效的环境。' },
    { n: '04', t: '全案深化与施工图', d: '方案确定后完成材料选样、色彩与灯具定义、节点大样与施工图绘制，交付可直接施工的图纸。' },
    { n: '05', t: '软装陈设与采购', d: '家具、灯具、窗帘、饰品与绿植的整体搭配，提供选品清单与采购对接，控制预算与到货周期。' },
    { n: '06', t: '施工跟进与落地', d: '开工交底、隐蔽工程验收、材料进场核对与关键节点现场调整，确保收口与效果不走样。' }
  ];
  var svcGrid = byId('svcGrid');
  if (svcGrid) {
    SERVICES.forEach(function (s) {
      var d = document.createElement('article');
      d.className = 'svc';
      d.innerHTML = '<p class="num">' + s.n + '</p><h3>' + s.t + '</h3><p class="svc-d">' + s.d + '</p>';
      svcGrid.appendChild(d);
    });
  }

  /* SECTION: process-steps */
  var STEPS = [
    { n: 'I', t: '需求沟通', d: '了解生活方式或经营目标、面积与预算区间，明确服务深度。' },
    { n: 'II', t: '现场勘测', d: '复尺、采光与梁柱管井记录，梳理现场不可变更的约束条件。' },
    { n: 'III', t: '方案设计', d: '平面布局与动线、概念方案与材质方向，确认后再谈风格。' },
    { n: 'IV', t: '深化与施工', d: '施工图与节点大样、材料封样，配合交底与进度排布。' },
    { n: 'V', t: '陈设与交付', d: '软装进场摆场、缺陷清单整改，交付使用说明与后期建议。' }
  ];
  var stepsBox = byId('steps');
  if (stepsBox) {
    STEPS.forEach(function (s) {
      var d = document.createElement('article');
      d.className = 'step';
      d.innerHTML = '<i>' + s.n + '</i><h3>' + s.t + '</h3><p>' + s.d + '</p>';
      stepsBox.appendChild(d);
    });
  }

  /* SECTION: contact-info */
  var INFO = [
    ['工作室', '海南省清水湾碧海帆影 D1-55'],
    ['联系电话', '181 8985 8778'],
    ['邮箱', MAIL_TO],
    ['工作时间', '周一至周六 09:00 – 19:00'],
    ['合作方式', '纯设计 / 全案托管']
  ];
  var infoList = byId('infoList');
  if (infoList) {
    INFO.forEach(function (row) {
      var d = document.createElement('div');
      d.className = 'info-row';
      d.innerHTML = '<dt>' + row[0] + '</dt><dd>' + row[1] + '</dd>';
      infoList.appendChild(d);
    });
  }
  var footStyles = byId('footStyles');
  if (footStyles) {
    STYLES.forEach(function (s) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="#works" data-style-link="' + s.key + '">' + s.key + '</a>';
      footStyles.appendChild(li);
    });
  }

  /* SECTION: portfolio-filter */
  var chips = byId('chips'), masonry = byId('masonry'), pfInfo = byId('pfInfo'),
      pfEmpty = byId('pfEmpty'), pfTotal = byId('pfTotal');
  if (pfTotal) pfTotal.textContent = WORKS.length;
  var current = 'all', shown = [];

  function buildChips() {
    if (!chips) return;
    var all = document.createElement('button');
    all.className = 'chip is-on';
    all.type = 'button';
    all.dataset.style = 'all';
    all.innerHTML = '全部作品 <b>' + WORKS.length + '</b>';
    chips.appendChild(all);
    STYLES.forEach(function (s) {
      var b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.dataset.style = s.key;
      b.innerHTML = s.key + ' <b>' + s.count + '</b>';
      chips.appendChild(b);
    });
    chips.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (btn) applyFilter(btn.dataset.style);
    });
  }

  function applyFilter(key) {
    current = key;
    var list = key === 'all' ? WORKS.slice() : WORKS.filter(function (it) { return it.style === key; });
    shown = list;
    if (chips) {
      Array.prototype.forEach.call(chips.querySelectorAll('.chip'), function (c) {
        var on = c.dataset.style === key;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    if (pfInfo) {
      var meta = key === 'all' ? '五种设计方向 · 全部作品' : (STYLE_INFO[key] ? key + ' / ' + STYLE_INFO[key].en : key);
      pfInfo.textContent = meta + ' · ' + list.length + ' 组';
    }
    renderCases(list);
    if (pfEmpty) pfEmpty.style.display = list.length ? 'none' : 'block';
  }

  function renderCases(list) {
    if (!masonry) return;
    masonry.innerHTML = '';
    list.forEach(function (item, i) {
      var fig = document.createElement('figure');
      fig.className = 'case';
      fig.dataset.index = i;
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', '查看大图：' + item.title);
      var box = document.createElement('div');
      box.className = 'case-img';
      box.style.aspectRatio = item.w + ' / ' + item.h;
      var img = document.createElement('img');
      mountImage(img, item.thumb, item.alt, i < 6); /* 列表只加载压缩缩略图 */
      var zoom = document.createElement('span');
      zoom.className = 'case-zoom';
      zoom.innerHTML = '&#8690;';
      box.appendChild(img);
      box.appendChild(zoom);
      var cap = document.createElement('figcaption');
      cap.innerHTML = '<span>' + item.title + '</span><em>' + (item.w > item.h ? '横版实景' : (item.w === item.h ? '方形构图' : '竖版实景')) + '</em>';
      fig.appendChild(box);
      fig.appendChild(cap);
      fig.addEventListener('click', function () { openLb(i); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
      masonry.appendChild(fig);
      if (revealObserver) revealObserver.observe(fig);
    });
  }

  /* SECTION: lightbox */
  var lb = byId('lb'), lbImg = byId('lbImg'), lbTitle = byId('lbTitle'),
      lbCount = byId('lbCount'), lbMeta = byId('lbMeta'), lbIdx = 0, lastFocus = null;

  function openLb(i) {
    if (!lb || !shown.length) return;
    lastFocus = document.activeElement;
    lbIdx = i;
    paintLb();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    byId('lbClose') && byId('lbClose').focus();
  }
  function paintLb() {
    var item = shown[lbIdx];
    if (!item) return;
    lbImg.classList.remove('is-loaded');
    lbImg.style.display = '';
    mountImage(lbImg, item.medium, item.alt, true); /* 大图浏览用 2200px 中图 */
    lbTitle.textContent = item.title;
    lbCount.textContent = (lbIdx + 1) + ' / ' + shown.length;
    var s = STYLES.filter(function (x) { return x.key === item.style; })[0];
    lbMeta.textContent = item.style + ' 系列' + (s ? ' · ' + s.tagline : '') + ' · 千寻设计实景作品';
  }
  function stepLb(d) {
    if (!shown.length) return;
    lbIdx = (lbIdx + d + shown.length) % shown.length;
    paintLb();
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  if (lb) {
    byId('lbClose').addEventListener('click', closeLb);
    byId('lbPrev').addEventListener('click', function () { stepLb(-1); });
    byId('lbNext').addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') stepLb(-1);
      if (e.key === 'ArrowRight') stepLb(1);
    });
  }

  /* SECTION: reveal-observer */
  var revealObserver = null;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        var counters = en.target.querySelectorAll ? en.target.querySelectorAll('[data-count]') : [];
        Array.prototype.forEach.call(counters, function (c) {
          if (!c.dataset.done) { c.dataset.done = '1'; runCount(c); }
        });
        revealObserver.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { revealObserver.observe(el); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll('.reveal,.case'), function (el) { el.classList.add('is-in'); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* SECTION: nav-state */
  var nav = byId('nav');
  function syncNav() {
    if (!nav) return;
    nav.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.72);
  }
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  var links = byId('navLinks') ? byId('navLinks').querySelectorAll('a') : [];
  var sections = [];
  Array.prototype.forEach.call(links, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ link: a, el: el });
  });
  function syncActive() {
    var pos = window.scrollY + window.innerHeight * 0.34;
    var hit = null;
    sections.forEach(function (s) { if (s.el.offsetTop <= pos) hit = s; });
    Array.prototype.forEach.call(links, function (a) { a.classList.remove('is-active'); });
    if (hit) hit.link.classList.add('is-active');
  }
  window.addEventListener('scroll', syncActive, { passive: true });
  syncActive();

  /* SECTION: drawer */
  var drawer = byId('drawer'), burger = byId('burger');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger && burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger && burger.addEventListener('click', function () { setDrawer(true); });
  byId('drawerClose') && byId('drawerClose').addEventListener('click', function () { setDrawer(false); });
  drawer && drawer.addEventListener('click', function (e) { if (e.target.tagName === 'A') setDrawer(false); });

  /* 页脚风格链接直接切到对应分类 */
  Array.prototype.forEach.call(document.querySelectorAll('[data-style-link]'), function (a) {
    a.addEventListener('click', function () { applyFilter(a.dataset.styleLink); });
  });

  /* SECTION: init */
  buildChips();
  applyFilter('all');
  var yr = byId('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
