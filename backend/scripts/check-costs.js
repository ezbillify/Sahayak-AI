#!/usr/bin/env node

/**
 * AWS Cost Monitoring Script
 * Run: node scripts/check-costs.js
 */

const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');

const client = new CostExplorerClient({ region: 'us-east-1' }); // Cost Explorer is only in us-east-1

async function checkCosts() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: startDate.toISOString().split('T')[0],
        End: endDate.toISOString().split('T')[0]
      },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [
        {
          Type: 'SERVICE',
          Key: 'SERVICE'
        }
      ]
    });

    const response = await client.send(command);
    
    console.log('\n📊 AWS Cost Report (Last 30 Days)\n');
    console.log('='.repeat(50));
    
    let totalCost = 0;
    const services = {};

    response.ResultsByTime.forEach(result => {
      result.Groups.forEach(group => {
        const service = group.Keys[0];
        const cost = parseFloat(group.Metrics.UnblendedCost.Amount);
        
        if (cost > 0) {
          services[service] = (services[service] || 0) + cost;
          totalCost += cost;
        }
      });
    });

    // Sort by cost
    const sortedServices = Object.entries(services)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10

    sortedServices.forEach(([service, cost]) => {
      const percentage = ((cost / totalCost) * 100).toFixed(1);
      console.log(`${service.padEnd(30)} $${cost.toFixed(2).padStart(8)} (${percentage}%)`);
    });

    console.log('='.repeat(50));
    console.log(`${'TOTAL'.padEnd(30)} $${totalCost.toFixed(2).padStart(8)}`);
    console.log('='.repeat(50));

    // Cost alerts
    console.log('\n⚠️  Cost Alerts:\n');
    
    if (totalCost > 100) {
      console.log('🔴 HIGH: Monthly cost exceeds $100!');
    } else if (totalCost > 50) {
      console.log('🟡 MEDIUM: Monthly cost exceeds $50');
    } else if (totalCost > 10) {
      console.log('🟢 LOW: Monthly cost is under control');
    } else {
      console.log('✅ EXCELLENT: Very low monthly cost!');
    }

    // Optimization suggestions
    console.log('\n💡 Optimization Suggestions:\n');
    
    if (services['AWS Lambda'] > 5) {
      console.log('- Consider reducing Lambda memory or timeout');
    }
    if (services['Amazon Textract'] > 10) {
      console.log('- Enable image compression before Textract');
      console.log('- Cache OCR results to avoid re-processing');
    }
    if (services['Amazon Bedrock'] > 20) {
      console.log('- Cache AI responses');
      console.log('- Use cheaper model for simple tasks');
    }
    if (services['Amazon S3'] > 5) {
      console.log('- Enable S3 Intelligent-Tiering');
      console.log('- Set up lifecycle policies');
    }

    console.log('\n');

  } catch (error) {
    console.error('Error fetching costs:', error.message);
    console.log('\nNote: Make sure you have Cost Explorer enabled in AWS Console');
    console.log('and your IAM user has ce:GetCostAndUsage permission');
  }
}

checkCosts();
