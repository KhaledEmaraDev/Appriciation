server {
    listen 443 ssl http2;
    server_name appriciation.com;

    ssl_certificate /etc/letsencrypt/live/appriciation.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/appriciation.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;

        # Socket.IO Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name appriciation.com;

    if ($host = appriciation.com) {
        return 301 https://$host$request_uri;
    }

    return 404;
}