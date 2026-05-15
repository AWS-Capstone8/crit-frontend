#!/bin/bash
# crit-frontend 시작 스크립트
# 현재 EC2 IP를 감지하여 .env 업데이트 후 프론트 실행

IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "현재 EC2 IP: $IP"

# .env 업데이트
sed -i "s|http://[0-9.]*\.nip\.io:8080|http://${IP}.nip.io:8080|" .env
sed -i "s|VITE_SERVER_URL=http://[0-9.]*:8080|VITE_SERVER_URL=http://${IP}:8080|" .env

echo "설정 업데이트 완료"
echo "프론트 시작..."
npx vite --host
