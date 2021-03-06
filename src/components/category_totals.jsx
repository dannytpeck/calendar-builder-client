import React from 'react';

function CategoryTotals({ challenges }) {
  let healthFitnessTotal = 0;
  let growthDevelopmentTotal = 0;
  let contributionSustainabilityTotal = 0;
  let moneyProsperityTotal = 0;

  for (let phase in challenges) {
    challenges[phase].map(challenge => {
      switch (challenge.fields['Category']) {
        case 'Health and Fitness':
        case 'Health & Fitness':
          healthFitnessTotal += 1;
          break;
        case 'Growth and Development':
        case 'Growth & Development':
          growthDevelopmentTotal += 1;
          break;
        case 'Contribution and Sustainability':
        case 'Contribution & Sustainability':
          contributionSustainabilityTotal += 1;
          break;
        case 'Money and Prosperity':
        case 'Money & Prosperity':
          moneyProsperityTotal += 1;
          break;
      }
    });
  }

  return (
    <div id="categoryTotals">
      <h5>Category Totals</h5>
      <img className="table-icon table-icon_spacing" src="images/HP_Icon_Health_Fitness.png" title="Health and Fitness" />
      <span>{healthFitnessTotal}</span>
      <img className="table-icon table-icon_spacing" src="images/HP_Icon_Growth_Development.png" title="Growth and Development" />
      <span>{growthDevelopmentTotal}</span>
      <img className="table-icon table-icon_spacing" src="images/HP_Icon_Contribution_Sustainability.png" title="Contribution and Sustainability" />
      <span>{contributionSustainabilityTotal}</span>
      <img className="table-icon table-icon_spacing" src="images/HP_Icon_Money_Prosperity.png" title="Money and Prosperity" />
      <span>{moneyProsperityTotal}</span>
    </div>
  );
}

export default CategoryTotals;
