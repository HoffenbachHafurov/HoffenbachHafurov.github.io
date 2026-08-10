/* ============================================================================
   app.js — оркестрация: вход, фильтры, темы, языки, отрисовка карточек
   ----------------------------------------------------------------------------
   Расшифрованные данные живут ТОЛЬКО в памяти вкладки. Ни localStorage, ни
   sessionStorage их не получают: иначе выручка осела бы на диске в открытом
   виде и пережила бы закрытие браузера. Плата за это — обновление страницы
   требует повторного входа. Это осознанный размен.
   ========================================================================= */

(function (global) {
  "use strict";

  var T = global.I18N.t;
  var Fmt = global.Fmt;

  /* Состояние приложения. data заполняется после успешной расшифровки. */
  var state = {
    data: null,
    page: "sales",
    filters: { period: "30", currency: null, marketplace: "all" }
  };

  function $(id) { return document.getElementById(id); }
  function el(name, cls, text) {
    var n = document.createElement(name);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ======================================================================
     Локализация разметки
     ===================================================================== */

  function applyI18n() {
    document.documentElement.lang = global.I18N.getLang();

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = T(node.getAttribute("data-i18n"));
    });

    /* data-i18n-attr="placeholder:ключ;title:другой.ключ" */
    document.querySelectorAll("[data-i18n-attr]").forEach(function (node) {
      node.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) node.setAttribute(bits[0].trim(), T(bits[1].trim()));
      });
    });
  }

  /* ======================================================================
     Переключатели языка и темы
     ===================================================================== */

  function buildLangSwitch(container) {
    if (!container) return;
    container.textContent = "";
    global.I18N.LANGS.forEach(function (lang) {
      var btn = el("button", "segmented__item", global.I18N.NATIVE_NAMES[lang]);
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(lang === global.I18N.getLang()));
      btn.addEventListener("click", function () {
        global.I18N.setLang(lang);
        applyI18n();
        buildLangSwitch($("login-lang"));
        buildLangSwitch($("app-lang"));
        buildThemeSwitch($("login-theme"));
        buildThemeSwitch($("app-theme"));
        /* Форматы чисел и дат зависят от локали — карточки и меню
           нужно пересобрать целиком */
        if (state.data) {
          buildFilters();
          buildSidebar();
          navigate(state.page);
        }
      });
      container.appendChild(btn);
    });
  }

  var THEMES = [
    { id: "light", key: "nav.themeLight" },
    { id: "dark", key: "nav.themeDark" },
    { id: "system", key: "nav.themeSystem" }
  ];

  function currentThemePref() {
    return document.documentElement.getAttribute("data-theme-pref") || "system";
  }

  function setTheme(pref) {
    document.documentElement.setAttribute("data-theme-pref", pref);
    if (pref === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", pref);
    }
    try { global.localStorage.setItem("dashboard.theme", pref); } catch (e) {}
  }

  function buildThemeSwitch(container) {
    if (!container) return;
    container.textContent = "";
    THEMES.forEach(function (theme) {
      var btn = el("button", "segmented__item", T(theme.key));
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(theme.id === currentThemePref()));
      btn.addEventListener("click", function () {
        setTheme(theme.id);
        buildThemeSwitch($("login-theme"));
        buildThemeSwitch($("app-theme"));
      });
      container.appendChild(btn);
    });
  }

  /* ======================================================================
     Разделы CRM: реестр, боковое меню, переходы
     ----------------------------------------------------------------------
     Пункты меню описаны данными, а не разметкой: заголовки берутся из i18n,
     поэтому при смене языка меню перестраивается само, а добавление раздела
     сводится к одной строке в этом списке.
     ===================================================================== */

  /* Иконки — линейный SVG, 18×18, толщина 1.7. Рисуем через createElementNS:
     innerHTML для SVG здесь не нужен, а строковая сборка разметки — плохая
     привычка в коде, который рядом печатает данные из API. */
  var ICONS = {
    chart: "M4 19V6M9 19V10M14 19V13M19 19V8|M3 21h18",
    grid: "M4 6h7v6H4zM13 6h7v4h-7zM13 14h7v4h-7zM4 16h7v3H4z",
    box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
    cart: "M4 5h2l2.2 9.5a2 2 0 002 1.5h6.6a2 2 0 002-1.6L21 8H7|M9 20h.01M17 20h.01",
    back: "M4 12a8 8 0 108-8|M4 12l3-3M4 12l3 3",
    gear: "M12 15a3 3 0 100-6 3 3 0 000 6z|M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.3 1a7 7 0 00-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 00-2 1.2l-2.3-1-2 3.5 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.3-1a7 7 0 002 1.2l.4 2.6h4.4l.4-2.6a7 7 0 002-1.2l2.3 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"
  };

  function iconSvg(name) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "navlink__icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    (ICONS[name] || ICONS.grid).split("|").forEach(function (d) {
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.7");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
    });
    return svg;
  }

  /* ready:false — раздел показывается в меню, но открывает заглушку.
     Показывать будущие разделы полезно: видно, куда движется продукт. */
  var NAV = [
    {
      group: "nav.analytics",
      items: [
        { id: "sales", label: "page.salesAnalysis", icon: "chart", ready: true },
        { id: "overview", label: "page.overview", icon: "grid", ready: true }
      ]
    },
    {
      group: "nav.catalog",
      items: [
        { id: "products", label: "page.products", icon: "box", ready: false },
        { id: "inventory", label: "page.inventory", icon: "layers", ready: false }
      ]
    },
    {
      group: "nav.operations",
      items: [
        { id: "orders", label: "page.orders", icon: "cart", ready: false },
        { id: "returns", label: "page.returns", icon: "back", ready: false }
      ]
    },
    {
      group: "nav.system",
      items: [
        { id: "settings", label: "page.settings", icon: "gear", ready: false }
      ]
    }
  ];

  function findNavItem(id) {
    for (var g = 0; g < NAV.length; g++) {
      for (var i = 0; i < NAV[g].items.length; i++) {
        if (NAV[g].items[i].id === id) return NAV[g].items[i];
      }
    }
    return null;
  }

  function buildSidebar() {
    var nav = $("sidebar-nav");
    nav.textContent = "";

    NAV.forEach(function (group) {
      var section = el("div", "navgroup");
      section.appendChild(el("div", "navgroup__label", T(group.group)));

      var list = el("ul", "navgroup__list");
      group.items.forEach(function (item) {
        var li = el("li");
        var link = el("button", "navlink");
        link.type = "button";
        link.dataset.page = item.id;
        link.appendChild(iconSvg(item.icon));
        link.appendChild(el("span", "navlink__text", T(item.label)));
        if (!item.ready) {
          link.appendChild(el("span", "navlink__badge", T("page.soon")));
        }
        if (item.id === state.page) link.setAttribute("aria-current", "page");
        link.addEventListener("click", function () {
          navigate(item.id);
          closeSidebar();
        });
        li.appendChild(link);
        list.appendChild(li);
      });

      section.appendChild(list);
      nav.appendChild(section);
    });
  }

  var PAGE_NODES = ["page-sales", "page-overview", "page-placeholder"];

  function navigate(pageId) {
    var item = findNavItem(pageId);
    if (!item) { pageId = "sales"; item = findNavItem(pageId); }
    state.page = pageId;

    try { global.location.hash = "#/" + pageId; } catch (e) { }

    $("page-title").textContent = T(item.label);
    document.title = T(item.label) + " · " + T("app.title");

    PAGE_NODES.forEach(function (id) { $(id).hidden = true; });

    /* Фильтры относятся только к разделам с данными. На заглушке они
       вводили бы в заблуждение — там нечего фильтровать. */
    var dataPage = item.ready && state.data;
    $("filters").hidden = !dataPage;

    if (!item.ready) {
      $("placeholder-title").textContent = T(item.label);
      $("page-placeholder").hidden = false;
      $("empty-state").hidden = true;
    } else {
      render();
    }

    document.querySelectorAll(".navlink").forEach(function (link) {
      if (link.dataset.page === pageId) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function pageFromHash() {
    var raw = String(global.location.hash || "").replace(/^#\/?/, "");
    return findNavItem(raw) ? raw : "sales";
  }

  /* --- Выдвижное меню на узком экране --- */

  function openSidebar() {
    $("sidebar").classList.add("is-open");
    $("menu-toggle").setAttribute("aria-expanded", "true");
    if (!$("scrim")) {
      var scrim = el("div", "scrim");
      scrim.id = "scrim";
      scrim.addEventListener("click", closeSidebar);
      document.body.appendChild(scrim);
    }
  }

  function closeSidebar() {
    $("sidebar").classList.remove("is-open");
    $("menu-toggle").setAttribute("aria-expanded", "false");
    var scrim = $("scrim");
    if (scrim) scrim.remove();
  }

  /* ======================================================================
     Вход
     ===================================================================== */

  function showLoginError(message) {
    var box = $("login-error");
    $("login-error-text").textContent = message;
    box.hidden = false;
  }

  function clearLoginError() {
    $("login-error").hidden = true;
  }

  function setBusy(busy) {
    $("login-submit").disabled = busy;
    $("login-spinner").hidden = !busy;
    $("login-submit-text").textContent = busy ? T("login.working") : T("login.submit");
  }

  function errorMessage(err) {
    var code = err && err.message;
    if (code === "BAD_CREDENTIALS") return T("error.badCredentials");
    if (code === "NO_WEBCRYPTO") return T("error.noCrypto");
    if (code === "NO_GZIP_SUPPORT") return T("error.noGzip");
    if (code === "BAD_PAYLOAD" || code === "UNSUPPORTED_KDF") return T("error.badPayload");
    return T("error.generic");
  }

  function handleLogin(event) {
    event.preventDefault();
    clearLoginError();

    var payload = global.DASHBOARD_PAYLOAD;
    if (global.__DASHBOARD_MISSING__ || !payload) {
      showLoginError(T("error.noData"));
      return;
    }
    if (!global.Vault.hasWebCrypto()) {
      showLoginError(T("error.noCrypto"));
      return;
    }

    var user = $("login-user").value;
    var pass = $("login-password").value;

    setBusy(true);
    /* Пауза в один кадр, иначе индикатор не успевает отрисоваться:
       PBKDF2 на 600 000 итераций держит поток заметное время. */
    global.requestAnimationFrame(function () {
      global.Vault.decrypt(payload, user, pass)
        .then(function (data) {
          state.data = data;
          $("login-password").value = "";
          setBusy(false);
          enterApp();
        })
        .catch(function (err) {
          setBusy(false);
          showLoginError(errorMessage(err));
          $("login-password").select();
        });
    });
  }

  function enterApp() {
    $("login-view").hidden = true;
    $("app-view").hidden = false;

    var meta = (state.data && state.data.meta) || {};
    $("sidebar-store").textContent = meta.storefront || "";
    $("updated-at").textContent = meta.generatedAt
      ? T("nav.updated") + ": " + Fmt.dateTime(meta.generatedAt)
      : "";

    buildFilters();
    buildSidebar();
    navigate(pageFromHash());
  }

  /* ======================================================================
     Колокольчик синхронизаций
     ----------------------------------------------------------------------
     Журнал (data/runs.js) не зашифрован и грузится независимо от входа,
     поэтому колокольчик работает и тогда, когда выгрузка сломалась.
     ===================================================================== */

  function refreshSyncBell() {
    var bell = $("sync-bell");
    if (!bell || !global.Runs) return;

    var s = global.Runs.summary();
    var dot = $("sync-dot");

    /* Точка — только про беду: последний прогон упал или данные протухли.
       Значок «всё хорошо» на колокольчике был бы шумом. */
    if (dot) dot.hidden = !s.alert;
    bell.classList.toggle("bell--alert", !!s.alert);

    var label = T("sync.title");
    if (s.last) label += ": " + global.Runs.statusText(s.last.status) + ", " + global.Runs.when(s.last.startedAt);
    bell.setAttribute("aria-label", label);
    bell.setAttribute("title", label);

    var sched = $("sync-schedule");
    if (sched) {
      var integ = global.Runs.integration();
      sched.textContent = (integ ? integ.name + " · " : "") + T("sync.every5h");
    }
  }

  function wireSyncBell() {
    var bell = $("sync-bell");
    var modal = $("sync-modal");
    if (!bell || !modal) return;

    refreshSyncBell();

    bell.addEventListener("click", function () {
      global.Runs.renderList($("sync-list"), 6);
      refreshSyncBell();
      /* showModal даёт фокус-ловушку, Esc и подложку без своего кода */
      if (typeof modal.showModal === "function") { modal.showModal(); }
      else { modal.setAttribute("open", ""); }
    });

    $("sync-close").addEventListener("click", function () { modal.close(); });

    /* Клик по подложке за пределами карточки закрывает окно */
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
  }

  function signOut() {
    /* Данные выбрасываем из памяти. Перезайти можно только с паролем. */
    state.data = null;
    skuCache = null;
    global.Charts.hideTip();
    $("app-view").hidden = true;
    $("login-view").hidden = false;
    $("login-password").value = "";
    $("login-user").focus();
  }

  /* ======================================================================
     Работа с данными
     ===================================================================== */

  function rows() {
    return (state.data && state.data.days) || [];
  }

  /* Раздел обзора работает с полями sku/units/revenue. Отдельного массива
     skus в данных больше нет — он был точной копией economics.products и
     удваивал вес файла. Приводим форму на лету и кэшируем: render()
     обращается сюда несколько раз за проход. */
  var skuCache = null;

  function skuRows() {
    var d = state.data;
    if (!d) return [];
    if (d.skus && d.skus.length) return d.skus;
    if (skuCache) return skuCache;
    /* Подпись товара — ASIN: он узнаётся, ищется на Amazon и одинаков во всех
       витринах. MSKU остаётся рядом как внутренний код продавца. */
    skuCache = ecoProducts().map(function (r) {
      return {
        date: r.date, sku: r.asin || r.msku, msku: r.msku,
        name: r.name || r.asin || r.msku,
        marketplace: r.marketplace, currency: r.currency,
        units: r.unitsOrdered, revenue: r.orderedSales
      };
    });
    return skuCache;
  }

  /* Периоды отсчитываются от последней даты В ДАННЫХ, а не от сегодняшнего дня:
     выгрузка может быть вчерашней, и «последние 30 дней» от сегодня дали бы
     пустой экран. */
  function maxDate(list) {
    var max = null;
    list.forEach(function (r) {
      if (!r.date) return;
      if (max === null || r.date > max) max = r.date;
    });
    return max;
  }

  function shiftDays(isoDate, days) {
    var d = Fmt.parseDate(isoDate);
    if (!d) return null;
    var copy = new Date(d.getTime());
    copy.setUTCDate(copy.getUTCDate() + days);
    return copy.toISOString().slice(0, 10);
  }

  var PERIODS = [
    { id: "7", key: "filter.period7", days: 7 },
    { id: "30", key: "filter.period30", days: 30 },
    { id: "90", key: "filter.period90", days: 90 },
    { id: "ytd", key: "filter.periodYtd", days: null },
    { id: "all", key: "filter.periodAll", days: null }
  ];

  /* Границы периода считаются по тому набору строк, который рисует раздел:
     у обзора и у анализа продаж источники разные и последняя дата может
     отличаться (комиссии приходят с задержкой до двух суток). */
  function periodBounds(list) {
    var last = maxDate(list || rows());
    if (!last) return { from: null, to: null, prevFrom: null, prevTo: null };

    var id = state.filters.period;
    if (id === "all") return { from: null, to: last, prevFrom: null, prevTo: null };
    if (id === "ytd") {
      var from = last.slice(0, 4) + "-01-01";
      return { from: from, to: last, prevFrom: null, prevTo: null };
    }
    var span = PERIODS.filter(function (p) { return p.id === id; })[0];
    var days = (span && span.days) || 30;
    var start = shiftDays(last, -(days - 1));
    return {
      from: start,
      to: last,
      prevFrom: shiftDays(start, -days),
      prevTo: shiftDays(start, -1)
    };
  }

  function matches(row, from, to) {
    if (from && row.date < from) return false;
    if (to && row.date > to) return false;
    /* Фильтра по валюте больше нет: конвейер приводит все суммы к евро
       по курсам ЕЦБ, поэтому складывать их можно без оговорок. */
    if (state.filters.marketplace !== "all" && row.marketplace !== state.filters.marketplace) {
      return false;
    }
    return true;
  }

  function slice(list, from, to) {
    return list.filter(function (r) { return matches(r, from, to); });
  }

  function sum(list, field) {
    return list.reduce(function (acc, r) { return acc + (Number(r[field]) || 0); }, 0);
  }

  /* Свод по дате: на графике должен быть непрерывный ряд, иначе пропуски
     молча искажают форму линии */
  function byDate(list, field, from, to) {
    var map = {};
    list.forEach(function (r) {
      map[r.date] = (map[r.date] || 0) + (Number(r[field]) || 0);
    });
    var dates = Object.keys(map).sort();
    if (from && to) {
      dates = [];
      var cursor = from;
      var guard = 0;
      while (cursor <= to && guard < 2000) {
        dates.push(cursor);
        cursor = shiftDays(cursor, 1);
        guard++;
      }
    }
    return {
      labels: dates,
      values: dates.map(function (d) { return map[d] || 0; })
    };
  }

  /* Валюта отображения одна на весь дашборд: конвейер сводит суммы к евро
     по курсам ЕЦБ. Берём её из payload, а не хардкодим — если источник
     когда-нибудь сменит базу, интерфейс поедет за ним. */
  function displayCurrency() {
    return (state.data && state.data.meta && state.data.meta.defaultCurrency) || "EUR";
  }

  function marketplaceName(id) {
    var list = (state.data && state.data.marketplaces) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i].name || id;
    }
    return id;
  }

  /* Более восьми категорий цветом не кодируются: хвост сворачивается
     в «Прочее», а не получает девятый выдуманный тон. */
  function topSegments(list, field, limit) {
    var map = {};
    list.forEach(function (r) {
      map[r.marketplace] = (map[r.marketplace] || 0) + (Number(r[field]) || 0);
    });
    var entries = Object.keys(map)
      .map(function (id) { return { id: id, label: marketplaceName(id), value: map[id] }; })
      .filter(function (e) { return e.value > 0; })
      .sort(function (a, b) { return b.value - a.value; });

    if (entries.length <= limit) return entries;
    var head = entries.slice(0, limit - 1);
    var tail = entries.slice(limit - 1);
    head.push({
      id: "__other__",
      label: T("filter.all") === "Все" ? "Прочее" : "Other",
      value: tail.reduce(function (a, e) { return a + e.value; }, 0),
      color: "var(--series-other)"
    });
    return head;
  }

  /* ======================================================================
     Фильтры
     ===================================================================== */

  function buildFilters() {
    var periodSel = $("filter-period");
    periodSel.textContent = "";
    PERIODS.forEach(function (p) {
      var opt = el("option", null, T(p.key));
      opt.value = p.id;
      if (p.id === state.filters.period) opt.selected = true;
      periodSel.appendChild(opt);
    });

    /* Список витрин собирается из обоих источников: обзор берёт данные
       из отчёта по заказам, анализ продаж — из Data Kiosk, и набор
       маркетплейсов у них может не совпадать. */
    var sources = rows().concat(ecoDays());

    /* Переключателя валют больше нет. Конвейер приводит все суммы к евро
       по курсам ЕЦБ, поэтому валюта на дашборде ровно одна. */
    state.filters.currency = null;

    /* Курс — часть данных, а не украшение: по нему пересчитана каждая сумма
       на экране, и читатель вправе видеть, какой именно и на какую дату. */
    var fxNote = $("fx-note");
    var fx = state.data && state.data.meta && state.data.meta.fx;
    if (fxNote) {
      if (fx && fx.rates && fx.rates.length) {
        var pairs = fx.rates
          .filter(function (r) { return r.currency !== "EUR"; })
          .map(function (r) { return r.currency + " " + Fmt.number(r.perEur, 4); });
        fxNote.textContent = pairs.length
          ? T("filter.fxOn") + " " + Fmt.date(fx.date) + ": 1 € = " + pairs.join(", ")
          : "";
      } else {
        fxNote.textContent = "";
      }
    }

    var marketSel = $("filter-marketplace");
    marketSel.textContent = "";
    var allOpt = el("option", null, T("filter.all"));
    allOpt.value = "all";
    marketSel.appendChild(allOpt);
    var seen = {};
    sources.forEach(function (r) { if (r.marketplace) seen[r.marketplace] = true; });
    Object.keys(seen).sort().forEach(function (id) {
      var opt = el("option", null, marketplaceName(id));
      opt.value = id;
      if (id === state.filters.marketplace) opt.selected = true;
      marketSel.appendChild(opt);
    });
    marketSel.value = state.filters.marketplace;
  }

  function onFilterChange() {
    state.filters.period = $("filter-period").value;
    state.filters.marketplace = $("filter-marketplace").value;
    render();
  }

  /* ======================================================================
     Плитки показателей
     ===================================================================== */

  function renderStat(node, opts) {
    node.textContent = "";
    node.appendChild(el("div", "stat__label", opts.label));

    var row = el("div", "stat__row");
    row.appendChild(el("div", "stat__value", opts.value));

    if (opts.delta != null && isFinite(opts.delta)) {
      var dir = opts.delta > 0.0005 ? "up" : opts.delta < -0.0005 ? "down" : "flat";
      var badge = el("span", "stat__delta stat__delta--" + dir);
      /* Направление подкреплено стрелкой, а не только цветом */
      badge.appendChild(el("span", null, dir === "up" ? "▲" : dir === "down" ? "▼" : "—"));
      badge.appendChild(el("span", null, Fmt.delta(opts.delta)));
      row.appendChild(badge);
      row.appendChild(el("span", "stat__period", T("kpi.vsPrev")));
    }
    node.appendChild(row);

    /* Пояснение под значением: нужно, когда величина не «ноль», а «неизвестна».
       Без него прочерк выглядит поломкой, а не честным «данных нет». */
    if (opts.note) {
      node.appendChild(el("div", "stat__note", opts.note));
    }

    /* Метр доли — приём из карточек 21st: значение плюс полоска, показывающая
       его вес в целом. Заполняет карточку-героя смыслом, а не пустотой. */
    if (opts.meter && isFinite(opts.meter.value)) {
      var share = Math.max(0, Math.min(1, opts.meter.value));
      var meter = el("div", "stat__meter");
      var head = el("div", "stat__meter-head");
      head.appendChild(el("span", "stat__meter-label", opts.meter.label));
      head.appendChild(el("span", "stat__meter-value", Fmt.percent(share)));
      meter.appendChild(head);
      var track = el("div", "stat__meter-track");
      track.setAttribute("role", "img");
      track.setAttribute("aria-label", opts.meter.label + ": " + Fmt.percent(share));
      var fill = el("div", "stat__meter-fill");
      fill.style.width = (share * 100).toFixed(1) + "%";
      track.appendChild(fill);
      meter.appendChild(track);
      node.appendChild(meter);
    }

    if (opts.spark && opts.spark.length > 1) {
      var holder = el("div", "stat__spark");
      node.appendChild(holder);
      global.Charts.sparkline(holder, {
        points: opts.spark,
        color: "var(--series-other)",
        accent: "var(--series-1)",
        height: opts.hero ? 72 : 30
      });
    }
  }

  function growth(now, before) {
    if (!isFinite(before) || before === 0) return null;
    return (now - before) / before;
  }

  /* ======================================================================
     Отрисовка
     ===================================================================== */

  /* Диспетчер: рисуем только активный раздел. Перерисовывать скрытые
     страницы бессмысленно — их ширина равна нулю, и графики построились бы
     по неверным размерам. */
  function render() {
    if (state.page === "sales") { renderSales(); return; }
    renderOverview();
  }

  function renderOverview() {
    var bounds = periodBounds();
    var current = slice(rows(), bounds.from, bounds.to);
    var previous = bounds.prevFrom ? slice(rows(), bounds.prevFrom, bounds.prevTo) : [];

    var hasData = rows().length > 0;
    $("empty-state").hidden = hasData;
    $("page-overview").hidden = !hasData;
    if (!hasData) return;

    var currency = displayCurrency();

    /* ---- Показатели ---- */
    var revenue = sum(current, "revenue");
    var units = sum(current, "units");
    /* Data Kiosk отдаёт штуки, но не число заказов — в строках там null.
       Ноль здесь был бы враньём: он читается как «заказов не было», хотя
       на деле величина просто неизвестна. Отличаем «нет данных» от нуля. */
    var hasOrders = current.some(function (r) { return r.orders != null; });
    var orders = hasOrders ? sum(current, "orders") : null;
    var avg = (hasOrders && orders > 0) ? revenue / orders : null;

    var prevRevenue = sum(previous, "revenue");
    var prevUnits = sum(previous, "units");
    var hasPrevOrders = previous.some(function (r) { return r.orders != null; });
    var prevOrders = hasPrevOrders ? sum(previous, "orders") : null;
    var prevAvg = (hasPrevOrders && prevOrders > 0) ? prevRevenue / prevOrders : null;

    var revSeries = byDate(current, "revenue", bounds.from, bounds.to);
    var unitSeries = byDate(current, "units", bounds.from, bounds.to);

    function tail(values, n) {
      return values.slice(Math.max(0, values.length - n));
    }

    renderStat($("kpi-revenue"), {
      label: T("kpi.revenue"),
      value: Fmt.money(revenue, currency),
      delta: growth(revenue, prevRevenue),
      spark: tail(revSeries.values, 14),
      hero: true
    });
    renderStat($("kpi-units"), {
      label: T("kpi.units"),
      value: Fmt.number(units),
      delta: growth(units, prevUnits),
      spark: tail(unitSeries.values, 12)
    });
    var orderSeries = byDate(current, "orders", bounds.from, bounds.to);
    renderStat($("kpi-orders"), {
      label: T("kpi.orders"),
      /* Fmt.number(null) сам вернёт прочерк. Спарклайн из пустой серии
         рисовал бы прямую по нулям — тоже не показываем. */
      value: Fmt.number(orders),
      delta: hasOrders ? growth(orders, prevOrders) : null,
      spark: hasOrders ? tail(orderSeries.values, 12) : null,
      note: hasOrders ? null : T("kpi.ordersUnavailable")
    });
    renderStat($("kpi-avg"), {
      label: T("kpi.avgOrder"),
      value: Fmt.money(avg, currency, 2),
      delta: (hasOrders && hasPrevOrders) ? growth(avg, prevAvg) : null,
      note: hasOrders ? null : T("kpi.ordersUnavailable")
    });

    var activeSkus = {};
    skuRows().forEach(function (r) {
      if (matches(r, bounds.from, bounds.to) && (Number(r.units) || 0) > 0) {
        activeSkus[r.sku] = true;
      }
    });
    renderStat($("kpi-skus"), {
      label: T("kpi.skus"),
      value: Fmt.number(Object.keys(activeSkus).length)
    });

    /* ---- Выручка по дням ---- */
    $("revenue-range").textContent = bounds.from
      ? Fmt.date(bounds.from) + " — " + Fmt.date(bounds.to)
      : Fmt.date(bounds.to);

    global.Charts.line($("chart-revenue"), {
      labels: revSeries.labels,
      series: [{ name: T("kpi.revenue"), values: revSeries.values }],
      formatY: function (v, axis) {
        return axis ? Fmt.moneyCompact(v, currency) : Fmt.money(v, currency, 2);
      },
      formatX: function (d, full) { return full ? Fmt.date(d) : Fmt.dateShort(d); },
      ariaLabel: T("chart.revenueOverTime"),
      height: 250
    });
    global.Charts.table($("table-revenue"), {
      caption: T("chart.revenueOverTime"),
      columns: [
        { label: T("table.date") },
        { label: T("table.revenue"), numeric: true }
      ],
      rows: revSeries.labels.map(function (d, i) {
        return [Fmt.date(d), Fmt.money(revSeries.values[i], currency, 2)];
      }),
      footRow: [T("table.total"), Fmt.money(revenue, currency, 2)]
    });

    /* ---- Штуки по дням ---- */
    global.Charts.line($("chart-units"), {
      labels: unitSeries.labels,
      series: [{ name: T("kpi.units"), values: unitSeries.values, color: "var(--series-3)" }],
      formatY: function (v, axis) { return axis ? Fmt.compact(v) : Fmt.number(v); },
      formatX: function (d, full) { return full ? Fmt.date(d) : Fmt.dateShort(d); },
      ariaLabel: T("chart.unitsOverTime"),
      height: 200
    });
    global.Charts.table($("table-units"), {
      caption: T("chart.unitsOverTime"),
      columns: [
        { label: T("table.date") },
        { label: T("table.units"), numeric: true }
      ],
      rows: unitSeries.labels.map(function (d, i) {
        return [Fmt.date(d), Fmt.number(unitSeries.values[i])];
      }),
      footRow: [T("table.total"), Fmt.number(units)]
    });

    /* ---- Доли витрин ---- */
    var segments = topSegments(current, "revenue", 7);
    var segTotal = segments.reduce(function (a, s) { return a + s.value; }, 0);
    global.Charts.stackedBar($("chart-marketplace"), {
      segments: segments,
      formatValue: function (v) { return Fmt.money(v, currency); },
      valueName: T("table.revenue"),
      shareName: T("table.share"),
      ariaLabel: T("chart.byMarketplace")
    });
    global.Charts.legend($("legend-marketplace"), segments.map(function (s) {
      return { label: s.label, color: s.color };
    }), "rect");
    global.Charts.table($("table-marketplace"), {
      caption: T("chart.byMarketplace"),
      columns: [
        { label: T("table.marketplace") },
        { label: T("table.revenue"), numeric: true },
        { label: T("table.share"), numeric: true }
      ],
      rows: segments.map(function (s, i) {
        return [
          { text: s.label, color: global.Charts.seriesColor(i, s.color) },
          Fmt.money(s.value, currency, 2),
          segTotal ? Fmt.percent(s.value / segTotal) : "—"
        ];
      }),
      footRow: [T("table.total"), Fmt.money(segTotal, currency, 2), ""]
    });

    /* ---- Топ товаров ---- */
    var skuMap = {};
    skuRows().forEach(function (r) {
      if (!matches(r, bounds.from, bounds.to)) return;
      var key = r.sku;
      if (!skuMap[key]) skuMap[key] = { sku: key, name: r.name || key, units: 0, revenue: 0 };
      skuMap[key].units += Number(r.units) || 0;
      skuMap[key].revenue += Number(r.revenue) || 0;
    });
    var topSkus = Object.keys(skuMap)
      .map(function (k) { return skuMap[k]; })
      .sort(function (a, b) { return b.units - a.units; })
      .slice(0, 10);

    global.Charts.barsH($("chart-skus"), {
      items: topSkus.map(function (s) {
        /* Полное имя отдаём как есть: график обрежет его по фактически
           доступной ширине, а целиком оно останется в подсказке и таблице */
        return { label: s.name, value: s.units };
      }),
      formatValue: function (v) { return Fmt.number(v); },
      valueName: T("table.units"),
      color: "var(--series-1)",
      ariaLabel: T("chart.topSkus")
    });
    global.Charts.table($("table-skus"), {
      caption: T("chart.topSkus"),
      columns: [
        { label: T("table.asin") },
        { label: T("table.product") },
        { label: T("table.units"), numeric: true },
        { label: T("table.revenue"), numeric: true }
      ],
      rows: topSkus.map(function (s) {
        return [s.sku, s.name, Fmt.number(s.units), Fmt.money(s.revenue, currency, 2)];
      })
    });
  }

  /* ======================================================================
     Раздел «Анализ продаж»
     ----------------------------------------------------------------------
     Источник — датасет Data Kiosk analytics_economics: продажи и комиссии
     приходят из одной агрегации, поэтому выручка и расходы гарантированно
     сходятся между собой.

     Знак сумм. Amazon отдаёт комиссии отрицательными числами. В плитках и
     на графиках показываем модуль (расход как положительная величина), но
     чистый доход берём как есть — он уже посчитан с учётом знаков.
     ===================================================================== */

  function economics() {
    return (state.data && state.data.economics) || null;
  }

  function ecoDays() { var e = economics(); return (e && e.days) || []; }
  function ecoFees() { var e = economics(); return (e && e.feeDays) || []; }
  function ecoProducts() { var e = economics(); return (e && e.products) || []; }

  /* Больше восьми категорий цветом не кодируются: хвост сворачивается
     в «Прочее», а не получает девятый выдуманный тон. */
  function foldTail(entries, limit) {
    var sorted = entries.slice().sort(function (a, b) { return b.value - a.value; });
    if (sorted.length <= limit) return sorted;
    var head = sorted.slice(0, limit - 1);
    var tail = sorted.slice(limit - 1);
    head.push({
      id: "__other__",
      label: T("filter.all") === "Все" ? "Прочее" : T("filter.all") === "Усі" ? "Інше" : "Other",
      value: tail.reduce(function (a, e) { return a + e.value; }, 0),
      color: "var(--series-other)"
    });
    return head;
  }

  function renderSales() {
    var days = ecoDays();
    var hasData = days.length > 0;
    $("empty-state").hidden = hasData;
    $("page-sales").hidden = !hasData;
    if (!hasData) return;

    var bounds = periodBounds(days);
    var currency = displayCurrency();

    var current = days.filter(function (r) { return matches(r, bounds.from, bounds.to); });
    var previous = bounds.prevFrom
      ? days.filter(function (r) { return matches(r, bounds.prevFrom, bounds.prevTo); })
      : [];

    /* ---- Показатели ---- */
    var revenue = sum(current, "orderedSales");
    var refunds = Math.abs(sum(current, "refundedSales"));
    var feesTotal = Math.abs(sum(current, "fees")) + Math.abs(sum(current, "ads"));
    var net = sum(current, "netProceeds");
    var feeShare = revenue > 0 ? feesTotal / revenue : null;

    var prevRevenue = sum(previous, "orderedSales");
    var prevNet = sum(previous, "netProceeds");
    var prevFees = Math.abs(sum(previous, "fees")) + Math.abs(sum(previous, "ads"));
    var prevRefunds = Math.abs(sum(previous, "refundedSales"));

    var revSeries = byDate(current, "orderedSales", bounds.from, bounds.to);
    var netSeries = byDate(current, "netProceeds", bounds.from, bounds.to);

    function tail(values, n) { return values.slice(Math.max(0, values.length - n)); }

    renderStat($("s-kpi-net"), {
      label: T("kpi.netProceeds"),
      value: Fmt.money(net, currency),
      delta: growth(net, prevNet),
      spark: tail(netSeries.values, 14),
      meter: revenue > 0 ? { value: net / revenue, label: T("kpi.margin") } : null,
      hero: true
    });
    renderStat($("s-kpi-revenue"), {
      label: T("kpi.revenue"),
      value: Fmt.money(revenue, currency),
      delta: growth(revenue, prevRevenue),
      spark: tail(revSeries.values, 12)
    });
    renderStat($("s-kpi-fees"), {
      label: T("kpi.fees"),
      value: Fmt.money(feesTotal, currency),
      /* Рост расходов — это плохо, поэтому знак дельты переворачиваем:
         иначе «+12%» подсветилось бы зелёным как достижение. */
      delta: growth(feesTotal, prevFees) == null ? null : -growth(feesTotal, prevFees)
    });
    renderStat($("s-kpi-feeshare"), {
      label: T("kpi.feeShare"),
      value: feeShare == null ? "—" : Fmt.percent(feeShare)
    });
    renderStat($("s-kpi-refunds"), {
      label: T("kpi.refunds"),
      value: Fmt.money(refunds, currency),
      delta: growth(refunds, prevRefunds) == null ? null : -growth(refunds, prevRefunds)
    });

    /* ---- Выручка и чистый доход: две серии, одна шкала ---- */
    $("s-trend-range").textContent = bounds.from
      ? Fmt.date(bounds.from) + " — " + Fmt.date(bounds.to)
      : Fmt.date(bounds.to);

    var trendSeries = [
      { name: T("kpi.revenue"), values: revSeries.values },
      { name: T("kpi.netProceeds"), values: netSeries.values, color: "var(--series-3)" }
    ];
    global.Charts.line($("chart-s-trend"), {
      labels: revSeries.labels,
      series: trendSeries,
      formatY: function (v, axis) {
        return axis ? Fmt.moneyCompact(v, currency) : Fmt.money(v, currency, 2);
      },
      formatX: function (d, full) { return full ? Fmt.date(d) : Fmt.dateShort(d); },
      ariaLabel: T("chart.revenueVsNet"),
      height: 250
    });
    /* Две серии — легенда обязательна: цвет в одиночку идентичность не несёт */
    global.Charts.legend($("legend-s-trend"), [
      { label: T("kpi.revenue") },
      { label: T("kpi.netProceeds"), color: "var(--series-3)" }
    ], "line");
    global.Charts.table($("table-s-trend"), {
      caption: T("chart.revenueVsNet"),
      columns: [
        { label: T("table.date") },
        { label: T("kpi.revenue"), numeric: true },
        { label: T("table.netProceeds"), numeric: true }
      ],
      rows: revSeries.labels.map(function (d, i) {
        return [Fmt.date(d), Fmt.money(revSeries.values[i], currency, 2),
                Fmt.money(netSeries.values[i], currency, 2)];
      }),
      footRow: [T("table.total"), Fmt.money(revenue, currency, 2), Fmt.money(net, currency, 2)]
    });

    /* ---- Комиссии по типам ---- */
    var feeRows = ecoFees().filter(function (r) { return matches(r, bounds.from, bounds.to); });
    var feeMap = {};
    feeRows.forEach(function (r) {
      var key = r.feeType || "—";
      /* Знак сохраняем. В Data Kiosk (analytics_economics) СПИСАНИЯ приходят
         ПОЛОЖИТЕЛЬНЫМИ, а возвраты денег продавцу — отрицательными:
         FbaFulfilmentFee +966 657, FBAInventoryReimbursement −8 674.
         Проверяется тождеством netProceeds = netSales − fees − ads,
         которое сходится копейка в копейку только при таком знаке.
         Брать модуль нельзя: возмещение попадёт в расходы и завысит их. */
      feeMap[key] = (feeMap[key] || 0) + (Number(r.amount) || 0);
    });

    var feeSigned = Object.keys(feeMap).map(function (k) {
      return { id: k, label: k, signed: feeMap[k] };
    });
    /* Расходы — положительные суммы. Возмещения (отрицательные) идут отдельной
       строкой в таблице и в структуру расходов не попадают: часть-целое из
       смеси плюсов и минусов не строится. */
    var feeEntries = feeSigned.filter(function (e) { return e.signed > 0; })
      .map(function (e) { return { id: e.id, label: e.label, value: e.signed }; });
    var creditEntries = feeSigned.filter(function (e) { return e.signed < 0; })
      .map(function (e) { return { id: e.id, label: e.label, value: -e.signed }; })
      .sort(function (a, b) { return b.value - a.value; });

    var feeSegments = foldTail(feeEntries, 7);
    var feeSum = feeEntries.reduce(function (a, e) { return a + e.value; }, 0);

    global.Charts.stackedBar($("chart-s-mix"), {
      segments: feeSegments,
      formatValue: function (v) { return Fmt.money(v, currency); },
      valueName: T("table.amount"),
      shareName: T("table.share"),
      ariaLabel: T("chart.feeMix")
    });
    global.Charts.legend($("legend-s-mix"), feeSegments.map(function (s) {
      return { label: s.label, color: s.color };
    }), "rect");
    global.Charts.table($("table-s-mix"), {
      caption: T("chart.feeMix"),
      columns: [
        { label: T("table.feeType") },
        { label: T("table.amount"), numeric: true },
        { label: T("table.share"), numeric: true }
      ],
      rows: feeSegments.map(function (s, i) {
        return [
          { text: s.label, color: global.Charts.seriesColor(i, s.color) },
          Fmt.money(s.value, currency, 2),
          feeSum ? Fmt.percent(s.value / feeSum) : "—"
        ];
      }),
      footRow: [T("table.total"), Fmt.money(feeSum, currency, 2), ""]
    });

    /* Одна серия — один цвет на все столбцы. Заливка «чем больше, тем
       темнее» здесь запрещена: типы комиссий не имеют естественного порядка. */
    var feeTop = feeEntries.slice().sort(function (a, b) { return b.value - a.value; }).slice(0, 12);
    global.Charts.barsH($("chart-s-fees"), {
      items: feeTop.map(function (e) { return { label: e.label, value: e.value }; }),
      formatValue: function (v) { return Fmt.moneyCompact(v, currency); },
      valueName: T("table.amount"),
      color: "var(--series-2)",
      ariaLabel: T("chart.feesByType")
    });
    global.Charts.table($("table-s-fees"), {
      caption: T("chart.feesByType"),
      columns: [
        { label: T("table.feeType") },
        { label: T("table.amount"), numeric: true },
        { label: T("table.share"), numeric: true }
      ],
      /* Возмещения дописываются в конец таблицы со знаком плюс: в графике
         расходов им места нет, но потерять их из виду нельзя. */
      rows: feeEntries.slice().sort(function (a, b) { return b.value - a.value; })
        .map(function (e) {
          return [e.label, Fmt.money(e.value, currency, 2),
                  feeSum ? Fmt.percent(e.value / feeSum) : "—"];
        }).concat(creditEntries.map(function (e) {
          return [e.label, "+" + Fmt.money(e.value, currency, 2), "—"];
        })),
      footRow: [T("table.total"), Fmt.money(feeSum, currency, 2), ""]
    });

    /* ---- Товары по чистому доходу ---- */
    var prodMap = {};
    ecoProducts().forEach(function (r) {
      if (!matches(r, bounds.from, bounds.to)) return;
      /* Ключ — ASIN. Раньше первым шёл MSKU, и один и тот же товар с разными
         внутренними кодами дробился на несколько строк в топе. */
      var key = r.asin || r.msku || "—";
      if (!prodMap[key]) {
        prodMap[key] = { key: key, name: r.name || key, net: 0, sales: 0, units: 0 };
      }
      prodMap[key].net += Number(r.netProceeds) || 0;
      prodMap[key].sales += Number(r.orderedSales) || 0;
      prodMap[key].units += Number(r.unitsOrdered) || 0;
    });
    var products = Object.keys(prodMap).map(function (k) { return prodMap[k]; })
      .sort(function (a, b) { return b.net - a.net; });
    var topProducts = products.slice(0, 10);

    global.Charts.barsH($("chart-s-products"), {
      items: topProducts.map(function (p) { return { label: p.name, value: p.net }; }),
      formatValue: function (v) { return Fmt.moneyCompact(v, currency); },
      valueName: T("table.netProceeds"),
      color: "var(--series-1)",
      ariaLabel: T("chart.topByNet")
    });
    global.Charts.table($("table-s-products"), {
      caption: T("chart.topByNet"),
      columns: [
        { label: T("table.asin") },
        { label: T("kpi.revenue"), numeric: true },
        { label: T("table.units"), numeric: true },
        { label: T("table.netProceeds"), numeric: true }
      ],
      rows: products.slice(0, 50).map(function (p) {
        return [p.name, Fmt.money(p.sales, currency, 2), Fmt.number(p.units),
                Fmt.money(p.net, currency, 2)];
      })
    });
  }

  /* ======================================================================
     Переключатель «график ↔ таблица»
     ===================================================================== */

  function wireTableToggles() {
    document.querySelectorAll("[data-table-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-table-toggle");
        var chart = $("chart-" + name);
        var tableNode = $("table-" + name);
        var legendNode = $("legend-" + name);
        var showTable = btn.getAttribute("aria-pressed") !== "true";

        btn.setAttribute("aria-pressed", String(showTable));
        btn.textContent = showTable ? T("table.hide") : T("table.show");
        if (chart) chart.hidden = showTable;
        if (legendNode) legendNode.hidden = showTable;
        if (tableNode) tableNode.hidden = !showTable;
        global.Charts.hideTip();
      });
    });
  }

  /* ======================================================================
     Запуск
     ===================================================================== */

  function init() {
    global.I18N.setLang(global.I18N.detect());
    applyI18n();
    buildLangSwitch($("login-lang"));
    buildLangSwitch($("app-lang"));
    buildThemeSwitch($("login-theme"));
    buildThemeSwitch($("app-theme"));

    $("login-form").addEventListener("submit", handleLogin);
    $("sign-out").addEventListener("click", signOut);
    /* Переключателя валют в разметке больше нет — все суммы в евро.
       Проверка на null здесь не «на всякий случай»: когда его убрали,
       $(id) вернул null, forEach упал на второй итерации, и фильтр витрин
       остался без обработчика. Внешне это выглядело как «цифры не меняются». */
    ["filter-period", "filter-marketplace"].forEach(function (id) {
      var node = $(id);
      if (node) { node.addEventListener("change", onFilterChange); }
    });
    wireTableToggles();

    $("menu-toggle").addEventListener("click", function () {
      if ($("sidebar").classList.contains("is-open")) { closeSidebar(); } else { openSidebar(); }
    });

    wireSyncBell();
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
    /* Переход по кнопке «назад» в браузере тоже должен работать */
    global.addEventListener("hashchange", function () {
      if (state.data) navigate(pageFromHash());
    });

    /* Показ пароля */
    var toggle = $("toggle-password");
    toggle.addEventListener("click", function () {
      var field = $("login-password");
      var reveal = field.type === "password";
      field.type = reveal ? "text" : "password";
      var key = reveal ? "login.hidePassword" : "login.showPassword";
      toggle.setAttribute("aria-label", T(key));
      toggle.setAttribute("title", T(key));
      field.focus();
    });

    /* Подсказка к паролю — необязательная, задаётся при шифровании */
    var payload = global.DASHBOARD_PAYLOAD;
    if (payload && payload.hint) {
      $("login-hint").hidden = false;
      $("login-hint-text").textContent = T("login.hintLabel") + " " + payload.hint;
    }
    if (global.__DASHBOARD_MISSING__ || !payload) {
      showLoginError(T("error.noData"));
    }

    $("login-user").focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
