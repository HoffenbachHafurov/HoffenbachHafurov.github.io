/* Журнал синхронизаций. Собирается автоматически, руками не править. */
window.DASHBOARD_RUNS = {
  "schemaVersion": 1,
  "updatedAt": "2026-08-10T18:18:17Z",
  "integrations": [
    {
      "id": "amazon-economics",
      "name": "Amazon SP-API · Data Kiosk",
      "cron": "10 */5 * * *",
      "every": "PT5H",
      "repo": "amazon-sp-api-integration"
    }
  ],
  "runs": [
    {
      "id": "31417113205",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-10T18:03:22Z",
      "finishedAt": "2026-08-10T18:18:17Z",
      "durationSec": 895,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 855,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 30,
          "detail": "5,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "565 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31417113205"
    },
    {
      "id": "31389453777",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-10T12:52:04Z",
      "finishedAt": "2026-08-10T13:19:33Z",
      "durationSec": 1649,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 1615,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 23,
          "detail": "5,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "566 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31389453777"
    },
    {
      "id": "31388751048",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-10T12:35:38Z",
      "finishedAt": "2026-08-10T12:51:45Z",
      "durationSec": 967,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 920,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,0 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "533 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31388751048"
    },
    {
      "id": "31376196370",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-10T09:47:05Z",
      "finishedAt": "2026-08-10T09:59:32Z",
      "durationSec": 747,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 703,
          "detail": "138,567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 34,
          "detail": "5.0 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "533 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31376196370"
    }
  ]
};
