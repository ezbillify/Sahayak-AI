const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // Read forms database from file
    const formsPath = path.join(__dirname, '../../data/forms-database.json');
    const formsData = JSON.parse(fs.readFileSync(formsPath, 'utf8'));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        forms: formsData.forms || [],
        total: formsData.forms?.length || 0
      })
    };

  } catch (error) {
    console.error('Error getting forms:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get forms' })
    };
  }
};
