<?php
declare(strict_types=1);

/**
 * Enquiry endpoint for the homepage sample form.
 * Notifies studio@toonghuri.com and appends a lead log outside the web root
 * when the host allows it (otherwise _private/, which .htaccess denies).
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;
const MAX_BODY = 8192;
const STUDIO_EMAIL = 'studio@toonghuri.com';

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function site_url_allowed(string $url): bool
{
    $parts = parse_url($url);
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        return false;
    }
    if (!empty($parts['user']) || !empty($parts['pass'])) {
        return false;
    }
    $scheme = strtolower((string) $parts['scheme']);
    $host = strtolower(rtrim((string) $parts['host'], '.'));
    if (!in_array($scheme, ['http', 'https'], true)) {
        return false;
    }
    if (in_array($host, ['toonghuri.com', 'www.toonghuri.com'], true)) {
        return true;
    }
    return in_array($host, ['localhost', '127.0.0.1', '[::1]'], true);
}

function request_from_site(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        return site_url_allowed($origin);
    }
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer !== '') {
        return site_url_allowed($referer);
    }
    return false;
}

function client_ip(): string
{
    $candidates = [];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        foreach (explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR']) as $part) {
            $candidates[] = trim($part);
        }
    }
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    $candidates[] = $remote;
    foreach ($candidates as $ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return $ip;
        }
    }
    if (filter_var($remote, FILTER_VALIDATE_IP)) {
        return $remote;
    }
    return 'unknown';
}

function storage_dir(): ?string
{
    $candidates = [
        dirname(__DIR__) . '/toonghuri-private',
        __DIR__ . '/_private',
    ];
    foreach ($candidates as $dir) {
        if (is_dir($dir) && is_writable($dir)) {
            return $dir;
        }
    }
    foreach ($candidates as $dir) {
        if (@mkdir($dir, 0700, true) && is_dir($dir) && is_writable($dir)) {
            return $dir;
        }
    }
    return null;
}

function rate_limited(string $ip): bool
{
    $dir = storage_dir();
    if ($dir === null) {
        return false;
    }
    $file = $dir . '/rate-limit.json';
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return false;
    }
    $limited = false;
    if (flock($fh, LOCK_EX)) {
        $raw = stream_get_contents($fh);
        $data = json_decode(is_string($raw) ? $raw : '', true);
        if (!is_array($data)) {
            $data = [];
        }
        $now = time();
        $cutoff = $now - RATE_WINDOW;
        foreach ($data as $key => $times) {
            if (!is_array($times)) {
                unset($data[$key]);
                continue;
            }
            $fresh = [];
            foreach ($times as $stamp) {
                if (is_int($stamp) && $stamp > $cutoff) {
                    $fresh[] = $stamp;
                } elseif (is_numeric($stamp) && (int) $stamp > $cutoff) {
                    $fresh[] = (int) $stamp;
                }
            }
            if ($fresh) {
                $data[$key] = $fresh;
            } else {
                unset($data[$key]);
            }
        }
        $key = hash('sha256', $ip . '|toonghuri-form');
        $mine = $data[$key] ?? [];
        if (count($mine) >= RATE_LIMIT) {
            $limited = true;
        } else {
            $mine[] = $now;
            $data[$key] = $mine;
        }
        if (count($data) > 5000) {
            $data = [$key => $data[$key] ?? [$now]];
        }
        rewind($fh);
        ftruncate($fh, 0);
        fwrite($fh, json_encode($data));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    return $limited;
}

function field_string(array $data, string $key): string
{
    if (!isset($data[$key]) || is_array($data[$key])) {
        return '';
    }
    return trim((string) $data[$key]);
}

function clean_line(string $value, int $max): string
{
    $value = strip_tags($value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value);
    if (!is_string($value)) {
        $value = '';
    }
    $collapsed = preg_replace('/\s+/u', ' ', $value);
    $value = trim(is_string($collapsed) ? $collapsed : '');
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

function clean_notes(string $value, int $max): string
{
    $value = strip_tags(str_replace(["\r\n", "\r"], "\n", $value));
    $value = preg_replace('/[^\P{C}\n]/u', '', $value);
    if (!is_string($value)) {
        $value = '';
    }
    $value = trim($value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

function youtube_url(string $value): ?string
{
    if ($value === '' || strlen($value) > 500 || preg_match('/[\x00-\x20\x7F]/', $value)) {
        return null;
    }
    $parts = parse_url($value);
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        return null;
    }
    if (!empty($parts['user']) || !empty($parts['pass'])) {
        return null;
    }
    $scheme = strtolower((string) $parts['scheme']);
    $host = strtolower(rtrim((string) $parts['host'], '.'));
    if (!in_array($scheme, ['http', 'https'], true)) {
        return null;
    }
    $allowed = [
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
        'music.youtube.com',
        'youtu.be',
        'www.youtu.be',
    ];
    if (!in_array($host, $allowed, true)) {
        return null;
    }
    return $value;
}

function clean_email(string $value): ?string
{
    if ($value === '' || strlen($value) > 254 || preg_match('/[\r\n\x00]/', $value)) {
        return null;
    }
    $email = filter_var($value, FILTER_VALIDATE_EMAIL);
    if (!is_string($email)) {
        return null;
    }
    return $email;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && site_url_allowed($origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($method === 'OPTIONS') {
    http_response_code($origin !== '' && site_url_allowed($origin) ? 204 : 403);
    exit;
}

if ($method !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

if (!request_from_site()) {
    respond(403, ['ok' => false, 'error' => 'This form can only be submitted from toonghuri.com']);
}

if (rate_limited(client_ip())) {
    respond(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') === false) {
    respond(400, ['ok' => false, 'error' => 'Invalid request payload']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY) {
    respond(400, ['ok' => false, 'error' => 'Invalid request payload']);
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || $raw === '' || strlen($raw) > MAX_BODY) {
    respond(400, ['ok' => false, 'error' => 'Invalid request payload']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid request payload']);
}

// Honeypot. Bots that fill it get the same success response and nothing is stored or emailed.
if (trim(field_string($data, 'tg_leave_blank')) !== '') {
    respond(200, ['ok' => true, 'message' => 'Sample request received!']);
}

$url = youtube_url(field_string($data, 'url'));
$contact = clean_email(field_string($data, 'contact'));
if ($url === null || $contact === null) {
    respond(400, ['ok' => false, 'error' => 'Enter a YouTube link and a valid email address.']);
}

$channel = clean_line(field_string($data, 'channel'), 150);
if ($channel === '') {
    $channel = 'Not provided';
}
$length = clean_line(field_string($data, 'length'), 80);
if ($length === '') {
    $length = 'Not provided';
}
$plan = clean_line(field_string($data, 'plan'), 400);
if ($plan === '') {
    $plan = 'Free sample · Help me choose a plan';
}
$customNotes = clean_notes(field_string($data, 'customNotes'), 1000);
$date = gmdate('Y-m-d H:i:s') . ' UTC';
$ip = client_ip();

$leadEntry = [
    'timestamp' => $date,
    'channel' => $channel,
    'video_url' => $url,
    'length' => $length,
    'contact' => $contact,
    'plan' => $plan,
    'custom_notes' => $customNotes,
    'ip' => $ip,
];

$logged = false;
$dir = storage_dir();
if ($dir !== null) {
    $logFile = $dir . '/leads.jsonl';
    $written = file_put_contents(
        $logFile,
        json_encode($leadEntry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n",
        FILE_APPEND | LOCK_EX
    );
    $logged = $written !== false;
}

$subject = 'New YouTube Sample / Custom Offer Lead: ' . $channel;
if (preg_match('/[^\x20-\x7E]/', $subject)) {
    $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
}
$message = "New YouTube Creator Sample / Custom Offer Request:\n\n"
    . "• Selected Offer: {$plan}\n"
    . "• Channel Name: {$channel}\n"
    . "• Video / Channel URL: {$url}\n"
    . "• Typical Video Length: {$length}\n"
    . "• Creator Contact: {$contact}\n"
    . ($customNotes !== '' ? "• Custom Offer Notes: {$customNotes}\n" : '')
    . "• Submitted At: {$date}\n";
$headers = "From: ToonGhuri Studio <noreply@toonghuri.com>\r\n"
    . 'Reply-To: ' . STUDIO_EMAIL . "\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n";

$mailed = @mail(STUDIO_EMAIL, $subject, $message, $headers);

if (!$logged && !$mailed) {
    respond(500, ['ok' => false, 'error' => 'Could not record your request. Please email studio@toonghuri.com.']);
}

respond(200, ['ok' => true, 'message' => 'Sample request received!']);
