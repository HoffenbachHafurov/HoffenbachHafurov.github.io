/* ============================================================================
   format.js — числа, деньги, даты, проценты
   Всё через Intl с текущей локалью: разделители разрядов, порядок дат и
   позиция символа валюты отличаются в ru / en / uk, руками это не собрать.
   ========================================================================= */

(function (global) {
  "use strict";

  /* Форматтеры Intl дорогие в создании — кешируем по ключу. */
  var cache = {};

  function fmt(kind, locale, options) {
    var key = kind + "|" + locale + "|" + JSON.stringify(options || {});
    if (!cache[key]) {
      cache[key] =
        kind === "date"
          ? new Intl.DateTimeFormat(locale, options)
          : new Intl.NumberFormat(locale, options);
    }
    return cache[key];
  }

  function loc() {
    return global.I18N ? global.I18N.locale() : "en-US";
  }

  function isNum(v) {
    return typeof v === "number" && isFinite(v);
  }

  /* ---- Числа ------------------------------------------------------------ */

  function number(value, decimals) {
    if (!isNum(value)) return "—";
    return fmt("num", loc(), {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals == null ? 0 : decimals
    }).format(value);
  }

  /* Компактная запись для плиток показателей: 12,9 тыс. / 4,2 млн */
  function compact(value) {
    if (!isNum(value)) return "—";
    if (Math.abs(value) < 1000) return number(value);
    return fmt("num", loc(), {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);
  }

  /* ---- Деньги -----------------------------------------------------------
     Валюта обязательна: складывать EUR с GBP нельзя, и подпись должна об этом
     напоминать на каждом значении. */

  function money(value, currency, decimals) {
    if (!isNum(value)) return "—";
    if (!currency) return number(value, decimals);
    try {
      return fmt("num", loc(), {
        style: "currency",
        currency: currency,
        minimumFractionDigits: decimals == null ? 0 : decimals,
        maximumFractionDigits: decimals == null ? 0 : decimals
      }).format(value);
    } catch (e) {
      /* Неизвестный код валюты — не роняем страницу */
      return number(value, decimals) + " " + currency;
    }
  }

  function moneyCompact(value, currency) {
    if (!isNum(value)) return "—";
    if (!currency) return compact(value);
    try {
      return fmt("num", loc(), {
        style: "currency",
        currency: currency,
        notation: "compact",
        maximumFractionDigits: 1
      }).format(value);
    } catch (e) {
      return compact(value) + " " + currency;
    }
  }

  /* ---- Проценты и дельты ------------------------------------------------ */

  function percent(value, decimals) {
    if (!isNum(value)) return "—";
    return fmt("num", loc(), {
      style: "percent",
      minimumFractionDigits: decimals == null ? 1 : decimals,
      maximumFractionDigits: decimals == null ? 1 : decimals
    }).format(value);
  }

  /* Дельта всегда со знаком — иначе непонятно, рост это или падение */
  function delta(value, decimals) {
    if (!isNum(value)) return "—";
    return fmt("num", loc(), {
      style: "percent",
      signDisplay: "exceptZero",
      minimumFractionDigits: decimals == null ? 1 : decimals,
      maximumFractionDigits: decimals == null ? 1 : decimals
    }).format(value);
  }

  /* ---- Даты -------------------------------------------------------------
     Даты приходят строками ISO ("2026-08-05"). Разбираем как UTC, чтобы
     часовой пояс не сдвигал день на единицу. */

  function parseDate(value) {
    if (value instanceof Date) return value;
    var s = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + "T00:00:00Z");
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function date(value, options) {
    var d = parseDate(value);
    if (!d) return "—";
    return fmt(
      "date",
      loc(),
      options || { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
    ).format(d);
  }

  /* Короткая подпись для оси X — без года, он и так в заголовке периода */
  function dateShort(value) {
    return date(value, { day: "numeric", month: "short", timeZone: "UTC" });
  }

  function dateTime(value) {
    var d = parseDate(value);
    if (!d) return "—";
    return fmt("date", loc(), {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  }

  global.Fmt = {
    number: number,
    compact: compact,
    money: money,
    moneyCompact: moneyCompact,
    percent: percent,
    delta: delta,
    date: date,
    dateShort: dateShort,
    dateTime: dateTime,
    parseDate: parseDate
  };
})(window);
