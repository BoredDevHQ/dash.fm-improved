<?php
header('Content-Type: application/json');

// Allow from any origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['type']) && isset($data['content'])) {
        $filename = '';
        $content = '';
        
        // Determine which file to write to and how to handle the content
        if ($data['type'] === 'glances') {
            $filename = 'get_data.js';
            // Read the current file content
            $currentContent = file_get_contents($filename);
            if ($currentContent === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to read file']);
                exit;
            }

            // Create the replacement content
            $pattern = '/const glancesconfig = \{[\s\S]*?\};/';
            $replacement = "const glancesconfig = {\n    baseURL: 'http://" . $data['content'] . ":61208'\n};";
            
            // Perform the replacement
            $content = preg_replace($pattern, $replacement, $currentContent);
            if ($content === null) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Pattern replacement failed']);
                exit;
            }
        } else if ($data['type'] === 'lastfm_user') {
            $filename = 'get_data.js';
            // Read the current file content
            $currentContent = file_get_contents($filename);
            if ($currentContent === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to read file']);
                exit;
            }

            // Create the replacement content
            $pattern = '/user=.*?&/';
            $replacement = "user=" . $data['content'] . "&";
            
            // Perform the replacement
            $content = preg_replace($pattern, $replacement, $currentContent);
            if ($content === null) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Pattern replacement failed']);
                exit;
            }
        } else if ($data['type'] === 'apikey') {
            $filename = 'apikey.js';
            $content = 'const ApiKey = "' . $data['content'] . '";';
        }
        
        if ($filename && file_put_contents($filename, $content) !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to write file']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid request data']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?> 
