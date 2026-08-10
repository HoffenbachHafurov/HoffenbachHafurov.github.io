/* ============================================================================
   runs.js — журнал синхронизаций
   ----------------------------------------------------------------------------
   Общий модуль для двух потребителей: колокольчик в шапке дашборда (модальное
   окно) и отдельная страница logs.html.

   Источник данных — window.DASHBOARD_RUNS из data/runs.js, который пишет
   конвейер (src/Write-RunLog.ps1 в приватном репозитории).

   🔴 Журнал НЕ шифруется. Это осознанно: причину сбоя нужно видеть и тогда,
   когда войти в дашборд нельзя — например, если сломалась сама выгрузка.
   Поэтому в журнал не попадают ни деньги, ни SKU, ни разбивка по маркетплейсам.

   Тексты ошибок приходят от Amazon и GitHub, то есть это НЕДОВЕРЕННЫЕ данные.
   Всё вставляется через textContent, innerHTML не используется нигде.
   ========================================================================= */

(function (global) {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function T(key, fallback) {
    if (global.I18N && typeof global.I18N.t === "function") {
      var v = global.I18N.t(key);
      if (v && v !== key) return v;
    }
    return fallback != null ? fallback : key;
  }

  /* ---------------------------------------------------------------- данные */

  function data() {
    return global.DASHBOARD_RUNS || null;
  }

  function list() {
    var d = data();
    return (d && Array.isArray(d.runs)) ? d.runs : [];
  }

  function integration() {
    var d = data();
    return (d && d.integrations && d.integrations[0]) || null;
  }

  /* Последний прогон и последний УСПЕШНЫЙ — это разные вещи. Если последний
     упал, важно знать, насколько свежи данные, которые сейчас на экране. */
  function summary() {
    var runs = list();
    var lastSuccess = null;
    for (var i = 0; i < runs.length; i++) {
      if (runs[i].status === "success" || runs[i].status === "partial") {
        lastSuccess = runs[i];
        break;
      }
    }
    var last = runs[0] || null;
    var stale = false;
    var hoursSince = null;

    if (lastSuccess && lastSuccess.finishedAt) {
      var ms = Date.now() - Date.parse(lastSuccess.finishedAt);
      hoursSince = ms / 3600000;
      /* Расписание — каждые 5 часов, но GitHub его не соблюдает (см. README).
         Тревожим только когда пропущено больше двух окон подряд. */
      stale = hoursSince > 11;
    } else if (runs.length) {
      stale = true;
    }

    return {
      last: last,
      lastSuccess: lastSuccess,
      stale: stale,
      hoursSinceSuccess: hoursSince,
      total: runs.length,
      /* Значок на колокольчике: тревожный, если последний прогон неудачен
         или данные протухли. */
      alert: !runs.length || (last && last.status === "failed") || stale
    };
  }

  /* --------------------------------------------------------------- значки */

  function badge(status) {
    var wrap = el("span", "runbadge runbadge--" + (status || "unknown"));
    var s = svg("svg", { width: "16", height: "16", viewBox: "0 0 16 16",
                         "aria-hidden": "true", focusable: "false" });
    s.appendChild(svg("circle", { cx: "8", cy: "8", r: "8", class: "runbadge__disc" }));

    var mark = { d: "", w: "2" };
    if (status === "success") mark.d = "M4.5 8.4l2.3 2.3 4.7-5";
    else if (status === "failed") mark.d = "M5.2 5.2l5.6 5.6M10.8 5.2l-5.6 5.6";
    else if (status === "partial") mark.d = "M8 4.2v4.6M8 11.2v.1";
    else mark.d = "M4.8 8h6.4";

    s.appendChild(svg("path", {
      d: mark.d, fill: "none", stroke: "currentColor", "stroke-width": mark.w,
      "stroke-linecap": "round", "stroke-linejoin": "round", class: "runbadge__mark"
    }));
    wrap.appendChild(s);
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", statusText(status));
    return wrap;
  }

  function statusText(status) {
    if (status === "success") return T("sync.ok", "Успешно");
    if (status === "failed") return T("sync.failed", "Сбой");
    if (status === "partial") return T("sync.partial", "Данные неполные");
    if (status === "skipped") return T("sync.skipped", "Пропущен");
    return T("sync.unknown", "Неизвестно");
  }

  /* ------------------------------------------------------------ форматы */

  function when(iso) {
    if (!iso) return "—";
    if (global.Fmt && typeof global.Fmt.dateTime === "function") {
      return global.Fmt.dateTime(iso);
    }
    return new Date(iso).toLocaleString();
  }

  function duration(sec) {
    if (sec == null || !isFinite(sec)) return "—";
    var s = Math.max(0, Math.round(sec));
    if (s < 60) return s + " " + T("sync.sec", "с");
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + " " + T("sync.min", "мин") + (r ? " " + r + " " + T("sync.sec", "с") : "");
  }

  function triggerText(trigger) {
    if (trigger === "schedule") return T("sync.bySchedule", "по расписанию");
    if (trigger === "workflow_dispatch") return T("sync.manual", "вручную");
    return trigger || "—";
  }

  /* ------------------------------------------------- компактный список */
  /* Для модального окна: последние N прогонов, по строке на каждый. */

  function renderList(container, limit) {
    container.textContent = "";
    var runs = list().slice(0, limit || 6);

    if (!runs.length) {
      container.appendChild(el("p", "runs__empty",
        T("sync.noRuns", "Журнал пуст. Первая запись появится после ближайшей синхронизации.")));
      return;
    }

    runs.forEach(function (r) {
      var row = el("div", "runrow");
      row.appendChild(badge(r.status));

      var main = el("div", "runrow__main");
      main.appendChild(el("div", "runrow__when", when(r.startedAt)));

      var meta = el("div", "runrow__meta");
      meta.appendChild(el("span", null, statusText(r.status)));
      meta.appendChild(el("span", "runrow__dot", "·"));
      meta.appendChild(el("span", null, duration(r.durationSec)));
      meta.appendChild(el("span", "runrow__dot", "·"));
      meta.appendChild(el("span", null, triggerText(r.trigger)));
      main.appendChild(meta);

      /* Причина сбоя — то, ради чего журнал и заводился. Показываем сразу,
         не пряча за переходом на отдельную страницу. */
      if (r.error && r.error.message) {
        var err = el("div", "runrow__error");
        if (r.error.type) err.appendChild(el("strong", null, r.error.type + ": "));
        err.appendChild(document.createTextNode(r.error.message));
        main.appendChild(err);
      }

      row.appendChild(main);
      container.appendChild(row);
    });
  }

  /* ------------------------------------------------------ полный журнал */
  /* Для logs.html: разворачиваемая карточка на каждый прогон. */

  function renderFull(container, runs) {
    container.textContent = "";
    runs = runs || list();

    if (!runs.length) {
      container.appendChild(el("p", "runs__empty",
        T("sync.noRuns", "Журнал пуст. Первая запись появится после ближайшей синхронизации.")));
      return;
    }

    runs.forEach(function (r) {
      var card = el("article", "logcard logcard--" + (r.status || "unknown"));

      var head = el("div", "logcard__head");
      head.appendChild(badge(r.status));

      var title = el("div", "logcard__title");
      title.appendChild(el("div", "logcard__when", when(r.startedAt)));
      var sub = el("div", "logcard__sub");
      sub.appendChild(el("span", null, statusText(r.status)));
      sub.appendChild(el("span", "runrow__dot", "·"));
      sub.appendChild(el("span", null, duration(r.durationSec)));
      sub.appendChild(el("span", "runrow__dot", "·"));
      sub.appendChild(el("span", null, triggerText(r.trigger)));
      if (r.period && r.period.from) {
        sub.appendChild(el("span", "runrow__dot", "·"));
        sub.appendChild(el("span", null, r.period.from + " — " + r.period.to));
      }
      title.appendChild(sub);
      head.appendChild(title);

      if (r.runUrl) {
        var a = el("a", "link logcard__link", T("sync.openRun", "Лог запуска"));
        a.href = r.runUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        head.appendChild(a);
      }
      card.appendChild(head);

      if (r.error && r.error.message) {
        var box = el("div", "logcard__error");
        box.appendChild(el("div", "logcard__error-type",
          r.error.type || T("sync.failed", "Сбой")));
        box.appendChild(el("div", "logcard__error-text", r.error.message));
        card.appendChild(box);
      }

      if (r.coverage) {
        var cov = el("div", "logcard__coverage");
        [
          [T("sync.covDays", "Дней получено"),
           r.coverage.coveredDays + " / " + r.coverage.expectedDays +
             (r.coverage.percent != null ? "  (" + r.coverage.percent + " %)" : "")],
          [T("sync.covRows", "Строк по дням"), fmtNum(r.coverage.rows)],
          [T("sync.covFees", "Строк по комиссиям"), fmtNum(r.coverage.feeRows)],
          [T("sync.covProducts", "Строк по товарам"), fmtNum(r.coverage.productRows)]
        ].forEach(function (pair) {
          var cell = el("div", "logcard__cov-cell");
          cell.appendChild(el("div", "logcard__cov-label", pair[0]));
          cell.appendChild(el("div", "logcard__cov-value", pair[1]));
          cov.appendChild(cell);
        });
        card.appendChild(cov);
      }

      if (r.steps && r.steps.length) {
        var steps = el("ol", "logsteps");
        r.steps.forEach(function (s) {
          var li = el("li", "logstep logstep--" + (s.status || "unknown"));
          li.appendChild(badge(s.status));
          var body = el("div", "logstep__body");
          body.appendChild(el("div", "logstep__name", s.name));
          if (s.detail) body.appendChild(el("div", "logstep__detail", s.detail));
          li.appendChild(body);
          li.appendChild(el("div", "logstep__time", duration(s.durationSec)));
          steps.appendChild(li);
        });
        card.appendChild(steps);
      }

      container.appendChild(card);
    });
  }

  function fmtNum(n) {
    if (n == null || !isFinite(n)) return "—";
    if (global.Fmt && typeof global.Fmt.number === "function") return global.Fmt.number(n);
    return String(n);
  }

  global.Runs = {
    data: data,
    list: list,
    integration: integration,
    summary: summary,
    badge: badge,
    statusText: statusText,
    when: when,
    duration: duration,
    triggerText: triggerText,
    renderList: renderList,
    renderFull: renderFull
  };
})(window);
