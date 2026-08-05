/* ============================================================================
   vault.js — шифрование данных дашборда
   ----------------------------------------------------------------------------
   Зачем это нужно. GitHub Pages отдаёт только статические файлы: сервера,
   который проверил бы пароль, там нет. Поэтому «проверка пароля в JS» защитой
   не является — данные всё равно лежали бы рядом в открытом виде.

   Здесь другой подход: на странице лежит ШИФРОТЕКСТ. Логин и пароль ни с чем
   не сверяются — из них выводится ключ, и этим ключом данные расшифровываются.
   Неверная пара даёт неверный ключ, HMAC не сходится, расшифровка не начинается.
   Ни пароль, ни его хеш нигде не хранятся.

   Схема — encrypt-then-MAC:
     ключи = PBKDF2-SHA256(login + "\n" + password, salt, N итераций) → 64 байта
             первые 32 → ключ AES, вторые 32 → ключ HMAC
     ct    = AES-256-CBC(ключ AES, iv) поверх JSON, опционально сжатого gzip
     tag   = HMAC-SHA256(ключ HMAC, iv || ct)
     Проверка tag идёт ДО расшифровки.

   Почему CBC+HMAC, а не GCM: этот же формат должен собираться из PowerShell 5.1,
   а в .NET Framework нет AesGcm. AES-CBC, HMACSHA256 и Rfc2898DeriveBytes есть
   и там, и в Web Crypto — формат читается обеими сторонами.

   Стойкость упирается в пароль. Репозиторий публичный, значит шифротекст
   доступен для офлайнового перебора — короткий или словарный пароль подберут.
   Нужна длинная случайная фраза.
   ========================================================================= */

(function (global) {
  "use strict";

  /* 600 000 итераций — рекомендация OWASP для PBKDF2-SHA256.
     Значение записывается в сам файл данных, поэтому старые файлы продолжат
     открываться, даже если здесь его потом поднимут. */
  var DEFAULT_ITERATIONS = 600000;
  var SALT_BYTES = 16;
  var IV_BYTES = 16;   // размер блока AES
  var KEY_BITS = 512;  // 256 на шифрование + 256 на HMAC

  /* ---- Кодирование ------------------------------------------------------ */

  function bytesToBase64(bytes) {
    var bin = "";
    var chunk = 0x8000; // частями, иначе переполняется стек на больших массивах
    for (var i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(
        null, bytes.subarray(i, Math.min(i + chunk, bytes.length))
      );
    }
    return btoa(bin);
  }

  function base64ToBytes(b64) {
    var bin = atob(String(b64).replace(/\s+/g, ""));
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function concatBytes(a, b) {
    var out = new Uint8Array(a.length + b.length);
    out.set(a, 0);
    out.set(b, a.length);
    return out;
  }

  /* ---- Сжатие (необязательное) ------------------------------------------
     CompressionStream есть в актуальных Chrome/Edge/Firefox и Safari 16.4+.
     Если его нет — работаем без сжатия, формат это допускает. */

  function supportsGzip() {
    return typeof global.CompressionStream === "function" &&
           typeof global.DecompressionStream === "function";
  }

  function streamThrough(bytes, stream) {
    return new Response(new Blob([bytes]).stream().pipeThrough(stream))
      .arrayBuffer()
      .then(function (buf) { return new Uint8Array(buf); });
  }

  function gzip(bytes) {
    return streamThrough(bytes, new global.CompressionStream("gzip"));
  }

  function gunzip(bytes) {
    return streamThrough(bytes, new global.DecompressionStream("gzip"));
  }

  /* ---- Вывод ключей ----------------------------------------------------- */

  function assertCrypto() {
    if (!global.crypto || !global.crypto.subtle) throw new Error("NO_WEBCRYPTO");
  }

  /* Логин приводится к нижнему регистру и обрезается по краям, чтобы
     «Admin » и «admin» открывали одинаково. Пароль не нормализуется —
     он учитывается символ в символ. */
  function credentialMaterial(login, password) {
    var l = String(login == null ? "" : login).trim().toLowerCase();
    var p = String(password == null ? "" : password);
    return new TextEncoder().encode(l + "\n" + p);
  }

  function deriveKeys(login, password, salt, iterations) {
    assertCrypto();
    return global.crypto.subtle
      .importKey("raw", credentialMaterial(login, password), "PBKDF2", false, ["deriveBits"])
      .then(function (baseKey) {
        return global.crypto.subtle.deriveBits(
          { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
          baseKey,
          KEY_BITS
        );
      })
      .then(function (bits) {
        var all = new Uint8Array(bits);
        return Promise.all([
          global.crypto.subtle.importKey(
            "raw", all.slice(0, 32), { name: "AES-CBC" }, false, ["encrypt", "decrypt"]
          ),
          global.crypto.subtle.importKey(
            "raw", all.slice(32, 64), { name: "HMAC", hash: "SHA-256" }, false,
            ["sign", "verify"]
          )
        ]).then(function (keys) {
          return { enc: keys[0], mac: keys[1] };
        });
      });
  }

  /* ---- Шифрование -------------------------------------------------------
     Используется утилитой tools/encrypt.html. Дашборду не нужно. */

  function encrypt(data, login, password, options) {
    var opts = options || {};
    var iterations = opts.iterations || DEFAULT_ITERATIONS;
    var salt = global.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    var iv = global.crypto.getRandomValues(new Uint8Array(IV_BYTES));
    var plainBytes = new TextEncoder().encode(JSON.stringify(data));

    var useGzip = opts.gzip !== false && supportsGzip();
    var prepared = useGzip ? gzip(plainBytes) : Promise.resolve(plainBytes);

    return prepared.then(function (body) {
      return deriveKeys(login, password, salt, iterations).then(function (keys) {
        return global.crypto.subtle
          .encrypt({ name: "AES-CBC", iv: iv }, keys.enc, body)
          .then(function (cipher) {
            var ct = new Uint8Array(cipher);
            /* Подписывается iv вместе с шифротекстом: иначе iv можно
               подменить незаметно для проверки. */
            return global.crypto.subtle
              .sign("HMAC", keys.mac, concatBytes(iv, ct))
              .then(function (tag) {
                return {
                  v: 2,
                  kdf: "PBKDF2-SHA256",
                  iterations: iterations,
                  cipher: "AES-256-CBC",
                  mac: "HMAC-SHA256",
                  compression: useGzip ? "gzip" : "none",
                  salt: bytesToBase64(salt),
                  iv: bytesToBase64(iv),
                  ct: bytesToBase64(ct),
                  tag: bytesToBase64(new Uint8Array(tag)),
                  /* Подсказка видна всем — секретов в неё не писать */
                  hint: opts.hint || "",
                  createdAt: opts.createdAt || ""
                };
              });
          });
      });
    });
  }

  /* ---- Расшифровка ------------------------------------------------------ */

  function decrypt(payload, login, password) {
    if (!payload || !payload.ct || !payload.salt || !payload.iv || !payload.tag) {
      return Promise.reject(new Error("BAD_PAYLOAD"));
    }
    if (payload.kdf && payload.kdf !== "PBKDF2-SHA256") {
      return Promise.reject(new Error("BAD_PAYLOAD"));
    }
    if (payload.cipher && payload.cipher !== "AES-256-CBC") {
      return Promise.reject(new Error("BAD_PAYLOAD"));
    }

    var salt, iv, ct, tag;
    try {
      salt = base64ToBytes(payload.salt);
      iv = base64ToBytes(payload.iv);
      ct = base64ToBytes(payload.ct);
      tag = base64ToBytes(payload.tag);
    } catch (e) {
      return Promise.reject(new Error("BAD_PAYLOAD"));
    }

    var iterations = payload.iterations || DEFAULT_ITERATIONS;

    return deriveKeys(login, password, salt, iterations)
      .then(function (keys) {
        /* Сначала проверка подлинности, только потом расшифровка.
           subtle.verify сравнивает за постоянное время. */
        return global.crypto.subtle
          .verify("HMAC", keys.mac, tag, concatBytes(iv, ct))
          .then(function (ok) {
            if (!ok) throw new Error("BAD_CREDENTIALS");
            return global.crypto.subtle.decrypt(
              { name: "AES-CBC", iv: iv }, keys.enc, ct
            );
          });
      })
      .catch(function (err) {
        if (err && err.message === "NO_WEBCRYPTO") throw err;
        /* Различать «нет такого логина» и «неверный пароль» здесь нечем
           и не нужно: проверки учётной записи как таковой не существует. */
        throw new Error("BAD_CREDENTIALS");
      })
      .then(function (buf) {
        var bytes = new Uint8Array(buf);
        if (payload.compression === "gzip") {
          if (!supportsGzip()) throw new Error("NO_GZIP_SUPPORT");
          return gunzip(bytes);
        }
        return bytes;
      })
      .then(function (bytes) {
        return JSON.parse(new TextDecoder().decode(bytes));
      });
  }

  global.Vault = {
    DEFAULT_ITERATIONS: DEFAULT_ITERATIONS,
    encrypt: encrypt,
    decrypt: decrypt,
    supportsGzip: supportsGzip,
    hasWebCrypto: function () {
      return !!(global.crypto && global.crypto.subtle);
    }
  };
})(window);
