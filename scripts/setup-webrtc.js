#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎥 Setting up WebRTC for RTSP streaming...\n');

// Check if FFmpeg is installed
function checkFFmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('✅ FFmpeg is installed');
        resolve(true);
      } else {
        console.log('❌ FFmpeg not found');
        resolve(false);
      }
    });
    
    ffmpeg.on('error', () => {
      console.log('❌ FFmpeg not found');
      resolve(false);
    });
  });
}

// Install FFmpeg instructions
function showFFmpegInstructions() {
  console.log('\n📦 FFmpeg Installation Required:');
  console.log('');
  console.log('Windows:');
  console.log('  1. Download from: https://ffmpeg.org/download.html#build-windows');
  console.log('  2. Extract and add to PATH');
  console.log('  3. Or use chocolatey: choco install ffmpeg');
  console.log('');
  console.log('macOS:');
  console.log('  brew install ffmpeg');
  console.log('');
  console.log('Ubuntu/Debian:');
  console.log('  sudo apt update && sudo apt install ffmpeg');
  console.log('');
}

// Create systemd service for WebRTC server (Linux)
function createSystemdService() {
  const serviceContent = `[Unit]
Description=WebRTC Signaling Server for RTSP Cameras
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${process.cwd()}
ExecStart=/usr/bin/node server/webrtc-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target`;

  const servicePath = '/etc/systemd/system/webrtc-camera.service';
  
  try {
    fs.writeFileSync(servicePath, serviceContent);
    console.log('✅ Systemd service created at:', servicePath);
    console.log('   Enable with: sudo systemctl enable webrtc-camera');
    console.log('   Start with: sudo systemctl start webrtc-camera');
  } catch (error) {
    console.log('ℹ️  To create systemd service, run as root:');
    console.log(`   sudo node ${__filename}`);
  }
}

// Create PM2 ecosystem file
function createPM2Config() {
  const pm2Config = {
    apps: [{
      name: 'webrtc-server',
      script: 'server/webrtc-server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      }
    }]
  };

  fs.writeFileSync('ecosystem.config.js', `module.exports = ${JSON.stringify(pm2Config, null, 2)};`);
  console.log('✅ PM2 ecosystem file created');
  console.log('   Start with: pm2 start ecosystem.config.js');
}

// Create Docker setup
function createDockerSetup() {
  const dockerfile = `FROM node:18-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

EXPOSE 8080

CMD ["node", "server/webrtc-server.js"]`;

  const dockerCompose = `version: '3.8'

services:
  webrtc-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - webrtc-server
    restart: unless-stopped`;

  fs.writeFileSync('Dockerfile', dockerfile);
  fs.writeFileSync('docker-compose.yml', dockerCompose);
  
  console.log('✅ Docker configuration created');
  console.log('   Build with: docker-compose up --build');
}

// Create nginx configuration
function createNginxConfig() {
  const nginxConfig = `events {
    worker_connections 1024;
}

http {
    upstream webrtc_backend {
        server webrtc-server:8080;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://webrtc_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /socket.io/ {
            proxy_pass http://webrtc_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}`;

  fs.writeFileSync('nginx.conf', nginxConfig);
  console.log('✅ Nginx configuration created');
}

// Main setup function
async function setup() {
  console.log('1. Checking dependencies...');
  
  const hasFFmpeg = await checkFFmpeg();
  
  if (!hasFFmpeg) {
    showFFmpegInstructions();
    return;
  }

  console.log('\n2. Creating deployment configurations...');
  
  // Create deployment configs
  createPM2Config();
  createDockerSetup();
  createNginxConfig();
  
  // Create systemd service (Linux only)
  if (process.platform === 'linux') {
    createSystemdService();
  }

  console.log('\n✅ WebRTC setup complete!');
  console.log('\n🚀 Next steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Start WebRTC server: node server/webrtc-server.js');
  console.log('3. Start Next.js app: npm run dev');
  console.log('4. Test camera streams at: http://localhost:3000/dashboard/cameras');
  console.log('\n📚 For production deployment, see the created configuration files.');
}

// Run setup
setup().catch(console.error);