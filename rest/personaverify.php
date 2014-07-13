<?php
function PersonaVerify() {
    error_log("Persona Verify");
    $url = 'https://verifier.login.persona.org/verify';
 
    $assert = filter_input(
        INPUT_POST,
        'assertion',
        FILTER_UNSAFE_RAW,
        FILTER_FLAG_STRIP_LOW|FILTER_FLAG_STRIP_HIGH
    );
 
error_log(print_r('Assert: ' . $assert,true));

    $scheme = 'http';
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != "on") {
        $scheme = 'https';
    }
    $audience = sprintf(
        '%s://%s:%s',
        $scheme,
        $_SERVER['HTTP_HOST'],
        $_SERVER['SERVER_PORT']
    );
 
error_log(print_r('audience: ' . $audience,true));

    $params = 'assertion=' . urlencode($assert) . '&audience='
        . urlencode($audience);
 
    $ch = curl_init();
    $options = array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => 2,
        CURLOPT_POSTFIELDS => $params
    );
 
    curl_setopt_array($ch, $options);
    $result = curl_exec($ch);
    curl_close($ch);
    error_log(print_r('audience: ' . $result,true));
    return $result;
}

?>