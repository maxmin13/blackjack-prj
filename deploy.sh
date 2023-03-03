#!/bin/bash
         
rm -rf ~/.config/google-chrome
rm -rf ~/.cache/google-chrome
sudo rm -rf /var/www/html/*

sudo cp html/*.html /var/www/html

sudo cp -r images /var/www/html
sudo cp -r scripts /var/www/html
sudo cp -r styles /var/www/html

sudo cp -r html/test /var/www/html
