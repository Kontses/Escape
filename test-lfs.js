// Test script to check GitHub LFS URLs
const testUrls = [
  'https://github.com/Kontses/Escape/raw/main/public/Music/Discography/Ανθυγιεινή-μουσική/2.wav',
  'https://media.githubusercontent.com/media/Kontses/Escape/main/public/Music/Discography/Ανθυγιεινή-μουσική/2.wav',
  'https://github.com/Kontses/Escape/raw/main/public/Music/Dj-Sets/O%20BROSLA%20XESTIKE%20PANW%20TOU.mp3'
];

async function testUrl(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Test)',
      },
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Content-Length: ${response.headers.get('content-length')}`);
    console.log('---');
    
  } catch (error) {
    console.error(`Error testing ${url}:`, error.message);
    console.log('---');
  }
}

async function runTests() {
  for (const url of testUrls) {
    await testUrl(url);
  }
}

runTests();
