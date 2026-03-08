#!/usr/bin/env node

const http = require('http');

async function testSetup() {
  console.log('🔍 Testing Camera Setup...\n');

  // Test 1: Check if Next.js app is running
  console.log('1. Testing Next.js application...');
  try {
    const response = await fetch('http://localhost:3000/api/cameras');
    if (response.ok) {
      const cameras = await response.json();
      console.log(`✅ Next.js app running - Found ${cameras.length} cameras`);
    } else {
      console.log('❌ Next.js app not responding properly');
    }
  } catch (error) {
    console.log('❌ Next.js app not running on port 3000');
    console.log('   Start with: npm run dev');
  }

  // Test 2: Check if WebRTC server is running
  console.log('\n2. Testing WebRTC server...');
  try {
    const response = await fetch('http://localhost:8080/health');
    if (response.ok) {
      const health = await response.json();
      console.log('✅ WebRTC server running');
      console.log(`   Active streams: ${health.activeStreams}`);
    } else {
      console.log('❌ WebRTC server not responding properly');
    }
  } catch (error) {
    console.log('❌ WebRTC server not running on port 8080');
    console.log('   Start with: npm run webrtc');
    console.log('   Or both: npm run dev:full');
  }

  // Test 3: Check RTSP connectivity (basic ping)
  console.log('\n3. Testing RTSP server connectivity...');
  try {
    // Simple connectivity test to RTSP server IP
    const testRTSP = () => new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '65.1.214.31',
        port: 8554,
        method: 'HEAD',
        timeout: 5000
      }, (res) => {
        resolve(true);
      });
      
      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Timeout')));
      req.end();
    });

    await testRTSP();
    console.log('✅ RTSP server reachable at 65.1.214.31:8554');
  } catch (error) {
    console.log('❌ RTSP server not reachable');
    console.log('   Check network connectivity to 65.1.214.31:8554');
    console.log('   Verify VPN connection if required');
  }

  // Test 4: Check FFmpeg installation
  console.log('\n4. Testing FFmpeg installation...');
  try {
    const { spawn } = require('child_process');
    const ffmpeg = spawn('ffmpeg', ['-version']);
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('✅ FFmpeg is installed and working');
      } else {
        console.log('❌ FFmpeg installation issue');
      }
    });
    
    ffmpeg.on('error', () => {
      console.log('❌ FFmpeg not found in PATH');
      console.log('   Install FFmpeg:');
      console.log('   Windows: choco install ffmpeg');
      console.log('   macOS: brew install ffmpeg');
      console.log('   Linux: sudo apt install ffmpeg');
    });
  } catch (error) {
    console.log('❌ Cannot test FFmpeg');
  }

  console.log('\n📋 Summary:');
  console.log('If all tests pass, your camera system should work properly.');
  console.log('If WebRTC server is not running, the system will fall back to demo mode.');
  console.log('\n🚀 To start everything:');
  console.log('npm run dev:full');
  console.log('\nThen visit: http://localhost:3000/dashboard/cameras');
}

// Polyfill fetch for older Node.js versions
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data)
          });
        });
      });
      
      req.on('error', reject);
      if (options.body) req.write(options.body);
      req.end();
    });
  };
}

testSetup().catch(console.error);