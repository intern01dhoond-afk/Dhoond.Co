process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fetch = require('node-fetch');

async function runAudit(strategy) {
  console.log(`Running PageSpeed audit for ${strategy}...`);
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.dhoond.co&strategy=${strategy}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const json = await res.json();
    
    const lighthouseResult = json.lighthouseResult;
    const categories = lighthouseResult.categories;
    const performanceScore = categories.performance.score * 100;
    
    console.log(`\n======================================`);
    console.log(`Strategy: ${strategy.toUpperCase()}`);
    console.log(`Performance Score: ${performanceScore}`);
    console.log(`======================================`);
    
    const audits = lighthouseResult.audits;
    const items = [];
    
    for (const [auditId, audit] of Object.entries(audits)) {
      if (audit.score !== null && audit.score < 0.9 && audit.details) {
        items.push({
          id: auditId,
          title: audit.title,
          score: audit.score,
          displayValue: audit.displayValue,
          description: audit.description,
          numericValue: audit.numericValue
        });
      }
    }
    
    // Sort by lowest score first
    items.sort((a, b) => a.score - b.score);
    
    console.log(`Failing Audits (Score < 0.9):`);
    items.forEach(item => {
      console.log(`- [${item.id}] ${item.title} (Score: ${Math.round(item.score * 100)})`);
      if (item.displayValue) console.log(`  Value: ${item.displayValue}`);
      if (item.description) console.log(`  Desc: ${item.description.replace(/\s+/g, ' ').substring(0, 150)}...`);
    });
  } catch (error) {
    console.error(`Error running audit for ${strategy}:`, error.message);
  }
}

async function main() {
  if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
  }
  await runAudit('desktop');
  await runAudit('mobile');
}

main();
