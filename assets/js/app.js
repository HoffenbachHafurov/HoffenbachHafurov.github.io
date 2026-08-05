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
        /* Форматы чисел и дат зависят от локали — карточки нужно пересобрать */
        if (state.data) { buildFilters(); render(); }
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
    buildFilters();
    render();
    var meta = state.data && state.data.meta;
    $("updated-at").textContent = meta && meta.generatedAt
      ? T("nav.updated") + ": " + Fmt.dateTime(meta.generatedAt)
      : "";
  }

  function signOut() {
    /* Данные выбрасываем из памяти. Перезайти можно только с паролем. */
    state.data = null;
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

  function skuRows() {
    return (state.data && state.data.skus) || [];
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

  function periodBounds() {
    var last = maxDate(rows());
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
    if (state.filters.currency && row.currency !== state.filters.currency) return false;
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

    /* Валюты: складывать EUR с GBP нельзя, поэтому это переключатель,
       а не «все сразу» */
    var currencies = {};
    rows().forEach(function (r) { if (r.currency) currencies[r.currency] = true; });
    var codes = Object.keys(currencies).sort();
    if (!state.filters.currency || codes.indexOf(state.filters.currency) === -1) {
      var preferred = state.data && state.data.meta && state.data.meta.defaultCurrency;
      state.filters.currency = (preferred && codes.indexOf(preferred) !== -1)
        ? preferred
        : codes[0] || null;
    }
    var currencySel = $("filter-currency");
    currencySel.textContent = "";
    codes.forEach(function (code) {
      var opt = el("option", null, code);
      opt.value = code;
      if (code === state.filters.currency) opt.selected = true;
      currencySel.appendChild(opt);
    });
    currencySel.disabled = codes.length < 2;

    var marketSel = $("filter-marketplace");
    marketSel.textContent = "";
    var allOpt = el("option", null, T("filter.all"));
    allOpt.value = "all";
    marketSel.appendChild(allOpt);
    var seen = {};
    rows().forEach(function (r) { if (r.marketplace) seen[r.marketplace] = true; });
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
    state.filters.currency = $("filter-currency").value || null;
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

    if (opts.spark && opts.spark.length > 1) {
      var holder = el("div", "stat__spark");
      node.appendChild(holder);
      global.Charts.sparkline(holder, {
        points: opts.spark,
        color: "var(--series-other)",
        accent: "var(--series-1)",
        height: opts.hero ? 44 : 30
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

  function render() {
    var bounds = periodBounds();
    var current = slice(rows(), bounds.from, bounds.to);
    var previous = bounds.prevFrom ? slice(rows(), bounds.prevFrom, bounds.prevTo) : [];

    var hasData = rows().length > 0;
    $("empty-state").hidden = hasData;
    $("dashboard").hidden = !hasData;
    if (!hasData) return;

    var currency = state.filters.currency;

    /* ---- Показатели ---- */
    var revenue = sum(current, "revenue");
    var units = sum(current, "units");
    var orders = sum(current, "orders");
    var avg = orders > 0 ? revenue / orders : 0;

    var prevRevenue = sum(previous, "revenue");
    var prevUnits = sum(previous, "units");
    var prevOrders = sum(previous, "orders");
    var prevAvg = prevOrders > 0 ? prevRevenue / prevOrders : 0;

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
      value: Fmt.number(orders),
      delta: growth(orders, prevOrders),
      spark: tail(orderSeries.values, 12)
    });
    renderStat($("kpi-avg"), {
      label: T("kpi.avgOrder"),
      value: Fmt.money(avg, currency, 2),
      delta: growth(avg, prevAvg)
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
        { label: T("table.sku") },
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
    ["filter-period", "filter-currency", "filter-marketplace"].forEach(function (id) {
      $(id).addEventListener("change", onFilterChange);
    });
    wireTableToggles();

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
