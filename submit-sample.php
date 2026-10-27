<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request payload']);
    exit;
}

$channel = isset($data['channel']) ? trim(strip_tags($data['channel'])) : 'Unknown Channel';
$url     = isset($data['url']) ? trim(strip_tags($data['url'])) : '';
$length  = isset($data['length']) ? trim(strip_tags($data['length'])) : '';
$contact = isset($data['contact']) ? trim(strip_tags($data['contact'])) : '';
$plan    = isset($data['plan']) ? trim(strip_tags($data['plan'])) : 'Free 90s 10-Language Pilot';
$date    = gmdate('Y-m-d H:i:s') . ' UTC';

// 1. Append lead to a protected JSON log file on Hostinger so no lead is ever lost
$leadEntry = [
    'timestamp' => $date,
    'channel'   => $channel,
    'video_url' => $url,
    'length'    => $length,
    'contact'   => $contact,
    'plan'      => $plan,
    'ip'        => $_SERVER['REMOTE_ADDR'] ?? ''
];

$logFile = __DIR__ . '/_leads_submissions.jsonl';
@file_put_contents($logFile, json_encode($leadEntry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

// 2. Send instant email notification to studio@toonghuri.com via Hostinger PHP mail()
$to      = 'studio@toonghuri.com';
$subject = "New 10-Language Sample Lead: {$channel}";
$message = "New YouTube Creator Sample Request on ToonGhuri Studio (toonghuri.com):\n\n"
         . "• Channel Name: {$channel}\n"
         . "• Video / Channel URL: {$url}\n"
         . "• Typical Video Length: {$length}\n"
         . "• Creator Contact: {$contact}\n"
         . "• Selected Plan: {$plan}\n"
         . "• Submitted At: {$date}\n";
$headers = "From: ToonGhuri Studio <noreply@toonghuri.com>\r\n"
         . "Reply-To: {$to}\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to, $subject, $message, $headers);

echo json_encode(['ok' => true, 'message' => 'Sample request received!']);
