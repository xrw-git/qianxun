/* SECTION: app-init */
(function () {
  'use strict';
  var WORKS = window.QX_PORTFOLIO || [];
  var PROJ_META = window.QX_PROJECTS || [];
  var byId = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAIL_TO = '2841552891@qq.com';

  /* 真实项目列表：每个项目的全部图片归到同一组 */
  var PROJECTS = PROJ_META.map(function (m) {
    return {
      key: m.key, label: m.label, en: m.en,
      tagline: m.tagline, desc: m.desc, stack: m.stack,
      items: WORKS.filter(function (it) { return it.project === m.key; })
    };
  }).filter(function (p) { return p.items.length; });

  function projOf(key) {
    var p = PROJECTS.filter(function (x) { return x.key === key; })[0];
    return p || { key: key, label: key, en: 'Project', tagline: '', desc: '' };
  }

  /* 首屏轮播：指定图片（找不到时回退为每项目第一张横版图） */
  var HERO_SLUGS = ['weilan3-03', 'weilan3-09', 'haitang-05', 'yunhai1-03', 'sanya-02'];
  var heroSet = [];
  HERO_SLUGS.forEach(function (slug) {
    var it = WORKS.filter(function (x) { return x.thumb.indexOf('/' + slug + '.jpg') >= 0; })[0];
    if (it) heroSet.push(it);
  });
  if (!heroSet.length) {
    PROJECTS.forEach(function (p) {
      var it = p.items.filter(function (x) { return x.w >= x.h; })[0] || p.items[0];
      if (it && heroSet.length < 5) heroSet.push(it);
    });
  }

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
      dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 张：' + projOf(item.project).label);
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
      if (heroMeta) {
        var hp = projOf(it.project);
        heroMeta.textContent = hp.label + ' · ' + hp.tagline + ' · ' + ('0' + (heroIdx + 1)).slice(-2) + ' / ' + ('0' + heroSet.length).slice(-2);
      }
      if (manual) restartHero();
    }
    function restartHero() {
      if (heroTimer) clearInterval(heroTimer);
      if (!reduceMotion && heroSet.length > 1) heroTimer = setInterval(function () { showHero(heroIdx + 1); }, 5200);
    }
    restartHero();
    showHero(0);
  }

  /* SECTION: about-figure —— 指定图：云海听歌01 实景 01 */
  var aboutFrame = byId('aboutFrame');
  if (aboutFrame) {
    var aboutItem = WORKS.filter(function (x) { return x.thumb.indexOf('/yunhai1-01.jpg') >= 0; })[0];
    if (!aboutItem) {
      for (var ai = 0; ai < WORKS.length && !aboutItem; ai++) {
        if (WORKS[ai].h > WORKS[ai].w) aboutItem = WORKS[ai];
      }
      if (!aboutItem) aboutItem = WORKS[0];
    }
    if (aboutItem) {
      var aimg = document.createElement('img');
      mountImage(aimg, aboutItem.medium, aboutItem.alt, false);
      aboutFrame.appendChild(aimg);
    }
  }

  /* SECTION: stats */
  var STATS = [
    { k: WORKS.length, suffix: ' 组', label: '实景落地作品' },
    { k: PROJECTS.length, suffix: ' 个', label: '交付落地项目' },
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

  /* SECTION: projects
     真实项目：同一项目的图片堆叠成一张卡，点击查看该项目图集 */

  /* 堆叠层顺序：返回 底层 → 顶层。
     项目可在数据里用 stack 字段指定照片，列表第一项放最上层（最显眼）；
     未指定或图片缺失时回退为自动挑选：一张横版图放顶层，其余两张垫底。 */
  function pickLayers(p) {
    var items = p.items;
    if (p.stack && p.stack.length) {
      var picked = [];
      p.stack.forEach(function (slug) {
        var it = items.filter(function (x) { return x.thumb.indexOf('/' + slug + '.jpg') >= 0; })[0];
        if (it && picked.indexOf(it) < 0) picked.push(it);
      });
      if (picked.length) return picked.slice().reverse();
    }
    var front = items.filter(function (it) { return it.w >= it.h; })[0] || items[0];
    var rest = items.filter(function (it) { return it !== front; }).slice(0, 2);
    return rest.concat([front]);
  }

  var projGrid = byId('projGrid'), pfInfo = byId('pfInfo'),
      pfEmpty = byId('pfEmpty'), pfTotal = byId('pfTotal');
  if (pfTotal) pfTotal.textContent = WORKS.length;
  if (pfInfo) pfInfo.textContent = PROJECTS.length + ' 个项目 · 共 ' + WORKS.length + ' 组实景图片';
  if (pfEmpty) pfEmpty.style.display = PROJECTS.length ? 'none' : 'block';

  function renderProjects() {
    if (!projGrid) return;
    projGrid.innerHTML = '';
    PROJECTS.forEach(function (p, pi) {
      var btn = document.createElement('div');
      btn.className = 'proj';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.dataset.project = pi;
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-label', '查看「' + p.label + '」项目的全部 ' + p.items.length + ' 张实景图片');

      var stack = document.createElement('div');
      stack.className = 'proj-stack';
      pickLayers(p).forEach(function (item, li, arr) {
        var lay = document.createElement('div');
        lay.className = 'lay';
        var img = document.createElement('img');
        mountImage(img, item.thumb, item.alt, pi === 0 && li === arr.length - 1);
        lay.appendChild(img);
        stack.appendChild(lay);
      });
      var badge = document.createElement('span');
      badge.className = 'proj-count';
      badge.textContent = '共 ' + p.items.length + ' 张';
      stack.appendChild(badge);

      var name = document.createElement('p');
      name.className = 'proj-name';
      name.innerHTML = '<span>' + p.label + '</span><em>' + p.en + '</em>';

      var tag = document.createElement('p');
      tag.className = 'proj-tag';
      tag.textContent = p.desc || p.tagline || '';

      var go = document.createElement('p');
      go.className = 'proj-go';
      go.innerHTML = '查看项目图集<span class="arrow">&#8594;</span>';

      btn.appendChild(stack);
      btn.appendChild(name);
      btn.appendChild(tag);
      btn.appendChild(go);
      btn.addEventListener('click', function () { openGal(pi, btn); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGal(pi, btn); }
      });
      projGrid.appendChild(btn);
      if (revealObserver) revealObserver.observe(btn);
    });
  }

  /* SECTION: scroll-lock
     图集弹层与大图灯箱可叠放，滚动锁定以「任一打开」为准 */
  var lb = byId('lb'), gal = byId('gal');
  function syncScrollLock() {
    var open = (lb && lb.classList.contains('is-open')) || (gal && gal.classList.contains('is-open'));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  /* SECTION: gallery-modal */
  var galGrid = byId('galGrid'), galEyebrow = byId('galEyebrow'), galTitle = byId('galTitle'),
      galDesc = byId('galDesc'), galFoot = byId('galFoot');
  var galIdx = -1, shown = [], galLastFocus = null;

  function openGal(pi, trigger) {
    if (!gal || pi < 0 || pi >= PROJECTS.length) return;
    galLastFocus = trigger || document.activeElement;
    galIdx = pi;
    var p = PROJECTS[pi];
    shown = p.items.slice();
    if (galEyebrow) galEyebrow.textContent = 'Project · ' + p.en;
    if (galTitle) galTitle.textContent = p.label + ' · 项目图集';
    if (galDesc) galDesc.textContent = p.desc || p.tagline || '';
    if (galFoot) galFoot.textContent = p.items.length + ' 张实景图片';
    renderGalGrid(p);
    gal.classList.add('is-open');
    gal.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    byId('galClose') && byId('galClose').focus();
  }

  function renderGalGrid(p) {
    if (!galGrid) return;
    galGrid.innerHTML = '';
    p.items.forEach(function (item, i) {
      var fig = document.createElement('figure');
      fig.className = 'gal-item';
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', '查看大图：' + item.title);
      var box = document.createElement('div');
      box.className = 'gal-img';
      box.style.aspectRatio = item.w + ' / ' + item.h;
      var img = document.createElement('img');
      mountImage(img, item.thumb, item.alt, i < 4);
      var zoom = document.createElement('span');
      zoom.className = 'gal-zoom';
      zoom.innerHTML = '&#8690;';
      box.appendChild(img);
      box.appendChild(zoom);
      var cap = document.createElement('figcaption');
      cap.textContent = item.title + ' · ' + (item.w > item.h ? '横版实景' : (item.w === item.h ? '方形构图' : '竖版实景'));
      fig.appendChild(box);
      fig.appendChild(cap);
      fig.addEventListener('click', function () { openLb(i); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
      galGrid.appendChild(fig);
    });
    var body = gal ? gal.querySelector('.gal-body') : null;
    if (body) body.scrollTop = 0;
  }

  function closeGal() {
    if (!gal || !gal.classList.contains('is-open')) return;
    gal.classList.remove('is-open');
    gal.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (galLastFocus && galLastFocus.focus) galLastFocus.focus();
  }

  if (gal) {
    byId('galClose').addEventListener('click', closeGal);
    gal.addEventListener('click', function (e) { if (e.target === gal) closeGal(); });
  }

  /* SECTION: lightbox */
  var lbImg = byId('lbImg'), lbTitle = byId('lbTitle'),
      lbCount = byId('lbCount'), lbMeta = byId('lbMeta'), lbIdx = 0, lastFocus = null;

  function openLb(i) {
    if (!lb || !shown.length) return;
    lastFocus = document.activeElement;
    lbIdx = i;
    paintLb();
    lb.classList.add('is-open');
    syncScrollLock();
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
    var pj = projOf(item.project);
    lbMeta.textContent = pj.label + ' · ' + pj.tagline + ' · 千寻设计实景作品';
  }
  function stepLb(d) {
    if (!shown.length) return;
    lbIdx = (lbIdx + d + shown.length) % shown.length;
    paintLb();
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove('is-open');
    syncScrollLock();
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  if (lb) {
    byId('lbClose').addEventListener('click', closeLb);
    byId('lbPrev').addEventListener('click', function () { stepLb(-1); });
    byId('lbNext').addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
  }

  /* 键盘：灯箱打开时优先操作灯箱，否则图集弹层用 Esc 关闭 */
  document.addEventListener('keydown', function (e) {
    var lbOpen = lb && lb.classList.contains('is-open');
    if (lbOpen) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') stepLb(-1);
      if (e.key === 'ArrowRight') stepLb(1);
      return;
    }
    if (gal && gal.classList.contains('is-open') && e.key === 'Escape') closeGal();
  });

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
    Array.prototype.forEach.call(document.querySelectorAll('.reveal,.proj'), function (el) { el.classList.add('is-in'); });
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

  /* 页脚设计方向链接：滚到作品集并打开对应项目图集 */
  var footStyles = byId('footStyles');
  if (footStyles) {
    PROJECTS.forEach(function (p, pi) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="#works" data-style-link="' + p.key + '">' + p.label + ' · ' + p.items.length + ' 张</a>';
      footStyles.appendChild(li);
    });
    Array.prototype.forEach.call(footStyles.querySelectorAll('[data-style-link]'), function (a) {
      a.addEventListener('click', function () {
        var pi = PROJECTS.map(function (p) { return p.key; }).indexOf(a.dataset.styleLink);
        if (pi < 0) return;
        setTimeout(function () { openGal(pi, a); }, 420);
      });
    });
  }

  /* SECTION: init */
  renderProjects();
  var yr = byId('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
