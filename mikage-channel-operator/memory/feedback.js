function calcScore({ views, likes, saves, clicks }) {
  if (!views || views <= 0) return 0;
  
  const likesWeighted = (likes || 0) * 1;
  const savesWeighted = (saves || 0) * 2;
  const clicksWeighted = (clicks || 0) * 3;
  
  const totalWeighted = likesWeighted + savesWeighted + clicksWeighted;
  
  return totalWeighted / views;
}

function classify(score) {
  if (score === null || score === undefined || score === 0) {
    return '';
  }
  
  if (score >= 0.10) {
    return 'win';
  } else if (score > 0 && score < 0.10) {
    return 'lose';
  }
  
  return '';
}

function updatePerformance(record) {
  const score = calcScore(record);
  const result = classify(score);
  
  return {
    ...record,
    performance_score: score,
    result_score: result
  };
}

module.exports = {
  calcScore,
  classify,
  updatePerformance
};
