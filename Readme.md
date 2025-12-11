## Setup for Deployment

### Create minimal Nginx config file
  ```nginx
  server {
    listen 80;
    server_name gamesjclient.barryonweb.com;

    root /var/www/games/frontend;
    index index.html;

    location / {
      try_files $uri /index.html;
    }
  }
  ```

### Issue SSL certificate

- Output: Certbot will update Nginx config file
  ```nginx
  server {
    server_name gamesjclient.barryonweb.com;

    root /var/www/games/frontend;
    index index.html;

    location / {
      try_files $uri /index.html;
    }

    listen 443 ssl; # managed by Certbot
      ssl_certificate /etc/letsencrypt/live/gamesjclient.barryonweb.com/fullchain.pem; # managed by Certbot
      ssl_certificate_key /etc/letsencrypt/live/gamesjclient.barryonweb.com/privkey.pem; # managed by Certbot
      include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
      ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }

  server {
      if ($host = gamesjclient.barryonweb.com) {
          return 301 https://$host$request_uri;
      } # managed by Certbot

    listen 80;
    server_name gamesjclient.barryonweb.com;
      return 404; # managed by Certbot
  }
  ```

- Copy nginx file to server manually
  ```bash
  scp gamesjclient.barryonweb.com barry75@barryonweb.com:/var/www/games/nginx/
  sudo cp /var/www/games/nginx/gamesjclient.barryonweb.com /etc/nginx/sites-available/ 
  ```

- Enable the site, check sites enabled, check syntax and restart
  ```bash
  sudo ln -sf /etc/nginx/sites-available/gamesjclient.barryonweb.com /etc/nginx/sites-enabled/
  ls -l /etc/nginx/sites-enabled/
  sudo nginx -t 
  sudo systemctl reload nginx
  ```

- Issue SSL certificate for the subdomain
  ```bash
  sudo certbot --nginx -d gamesjclient.barryonweb.com
  ```

- Check SSL certificate installed
  ```bash
  sudo ls -l /etc/letsencrypt/live/gamesjclient.barryonweb.com
  ```

- Copy updated file back to local Repo
  ```bash
  scp barry75@barryonweb.com:/etc/nginx/sites-available/gamesjclient.barryonweb.com ./
  ```


### Link to Github Repo

#### SSH connection Dev to Remote Repo

#### Initialize Git and make first commit 

1. Create Github Repo

2. <a href="docs/Git.md">Create remote repo, init, commit and  push
</a>




### Add CI/CD yaml


