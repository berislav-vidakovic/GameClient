## Frontend Deployment

1. [Create minimal Nginx config file](#1-create-minimal-nginx-config-file)  
2. [Issue SSL certificate](#2-issue-ssl-certificate)  
3. [Initialize Git and make first commit](#3-initialize-git-and-make-first-commit)  
4. [Add CI/CD yaml](#4-add-cicd-yaml)

### 1. Create minimal Nginx config file
  ```nginx
  server {
    listen 80;
    server_name gamesjclient.barryonweb.com;

    root /var/www/games/frontend/panel;
    index index.html;

    location / {
      try_files $uri /index.html;
    }
  }
  ```

### 2. Issue SSL certificate

- Output: Certbot will update Nginx config file
  ```nginx
  server {
    server_name gamesjclient.barryonweb.com;

    root /var/www/games/frontend/panel;
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


### 3. Initialize Git and make first commit 

1. Create Github Repo

2. <a href="docs/Git.md">Create remote repo, init, commit and  push
</a>

3. SSH connection Dev to Remote Repo

  - Test connection Dev-VPS
    ```bash
    ssh -i ~/.ssh/github_ci barry75@barryonweb.com
    ```

  - Establish connection Github-VPS (Repository-specific)
    - Add the Private Key ~/.ssh/github_ci to GitHub Secrets
      - GitHub: Settings → Secrets and variables → Actions → New repository secret
      - Create secret key: 
        - Name: SSH_PRIVATE_KEY
        - Content: Paste full content of private key github_ci





### 4. Add CI/CD yaml
  ```yaml
  name: Deploy TypeScript Frontend

  on:
    push:
      branches:
        - main
    workflow_dispatch:

  jobs:
    frontend-build-and-deploy:
      runs-on: ubuntu-latest

      steps:
        # Checkout code
        - name: Checkout repository
          uses: actions/checkout@v4

        # Setup Node.js environment
        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: 20

        # GitHub - Install frontend dependencies and build
        - name: Build frontend
          run: |
            npm install  
            cd panel
            npm install
            npm run build
            cd ../sudoku
            npm install
            npm run build
            cd ../connect4
            npm install
            npm run build

        # Start SSH agent with GitHub secret key
        - name: Setup SSH
          uses: webfactory/ssh-agent@v0.9.0
          with:
            ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

        # Add server to known_hosts to avoid verification errors
        - name: Add server to known_hosts
          run: |
            mkdir -p ~/.ssh
            ssh-keyscan barryonweb.com >> ~/.ssh/known_hosts
        
        # Nginx config - transfer, enable, check syntax and restart Nginx
        - name: Update Nginx config
          run: |
            ssh barry75@barryonweb.com "mkdir -p /var/www/games/nginx"
            scp gamesjclient.barryonweb.com barry75@barryonweb.com:/var/www/games/nginx/
            ssh barry75@barryonweb.com "
              sudo cp /var/www/games/nginx/gamesjclient.barryonweb.com /etc/nginx/sites-available/ &&
              sudo ln -sf /etc/nginx/sites-available/gamesjclient.barryonweb.com /etc/nginx/sites-enabled/ &&
              sudo nginx -t &&
              sudo systemctl reload nginx"
        

        # Transfer frontend from GitHub Repo to Ubuntu server via SCP
        - name: Deploy frontend via SSH to server
          run: |
            ssh barry75@barryonweb.com "mkdir -p /var/www/games/frontend/panel"
            scp -r panel/dist/* barry75@barryonweb.com:/var/www/games/frontend/panel/
            ssh barry75@barryonweb.com "mkdir -p /var/www/games/frontend/sudoku"
            scp -r sudoku/dist/* barry75@barryonweb.com:/var/www/games/frontend/sudoku/
            ssh barry75@barryonweb.com "mkdir -p /var/www/games/frontend/connect4"
            scp -r connect4/dist/* barry75@barryonweb.com:/var/www/games/frontend/connect4/
  ```

### 5. Troubleshooting 

1. Check Nginx health & config
  ```bash
  sudo systemctl status nginx --no-pager
  sudo nginx -t
  ```

2. Inspect Nginx error log
  ```bash
  sudo tail -n 200 /var/log/nginx/error.log
  sudo tail -f /var/log/nginx/error.log # follow live
  ```

3. Root folder in Nginx config must contain index.html

