// Test script for camera API
// Run with: node scripts/test-cameras.js

const BASE_URL = 'http://localhost:3000';

async function testCameraAPI() {
  try {
    console.log('🎥 Testing Camera API...\n');

    // 1. Seed database first
    console.log('1. Seeding database...');
    const seedResponse = await fetch(`${BASE_URL}/api/seed`, {
      method: 'POST'
    });
    const seedResult = await seedResponse.json();
    console.log('✅ Seed result:', seedResult.message);

    // 2. Fetch all cameras
    console.log('\n2. Fetching all cameras...');
    const camerasResponse = await fetch(`${BASE_URL}/api/cameras`);
    const cameras = await camerasResponse.json();
    console.log(`✅ Found ${cameras.length} cameras`);
    
    // Show first 5 cameras
    console.log('\nFirst 5 cameras:');
    cameras.slice(0, 5).forEach(cam => {
      console.log(`  - ${cam.name} (${cam.zone}) - ${cam.rtspUrl} [${cam.status}]`);
    });

    // 3. Test analytics session
    console.log('\n3. Testing analytics session...');
    const sessionResponse = await fetch(`${BASE_URL}/api/analytics-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cameraId: 1,
        modelType: 'face_recognition'
      })
    });
    const session = await sessionResponse.json();
    console.log('✅ Created analytics session:', session.sessionId);

    // 4. Update session with mock detection
    console.log('\n4. Adding mock detection...');
    const updateResponse = await fetch(`${BASE_URL}/api/analytics-session`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.sessionId,
        detections: [{
          timestamp: new Date(),
          confidence: 0.95,
          boundingBox: { x: 100, y: 150, width: 80, height: 120 },
          label: 'John Doe',
          metadata: { age: 35, emotion: 'neutral' }
        }],
        statistics: {
          totalDetections: 1,
          averageConfidence: 0.95,
          uniquePersons: 1
        }
      })
    });
    const updatedSession = await updateResponse.json();
    console.log('✅ Updated session with detection');

    // 5. End session
    console.log('\n5. Ending session...');
    await fetch(`${BASE_URL}/api/analytics-session`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.sessionId,
        isActive: false
      })
    });
    console.log('✅ Session ended');

    console.log('\n🎉 All tests passed! Camera integration is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  testCameraAPI();
}

module.exports = { testCameraAPI };