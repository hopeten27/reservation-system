import fetch from 'node-fetch';

const API_BASE = 'https://super-happiness-wrj7656wrr99hg6wj-5000.app.github.dev/api/v1';

const testEndpoints = [
  { name: 'Health Check', url: `${API_BASE}/health`, method: 'GET' },
  { name: 'Services List', url: `${API_BASE}/services`, method: 'GET' },
  { name: 'Slots List', url: `${API_BASE}/slots`, method: 'GET' },
];

async function testResponseTime(endpoint) {
  const start = Date.now();
  try {
    const response = await fetch(endpoint.url, { method: endpoint.method });
    const end = Date.now();
    const responseTime = end - start;
    
    return {
      name: endpoint.name,
      responseTime,
      status: response.status,
      success: response.ok
    };
  } catch (error) {
    const end = Date.now();
    return {
      name: endpoint.name,
      responseTime: end - start,
      status: 'ERROR',
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🚀 Testing API Response Times...\n');
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    const result = await testResponseTime(endpoint);
    results.push(result);
    
    const statusIcon = result.success ? '✅' : '❌';
    const timeColor = result.responseTime < 200 ? '🟢' : result.responseTime < 500 ? '🟡' : '🔴';
    
    console.log(`${statusIcon} ${result.name}`);
    console.log(`   ${timeColor} Response Time: ${result.responseTime}ms`);
    console.log(`   Status: ${result.status}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    console.log('');
  }
  
  // Summary
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  const successRate = (results.filter(r => r.success).length / results.length) * 100;
  
  console.log('📊 Summary:');
  console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`   Success Rate: ${successRate.toFixed(1)}%`);
  
  // Performance Assessment
  console.log('\n🎯 Performance Assessment:');
  if (avgResponseTime < 200) {
    console.log('   🟢 EXCELLENT - Very fast response times');
  } else if (avgResponseTime < 500) {
    console.log('   🟡 GOOD - Acceptable response times');
  } else if (avgResponseTime < 1000) {
    console.log('   🟠 FAIR - Could be improved');
  } else {
    console.log('   🔴 POOR - Needs optimization');
  }
}

runTests().catch(console.error);