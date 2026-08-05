/* ============================================================================
   i18n.js — русский / английский / украинский
   ----------------------------------------------------------------------------
   Один словарь на язык. Ключи плоские, чтобы не плодить вложенность.
   Форматирование чисел и дат идёт через Intl с локалью языка, а не вручную.
   ========================================================================= */

(function (global) {
  "use strict";

  var LANGS = ["ru", "en", "uk"];

  var LOCALES = { ru: "ru-RU", en: "en-US", uk: "uk-UA" };

  var NATIVE_NAMES = { ru: "Русский", en: "English", uk: "Українська" };

  var DICT = {
    /* ---------------------------------------------------------------- RU */
    ru: {
      "app.title": "Дашборд продаж Amazon",
      "app.subtitle": "Персональная витрина показателей",

      "login.heading": "Вход",
      "login.user": "Логин",
      "login.password": "Пароль",
      "login.userPlaceholder": "ваш логин",
      "login.passwordPlaceholder": "пароль",
      "login.submit": "Войти",
      "login.working": "Расшифровка…",
      "login.showPassword": "Показать пароль",
      "login.hidePassword": "Скрыть пароль",
      "login.note":
        "Данные на этой странице зашифрованы. Пароль нигде не хранится — он расшифровывает их прямо в браузере.",
      "login.hintLabel": "Подсказка:",

      "error.badCredentials": "Неверный логин или пароль",
      "error.noData":
        "Файл с данными не найден. Загрузите data/dashboard.enc.js в репозиторий.",
      "error.noCrypto":
        "Браузер не поддерживает Web Crypto. Откройте страницу по https и обновите браузер.",
      "error.noGzip":
        "Браузер не умеет распаковывать gzip. Обновите браузер или пересоберите файл данных без сжатия.",
      "error.badPayload": "Файл с данными повреждён или имеет неизвестный формат.",
      "error.generic": "Не удалось открыть данные",

      "nav.signOut": "Выйти",
      "nav.theme": "Тема",
      "nav.themeLight": "Светлая",
      "nav.themeDark": "Тёмная",
      "nav.themeSystem": "Как в системе",
      "nav.language": "Язык",
      "nav.updated": "Обновлено",

      "filter.period": "Период",
      "filter.period7": "7 дней",
      "filter.period30": "30 дней",
      "filter.period90": "90 дней",
      "filter.periodYtd": "С начала года",
      "filter.periodAll": "Весь период",
      "filter.currency": "Валюта",
      "filter.marketplace": "Маркетплейс",
      "filter.all": "Все",
      "filter.note":
        "Валюты не сводятся на одну шкалу — выберите одну. Штуки считаются по всем маркетплейсам сразу.",

      "kpi.revenue": "Выручка",
      "kpi.units": "Продано штук",
      "kpi.orders": "Заказов",
      "kpi.avgOrder": "Средний чек",
      "kpi.skus": "Активных SKU",
      "kpi.vsPrev": "к предыдущему периоду",

      "chart.revenueOverTime": "Выручка по дням",
      "chart.revenueOverTimeCaption":
        "Сумма item-price без налога. Наведите курсор — покажет точное значение.",
      "chart.unitsOverTime": "Штуки по дням",
      "chart.byMarketplace": "Выручка по маркетплейсам",
      "chart.byMarketplaceCaption": "Доля каждой витрины в выручке за период.",
      "chart.topSkus": "Топ товаров по штукам",
      "chart.topSkusCaption": "Десять позиций с наибольшим количеством продаж.",

      "table.show": "Таблица",
      "table.hide": "График",
      "table.date": "Дата",
      "table.value": "Значение",
      "table.marketplace": "Маркетплейс",
      "table.sku": "SKU",
      "table.product": "Товар",
      "table.units": "Штук",
      "table.revenue": "Выручка",
      "table.share": "Доля",
      "table.total": "Итого",

      "empty.title": "Данных пока нет",
      "empty.text":
        "Шаблон готов и ждёт наполнения. Следующий шаг — выгрузить показатели из SP-API и зашифровать их в файл данных.",
      "empty.noRows": "За выбранный период данных нет",

      "footer.note": "Статическая страница. Все расчёты идут в браузере.",
      "a11y.skipToContent": "Перейти к содержимому",
      "a11y.chartTable": "Табличное представление графика"
    },

    /* ---------------------------------------------------------------- EN */
    en: {
      "app.title": "Amazon Sales Dashboard",
      "app.subtitle": "Personal metrics workspace",

      "login.heading": "Sign in",
      "login.user": "Username",
      "login.password": "Password",
      "login.userPlaceholder": "your username",
      "login.passwordPlaceholder": "password",
      "login.submit": "Sign in",
      "login.working": "Decrypting…",
      "login.showPassword": "Show password",
      "login.hidePassword": "Hide password",
      "login.note":
        "The data on this page is encrypted. Your password is never stored — it decrypts the data right in your browser.",
      "login.hintLabel": "Hint:",

      "error.badCredentials": "Wrong username or password",
      "error.noData":
        "Data file not found. Upload data/dashboard.enc.js to the repository.",
      "error.noCrypto":
        "This browser has no Web Crypto support. Open the page over https and update your browser.",
      "error.noGzip":
        "This browser cannot decompress gzip. Update it, or rebuild the data file without compression.",
      "error.badPayload": "The data file is corrupted or in an unknown format.",
      "error.generic": "Could not open the data",

      "nav.signOut": "Sign out",
      "nav.theme": "Theme",
      "nav.themeLight": "Light",
      "nav.themeDark": "Dark",
      "nav.themeSystem": "System",
      "nav.language": "Language",
      "nav.updated": "Updated",

      "filter.period": "Period",
      "filter.period7": "7 days",
      "filter.period30": "30 days",
      "filter.period90": "90 days",
      "filter.periodYtd": "Year to date",
      "filter.periodAll": "All time",
      "filter.currency": "Currency",
      "filter.marketplace": "Marketplace",
      "filter.all": "All",
      "filter.note":
        "Currencies never share a scale — pick one. Unit counts cover every marketplace at once.",

      "kpi.revenue": "Revenue",
      "kpi.units": "Units sold",
      "kpi.orders": "Orders",
      "kpi.avgOrder": "Average order",
      "kpi.skus": "Active SKUs",
      "kpi.vsPrev": "vs previous period",

      "chart.revenueOverTime": "Revenue by day",
      "chart.revenueOverTimeCaption":
        "Item price excluding tax. Hover for the exact value.",
      "chart.unitsOverTime": "Units by day",
      "chart.byMarketplace": "Revenue by marketplace",
      "chart.byMarketplaceCaption": "Each storefront's share of revenue for the period.",
      "chart.topSkus": "Top products by units",
      "chart.topSkusCaption": "The ten best-selling positions.",

      "table.show": "Table",
      "table.hide": "Chart",
      "table.date": "Date",
      "table.value": "Value",
      "table.marketplace": "Marketplace",
      "table.sku": "SKU",
      "table.product": "Product",
      "table.units": "Units",
      "table.revenue": "Revenue",
      "table.share": "Share",
      "table.total": "Total",

      "empty.title": "No data yet",
      "empty.text":
        "The template is ready and waiting to be filled. Next step: export the metrics from SP-API and encrypt them into the data file.",
      "empty.noRows": "No data for the selected period",

      "footer.note": "A static page. Every calculation runs in your browser.",
      "a11y.skipToContent": "Skip to content",
      "a11y.chartTable": "Table view of the chart"
    },

    /* ---------------------------------------------------------------- UK */
    uk: {
      "app.title": "Дашборд продажів Amazon",
      "app.subtitle": "Персональна вітрина показників",

      "login.heading": "Вхід",
      "login.user": "Логін",
      "login.password": "Пароль",
      "login.userPlaceholder": "ваш логін",
      "login.passwordPlaceholder": "пароль",
      "login.submit": "Увійти",
      "login.working": "Розшифрування…",
      "login.showPassword": "Показати пароль",
      "login.hidePassword": "Приховати пароль",
      "login.note":
        "Дані на цій сторінці зашифровані. Пароль ніде не зберігається — він розшифровує їх просто у браузері.",
      "login.hintLabel": "Підказка:",

      "error.badCredentials": "Невірний логін або пароль",
      "error.noData":
        "Файл з даними не знайдено. Завантажте data/dashboard.enc.js до репозиторію.",
      "error.noCrypto":
        "Браузер не підтримує Web Crypto. Відкрийте сторінку через https та оновіть браузер.",
      "error.noGzip":
        "Браузер не вміє розпаковувати gzip. Оновіть його або перезберіть файл даних без стиснення.",
      "error.badPayload": "Файл з даними пошкоджено або він має невідомий формат.",
      "error.generic": "Не вдалося відкрити дані",

      "nav.signOut": "Вийти",
      "nav.theme": "Тема",
      "nav.themeLight": "Світла",
      "nav.themeDark": "Темна",
      "nav.themeSystem": "Як у системі",
      "nav.language": "Мова",
      "nav.updated": "Оновлено",

      "filter.period": "Період",
      "filter.period7": "7 днів",
      "filter.period30": "30 днів",
      "filter.period90": "90 днів",
      "filter.periodYtd": "Від початку року",
      "filter.periodAll": "Увесь період",
      "filter.currency": "Валюта",
      "filter.marketplace": "Маркетплейс",
      "filter.all": "Усі",
      "filter.note":
        "Валюти не зводяться на одну шкалу — оберіть одну. Штуки рахуються по всіх маркетплейсах одразу.",

      "kpi.revenue": "Виторг",
      "kpi.units": "Продано штук",
      "kpi.orders": "Замовлень",
      "kpi.avgOrder": "Середній чек",
      "kpi.skus": "Активних SKU",
      "kpi.vsPrev": "до попереднього періоду",

      "chart.revenueOverTime": "Виторг за днями",
      "chart.revenueOverTimeCaption":
        "Сума item-price без податку. Наведіть курсор — покаже точне значення.",
      "chart.unitsOverTime": "Штуки за днями",
      "chart.byMarketplace": "Виторг за маркетплейсами",
      "chart.byMarketplaceCaption": "Частка кожної вітрини у виторгу за період.",
      "chart.topSkus": "Топ товарів за штуками",
      "chart.topSkusCaption": "Десять позицій з найбільшою кількістю продажів.",

      "table.show": "Таблиця",
      "table.hide": "Графік",
      "table.date": "Дата",
      "table.value": "Значення",
      "table.marketplace": "Маркетплейс",
      "table.sku": "SKU",
      "table.product": "Товар",
      "table.units": "Штук",
      "table.revenue": "Виторг",
      "table.share": "Частка",
      "table.total": "Разом",

      "empty.title": "Даних поки немає",
      "empty.text":
        "Шаблон готовий і чекає на наповнення. Наступний крок — вивантажити показники з SP-API та зашифрувати їх у файл даних.",
      "empty.noRows": "За обраний період даних немає",

      "footer.note": "Статична сторінка. Усі обчислення відбуваються у браузері.",
      "a11y.skipToContent": "Перейти до вмісту",
      "a11y.chartTable": "Табличне подання графіка"
    }
  };

  var current = "en";

  /* Определение языка: сохранённый выбор → язык браузера → английский */
  function detect() {
    try {
      var saved = global.localStorage.getItem("dashboard.lang");
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {
      /* localStorage может быть недоступен — не повод падать */
    }
    var candidates = (global.navigator.languages && global.navigator.languages.length)
      ? global.navigator.languages
      : [global.navigator.language || "en"];

    for (var i = 0; i < candidates.length; i++) {
      var base = String(candidates[i]).toLowerCase().split("-")[0];
      if (LANGS.indexOf(base) !== -1) return base;
    }
    return "en";
  }

  function setLang(lang) {
    current = LANGS.indexOf(lang) !== -1 ? lang : "en";
    try {
      global.localStorage.setItem("dashboard.lang", current);
    } catch (e) {
      /* см. выше */
    }
    return current;
  }

  function getLang() {
    return current;
  }

  function locale() {
    return LOCALES[current] || "en-US";
  }

  /* t("ключ") — если ключа нет в текущем языке, откат на английский,
     а затем на сам ключ (чтобы пропажа была видна, а не молча пустела). */
  function t(key) {
    var table = DICT[current] || DICT.en;
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    if (Object.prototype.hasOwnProperty.call(DICT.en, key)) return DICT.en[key];
    return key;
  }

  global.I18N = {
    LANGS: LANGS,
    NATIVE_NAMES: NATIVE_NAMES,
    detect: detect,
    setLang: setLang,
    getLang: getLang,
    locale: locale,
    t: t
  };
})(window);
