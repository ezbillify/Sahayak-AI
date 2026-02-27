const formsDatabase = require('../data/forms-database.json');

/**
 * Detect form type by matching keywords in extracted text
 */
function detectFormType(extractedText) {
  const textLower = extractedText.toLowerCase();
  const allForms = [...formsDatabase.governmentForms, ...formsDatabase.bankForms];
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const form of allForms) {
    let score = 0;
    
    // Check each keyword
    for (const keyword of form.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    // Bonus points for exact form ID match
    if (textLower.includes(form.id.replace(/-/g, ' '))) {
      score += 3;
    }
    
    // Bonus for authority name
    if (textLower.includes(form.authority.toLowerCase())) {
      score += 2;
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = form;
    }
  }
  
  return {
    detectedForm: bestMatch,
    confidence: highestScore > 0 ? Math.min((highestScore / 5) * 100, 100) : 0
  };
}

module.exports = { detectFormType };
