<?php

if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
   echo "<P>Client IP is: " . $_SERVER["HTTP_CF_CONNECTING_IP"] . "</P>";
}

$local_ip = shell_exec('dig +short myip.opendns.com @resolver1.opendns.com');

echo "<P>Server IP is: " . $local_ip . "</P>";


$vpn_ip = shell_exec('sudo -u root ip netns exec ns1 dig +short myip.opendns.com @resolver1.opendns.com');

echo "<P>VPN IP is: " . $vpn_ip . "</P>";

?>
