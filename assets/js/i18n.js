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
      "filter.fxOn": "Курс ЕЦБ на",
      "filter.note":
        "Все суммы приведены к евро по курсам ЕЦБ. Фильтр по витрине действует на все карточки ниже.",

      "kpi.revenue": "Выручка",
      "kpi.units": "Продано штук",
      "kpi.orders": "Заказов",
      "kpi.avgOrder": "Средний чек",
      "kpi.skus": "Активных ASIN",
      "kpi.ordersUnavailable": "Data Kiosk не отдаёт число заказов",
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
      "table.asin": "ASIN",
      "table.product": "Товар",
      "table.units": "Штук",
      "table.revenue": "Выручка",
      "table.share": "Доля",
      "table.total": "Итого",

      "empty.title": "Данных пока нет",
      "empty.text":
        "Шаблон готов и ждёт наполнения. Следующий шаг — выгрузить показатели из SP-API и зашифровать их в файл данных.",
      "empty.noRows": "За выбранный период данных нет",

      "nav.mainMenu": "Главное меню",
      "nav.analytics": "Аналитика",
      "nav.catalog": "Каталог",
      "nav.operations": "Операции",
      "nav.system": "Система",

      "page.salesAnalysis": "Анализ продаж",
      "page.overview": "Обзор продаж",
      "page.products": "Товары",
      "page.inventory": "Запасы",
      "page.orders": "Заказы",
      "page.returns": "Возвраты",
      "page.wiki": "База знаний",
      "wiki.empty": "Документация не найдена в данных. Обновите выгрузку.",
      "page.settings": "Настройки",
      "page.soon": "скоро",
      "page.soonText":
        "Этот раздел ещё не наполнен. Каркас готов — содержимое добавим следующим шагом.",

      "kpi.netProceeds": "Чистый доход",
      "kpi.margin": "Маржа",
      "kpi.fees": "Комиссии Amazon",
      "kpi.feeShare": "Доля комиссий",
      "kpi.refunds": "Возвраты",
      "kpi.ofRevenue": "от выручки",

      "chart.revenueVsNet": "Выручка и чистый доход по дням",
      "chart.revenueVsNetCaption":
        "Чистый доход = выручка минус все комиссии Amazon и реклама. Обе величины в одной валюте, поэтому шкала одна.",
      "chart.feeMix": "Структура расходов",
      "chart.feeMixCaption": "Доля каждого типа комиссии в общих расходах за период.",
      "chart.feesByType": "Комиссии по типам",
      "chart.feesByTypeCaption":
        "Списания показаны положительными. Возмещения вынесены в таблицу отдельными строками со знаком плюс — в структуру расходов они не входят. Хранение начисляется не каждый день.",
      "chart.topByNet": "Товары по чистому доходу",
      "chart.topByNetCaption": "Десять позиций с наибольшим чистым доходом за период.",

      "table.feeType": "Тип комиссии",
      "table.amount": "Сумма",
      "table.netProceeds": "Чистый доход",
      "table.ordered": "Заказано",
      "table.refunded": "Возвращено",

      /* --- Маржа по странам --- */
      "page.margin": "Маржа по странам",
      "margin.empty": "В данных нет узла маржи. Обновите выгрузку конвейера.",
      "kpi.revenueNet": "Выручка (нетто)",
      "kpi.amazonCosts": "Расходы Amazon",
      "kpi.cogs": "Себестоимость (COGS)",
      "kpi.profit": "Прибыль",
      "margin.pp": "п.п.",
      "chart.marginTrend": "Выручка и прибыль по дням",
      "chart.marginTrendCaption":
        "Прибыль = выручка нетто минус комиссии, реклама и себестоимость. Подписка месячная и в дневные точки не входит.",
      "chart.seasonality": "Сезонность: маржа по месяцам",
      "margin.seasonNote":
        "Фильтр периода здесь не действует — показан весь диапазон данных. Фильтр витрины действует.",
      "margin.breakdown": "Разбор расходов",
      "margin.breakdownCaption": "За выбранный период. Доля — от выручки нетто.",
      "margin.ads": "Реклама",
      "margin.subscription": "Подписка Amazon",
      "chart.asinWeekly": "Недельная выручка выбранных товаров",
      "margin.pickHint":
        "Отметьте до шести товаров в таблице ниже — их линии появятся здесь.",
      "margin.products": "Товары (ASIN)",
      "margin.inChart": "В график",
      "margin.noCogs": "нет COGS",
      "margin.noCogsHint": "Себестоимость не задана — маржа этого товара не считается.",
      "margin.cogsNote": "Себестоимость известна для {x} из {y} товаров.",

      /* --- Раздел «4»: сравнение площадок --- */
      "page.cmp4": "4",
      "page.p30": "1",

      /* --- Раздел «20»: поисковые запросы --- */
      "page.sqp20": "20",
      "sqp.subtitle": "Неделя против предыдущей недели",
      "sqp.empty": "В выгрузке нет узла sqp. Отчёт Search Query Performance требует роли Brand Analytics и регистрации в Brand Registry.",
      "sqp.caption":
        "Доля показов — какую часть показов по запросу забрал мой товар, доля кликов — какую часть кликов. Доля кликов выше доли показов означает, что карточка кликается лучше рынка. Индекс CTR — мой CTR, делённый на рыночный по этому же запросу: он безразмерен и потому сравним между запросами разного размера.",
      "sqp.fix": "Показываюсь заслуженно — чинить карточку",
      "sqp.fixCaption":
        "CTR ниже рыночного, но клик доходит до покупки не хуже рынка. Трафик качественный, слаба выдача: главное изображение, заголовок, цена.",
      "sqp.irrelevant": "Нерелевантен — показы лишние",
      "sqp.irrelevantCaption":
        "Доля проседает и после клика: покупают заметно реже рынка. Запрос не мой, показы уходят впустую.",
      "sqp.all": "Все запросы",
      "sqp.allCaption": "Отсортированы по числу моих показов.",
      "sqp.none": "Ни одного запроса в этой группе.",
      "sqp.tableCaption": "Поисковые запросы за выбранную неделю",
      "sqp.col.query": "Запрос",
      "sqp.col.volume": "Объём поиска",
      "sqp.col.impressions": "Мои показы",
      "sqp.col.impShare": "Доля показов",
      "sqp.col.clicks": "Клики",
      "sqp.col.clickShare": "Доля кликов",
      "sqp.col.ctrIndex": "Индекс CTR",
      "sqp.col.buyIndex": "Индекс покупки",
      "sqp.col.marketPrice": "Цена рынка",
      "sqp.col.myPrice": "Моя цена",
      "sqp.col.deltaClickShare": "Δ доли кликов",
      "sqp.kpi.ctr": "Мой CTR",
      "sqp.kpi.ctrNote": "По рынку {x}",
      "sqp.kpi.impressions": "Мои показы",
      "sqp.kpi.impShare": "Доля показов",
      "sqp.kpi.clicks": "Клики",
      "sqp.kpi.clickShare": "Доля кликов",
      "sqp.kpi.volume": "Объём поиска",
      "sqp.kpi.volumeNote": "Весь рынок по {n} общим запросам",

      /* --- Раздел «24»: затоваривание и хранение --- */
      "page.ovr24": "24",
      "ovr.subtitle": "Затоваривание, возраст запаса и комиссии за хранение",
      "ovr.empty": "В выгрузке нет узла overstock. Нужен отчёт FBA Manage Inventory Health — он собирается src/Export-FbaInventoryHealth.ps1.",
      "ovr.snapshot": "Снимок запасов на {d} · витрины: {m}",
      "ovr.caption":
        "Запас в днях — остаток, делённый на скорость продаж за {w} дней. Порог {t} дня — первая корзина надбавки за выдержанный запас в самом отчёте. Излишек считается сверх {c} дней покрытия: собственная оценка излишков у Amazon по этому аккаунту равна нулю по всем позициям.",
      "ovr.kpi.stockValue": "Заморожено в запасе",
      "ovr.kpi.stockValueNote": "{n} единиц на складе",
      "ovr.kpi.inboundValue": "В пути",
      "ovr.kpi.inboundValueNote": "{n} единиц едет на склад",
      "ovr.kpi.storage12m": "Хранение за 12 мес",
      "ovr.kpi.storageNext": "Хранение, следующий месяц",
      "ovr.kpi.storage3m": "Прогноз хранения, 3 мес",
      "ovr.kpi.storage3mNote": "С поправкой на сезон: окт ×{o}, ноя ×{n}",
      "ovr.kpi.cross": "Единиц доживёт до порога",
      "ovr.kpi.crossNote": "Порог {t} дня",
      "ovr.age": "Возраст запаса",
      "ovr.ageCaption": "Сколько единиц в какой корзине дней. Корзины 91+ — кандидаты на надбавку за выдержанный запас.",
      "ovr.age0_90": "0–90 дней",
      "ovr.age91_180": "91–180 дней",
      "ovr.age181plus": "181+ дней",
      "ovr.cross": "Единицы, доживающие до порога",
      "ovr.crossCaption":
        "Расчёт по правилу FIFO отдельно в каждом складском пуле: запас в UK расходуется продажами UK, а не общими по Европе. Без разделения по пулам выдержанный запас в UK не виден.",
      "ovr.crossNone": "Ни одной позиции: весь запас уходит быстрее порога.",
      "ovr.table": "Все позиции",
      "ovr.tableCaption": "Отсортированы по сумме замороженных денег и прогноза хранения на 3 месяца.",
      "ovr.tableSr": "Затоваренные позиции FBA",
      "ovr.gaps": "Чего не хватает в данных",
      "ovr.col.sku": "SKU",
      "ovr.col.asin": "ASIN",
      "ovr.col.onHand": "Остаток",
      "ovr.col.inbound": "В пути",
      "ovr.col.velocity": "Шт/сут",
      "ovr.col.dos": "Запас, дн",
      "ovr.col.dosInb": "Дн с путём",
      "ovr.col.excess": "Излишек",
      "ovr.col.cross": "За порогом",
      "ovr.col.crossDate": "Когда",
      "ovr.col.unitCost": "Себест.",
      "ovr.col.stockValue": "Запас, EUR",
      "ovr.col.storage12m": "Хранение 12 мес",
      "ovr.col.storageNext": "След. мес",
      "ovr.col.storage3m": "Прогноз 3 мес",
      "ovr.col.rank": "Итого",
      "ovr.col.where": "Где",
      "ovr.total": "Итого",

      "p30.subtitle": "Выбранный период против предыдущего такой же длины",
      "p30.empty": "В выгрузке нет узла economics — сравнивать нечего.",
      "p30.movers": "Пять самых значимых изменений",
      "p30.moversCaption":
        "Отобраны по величине изменения в деньгах. «Влияние на прибыль» учитывает знак: рост расхода прибыль уменьшает.",
      "p30.bridge": "Из чего сложилось изменение прибыли",
      "p30.bridgeCaption":
        "Прибыль = выручка − возвраты − комиссии − реклама − себестоимость − подписка. Слагаемые в сумме дают изменение прибыли.",
      "p30.fees": "Комиссии Amazon по типам",
      "p30.feesCaption":
        "Списания положительные, возвраты денег продавцу отрицательные. Реклама сюда не входит — она отдельная статья.",
      "p30.markets": "Витрины",
      "p30.item.netSales": "Чистые продажи",
      "p30.col.item": "Статья",
      "p30.col.was": "Было",
      "p30.col.now": "Стало",
      "p30.col.change": "Изменение",
      "p30.col.effect": "Влияние на прибыль",
      "p30.noCogs": "Себестоимость неизвестна",
      "p30.noPrev": "Предыдущий период недоступен — сравнивать не с чем.",
      "p30.ofRevenue": "{x} от выручки",
      "p30.gapTitle": "Дыра в выгрузке",
      "p30.gapText":
        "За эти сутки есть комиссии и реклама, но нет ни одной продажи: {dates}. Расход без выручки занижает прибыль периода — цифры ниже неполные.",
      "cmp.subtitle": "Площадки за выбранный период против предыдущего периода такой же длины",
      "cmp.empty": "В выгрузке нет узла economics — сравнивать нечего.",
      "cmp.allMarkets":
        "Страница всегда сравнивает все площадки, поэтому фильтр витрины к ней не применяется. Фильтр периода действует.",
      "cmp.table": "Площадки по чистой прибыли",
      "cmp.tableCaption":
        "Отсортировано по прибыли за период. Δ — против предыдущего периода той же длины, маржа — в процентных пунктах.",
      "cmp.noCogsNote":
        "Себестоимости в выгрузке нет, поэтому вместо чистой прибыли показан чистый доход: выручка минус комиссии и реклама.",
      "cmp.col.market": "Площадка",
      "cmp.col.revenue": "Выручка",
      "cmp.col.orders": "Заказы",
      "cmp.col.fees": "Комиссии",
      "cmp.col.ads": "Реклама",
      "cmp.col.cogs": "COGS",
      "cmp.col.profit": "Прибыль",
      "cmp.col.netProceeds": "Чистый доход",
      "cmp.col.margin": "Маржа",
      "cmp.flag": "Выручка растёт, маржа падает",
      "cmp.flagCaption":
        "Площадки, где выручка выше прошлого периода, а маржа ниже. Доли комиссий, рекламы и себестоимости в выручке: было → стало.",
      "cmp.flagNone": "Таких площадок за выбранный период нет.",
      "cmp.quality": "Качество данных",
      "cmp.qualityOk":
        "Пустых дней в периоде нет, базовые комиссии есть на всех площадках.",
      "cmp.zeroDays":
        "Пустые дни в выгрузке: {x} — дата на месте и строки есть, но все суммы нулевые, итоги периода занижены.",
      "cmp.noFees":
        "Нет базовых комиссий (ReferralFee, FbaFulfilmentFee): {x}. Прибыль и маржа этих площадок завышены и сравнению не подлежат.",
      "cmp.badge.noFees": "нет комиссий",
      "cmp.ordersUnknown":
        "Числа заказов в выгрузке нет: Data Kiosk отдаёт только штуки.",
      "table.lineItem": "Статья",
      "table.month": "Месяц",
      "table.week": "Неделя",
      "table.costs": "Расходы",
      "table.cogs": "COGS",

      "sync.title": "Синхронизация данных",
      "sync.close": "Закрыть",
      "sync.more": "Подробнее — весь журнал",
      "sync.every5h": "обновление каждые 5 часов",
      "sync.ok": "Успешно",
      "sync.failed": "Сбой",
      "sync.partial": "Данные неполные",
      "sync.skipped": "Пропущен",
      "sync.unknown": "Неизвестно",
      "sync.sec": "с",
      "sync.min": "мин",
      "sync.bySchedule": "по расписанию",
      "sync.manual": "вручную",
      "sync.noRuns": "Журнал пуст. Первая запись появится после ближайшей синхронизации.",
      "sync.openRun": "Лог запуска",
      "sync.covDays": "Дней получено",
      "sync.covRows": "Строк по дням",
      "sync.covFees": "Строк по комиссиям",
      "sync.covProducts": "Строк по товарам",
      "logs.filter": "Показывать",
      "logs.integration": "Интеграция",
      "logs.title": "Журнал синхронизаций",
      "logs.subtitle": "Каждый прогон конвейера: время, длительность, результат каждого шага и причина сбоя.",
      "logs.back": "К дашборду",
      "logs.all": "Все",
      "logs.onlyProblems": "Только проблемные",
      "logs.lastSuccess": "Последняя успешная",
      "logs.totalRuns": "Записей в журнале",
      "logs.stale": "Данные устарели: последняя успешная синхронизация была давно.",
      "logs.noFile": "Файл журнала не найден. Он появится после первого прогона конвейера.",
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
      "filter.fxOn": "ECB rate as of",
      "filter.note":
        "Currencies never share a scale — pick one. Unit counts cover every marketplace at once.",

      "kpi.revenue": "Revenue",
      "kpi.units": "Units sold",
      "kpi.orders": "Orders",
      "kpi.avgOrder": "Average order",
      "kpi.skus": "Active ASINs",
      "kpi.ordersUnavailable": "Data Kiosk does not report order counts",
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
      "table.asin": "ASIN",
      "table.product": "Product",
      "table.units": "Units",
      "table.revenue": "Revenue",
      "table.share": "Share",
      "table.total": "Total",

      "empty.title": "No data yet",
      "empty.text":
        "The template is ready and waiting to be filled. Next step: export the metrics from SP-API and encrypt them into the data file.",
      "empty.noRows": "No data for the selected period",

      "nav.mainMenu": "Main menu",
      "nav.analytics": "Analytics",
      "nav.catalog": "Catalog",
      "nav.operations": "Operations",
      "nav.system": "System",

      "page.salesAnalysis": "Sales analysis",
      "page.overview": "Sales overview",
      "page.products": "Products",
      "page.inventory": "Inventory",
      "page.orders": "Orders",
      "page.returns": "Returns",
      "page.wiki": "Knowledge base",
      "wiki.empty": "No documentation in this dataset. Refresh the export.",
      "page.settings": "Settings",
      "page.soon": "soon",
      "page.soonText":
        "This section is not filled in yet. The frame is ready — content comes next.",

      "kpi.netProceeds": "Net proceeds",
      "kpi.margin": "Margin",
      "kpi.fees": "Amazon fees",
      "kpi.feeShare": "Fee share",
      "kpi.refunds": "Refunds",
      "kpi.ofRevenue": "of revenue",

      "chart.revenueVsNet": "Revenue and net proceeds by day",
      "chart.revenueVsNetCaption":
        "Net proceeds = revenue minus all Amazon fees and advertising. Both are the same currency, so they share one scale.",
      "chart.feeMix": "Cost breakdown",
      "chart.feeMixCaption": "Each fee type's share of total costs for the period.",
      "chart.feesByType": "Fees by type",
      "chart.feesByTypeCaption":
        "Charges are shown as positive. Credits are listed separately in the table with a plus sign and are excluded from the expense mix. Storage is not charged every day.",
      "chart.topByNet": "Products by net proceeds",
      "chart.topByNetCaption": "The ten positions with the highest net proceeds.",

      "table.feeType": "Fee type",
      "table.amount": "Amount",
      "table.netProceeds": "Net proceeds",
      "table.ordered": "Ordered",
      "table.refunded": "Refunded",

      /* --- Margin by country --- */
      "page.margin": "Margin by country",
      "margin.empty": "This dataset has no margin node. Refresh the pipeline export.",
      "kpi.revenueNet": "Revenue (net)",
      "kpi.amazonCosts": "Amazon costs",
      "kpi.cogs": "COGS",
      "kpi.profit": "Profit",
      "margin.pp": "pp",
      "chart.marginTrend": "Revenue and profit by day",
      "chart.marginTrendCaption":
        "Profit = net revenue minus fees, advertising and COGS. The subscription is monthly and is not part of the daily points.",
      "chart.seasonality": "Seasonality: margin by month",
      "margin.seasonNote":
        "The period filter does not apply here — the whole data range is shown. The marketplace filter does apply.",
      "margin.breakdown": "Cost breakdown",
      "margin.breakdownCaption": "For the selected period. Share is of net revenue.",
      "margin.ads": "Advertising",
      "margin.subscription": "Amazon subscription",
      "chart.asinWeekly": "Weekly revenue of selected products",
      "margin.pickHint":
        "Tick up to six products in the table below — their lines will appear here.",
      "margin.products": "Products (ASIN)",
      "margin.inChart": "In chart",
      "margin.noCogs": "no COGS",
      "margin.noCogsHint": "Cost is not set — this product's margin cannot be computed.",
      "margin.cogsNote": "Cost is known for {x} of {y} products.",

      /* --- Section "4": marketplace comparison --- */
      "page.cmp4": "4",
      "page.p30": "1",

      /* --- Section "20": search queries --- */
      "page.sqp20": "20",
      "sqp.subtitle": "Week against the previous week",
      "sqp.empty": "The payload has no sqp node. The Search Query Performance report requires the Brand Analytics role and Brand Registry enrollment.",
      "sqp.caption":
        "Impression share is the portion of a query's impressions my product took; click share is the portion of its clicks. Click share above impression share means the listing gets clicked better than the market. CTR index is my CTR divided by the market CTR for the same query — it is dimensionless and therefore comparable across queries of different size.",
      "sqp.fix": "Shown deservedly — fix the listing",
      "sqp.fixCaption":
        "CTR is below the market, yet clicks convert to purchases no worse than the market. The traffic is qualified; the search tile is what falls short: main image, title, price.",
      "sqp.irrelevant": "Irrelevant — impressions wasted",
      "sqp.irrelevantCaption":
        "The share keeps dropping after the click: purchases are markedly rarer than the market. Not my query; the impressions go to waste.",
      "sqp.all": "All queries",
      "sqp.allCaption": "Sorted by my impression count.",
      "sqp.none": "No queries in this group.",
      "sqp.tableCaption": "Search queries for the selected week",
      "sqp.col.query": "Query",
      "sqp.col.volume": "Search volume",
      "sqp.col.impressions": "My impressions",
      "sqp.col.impShare": "Impression share",
      "sqp.col.clicks": "Clicks",
      "sqp.col.clickShare": "Click share",
      "sqp.col.ctrIndex": "CTR index",
      "sqp.col.buyIndex": "Purchase index",
      "sqp.col.marketPrice": "Market price",
      "sqp.col.myPrice": "My price",
      "sqp.col.deltaClickShare": "Δ click share",
      "sqp.kpi.ctr": "My CTR",
      "sqp.kpi.ctrNote": "Market {x}",
      "sqp.kpi.impressions": "My impressions",
      "sqp.kpi.impShare": "Impression share",
      "sqp.kpi.clicks": "Clicks",
      "sqp.kpi.clickShare": "Click share",
      "sqp.kpi.volume": "Search volume",
      "sqp.kpi.volumeNote": "Whole market across {n} shared queries",

      /* --- Section "24": overstock and storage --- */
      "page.ovr24": "24",
      "ovr.subtitle": "Overstock, inventory age and storage fees",
      "ovr.empty": "The payload has no overstock node. It needs the FBA Manage Inventory Health report, produced by src/Export-FbaInventoryHealth.ps1.",
      "ovr.snapshot": "Inventory snapshot as of {d} · stores: {m}",
      "ovr.caption":
        "Days of supply is stock divided by the sales rate over {w} days. The {t}-day threshold is the first aged-inventory surcharge bucket present in the report itself. Excess is measured beyond {c} days of cover: Amazon's own excess estimate is zero across every position in this account.",
      "ovr.kpi.stockValue": "Tied up in stock",
      "ovr.kpi.stockValueNote": "{n} units on hand",
      "ovr.kpi.inboundValue": "Inbound",
      "ovr.kpi.inboundValueNote": "{n} units on the way",
      "ovr.kpi.storage12m": "Storage, last 12 months",
      "ovr.kpi.storageNext": "Storage, next month",
      "ovr.kpi.storage3m": "Storage forecast, 3 months",
      "ovr.kpi.storage3mNote": "Seasonally adjusted: Oct ×{o}, Nov ×{n}",
      "ovr.kpi.cross": "Units reaching the threshold",
      "ovr.kpi.crossNote": "{t}-day threshold",
      "ovr.age": "Inventory age",
      "ovr.ageCaption": "How many units sit in each age bucket. Buckets 91+ are candidates for the aged-inventory surcharge.",
      "ovr.age0_90": "0–90 days",
      "ovr.age91_180": "91–180 days",
      "ovr.age181plus": "181+ days",
      "ovr.cross": "Units reaching the threshold",
      "ovr.crossCaption":
        "FIFO calculation run separately per fulfilment pool: UK stock is consumed by UK sales, not by pan-European ones. Without splitting by pool, aged UK stock stays invisible.",
      "ovr.crossNone": "No positions: all stock sells through faster than the threshold.",
      "ovr.table": "All positions",
      "ovr.tableCaption": "Sorted by tied-up cash plus the three-month storage forecast.",
      "ovr.tableSr": "Overstocked FBA positions",
      "ovr.gaps": "Gaps in the data",
      "ovr.col.sku": "SKU",
      "ovr.col.asin": "ASIN",
      "ovr.col.onHand": "On hand",
      "ovr.col.inbound": "Inbound",
      "ovr.col.velocity": "Units/day",
      "ovr.col.dos": "Days",
      "ovr.col.dosInb": "Days w/ inbound",
      "ovr.col.excess": "Excess",
      "ovr.col.cross": "Past threshold",
      "ovr.col.crossDate": "When",
      "ovr.col.unitCost": "Unit cost",
      "ovr.col.stockValue": "Stock, EUR",
      "ovr.col.storage12m": "Storage 12m",
      "ovr.col.storageNext": "Next month",
      "ovr.col.storage3m": "Forecast 3m",
      "ovr.col.rank": "Total",
      "ovr.col.where": "Where",
      "ovr.total": "Total",

      "p30.subtitle": "Selected period against the previous period of equal length",
      "p30.empty": "The payload has no economics node — nothing to compare.",
      "p30.movers": "Five most significant changes",
      "p30.moversCaption":
        "Ranked by the size of the change in money. “Effect on profit” carries the sign: a rising cost lowers profit.",
      "p30.bridge": "What moved the profit",
      "p30.bridgeCaption":
        "Profit = revenue − refunds − fees − advertising − COGS − subscription. The terms add up to the change in profit.",
      "p30.fees": "Amazon fees by type",
      "p30.feesCaption":
        "Charges are positive, money returned to the seller is negative. Advertising is not included — it is a separate line.",
      "p30.markets": "Marketplaces",
      "p30.item.netSales": "Net sales",
      "p30.col.item": "Line",
      "p30.col.was": "Was",
      "p30.col.now": "Now",
      "p30.col.change": "Change",
      "p30.col.effect": "Effect on profit",
      "p30.noCogs": "Cost of goods unknown",
      "p30.noPrev": "No previous period available — nothing to compare against.",
      "p30.ofRevenue": "{x} of revenue",
      "p30.gapTitle": "Gap in the export",
      "p30.gapText":
        "These days carry fees and advertising but not a single sale: {dates}. Cost without revenue understates the period’s profit — the figures below are incomplete.",
      "cmp.subtitle": "Marketplaces over the selected period against the previous period of equal length",
      "cmp.empty": "The payload has no economics node — nothing to compare.",
      "cmp.allMarkets":
        "This page always compares every marketplace, so the marketplace filter does not apply here. The period filter does.",
      "cmp.table": "Marketplaces by net profit",
      "cmp.tableCaption":
        "Sorted by profit for the period. Δ is against the previous period of equal length; margin is in percentage points.",
      "cmp.noCogsNote":
        "The payload carries no cost of goods, so net proceeds are shown instead of net profit: revenue less fees and advertising.",
      "cmp.col.market": "Marketplace",
      "cmp.col.revenue": "Revenue",
      "cmp.col.orders": "Orders",
      "cmp.col.fees": "Fees",
      "cmp.col.ads": "Ads",
      "cmp.col.cogs": "COGS",
      "cmp.col.profit": "Profit",
      "cmp.col.netProceeds": "Net proceeds",
      "cmp.col.margin": "Margin",
      "cmp.flag": "Revenue up, margin down",
      "cmp.flagCaption":
        "Marketplaces whose revenue rose while margin fell. Shares of fees, ads and cost in revenue: before → after.",
      "cmp.flagNone": "No such marketplace in the selected period.",
      "cmp.quality": "Data quality",
      "cmp.qualityOk":
        "No empty days in the period, and every marketplace carries its core fees.",
      "cmp.zeroDays":
        "Empty days in the payload: {x} — the date and its rows are present but every amount is zero, so period totals are understated.",
      "cmp.noFees":
        "Core fees missing (ReferralFee, FbaFulfilmentFee): {x}. Profit and margin for these marketplaces are overstated and not comparable.",
      "cmp.badge.noFees": "no fees",
      "cmp.ordersUnknown":
        "The payload carries no order count: Data Kiosk reports units only.",
      "table.lineItem": "Line item",
      "table.month": "Month",
      "table.week": "Week",
      "table.costs": "Costs",
      "table.cogs": "COGS",

      "sync.title": "Data sync",
      "sync.close": "Close",
      "sync.more": "Details â full log",
      "sync.every5h": "updates every 5 hours",
      "sync.ok": "Success",
      "sync.failed": "Failed",
      "sync.partial": "Incomplete data",
      "sync.skipped": "Skipped",
      "sync.unknown": "Unknown",
      "sync.sec": "s",
      "sync.min": "min",
      "sync.bySchedule": "on schedule",
      "sync.manual": "manual",
      "sync.noRuns": "The log is empty. The first entry appears after the next sync.",
      "sync.openRun": "Run log",
      "sync.covDays": "Days received",
      "sync.covRows": "Daily rows",
      "sync.covFees": "Fee rows",
      "sync.covProducts": "Product rows",
      "logs.filter": "Show",
      "logs.integration": "Integration",
      "logs.title": "Sync log",
      "logs.subtitle": "Every pipeline run: time, duration, the result of each step and the reason for failure.",
      "logs.back": "Back to dashboard",
      "logs.all": "All",
      "logs.onlyProblems": "Problems only",
      "logs.lastSuccess": "Last successful",
      "logs.totalRuns": "Entries in the log",
      "logs.stale": "Data is stale: the last successful sync was a long time ago.",
      "logs.noFile": "Log file not found. It appears after the first pipeline run.",
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
      "filter.fxOn": "Курс ЄЦБ на",
      "filter.note":
        "Усі суми приведені до євро за курсами ЄЦБ. Фільтр за вітриною діє на всі картки нижче.",

      "kpi.revenue": "Виторг",
      "kpi.units": "Продано штук",
      "kpi.orders": "Замовлень",
      "kpi.avgOrder": "Середній чек",
      "kpi.skus": "Активних ASIN",
      "kpi.ordersUnavailable": "Data Kiosk не віддає кількість замовлень",
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
      "table.asin": "ASIN",
      "table.product": "Товар",
      "table.units": "Штук",
      "table.revenue": "Виторг",
      "table.share": "Частка",
      "table.total": "Разом",

      "empty.title": "Даних поки немає",
      "empty.text":
        "Шаблон готовий і чекає на наповнення. Наступний крок — вивантажити показники з SP-API та зашифрувати їх у файл даних.",
      "empty.noRows": "За обраний період даних немає",

      "nav.mainMenu": "Головне меню",
      "nav.analytics": "Аналітика",
      "nav.catalog": "Каталог",
      "nav.operations": "Операції",
      "nav.system": "Система",

      "page.salesAnalysis": "Аналіз продажів",
      "page.overview": "Огляд продажів",
      "page.products": "Товари",
      "page.inventory": "Запаси",
      "page.orders": "Замовлення",
      "page.returns": "Повернення",
      "page.wiki": "База знань",
      "wiki.empty": "Документацію не знайдено в даних. Оновіть вивантаження.",
      "page.settings": "Налаштування",
      "page.soon": "скоро",
      "page.soonText":
        "Цей розділ ще не наповнено. Каркас готовий — вміст додамо наступним кроком.",

      "kpi.netProceeds": "Чистий дохід",
      "kpi.margin": "Маржа",
      "kpi.fees": "Комісії Amazon",
      "kpi.feeShare": "Частка комісій",
      "kpi.refunds": "Повернення",
      "kpi.ofRevenue": "від виторгу",

      "chart.revenueVsNet": "Виторг і чистий дохід за днями",
      "chart.revenueVsNetCaption":
        "Чистий дохід = виторг мінус усі комісії Amazon та реклама. Обидві величини в одній валюті, тож шкала одна.",
      "chart.feeMix": "Структура витрат",
      "chart.feeMixCaption": "Частка кожного типу комісії у загальних витратах за період.",
      "chart.feesByType": "Комісії за типами",
      "chart.feesByTypeCaption":
        "Списання показані додатними. Відшкодування винесені в таблицю окремими рядками зі знаком плюс — у структуру витрат вони не входять. Зберігання нараховується не щодня.",
      "chart.topByNet": "Товари за чистим доходом",
      "chart.topByNetCaption": "Десять позицій з найбільшим чистим доходом за період.",

      "table.feeType": "Тип комісії",
      "table.amount": "Сума",
      "table.netProceeds": "Чистий дохід",
      "table.ordered": "Замовлено",
      "table.refunded": "Повернено",

      /* --- Маржа за країнами --- */
      "page.margin": "Маржа за країнами",
      "margin.empty": "У даних немає вузла маржі. Оновіть вивантаження конвеєра.",
      "kpi.revenueNet": "Виторг (нетто)",
      "kpi.amazonCosts": "Витрати Amazon",
      "kpi.cogs": "Собівартість (COGS)",
      "kpi.profit": "Прибуток",
      "margin.pp": "п.п.",
      "chart.marginTrend": "Виторг і прибуток за днями",
      "chart.marginTrendCaption":
        "Прибуток = виторг нетто мінус комісії, реклама та собівартість. Підписка місячна й у денні точки не входить.",
      "chart.seasonality": "Сезонність: маржа за місяцями",
      "margin.seasonNote":
        "Фільтр періоду тут не діє — показано весь діапазон даних. Фільтр вітрини діє.",
      "margin.breakdown": "Розбір витрат",
      "margin.breakdownCaption": "За обраний період. Частка — від виторгу нетто.",
      "margin.ads": "Реклама",
      "margin.subscription": "Підписка Amazon",
      "chart.asinWeekly": "Тижневий виторг обраних товарів",
      "margin.pickHint":
        "Позначте до шести товарів у таблиці нижче — їхні лінії з'являться тут.",
      "margin.products": "Товари (ASIN)",
      "margin.inChart": "У графік",
      "margin.noCogs": "немає COGS",
      "margin.noCogsHint": "Собівартість не задано — маржа цього товару не рахується.",
      "margin.cogsNote": "Собівартість відома для {x} з {y} товарів.",

      /* --- Розділ «4»: порівняння майданчиків --- */
      "page.cmp4": "4",
      "page.p30": "1",

      /* --- Розділ «20»: пошукові запити --- */
      "page.sqp20": "20",
      "sqp.subtitle": "Тиждень проти попереднього тижня",
      "sqp.empty": "У вивантаженні немає вузла sqp. Звіт Search Query Performance потребує ролі Brand Analytics і реєстрації в Brand Registry.",
      "sqp.caption":
        "Частка показів — яку частину показів за запитом забрав мій товар, частка кліків — яку частину кліків. Частка кліків вища за частку показів означає, що картка клікається краще за ринок. Індекс CTR — мій CTR, поділений на ринковий за цим же запитом: він безрозмірний і тому порівнянний між запитами різного розміру.",
      "sqp.fix": "Показуюся заслужено — лагодити картку",
      "sqp.fixCaption":
        "CTR нижчий за ринковий, але клік доходить до покупки не гірше за ринок. Трафік якісний, слабка видача: головне зображення, заголовок, ціна.",
      "sqp.irrelevant": "Нерелевантний — покази зайві",
      "sqp.irrelevantCaption":
        "Частка просідає й після кліку: купують помітно рідше за ринок. Запит не мій, покази йдуть намарно.",
      "sqp.all": "Усі запити",
      "sqp.allCaption": "Відсортовані за кількістю моїх показів.",
      "sqp.none": "Жодного запиту в цій групі.",
      "sqp.tableCaption": "Пошукові запити за вибраний тиждень",
      "sqp.col.query": "Запит",
      "sqp.col.volume": "Обсяг пошуку",
      "sqp.col.impressions": "Мої покази",
      "sqp.col.impShare": "Частка показів",
      "sqp.col.clicks": "Кліки",
      "sqp.col.clickShare": "Частка кліків",
      "sqp.col.ctrIndex": "Індекс CTR",
      "sqp.col.buyIndex": "Індекс покупки",
      "sqp.col.marketPrice": "Ціна ринку",
      "sqp.col.myPrice": "Моя ціна",
      "sqp.col.deltaClickShare": "Δ частки кліків",
      "sqp.kpi.ctr": "Мій CTR",
      "sqp.kpi.ctrNote": "По ринку {x}",
      "sqp.kpi.impressions": "Мої покази",
      "sqp.kpi.impShare": "Частка показів",
      "sqp.kpi.clicks": "Кліки",
      "sqp.kpi.clickShare": "Частка кліків",
      "sqp.kpi.volume": "Обсяг пошуку",
      "sqp.kpi.volumeNote": "Весь ринок за {n} спільними запитами",

      "p30.subtitle": "Вибраний період проти попереднього такої ж довжини",
      "p30.empty": "У вивантаженні немає вузла economics — порівнювати нічого.",
      "p30.movers": "П’ять найзначущіших змін",
      "p30.moversCaption":
        "Відібрані за величиною зміни у грошах. «Вплив на прибуток» враховує знак: зростання витрати прибуток зменшує.",
      "p30.bridge": "З чого склалася зміна прибутку",
      "p30.bridgeCaption":
        "Прибуток = виторг − повернення − комісії − реклама − собівартість − підписка. Доданки в сумі дають зміну прибутку.",
      "p30.fees": "Комісії Amazon за типами",
      "p30.feesCaption":
        "Списання додатні, повернення грошей продавцю від’ємні. Реклама сюди не входить — це окрема стаття.",
      "p30.markets": "Вітрини",
      "p30.item.netSales": "Чисті продажі",
      "p30.col.item": "Стаття",
      "p30.col.was": "Було",
      "p30.col.now": "Стало",
      "p30.col.change": "Зміна",
      "p30.col.effect": "Вплив на прибуток",
      "p30.noCogs": "Собівартість невідома",
      "p30.noPrev": "Попередній період недоступний — немає з чим порівнювати.",
      "p30.ofRevenue": "{x} від виторгу",
      "p30.gapTitle": "Дірка у вивантаженні",
      "p30.gapText":
        "За ці доби є комісії та реклама, але немає жодного продажу: {dates}. Витрата без виторгу занижує прибуток періоду — цифри нижче неповні.",
      "cmp.subtitle": "Майданчики за вибраний період проти попереднього періоду такої ж довжини",
      "cmp.empty": "У вивантаженні немає вузла economics — порівнювати нічого.",
      "cmp.allMarkets":
        "Сторінка завжди порівнює всі майданчики, тому фільтр вітрини до неї не застосовується. Фільтр періоду діє.",
      "cmp.table": "Майданчики за чистим прибутком",
      "cmp.tableCaption":
        "Відсортовано за прибутком за період. Δ — проти попереднього періоду такої ж довжини, маржа — у відсоткових пунктах.",
      "cmp.noCogsNote":
        "Собівартості у вивантаженні немає, тому замість чистого прибутку показано чистий дохід: виручка мінус комісії та реклама.",
      "cmp.col.market": "Майданчик",
      "cmp.col.revenue": "Виручка",
      "cmp.col.orders": "Замовлення",
      "cmp.col.fees": "Комісії",
      "cmp.col.ads": "Реклама",
      "cmp.col.cogs": "COGS",
      "cmp.col.profit": "Прибуток",
      "cmp.col.netProceeds": "Чистий дохід",
      "cmp.col.margin": "Маржа",
      "cmp.flag": "Виручка зростає, маржа падає",
      "cmp.flagCaption":
        "Майданчики, де виручка вища за минулий період, а маржа нижча. Частки комісій, реклами та собівартості у виручці: було → стало.",
      "cmp.flagNone": "Таких майданчиків за вибраний період немає.",
      "cmp.quality": "Якість даних",
      "cmp.qualityOk":
        "Порожніх днів у періоді немає, базові комісії є на всіх майданчиках.",
      "cmp.zeroDays":
        "Порожні дні у вивантаженні: {x} — дата на місці й рядки є, але всі суми нульові, підсумки періоду занижені.",
      "cmp.noFees":
        "Немає базових комісій (ReferralFee, FbaFulfilmentFee): {x}. Прибуток і маржа цих майданчиків завищені й порівнянню не підлягають.",
      "cmp.badge.noFees": "немає комісій",
      "cmp.ordersUnknown":
        "Числа замовлень у вивантаженні немає: Data Kiosk віддає лише штуки.",
      "table.lineItem": "Стаття",
      "table.month": "Місяць",
      "table.week": "Тиждень",
      "table.costs": "Витрати",
      "table.cogs": "COGS",

      "sync.title": "Синхронізація даних",
      "sync.close": "Закрити",
      "sync.more": "Докладніше — весь журнал",
      "sync.every5h": "оновлення кожні 5 годин",
      "sync.ok": "Успішно",
      "sync.failed": "Збій",
      "sync.partial": "Дані неповні",
      "sync.skipped": "Пропущено",
      "sync.unknown": "Невідомо",
      "sync.sec": "с",
      "sync.min": "хв",
      "sync.bySchedule": "за розкладом",
      "sync.manual": "вручну",
      "sync.noRuns": "Журнал порожній. Перший запис з'явиться після найближчої синхронізації.",
      "sync.openRun": "Лог запуску",
      "sync.covDays": "Днів отримано",
      "sync.covRows": "Рядків за днями",
      "sync.covFees": "Рядків за комісіями",
      "sync.covProducts": "Рядків за товарами",
      "logs.filter": "Показувати",
      "logs.integration": "Інтеграція",
      "logs.title": "Журнал синхронізацій",
      "logs.subtitle": "Кожен прогін конвеєра: час, тривалість, результат кожного кроку та причина збою.",
      "logs.back": "До дашборда",
      "logs.all": "Усі",
      "logs.onlyProblems": "Лише проблемні",
      "logs.lastSuccess": "Остання успішна",
      "logs.totalRuns": "Записів у журналі",
      "logs.stale": "Дані застаріли: остання успішна синхронізація була давно.",
      "logs.noFile": "Файл журналу не знайдено. Він з'явиться після першого прогону конвеєра.",
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
