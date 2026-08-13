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
    percent: "M19 5L5 19|M9 6.5a2.5 2.5 0 11-5 0a2.5 2.5 0 115 0|M20 17.5a2.5 2.5 0 11-5 0a2.5 2.5 0 115 0",
    box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
    cart: "M4 5h2l2.2 9.5a2 2 0 002 1.5h6.6a2 2 0 002-1.6L21 8H7|M9 20h.01M17 20h.01",
    back: "M4 12a8 8 0 108-8|M4 12l3-3M4 12l3 3",
    book: "M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5zM19 18v3H6.5",
    scale: "M12 4v16|M5 8h14|M5 8l-2.5 5.5a3 3 0 006 0zM19 8l-2.5 5.5a3 3 0 006 0|M9 20h6",
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
        { id: "overview", label: "page.overview", icon: "grid", ready: true },
        { id: "margin", label: "page.margin", icon: "percent", ready: true },
        { id: "cmp4", label: "page.cmp4", icon: "scale", ready: true },
        { id: "p30", label: "page.p30", icon: "chart", ready: true }
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
        { id: "wiki", label: "page.wiki", icon: "book", ready: true },
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

  var PAGE_NODES = ["page-sales", "page-overview", "page-margin", "page-cmp4", "page-p30", "page-wiki", "page-placeholder"];

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
    /* На вики фильтры не нужны: период и витрина к тексту не применяются. */
    var dataPage = item.ready && state.data && pageId !== "wiki";
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
    marginState.chartAsins = [];
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

    /* Список витрин собирается из всех источников: обзор берёт данные
       из отчёта по заказам, анализ продаж — из Data Kiosk, маржа — из
       своего узла, и набор маркетплейсов у них может не совпадать. */
    var sources = rows().concat(ecoDays()).concat(marginDays());

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
      /* Направление и оценка — РАЗНЫЕ вещи, и путать их нельзя.
         Стрелка показывает, куда двинулась величина. Цвет показывает, хорошо
         это или плохо, а это зависит от самой величины: рост выручки — хорошо,
         рост возвратов и комиссий — плохо. Раньше цвет вешался прямо на
         направление, и падение возвратов на 7 % красилось красным. */
      var dir = opts.delta > 0.0005 ? "up" : opts.delta < -0.0005 ? "down" : "flat";
      var upIsGood = opts.lowerIsBetter ? false : true;
      var tone = dir === "flat" ? "neutral"
               : (dir === "up") === upIsGood ? "good" : "bad";

      var badge = el("span", "stat__delta stat__delta--" + dir + " stat__delta--" + tone);
      /* Направление подкреплено стрелкой, а не только цветом */
      badge.appendChild(el("span", null, dir === "up" ? "▲" : dir === "down" ? "▼" : "—"));
      /* deltaText — готовая подпись вместо процента роста. Нужна марже:
         её дельта — разность в процентных пунктах, а не отношение. */
      badge.appendChild(el("span", null, opts.deltaText != null ? opts.deltaText : Fmt.delta(opts.delta)));
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

  /* ======================================================================
     База знаний
     Содержимое приезжает внутри шифрованного payload (узел wiki): репозиторий
     дашборда публичный, а в документации скриншоты с реальной выручкой.
     ===================================================================== */
  var wikiState = { page: null };

  function renderWiki() {
    var w = state.data && state.data.wiki;
    var nav = $("wiki-nav");
    var body = $("wiki-body");

    $("empty-state").hidden = true;
    $("page-wiki").hidden = false;

    if (!w || !w.pages || !w.pages.length) {
      nav.textContent = "";
      body.innerHTML = '<p class="wiki-p">' + T("wiki.empty") + '</p>';
      return;
    }

    function known(id) {
      return w.pages.some(function (p) { return p.id === id; });
    }
    if (!wikiState.page || !known(wikiState.page)) { wikiState.page = w.pages[0].id; }

    function openPage(id) {
      if (!known(id)) { return; }
      wikiState.page = id;
      renderWiki();
      body.scrollTop = 0;
      try { body.focus({ preventScroll: true }); } catch (e) { }
    }

    nav.textContent = "";
    w.pages.forEach(function (p) {
      var link = el("button", "wiki-navlink");
      link.type = "button";
      link.textContent = p.title;
      if (p.id === wikiState.page) { link.setAttribute("aria-current", "true"); }
      link.addEventListener("click", function () { openPage(p.id); });
      nav.appendChild(link);
    });

    var page = w.pages.filter(function (p) { return p.id === wikiState.page; })[0];
    body.setAttribute("tabindex", "-1");
    body.innerHTML = Markdown.render(page.markdown, w.images);

    /* Ссылки вида [текст](другая-страница.md) ведут в соседний раздел вики:
       .md-файлов на сайте нет, обычный href привёл бы в никуда. */
    var links = body.querySelectorAll("[data-wiki-page]");
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        openPage(a.getAttribute("data-wiki-page"));
      });
    });
  }

  /* Диспетчер: рисуем только активный раздел. Перерисовывать скрытые
     страницы бессмысленно — их ширина равна нулю, и графики построились бы
     по неверным размерам. */
  function render() {
    if (state.page === "wiki") { renderWiki(); return; }
    if (state.page === "sales") { renderSales(); return; }
    if (state.page === "margin") { renderMargin(); return; }
    if (state.page === "cmp4") { renderCompare(); return; }
    if (state.page === "p30") { renderP30(); return; }
    renderOverview();
  }

  /* ======================================================================
     Раздел «1» — период против предыдущего
     ----------------------------------------------------------------------
     Источник — узел margin: там уже собраны выручка, комиссии, реклама,
     себестоимость и подписка, причём валюты приведены по историческим
     курсам на дату операции. Прибыль считает marginCalc — ЕДИНСТВЕННОЕ
     место с этой формулой; складывать поля здесь заново нельзя, иначе
     две копии разъедутся.

     Возвраты и разбивка комиссий по типам в узле margin отсутствуют,
     поэтому берутся из economics — это единственный их источник.

     Границы задаёт общий фильтр периода: при выбранных «30 днях» это
     ровно последние 30 суток против предыдущих 30.
     ===================================================================== */

  /* Комиссии по типам. «Advertising» исключается: в feeDays он лежит
     рядом с комиссиями, но расходом Amazon за продажу не является и
     уже посчитан отдельным полем ads. */
  function p30Fees(from, to) {
    var map = {};
    ecoFees().forEach(function (r) {
      if (!matches(r, from, to)) return;
      if (r.feeType === "Advertising") return;
      map[r.feeType] = (map[r.feeType] || 0) + (Number(r.amount) || 0);
    });
    return map;
  }

  /* Сутки, где комиссии есть, а продаж нет, — это незаполненный день
     выгрузки, а не выходной: расход без выручки занижает прибыль периода.
     Так вёл себя 2026-08-11, пока Data Kiosk не дозаполнил его через
     несколько часов. Молча пропускать такое нельзя. */
  function p30Gaps(from, to) {
    var byDate = {};
    ecoDays().forEach(function (r) {
      if (!matches(r, from, to)) return;
      var d = byDate[r.date] || (byDate[r.date] = { units: 0, cost: 0 });
      d.units += Number(r.unitsOrdered) || 0;
      d.cost += Math.abs(Number(r.fees) || 0) + Math.abs(Number(r.ads) || 0);
    });
    return Object.keys(byDate).sort().filter(function (d) {
      return byDate[d].units === 0 && byDate[d].cost > 0;
    });
  }

  function renderP30() {
    var mg = marginData();
    var days = marginDays();
    var hasData = !!(mg && days.length);

    $("empty-state").hidden = true;
    $("page-p30").hidden = false;
    $("p30-empty").hidden = hasData;
    $("p30-content").hidden = !hasData;
    if (!hasData) return;

    var currency = (mg.meta && mg.meta.currency) || displayCurrency();
    var bounds = periodBounds(days);

    var cur = marginTotals(days, bounds.from, bounds.to);
    cur.subscription = marginSubscription(bounds.from || minDate(days), bounds.to);
    var kCur = marginCalc(cur);

    var prev = null, kPrev = null;
    if (bounds.prevFrom) {
      prev = marginTotals(days, bounds.prevFrom, bounds.prevTo);
      prev.subscription = marginSubscription(bounds.prevFrom, bounds.prevTo);
      kPrev = marginCalc(prev);
    }


    $("p30-range").textContent = bounds.from
      ? Fmt.date(bounds.from) + " — " + Fmt.date(bounds.to) : "";

    /* ---- Незаполненные сутки ---- */
    var gaps = p30Gaps(bounds.from, bounds.to);
    $("p30-gap").hidden = gaps.length === 0;
    if (gaps.length) {
      $("p30-gap-text").textContent = T("p30.gapText").replace(
        "{dates}", gaps.map(function (d) { return Fmt.date(d); }).join(", "));
    }

    /* ---- Плитки ---- */
    renderStat($("p30-kpi-revenue"), {
      label: T("kpi.revenue"),
      value: Fmt.money(cur.revenue, currency),
      delta: prev ? growth(cur.revenue, prev.revenue) : null,
      meter: kCur.marginPct != null
        ? { label: T("kpi.margin"), value: kCur.marginPct } : null
    });

    renderStat($("p30-kpi-profit"), {
      label: T("kpi.profit"),
      value: kCur.profit == null ? "—" : Fmt.money(kCur.profit, currency),
      delta: (kCur.profit != null && kPrev && kPrev.profit != null)
        ? growth(kCur.profit, kPrev.profit) : null,
      note: kCur.profit == null ? T("p30.noCogs") : null
    });

    /* Дельта маржи — разность в процентных пунктах, а не рост в процентах */
    var dMargin = (kCur.marginPct != null && kPrev && kPrev.marginPct != null)
      ? kCur.marginPct - kPrev.marginPct : null;
    renderStat($("p30-kpi-margin"), {
      label: T("kpi.margin"),
      value: kCur.marginPct == null ? "—" : Fmt.percent(kCur.marginPct),
      delta: dMargin,
      deltaText: dMargin == null ? null
        : (dMargin > 0 ? "+" : "") + Fmt.number(dMargin * 100, 2) + " " + T("margin.pp")
    });

    renderStat($("p30-kpi-units"), {
      label: T("kpi.units"),
      value: Fmt.number(cur.units),
      delta: prev ? growth(cur.units, prev.units) : null
    });

    renderStat($("p30-kpi-ads"), {
      label: T("margin.ads"),
      value: Fmt.money(cur.ads, currency),
      delta: prev ? growth(cur.ads, prev.ads) : null,
      lowerIsBetter: true,
      note: cur.revenue > 0
        ? T("p30.ofRevenue").replace("{x}", Fmt.percent(cur.ads / cur.revenue)) : null
    });

    renderStat($("p30-kpi-refunds"), {
      label: T("kpi.refunds"),
      value: Fmt.money(cur.refunded, currency),
      delta: prev ? growth(cur.refunded, prev.refunded) : null,
      lowerIsBetter: true,
      note: cur.revenue > 0
        ? T("p30.ofRevenue").replace("{x}", Fmt.percent(cur.refunded / cur.revenue)) : null
    });

    /* ---- Пять самых значимых изменений ----
       Ранжируются по величине изменения в деньгах. «Влияние на прибыль»
       несёт знак: рост расхода прибыль уменьшает. */
    var moverBox = $("p30-movers");
    moverBox.textContent = "";
    if (!prev) {
      moverBox.appendChild(el("p", "card__caption", T("p30.noPrev")));
    } else {
      var candidates = [
        { label: T("kpi.revenue"), cur: cur.revenue, prev: prev.revenue, income: true },
        { label: T("margin.ads"), cur: cur.ads, prev: prev.ads, income: false },
        { label: T("kpi.cogs"), cur: cur.cogs, prev: prev.cogs, income: false },
        { label: T("kpi.refunds"), cur: cur.refunded, prev: prev.refunded, income: false }
      ];
      var fCur = p30Fees(bounds.from, bounds.to);
      var fPrev = p30Fees(bounds.prevFrom, bounds.prevTo);
      var seen = {};
      Object.keys(fCur).concat(Object.keys(fPrev)).forEach(function (k) {
        if (seen[k]) return;
        seen[k] = true;
        candidates.push({ label: k, cur: fCur[k] || 0, prev: fPrev[k] || 0, income: false });
      });

      var movers = candidates.map(function (c) {
        var d = c.cur - c.prev;
        return { label: c.label, delta: d, cur: c.cur, prev: c.prev, effect: c.income ? d : -d };
      }).sort(function (a, b) {
        return Math.abs(b.delta) - Math.abs(a.delta);
      }).slice(0, 5);

      global.Charts.table(moverBox, {
        caption: T("p30.movers"),
        columns: [
          { label: T("p30.col.item") },
          { label: T("p30.col.was"), numeric: true },
          { label: T("p30.col.now"), numeric: true },
          { label: T("p30.col.change"), numeric: true },
          { label: T("p30.col.effect"), numeric: true }
        ],
        rows: movers.map(function (m) {
          return [
            m.label,
            Fmt.money(m.prev, currency),
            Fmt.money(m.cur, currency),
            (m.delta > 0 ? "+" : "") + Fmt.money(m.delta, currency),
            (m.effect > 0 ? "+" : "") + Fmt.money(m.effect, currency)
          ];
        })
      });
    }

    /* ---- Мостик прибыли ----
       Слагаемые в сумме дают изменение прибыли, поэтому подписка тоже
       участвует: она входит в формулу marginCalc. */
    var bridgeBox = $("p30-bridge");
    bridgeBox.textContent = "";
    if (!prev || kCur.profit == null || !kPrev || kPrev.profit == null) {
      bridgeBox.appendChild(el("p", "card__caption", T("p30.noPrev")));
    } else {
      var bRows = [
        [T("kpi.revenue"), cur.revenue - prev.revenue],
        [T("kpi.refunds"), -(cur.refunded - prev.refunded)],
        [T("kpi.fees"), -(cur.fees - prev.fees)],
        [T("margin.ads"), -(cur.ads - prev.ads)],
        [T("kpi.cogs"), -(cur.cogs - prev.cogs)],
        [T("margin.subscription"), -((cur.subscription || 0) - (prev.subscription || 0))]
      ];
      global.Charts.table(bridgeBox, {
        caption: T("p30.bridge"),
        columns: [
          { label: T("p30.col.item") },
          { label: T("p30.col.effect"), numeric: true }
        ],
        rows: bRows.map(function (r) {
          return [r[0], (r[1] > 0 ? "+" : "") + Fmt.money(r[1], currency)];
        }),
        footRow: [
          T("kpi.profit"),
          (kCur.profit - kPrev.profit > 0 ? "+" : "") +
          Fmt.money(kCur.profit - kPrev.profit, currency)
        ]
      });
    }

    /* ---- Комиссии по типам ---- */
    var feeCur = p30Fees(bounds.from, bounds.to);
    var feePrev = prev ? p30Fees(bounds.prevFrom, bounds.prevTo) : {};
    var feeKeys = {};
    Object.keys(feeCur).concat(Object.keys(feePrev)).forEach(function (k) { feeKeys[k] = true; });
    var feeList = Object.keys(feeKeys).map(function (k) {
      return { type: k, cur: feeCur[k] || 0, prev: feePrev[k] || 0 };
    }).sort(function (a, b) {
      return Math.abs(b.cur - b.prev) - Math.abs(a.cur - a.prev);
    });

    global.Charts.table($("p30-fees"), {
      caption: T("p30.fees"),
      columns: [
        { label: T("table.feeType") },
        { label: T("p30.col.was"), numeric: true },
        { label: T("p30.col.now"), numeric: true },
        { label: T("p30.col.change"), numeric: true }
      ],
      rows: feeList.map(function (f) {
        var d = f.cur - f.prev;
        return [
          f.type,
          Fmt.money(f.prev, currency),
          Fmt.money(f.cur, currency),
          (d > 0 ? "+" : "") + Fmt.money(d, currency)
        ];
      }),
      footRow: [
        T("table.total"),
        Fmt.money(prev ? prev.fees : 0, currency),
        Fmt.money(cur.fees, currency),
        prev ? ((cur.fees - prev.fees > 0 ? "+" : "") +
          Fmt.money(cur.fees - prev.fees, currency)) : "—"
      ]
    });

    /* ---- Витрины ----
       Прибыль площадки считает тот же marginCalc. Подписка account-level
       и по витринам не раскладывается, поэтому в разрез не входит —
       сумма строк на неё и разойдётся с итогом.  */
    var ids = {};
    days.forEach(function (r) {
      if (matches(r, bounds.from, bounds.to)) ids[r.marketplace] = true;
      if (bounds.prevFrom && matches(r, bounds.prevFrom, bounds.prevTo)) ids[r.marketplace] = true;
    });
    var mkList = Object.keys(ids).map(function (id) {
      var only = days.filter(function (r) { return r.marketplace === id; });
      var c = marginTotals(only, bounds.from, bounds.to);
      var kc = marginCalc(c);
      var kp = null;
      if (bounds.prevFrom) {
        kp = marginCalc(marginTotals(only, bounds.prevFrom, bounds.prevTo));
      }
      return {
        name: marketplaceName(id), rev: c.revenue,
        profit: kc.profit, marginPct: kc.marginPct,
        dProfit: (kc.profit != null && kp && kp.profit != null) ? kc.profit - kp.profit : null
      };
    }).sort(function (a, b) { return b.rev - a.rev; });

    global.Charts.table($("p30-markets"), {
      caption: T("p30.markets"),
      columns: [
        { label: T("cmp.col.market") },
        { label: T("cmp.col.revenue"), numeric: true },
        { label: T("cmp.col.profit"), numeric: true },
        { label: "Δ " + T("cmp.col.profit"), numeric: true },
        { label: T("cmp.col.margin"), numeric: true }
      ],
      rows: mkList.map(function (m) {
        return [
          m.name,
          Fmt.money(m.rev, currency),
          m.profit == null ? "—" : Fmt.money(m.profit, currency),
          m.dProfit == null ? "—" : (m.dProfit > 0 ? "+" : "") + Fmt.money(m.dProfit, currency),
          m.marginPct == null ? "—" : Fmt.percent(m.marginPct)
        ];
      })
    });
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
    /* lowerIsBetter вместо переворота знака. Раньше дельту расходов и возвратов
       умножали на −1, чтобы получить нужный цвет, — и вместе с цветом
       переворачивалось само число: рост возвратов на 7,3 % показывался
       как «▼ −7,3 %». Теперь знак настоящий, а цветом заведует оценка. */
    renderStat($("s-kpi-fees"), {
      label: T("kpi.fees"),
      value: Fmt.money(feesTotal, currency),
      delta: growth(feesTotal, prevFees),
      lowerIsBetter: true
    });
    renderStat($("s-kpi-feeshare"), {
      label: T("kpi.feeShare"),
      value: feeShare == null ? "—" : Fmt.percent(feeShare)
    });
    renderStat($("s-kpi-refunds"), {
      label: T("kpi.refunds"),
      value: Fmt.money(refunds, currency),
      delta: growth(refunds, prevRefunds),
      lowerIsBetter: true
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
     Раздел «Маржа по странам»
     ----------------------------------------------------------------------
     Источник — узел margin: выручка нетто из отчёта заказов, комиссии и
     реклама алгебраической суммой (возмещения уже внутри), себестоимость
     из справочника COGS. Все суммы в евро. «Страна» на этой странице —
     витрина из общего фильтра, отдельного переключателя нет намеренно.
     ===================================================================== */

  function marginData() { return (state.data && state.data.margin) || null; }
  function marginDays() { var m = marginData(); return (m && m.days) || []; }
  function marginMonths() { var m = marginData(); return (m && m.months) || []; }
  function marginProducts() { var m = marginData(); return (m && m.products) || []; }

  /* ЕДИНСТВЕННОЕ место, где считается прибыль и маржа. Любой блок страницы
     обязан звать эту функцию, а не складывать поля сам: две копии формулы
     разъехались бы при первом же изменении. cogs === null означает
     «себестоимость неизвестна» — тогда и прибыль, и маржа равны null,
     а НЕ нулю: ноль читался бы как «товар достался бесплатно». */
  function marginCalc(t) {
    if (t.cogs == null) return { profit: null, marginPct: null };
    var revenue = Number(t.revenue) || 0;
    /* Возвраты вычитаются обязательно: revenue здесь — orderedProductSales,
       то есть сумма ДО возвратов. Пока этой строки не было, деньги,
       вернувшиеся покупателю, оставались в прибыли и заметно её завышали.
       Знаменатель маржи — валовая выручка: тогда он совпадает с плиткой
       «Выручка», а возвраты видны отдельной статьёй. */
    var profit = revenue - (Number(t.refunded) || 0) - (Number(t.fees) || 0) -
      (Number(t.ads) || 0) - (Number(t.cogs) || 0) - (Number(t.subscription) || 0);
    return { profit: profit, marginPct: revenue > 0 ? profit / revenue : null };
  }

  /* Отмеченные чекбоксами ASIN для графика недельной выручки.
     Порядок в списке — порядок отметки: он же назначает цвета серий. */
  var marginState = { chartAsins: [] };

  function minDate(list) {
    var min = null;
    list.forEach(function (r) {
      if (r.date && (min === null || r.date < min)) min = r.date;
    });
    return min;
  }

  /* Свод дневных строк за период с учётом фильтра витрины */
  function marginTotals(list, from, to) {
    var t = { revenue: 0, units: 0, fees: 0, ads: 0, cogs: 0, refunded: 0, subscription: 0 };
    list.forEach(function (r) {
      if (!matches(r, from, to)) return;
      t.revenue += Number(r.revenue) || 0;
      t.units += Number(r.units) || 0;
      t.fees += Number(r.fees) || 0;
      t.ads += Number(r.ads) || 0;
      t.cogs += Number(r.cogs) || 0;
      t.refunded += Number(r.refunded) || 0;
    });
    return t;
  }

  /* Подписка месячная, в дневных строках её нет. Распределяем сумму месяца
     по дням его пересечения с периодом: иначе недельный период таскал бы
     на себе полный месячный платёж и занижал маржу. */
  function marginSubscription(from, to) {
    var mg = marginData();
    var found = mg && mg.meta && mg.meta.subscription &&
      mg.meta.subscription.status === "found";
    if (!found || !from || !to) return 0;

    var total = 0;
    marginMonths().forEach(function (r) {
      if (state.filters.marketplace !== "all" &&
          r.marketplace !== state.filters.marketplace) return;
      var sub = Number(r.subscription) || 0;
      if (!sub || !r.month) return;

      var y = +r.month.slice(0, 4);
      var m = +r.month.slice(5, 7);
      var dim = new Date(Date.UTC(y, m, 0)).getUTCDate(); // дней в месяце
      var first = r.month + "-01";
      var last = r.month + "-" + (dim < 10 ? "0" + dim : String(dim));

      var lo = from > first ? from : first;
      var hi = to < last ? to : last;
      if (hi < lo) return;
      var overlap = Math.round(
        (Fmt.parseDate(hi) - Fmt.parseDate(lo)) / 86400000) + 1;
      total += sub * overlap / dim;
    });
    return total;
  }

  /* Имя месяца из локали: и подпись оси, и строка таблицы сезонности.
     2024 — просто опорный год для Intl, имя месяца от года не зависит. */
  function monthName(mm, full) {
    return Fmt.date("2024-" + mm + "-01",
      { month: full ? "long" : "short", timeZone: "UTC" });
  }

  var MONTH_KEYS = ["01", "02", "03", "04", "05", "06",
                    "07", "08", "09", "10", "11", "12"];

  /* ======================================================================
     Раздел «4» — сравнение площадок

     Разрез, которого нет на других страницах: площадки стоят рядом за
     выбранный период и за предыдущий период такой же длины.

     Фильтр витрины здесь намеренно НЕ применяется. Страница существует
     ради сравнения площадок между собой, и одна выбранная витрина
     оставила бы таблицу из единственной строки.
     ===================================================================== */

  /* Свод по площадкам за интервал. Источники разные, потому что ни один
     не покрывает всё: суммы и комиссии — economics, заказы — Orders Report
     в узле days, себестоимость — узел margin, если конвейер его уже строит. */
  function cmpTotals(from, to) {
    var map = {};

    function bucket(id) {
      return map[id] || (map[id] = {
        id: id, revenue: 0, fees: 0, ads: 0, refunded: 0,
        units: 0, orders: 0, cogs: 0, cogsKnown: false, ordersKnown: false
      });
    }
    function inRange(r) {
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      return true;
    }

    ecoDays().forEach(function (r) {
      if (!inRange(r)) return;
      var b = bucket(r.marketplace);
      b.revenue += Number(r.netSales) || 0;
      b.fees += Number(r.fees) || 0;
      b.ads += Number(r.ads) || 0;
      b.refunded += Number(r.refundedSales) || 0;
      b.units += Number(r.unitsOrdered) || 0;
    });

    /* Числа заказов в economics нет — Data Kiosk отдаёт только штуки.
       Заказы приходят из Orders Report, он лежит в узле days. */
    rows().forEach(function (r) {
      if (!inRange(r) || r.orders == null) return;
      var o = bucket(r.marketplace);
      o.orders += Number(r.orders) || 0;
      o.ordersKnown = true;
    });

    marginDays().forEach(function (r) {
      if (!inRange(r) || r.cogs == null) return;
      var b = bucket(r.marketplace);
      b.cogs += Number(r.cogs) || 0;
      b.cogsKnown = true;
    });

    return map;
  }

  /* Прибыль и маржа площадки. Когда себестоимость известна — считает
     marginCalc, единственное место с этой формулой. Когда её нет во всей
     выгрузке — показываем ЧИСТЫЙ ДОХОД (выручка минус комиссии и реклама)
     и подписываем колонку иначе: назвать его прибылью значило бы молча
     раздать товар себе бесплатно. */
  function cmpProfit(t, hasCogs) {
    if (hasCogs) {
      return marginCalc({
        revenue: t.revenue, fees: t.fees, ads: t.ads,
        cogs: t.cogsKnown ? t.cogs : null
      });
    }
    var p = t.revenue - t.fees - t.ads;
    return { profit: p, marginPct: t.revenue > 0 ? p / t.revenue : null };
  }

  /* Пустой день: дата в выгрузке есть, строки на месте, но все суммы
     нулевые. Проверка «все ли даты присутствуют» такое пропускает —
     ловится только суммой по дню. Один пустой день занижает 30-дневный
     итог примерно на 3 %, а сравнение периодов — на 3 пункта. */
  function cmpZeroDays(from, to) {
    var byDay = {};
    ecoDays().forEach(function (r) {
      if (from && r.date < from) return;
      if (to && r.date > to) return;
      byDay[r.date] = (byDay[r.date] || 0) + (Number(r.unitsOrdered) || 0);
    });
    return Object.keys(byDay).filter(function (d) { return byDay[d] === 0; }).sort();
  }

  /* Площадка с живой выручкой, но без ReferralFee и без FbaFulfilmentFee —
     это дыра в данных, а не выдающаяся экономика: её маржа улетает к 80 %
     и портит и рейтинг, и любые выводы из него. */
  var CMP_CORE_FEES = ["ReferralFee", "FbaFulfilmentFee"];

  function cmpMarketsWithoutFees(from, to, totals) {
    var seen = {};
    ecoFees().forEach(function (r) {
      if (from && r.date < from) return;
      if (to && r.date > to) return;
      if (CMP_CORE_FEES.indexOf(r.feeType) < 0) return;
      if (!(Number(r.amount) || 0)) return;
      seen[r.marketplace] = true;
    });
    return Object.keys(totals).filter(function (id) {
      return totals[id].revenue > 0 && !seen[id];
    });
  }

  function renderCompare() {
    var bounds = periodBounds(ecoDays());
    var cur = cmpTotals(bounds.from, bounds.to);
    var prev = bounds.prevFrom ? cmpTotals(bounds.prevFrom, bounds.prevTo) : null;

    var ids = Object.keys(cur).filter(function (id) {
      return cur[id].revenue !== 0 || cur[id].orders !== 0;
    });

    $("empty-state").hidden = true;
    $("page-cmp4").hidden = false;
    $("cmp-empty").hidden = ids.length > 0;
    $("cmp-content").hidden = ids.length === 0;
    if (!ids.length) return;

    var currency = displayCurrency();
    var hasCogs = ids.some(function (id) { return cur[id].cogsKnown; });
    $("cmp-cogs-note").hidden = hasCogs;

    var broken = cmpMarketsWithoutFees(bounds.from, bounds.to, cur);
    var brokenSet = {};
    broken.forEach(function (id) { brokenSet[id] = true; });

    $("cmp-range").textContent = bounds.from
      ? Fmt.date(bounds.from) + " — " + Fmt.date(bounds.to)
      : Fmt.date(bounds.to);

    /* ---- Плитки: итог по всем площадкам ---- */
    function totalsOf(map) {
      var t = { revenue: 0, fees: 0, ads: 0, orders: 0, cogs: 0,
                cogsKnown: false, ordersKnown: false };
      Object.keys(map || {}).forEach(function (id) {
        var b = map[id];
        t.revenue += b.revenue; t.fees += b.fees; t.ads += b.ads;
        t.orders += b.orders; t.cogs += b.cogs;
        if (b.cogsKnown) t.cogsKnown = true;
        if (b.ordersKnown) t.ordersKnown = true;
      });
      return t;
    }
    var tCur = totalsOf(cur);
    var tPrev = prev ? totalsOf(prev) : null;
    var kCur = cmpProfit(tCur, hasCogs);
    var kPrev = tPrev ? cmpProfit(tPrev, hasCogs) : null;

    /* Спарклайн героя: дневная выручка по всем площадкам за период.
       Строится отдельно от byDate, потому что тут не действует фильтр
       витрины — страница показывает все площадки разом. */
    var cmpSpark = {};
    ecoDays().forEach(function (r) {
      if (bounds.from && r.date < bounds.from) return;
      if (bounds.to && r.date > bounds.to) return;
      cmpSpark[r.date] = (cmpSpark[r.date] || 0) + (Number(r.netSales) || 0);
    });
    var cmpSparkVals = Object.keys(cmpSpark).sort().map(function (d) {
      return cmpSpark[d];
    });

    renderStat($("c-kpi-revenue"), {
      label: T("kpi.revenueNet"),
      value: Fmt.money(tCur.revenue, currency),
      delta: tPrev ? growth(tCur.revenue, tPrev.revenue) : null,
      spark: cmpSparkVals.slice(-30),
      meter: kCur.marginPct != null
        ? { value: kCur.marginPct, label: T("kpi.margin") }
        : null,
      hero: true
    });
    renderStat($("c-kpi-profit"), {
      label: hasCogs ? T("kpi.profit") : T("cmp.col.netProceeds"),
      value: Fmt.money(kCur.profit, currency),
      delta: (kPrev && kPrev.profit) ? growth(kCur.profit, kPrev.profit) : null
    });

    /* Дельта маржи — в процентных ПУНКТАХ: «с 20 % до 23 %» это +3 п.п.,
       а не +15 % роста. Стрелке отдаём разность, подписи — готовый текст. */
    var ppTotal = (kCur.marginPct != null && kPrev && kPrev.marginPct != null)
      ? kCur.marginPct - kPrev.marginPct
      : null;
    renderStat($("c-kpi-margin"), {
      label: T("kpi.margin"),
      value: kCur.marginPct == null ? "—" : Fmt.percent(kCur.marginPct),
      delta: ppTotal,
      deltaText: ppTotal == null ? null
        : (ppTotal > 0 ? "+" : "") + Fmt.number(ppTotal * 100, 1) + " " + T("margin.pp")
    });
    /* Заказов в выгрузке может не быть вовсе: Data Kiosk отдаёт штуки,
       а число заказов приносит только Orders Report. Прочерк с подписью
       честнее нуля — ноль читался бы как «продаж не было». */
    renderStat($("c-kpi-orders"), {
      label: T("kpi.orders"),
      value: tCur.ordersKnown ? Fmt.number(tCur.orders) : "—",
      note: tCur.ordersKnown ? null : T("cmp.ordersUnknown"),
      delta: (tCur.ordersKnown && tPrev && tPrev.ordersKnown)
        ? growth(tCur.orders, tPrev.orders) : null
    });

    /* ---- Таблица площадок ---- */
    var list = ids.map(function (id) {
      var c = cur[id];
      var p = prev ? prev[id] : null;
      var kc = cmpProfit(c, hasCogs);
      var kp = p ? cmpProfit(p, hasCogs) : null;
      return {
        id: id, name: marketplaceName(id), c: c, p: p, kc: kc, kp: kp,
        dRevenue: p ? growth(c.revenue, p.revenue) : null,
        dOrders: p ? growth(c.orders, p.orders) : null,
        dMargin: (kc.marginPct != null && kp && kp.marginPct != null)
          ? kc.marginPct - kp.marginPct : null
      };
    });

    /* Площадки без прибыли (себестоимость неизвестна) — в хвост списка:
       иначе null оказался бы наверху и читался как лучший результат. */
    list.sort(function (a, b) {
      var av = a.kc.profit, bv = b.kc.profit;
      if (av == null && bv == null) return b.c.revenue - a.c.revenue;
      if (av == null) return 1;
      if (bv == null) return -1;
      return bv - av;
    });

    var columns = [
      { label: T("cmp.col.market") },
      { label: T("cmp.col.revenue"), numeric: true },
      { label: "Δ " + T("cmp.col.revenue"), numeric: true },
      { label: T("cmp.col.orders"), numeric: true },
      { label: T("cmp.col.fees"), numeric: true },
      { label: T("cmp.col.ads"), numeric: true }
    ];
    if (hasCogs) columns.push({ label: T("cmp.col.cogs"), numeric: true });
    columns.push({ label: hasCogs ? T("cmp.col.profit") : T("cmp.col.netProceeds"), numeric: true });
    columns.push({ label: T("cmp.col.margin"), numeric: true });
    columns.push({ label: "Δ " + T("cmp.col.margin"), numeric: true });

    function pp(v) {
      if (v == null) return "—";
      return (v > 0 ? "+" : "") + Fmt.number(v * 100, 1) + " " + T("margin.pp");
    }

    var tableRows = list.map(function (r) {
      var cells = [
        brokenSet[r.id] ? r.name + " · " + T("cmp.badge.noFees") : r.name,
        Fmt.money(r.c.revenue, currency),
        Fmt.delta(r.dRevenue),
        r.c.ordersKnown ? Fmt.number(r.c.orders) : "—",
        Fmt.money(r.c.fees, currency),
        Fmt.money(r.c.ads, currency)
      ];
      if (hasCogs) cells.push(r.c.cogsKnown ? Fmt.money(r.c.cogs, currency) : "—");
      cells.push(r.kc.profit == null ? "—" : Fmt.money(r.kc.profit, currency));
      cells.push(r.kc.marginPct == null ? "—" : Fmt.percent(r.kc.marginPct));
      cells.push(pp(r.dMargin));
      return cells;
    });

    var footRow = [
      T("table.total"),
      Fmt.money(tCur.revenue, currency),
      Fmt.delta(tPrev ? growth(tCur.revenue, tPrev.revenue) : null),
      tCur.ordersKnown ? Fmt.number(tCur.orders) : "—",
      Fmt.money(tCur.fees, currency),
      Fmt.money(tCur.ads, currency)
    ];
    if (hasCogs) footRow.push(Fmt.money(tCur.cogs, currency));
    footRow.push(kCur.profit == null ? "—" : Fmt.money(kCur.profit, currency));
    footRow.push(kCur.marginPct == null ? "—" : Fmt.percent(kCur.marginPct));
    footRow.push(pp(ppTotal));

    global.Charts.table($("cmp-table"), {
      caption: T("cmp.table"),
      columns: columns,
      rows: tableRows,
      footRow: footRow
    });

    /* ---- Выручка растёт, маржа падает ---- */
    var flagged = list.filter(function (r) {
      return r.dRevenue != null && r.dRevenue > 0 &&
             r.dMargin != null && r.dMargin < 0;
    });

    /* Доли расходов в выручке «было → стало» показывают, чем именно
       оплачен рост: почти всегда это реклама. */
    function share(v, base) {
      return base > 0 ? Fmt.percent(v / base) : "—";
    }

    var flagBox = $("cmp-flags");
    flagBox.textContent = "";
    if (!flagged.length) {
      flagBox.appendChild(el("p", "card__caption", T("cmp.flagNone")));
    } else {
      /* Колонку COGS показываем, только когда себестоимость вообще
         известна: иначе это столбец прочерков, то есть шум. */
      var flagCols = [
        { label: T("cmp.col.market") },
        { label: "Δ " + T("cmp.col.revenue"), numeric: true },
        { label: T("cmp.col.margin"), numeric: true },
        { label: T("cmp.col.fees"), numeric: true },
        { label: T("cmp.col.ads"), numeric: true }
      ];
      if (hasCogs) flagCols.push({ label: T("cmp.col.cogs"), numeric: true });
      global.Charts.table(flagBox, {
        caption: T("cmp.flag"),
        columns: flagCols,
        rows: flagged.map(function (r) {
          var cells = [
            r.name,
            Fmt.delta(r.dRevenue),
            Fmt.percent(r.kp.marginPct) + " → " + Fmt.percent(r.kc.marginPct),
            share(r.p.fees, r.p.revenue) + " → " + share(r.c.fees, r.c.revenue),
            share(r.p.ads, r.p.revenue) + " → " + share(r.c.ads, r.c.revenue)
          ];
          if (hasCogs) {
            cells.push((r.c.cogsKnown && r.p.cogsKnown)
              ? share(r.p.cogs, r.p.revenue) + " → " + share(r.c.cogs, r.c.revenue)
              : "—");
          }
          return cells;
        })
      });
    }

    /* ---- Качество данных ---- */
    var zero = cmpZeroDays(bounds.from, bounds.to);
    var qBox = $("cmp-quality");
    qBox.textContent = "";
    if (!zero.length && !broken.length) {
      qBox.appendChild(el("p", "card__caption", T("cmp.qualityOk")));
    } else {
      if (zero.length) {
        qBox.appendChild(el("p", "card__caption", T("cmp.zeroDays").replace(
          "{x}", zero.map(function (d) { return Fmt.date(d); }).join(", "))));
      }
      if (broken.length) {
        qBox.appendChild(el("p", "card__caption", T("cmp.noFees").replace(
          "{x}", broken.map(marketplaceName).join(", "))));
      }
    }
  }

  function renderMargin() {
    var mg = marginData();
    var days = marginDays();
    var hasData = !!(mg && (days.length || marginMonths().length));

    $("empty-state").hidden = true;
    $("page-margin").hidden = false;
    /* Узла margin в payload может не быть (старая выгрузка) — тогда честное
       пустое состояние вместо нулей, которые читались бы как «нет продаж». */
    $("margin-empty").hidden = hasData;
    $("margin-content").hidden = !hasData;
    if (!hasData) return;

    var currency = (mg.meta && mg.meta.currency) || displayCurrency();
    var bounds = periodBounds(days);
    var subFound = mg.meta && mg.meta.subscription &&
      mg.meta.subscription.status === "found";

    /* ---- Плитки показателей ---- */
    var cur = marginTotals(days, bounds.from, bounds.to);
    cur.subscription = marginSubscription(bounds.from || minDate(days), bounds.to);
    var kCur = marginCalc(cur);

    var prev = null;
    var kPrev = null;
    if (bounds.prevFrom) {
      prev = marginTotals(days, bounds.prevFrom, bounds.prevTo);
      prev.subscription = marginSubscription(bounds.prevFrom, bounds.prevTo);
      kPrev = marginCalc(prev);
    }

    var curRows = slice(days, bounds.from, bounds.to);
    var revS = byDate(curRows, "revenue", bounds.from, bounds.to);
    var feeS = byDate(curRows, "fees", bounds.from, bounds.to);
    var adsS = byDate(curRows, "ads", bounds.from, bounds.to);
    var cogsS = byDate(curRows, "cogs", bounds.from, bounds.to);
    var refS = byDate(curRows, "refunded", bounds.from, bounds.to);

    function tail(values, n) { return values.slice(Math.max(0, values.length - n)); }

    var costs = cur.fees + cur.ads;
    var prevCosts = prev ? prev.fees + prev.ads : null;

    renderStat($("m-kpi-revenue"), {
      label: T("kpi.revenueNet"),
      value: Fmt.money(cur.revenue, currency),
      delta: prev ? growth(cur.revenue, prev.revenue) : null,
      spark: tail(revS.values, 14),
      meter: kCur.marginPct != null
        ? { value: kCur.marginPct, label: T("kpi.margin") }
        : null,
      hero: true
    });
    renderStat($("m-kpi-costs"), {
      label: T("kpi.amazonCosts"),
      value: Fmt.money(costs, currency),
      delta: prev ? growth(costs, prevCosts) : null,
      lowerIsBetter: true
    });
    renderStat($("m-kpi-cogs"), {
      label: T("kpi.cogs"),
      value: Fmt.money(cur.cogs, currency),
      delta: prev ? growth(cur.cogs, prev.cogs) : null,
      lowerIsBetter: true
    });
    renderStat($("m-kpi-profit"), {
      label: T("kpi.profit"),
      value: Fmt.money(kCur.profit, currency),
      delta: (kPrev && kPrev.profit) ? growth(kCur.profit, kPrev.profit) : null
    });

    /* Дельта маржи — в процентных ПУНКТАХ (разность), а не в процентах
       роста: «с 20 % до 23 %» — это +3 п.п., а не +15 %. Стрелке и цвету
       отдаём саму разность, подписи — готовый текст с «п.п.». */
    var ppDiff = (kCur.marginPct != null && kPrev && kPrev.marginPct != null)
      ? kCur.marginPct - kPrev.marginPct
      : null;
    renderStat($("m-kpi-margin"), {
      label: T("kpi.margin"),
      value: kCur.marginPct == null ? "—" : Fmt.percent(kCur.marginPct),
      delta: ppDiff,
      deltaText: ppDiff == null ? null
        : (ppDiff > 0 ? "+" : "") + Fmt.number(ppDiff * 100, 1) + " " + T("margin.pp")
    });

    /* ---- Выручка и прибыль по дням: одна валюта — одна шкала ---- */
    $("m-trend-range").textContent = bounds.from
      ? Fmt.date(bounds.from) + " — " + Fmt.date(bounds.to)
      : Fmt.date(bounds.to);

    /* Дневная прибыль считается той же формулой; подписка в дневные точки
       не входит — она месячная и размазывать её по дням на графике
       значило бы рисовать выдуманные значения. */
    var profitVals = revS.labels.map(function (d, i) {
      return marginCalc({
        revenue: revS.values[i], fees: feeS.values[i], refunded: refS.values[i],
        ads: adsS.values[i], cogs: cogsS.values[i]
      }).profit;
    });
    var trendProfitTotal = profitVals.reduce(function (a, v) {
      return a + (Number(v) || 0);
    }, 0);

    global.Charts.line($("chart-m-trend"), {
      labels: revS.labels,
      series: [
        { name: T("kpi.revenueNet"), values: revS.values },
        { name: T("kpi.profit"), values: profitVals, color: "var(--series-3)" }
      ],
      formatY: function (v, axis) {
        return axis ? Fmt.moneyCompact(v, currency) : Fmt.money(v, currency, 2);
      },
      formatX: function (d, full) { return full ? Fmt.date(d) : Fmt.dateShort(d); },
      ariaLabel: T("chart.marginTrend"),
      height: 250
    });
    global.Charts.legend($("legend-m-trend"), [
      { label: T("kpi.revenueNet") },
      { label: T("kpi.profit"), color: "var(--series-3)" }
    ], "line");
    global.Charts.table($("table-m-trend"), {
      caption: T("chart.marginTrend"),
      columns: [
        { label: T("table.date") },
        { label: T("kpi.revenueNet"), numeric: true },
        { label: T("kpi.profit"), numeric: true }
      ],
      rows: revS.labels.map(function (d, i) {
        return [Fmt.date(d), Fmt.money(revS.values[i], currency, 2),
                Fmt.money(profitVals[i], currency, 2)];
      }),
      footRow: [T("table.total"), Fmt.money(cur.revenue, currency, 2),
                Fmt.money(trendProfitTotal, currency, 2)]
    });

    /* ---- Сезонность: маржа по месяцам, линии по годам ----
       Фильтр периода тут не действует — сезонность по определению смотрит
       на весь диапазон. Фильтр витрины действует, об этом микротекст. */
    var monthAgg = {};
    marginMonths().forEach(function (r) {
      if (state.filters.marketplace !== "all" &&
          r.marketplace !== state.filters.marketplace) return;
      var t = monthAgg[r.month] || (monthAgg[r.month] = {
        revenue: 0, fees: 0, ads: 0, cogs: 0, refunded: 0, subscription: 0
      });
      t.revenue += Number(r.revenue) || 0;
      t.fees += Number(r.fees) || 0;
      t.ads += Number(r.ads) || 0;
      t.cogs += Number(r.cogs) || 0;
      t.refunded += Number(r.refunded) || 0;
      t.subscription += Number(r.subscription) || 0;
    });

    var yearSet = {};
    Object.keys(monthAgg).forEach(function (m) { yearSet[m.slice(0, 4)] = true; });
    var yearList = Object.keys(yearSet).sort();

    var seasonSeries = yearList.map(function (y) {
      return {
        name: y,
        values: MONTH_KEYS.map(function (mm) {
          var t = monthAgg[y + "-" + mm];
          /* Месяца в данных нет — разрыв линии (null), не ноль */
          if (!t) return null;
          return marginCalc(t).marginPct;
        })
      };
    });

    global.Charts.line($("chart-m-season"), {
      labels: MONTH_KEYS,
      series: seasonSeries,
      area: false,
      formatY: function (v, axis) { return Fmt.percent(v, axis ? 0 : 1); },
      formatX: function (mm, full) { return monthName(mm, full); },
      ariaLabel: T("chart.seasonality"),
      height: 240
    });
    global.Charts.legend($("legend-m-season"), yearList.map(function (y) {
      return { label: y };
    }), "line");
    global.Charts.table($("table-m-season"), {
      caption: T("chart.seasonality"),
      columns: [{ label: T("table.month") }].concat(yearList.map(function (y) {
        return { label: y, numeric: true };
      })),
      rows: MONTH_KEYS.map(function (mm) {
        return [monthName(mm, true)].concat(yearList.map(function (y) {
          var t = monthAgg[y + "-" + mm];
          if (!t) return "—";
          var k = marginCalc(t);
          return (k.marginPct == null ? "—" : Fmt.percent(k.marginPct)) +
            " · " + Fmt.money(k.profit, currency);
        }));
      })
    });

    /* ---- Разбор расходов за выбранный период ---- */
    function shareOf(v) {
      return cur.revenue > 0 ? Fmt.percent(v / cur.revenue) : "—";
    }
    var breakdownRows = [
      [T("kpi.revenueNet"), Fmt.money(cur.revenue, currency, 2), ""],
      [T("kpi.fees"), Fmt.money(cur.fees, currency, 2), shareOf(cur.fees)],
      [T("margin.ads"), Fmt.money(cur.ads, currency, 2), shareOf(cur.ads)],
      [T("kpi.cogs"), Fmt.money(cur.cogs, currency, 2), shareOf(cur.cogs)]
    ];
    /* Подписка — строка только когда она реально найдена в данных */
    if (subFound) {
      breakdownRows.push([T("margin.subscription"),
        Fmt.money(cur.subscription, currency, 2), shareOf(cur.subscription)]);
    }
    breakdownRows.push([T("kpi.profit"), Fmt.money(kCur.profit, currency, 2), ""]);
    breakdownRows.push([T("kpi.margin"),
      kCur.marginPct == null ? "—" : Fmt.percent(kCur.marginPct), ""]);

    global.Charts.table($("m-breakdown"), {
      caption: T("margin.breakdown"),
      columns: [
        { label: T("table.lineItem") },
        { label: T("table.amount"), numeric: true },
        { label: T("table.share"), numeric: true }
      ],
      rows: breakdownRows
    });

    /* ---- Товары: недельные строки за период ---- */
    var weekRows = marginProducts().filter(function (r) {
      if (state.filters.marketplace !== "all" &&
          r.marketplace !== state.filters.marketplace) return false;
      if (bounds.from && r.week < bounds.from) return false;
      if (bounds.to && r.week > bounds.to) return false;
      return true;
    });

    var prodMap = {};
    weekRows.forEach(function (r) {
      var key = r.asin || "—";
      var p = prodMap[key] || (prodMap[key] = {
        asin: key, revenue: 0, units: 0, fees: 0, ads: 0, cogs: 0, refunded: 0, noCogs: false
      });
      p.revenue += Number(r.revenue) || 0;
      p.units += Number(r.units) || 0;
      p.fees += Number(r.fees) || 0;
      p.ads += Number(r.ads) || 0;
      p.refunded += Number(r.refunded) || 0;
      /* Хоть одна неделя без себестоимости — весь товар «без COGS»:
         сумма из известной части занизила бы затраты и завысила маржу */
      if (r.cogs == null) { p.noCogs = true; } else { p.cogs += Number(r.cogs) || 0; }
    });

    var prods = Object.keys(prodMap).map(function (k) { return prodMap[k]; })
      .sort(function (a, b) { return b.revenue - a.revenue; });
    /* OTHER — свёрнутый хвост, а не товар: держим его в конце списка */
    prods = prods.filter(function (p) { return p.asin !== "OTHER"; })
      .concat(prods.filter(function (p) { return p.asin === "OTHER"; }));

    /* ---- График недельной выручки отмеченных ASIN ---- */
    var picked = marginState.chartAsins.filter(function (a) { return prodMap[a]; });
    var weekSet = {};
    weekRows.forEach(function (r) { weekSet[r.week] = true; });
    var weeks = Object.keys(weekSet).sort();

    var asinChart = $("chart-m-asin");
    var asinLegend = $("legend-m-asin");
    var asinTable = $("table-m-asin");
    var asinHint = $("m-asin-hint");
    if (picked.length && weeks.length) {
      var asinSeries = picked.map(function (asin, i) {
        var perWeek = {};
        weekRows.forEach(function (r) {
          if (r.asin === asin) {
            perWeek[r.week] = (perWeek[r.week] || 0) + (Number(r.revenue) || 0);
          }
        });
        return {
          name: asin,
          /* Недели без строк — нулевая выручка, это настоящий ноль */
          values: weeks.map(function (w) { return perWeek[w] || 0; }),
          /* Цвет закреплён за порядком отметки: series-1…series-6 */
          color: "var(--series-" + (i + 1) + ")"
        };
      });
      global.Charts.line(asinChart, {
        labels: weeks,
        series: asinSeries,
        area: false,
        formatY: function (v, axis) {
          return axis ? Fmt.moneyCompact(v, currency) : Fmt.money(v, currency, 2);
        },
        formatX: function (d, full) { return full ? Fmt.date(d) : Fmt.dateShort(d); },
        ariaLabel: T("chart.asinWeekly"),
        height: 220
      });
      global.Charts.legend(asinLegend, asinSeries.map(function (s) {
        return { label: s.name, color: s.color };
      }), "line");
      global.Charts.table(asinTable, {
        caption: T("chart.asinWeekly"),
        columns: [{ label: T("table.week") }].concat(picked.map(function (a) {
          return { label: a, numeric: true };
        })),
        rows: weeks.map(function (w, wi) {
          return [Fmt.date(w)].concat(asinSeries.map(function (s) {
            return Fmt.money(s.values[wi], currency, 2);
          }));
        })
      });
      asinHint.hidden = true;
    } else {
      asinChart.textContent = "";
      asinLegend.textContent = "";
      asinTable.textContent = "";
      asinHint.hidden = false;
    }

    /* ---- Таблица товаров с чекбоксами «в график» ----
       Собирается руками, а не через Charts.table: внутри живые элементы
       управления, а не только текст. */
    var host = $("m-products");
    host.textContent = "";
    var wrap = el("div", "table-wrap");
    var tbl = el("table", "data");
    tbl.appendChild(el("caption", "sr-only", T("margin.products")));

    var thead = el("thead");
    var htr = el("tr");
    [
      { label: T("table.asin") },
      { label: T("table.revenue"), numeric: true },
      { label: T("table.units"), numeric: true },
      { label: T("table.costs"), numeric: true },
      { label: T("table.cogs"), numeric: true },
      { label: T("kpi.margin"), numeric: true },
      { label: T("margin.inChart"), cls: "margin-pick-cell" }
    ].forEach(function (col) {
      var th = el("th", col.cls || (col.numeric ? "num" : null), col.label);
      th.setAttribute("scope", "col");
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    tbl.appendChild(thead);

    var tbody = el("tbody");
    prods.forEach(function (p) {
      var isOther = p.asin === "OTHER";
      var k = marginCalc({
        revenue: p.revenue, fees: p.fees, ads: p.ads, refunded: p.refunded,
        cogs: p.noCogs ? null : p.cogs
      });

      var tr = el("tr", isOther ? "margin-other" : null);

      var tdA = el("td");
      tdA.appendChild(el("span", null, p.asin));
      if (p.noCogs && !isOther) {
        var badge = el("span", "margin-nocogs", T("margin.noCogs"));
        badge.title = T("margin.noCogsHint");
        tdA.appendChild(badge);
      }
      tr.appendChild(tdA);

      tr.appendChild(el("td", "num", Fmt.money(p.revenue, currency, 2)));
      tr.appendChild(el("td", "num", Fmt.number(p.units)));
      tr.appendChild(el("td", "num", Fmt.money(p.fees + p.ads, currency, 2)));
      tr.appendChild(el("td", "num",
        p.noCogs ? "—" : Fmt.money(p.cogs, currency, 2)));
      tr.appendChild(el("td", "num",
        k.marginPct == null ? "—" : Fmt.percent(k.marginPct)));

      var tdPick = el("td", "margin-pick-cell");
      if (!isOther) {
        var cb = el("input", "margin-pick");
        cb.type = "checkbox";
        cb.checked = marginState.chartAsins.indexOf(p.asin) !== -1;
        cb.setAttribute("aria-label", T("margin.inChart") + ": " + p.asin);
        cb.addEventListener("change", function () {
          var list = marginState.chartAsins;
          var at = list.indexOf(p.asin);
          if (cb.checked) {
            if (at === -1) list.push(p.asin);
            /* Больше шести линий не рисуем: седьмая отметка вытесняет
               самую давнюю, а не добавляет седьмой цвет */
            while (list.length > 6) list.shift();
          } else if (at !== -1) {
            list.splice(at, 1);
          }
          renderMargin();
        });
        tdPick.appendChild(cb);
      }
      tr.appendChild(tdPick);
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    wrap.appendChild(tbl);
    host.appendChild(wrap);

    /* Примечание о покрытии себестоимостью — из meta.cogs */
    var cogsMeta = mg.meta && mg.meta.cogs;
    var note = $("m-cogs-note");
    if (cogsMeta && cogsMeta.asins) {
      note.textContent = T("margin.cogsNote")
        .replace("{x}", Fmt.number(cogsMeta.asinsWithCost))
        .replace("{y}", Fmt.number(cogsMeta.asins));
      note.title = (cogsMeta.topUncovered && cogsMeta.topUncovered.length)
        ? T("margin.noCogs") + ": " + cogsMeta.topUncovered.join(", ")
        : "";
      note.hidden = false;
    } else {
      note.textContent = "";
      note.hidden = true;
    }
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
