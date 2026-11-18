# Вставка статичной шапки, раскрытого каталога и подвала во все страницы сайта.
# Источник разметки — tools/partials.js. Запуск из папки сайта:
#   powershell -ExecutionPolicy Bypass -File tools\build-layout.ps1
# На странице блок либо плейсхолдер <div data-zc="header"></div>, либо уже собранный
# участок между <!-- zc:header --> и <!-- /zc:header --> — он заменяется целиком.

$root = Split-Path -Parent $PSScriptRoot
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$gen = 'file:///' + ($root -replace '\\', '/') + '/tools/build-layout.html?t=' + (Get-Date -Format 'HHmmss')

$dom = & $chrome --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=5000 --dump-dom $gen 2>$null | Out-String
$m = [regex]::Match($dom, '<pre id="out">([\s\S]*?)</pre>')
if (-not $m.Success) { throw 'Генератор не вернул данные' }
$data = [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) | ConvertFrom-Json
foreach ($n in 'header', 'menu', 'footer') { if (-not $data.$n) { throw "Нет блока $n" } }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$count = 0
foreach ($f in Get-ChildItem $root -Filter '*.html') {
  $t = [IO.File]::ReadAllText($f.FullName, $utf8)
  $o = $t
  foreach ($n in 'header', 'menu', 'footer') {
    $block = "<!-- zc:$n -->`n  " + $data.$n + "`n  <!-- /zc:$n -->"
    $re = '<div data-zc="' + $n + '"></div>|<!-- zc:' + $n + ' -->[\s\S]*?<!-- /zc:' + $n + ' -->'
    $t = [regex]::Replace($t, $re, { param($mm) $block })
  }
  if ($t -ne $o) { [IO.File]::WriteAllText($f.FullName, $t, $utf8); $count++; "  $($f.Name)" }
}
"Готово: обновлено страниц — $count"
