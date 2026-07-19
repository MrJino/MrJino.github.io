---
date: 2026-07-20
tags:
- letsencrypt
- cloudflare
- nginx
- ssl
- wildcard
title: Let's Encrypt로 Cloudflare DNS 환경에서 gurunun.me 와일드카드
  인증서 발급하기
---

# Let's Encrypt로 Cloudflare DNS 환경에서 `gurunun.me` 와일드카드 인증서 발급하기

Let's Encrypt는 무료로 SSL/TLS 인증서를 발급받을 수 있는 서비스입니다.

Cloudflare를 DNS로 사용하는 경우 `*.gurunun.me` 와일드카드 인증서를
발급하려면 **DNS-01 Challenge**를 사용해야 합니다.

## 1. Cloudflare API Token 생성

Cloudflare Dashboard에서 다음 메뉴로 이동합니다.

``` text
My Profile
→ API Tokens
→ Create Token
→ Create Custom Token
```

권한은 다음과 같이 설정합니다.

  Permission    Access
  ------------- --------
  Zone → DNS    Edit
  Zone → Zone   Read

Zone Resources는 `gurunun.me`만 선택합니다.

## 2. Certbot 설치

``` bash
sudo apt update
sudo apt install certbot python3-certbot-dns-cloudflare
```

Snap을 사용하는 경우

``` bash
sudo snap install certbot --classic
```

## 3. API Token 저장

``` bash
sudo mkdir -p /root/.secrets
sudo nano /root/.secrets/cloudflare.ini
```

``` ini
dns_cloudflare_api_token = YOUR_API_TOKEN
```

``` bash
sudo chmod 600 /root/.secrets/cloudflare.ini
```

## 4. 인증서 발급

``` bash
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  --email admin@gurunun.me \
  --agree-tos \
  --no-eff-email \
  -d gurunun.me \
  -d "*.gurunun.me"
```

Certbot은 `_acme-challenge.gurunun.me` TXT 레코드를 자동 생성하여 인증을
수행합니다.

## 5. 인증서 위치

``` text
/etc/letsencrypt/live/gurunun.me/
```

생성 파일

``` text
cert.pem
chain.pem
fullchain.pem
privkey.pem
```

Nginx에서는 일반적으로 다음 두 파일을 사용합니다.

``` nginx
ssl_certificate     /etc/letsencrypt/live/gurunun.me/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/gurunun.me/privkey.pem;
```

## 6. 자동 갱신 테스트

``` bash
sudo certbot renew --dry-run
```

## 7. 갱신 후 Nginx 자동 Reload

``` bash
sudo certbot renew \
  --deploy-hook "systemctl reload nginx"
```

또는 `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh`

``` bash
#!/bin/bash
systemctl reload nginx
```

실행 권한

``` bash
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

## 전체 흐름

``` text
Cloudflare DNS
      │
      ▼
Cloudflare API Token
      │
      ▼
Certbot
      │
DNS-01 Challenge
      │
      ▼
Let's Encrypt
      │
      ▼
/etc/letsencrypt/live/gurunun.me/
      │
      ▼
Nginx
```

## 마무리

Cloudflare DNS에서는 DNS-01 Challenge를 사용해야 와일드카드 인증서를
발급할 수 있습니다. 한 번 설정해 두면 Certbot이 인증서 갱신을 자동으로
처리하므로 운영 환경에서도 편리하게 사용할 수 있습니다.
