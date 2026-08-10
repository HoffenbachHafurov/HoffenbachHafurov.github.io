/* Журнал синхронизаций. Собирается автоматически, руками не править. */
window.DASHBOARD_RUNS = {
  "schemaVersion": 1,
  "updatedAt": "2026-08-10T09:59:32Z",
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
