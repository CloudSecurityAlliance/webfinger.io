#!/bin/bash
#
# as root:
#
apt-get update
apt-get -y --with-new-pkgs upgrade
# reboot

# this will pull in apache
apt-get -y install php
a2enmod rewrite
systemctl restart apache2

echo "error" > /var/www/html/index.html

# /etc/apache2/apache2.conf
#<Directory /var/www/html/apiv1>
#	Options Indexes FollowSymLinks
#        AllowOverride All
#        Require all granted
#</Directory>

echo "" >> /etc/apache2/apache2.conf
echo "<Directory /var/www/html/apiv1>" >> /etc/apache2/apache2.conf
echo "	Options Indexes FollowSymLinks" >> /etc/apache2/apache2.conf
echo "        AllowOverride All" >> /etc/apache2/apache2.conf
echo "        Require all granted" >> /etc/apache2/apache2.conf
echo "</Directory>" >> /etc/apache2/apache2.conf

systemctl restart apache2

# Install google chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt -y install ./google-chrome-stable_current_amd64.deb
