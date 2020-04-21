import { fifaData } from './fifa.js';
//console.log(fifaData);

//  M V P  //

/* Task 1: Investigate the data above. Practice accessing data by console.log-ing the following pieces of data 

(a) Home Team name for 2014 world cup final
(b) Away Team name for 2014 world cup final
(c) Home Team goals for 2014 world cup final
(d) Away Team goals for 2014 world cup final
(e) Winner of 2014 world cup final */

let fourteenFinals = fifaData.filter(function (item) {
  return item.Year === 2014 && item.Stage === 'Final';
});

console.log('Task 1 - 2014 Home Team:', fourteenFinals[0]['Home Team Name']);
console.log('Task 1 - 2014 Away Team:', fourteenFinals[0]['Away Team Name']);
console.log(
  'Task 1 - 2014 Home Team Goals:',
  fourteenFinals[0]['Home Team Goals']
);
console.log(
  'Task 1 - 2014 Away Team Goals:',
  fourteenFinals[0]['Away Team Goals']
);

if (
  fourteenFinals[0]['Home Team Goals'] > fourteenFinals[0]['Away Team Goals']
) {
  console.log('Task 1 - 2014 Winner:', fourteenFinals[0]['Home Team Name']);
} else if (
  fourteenFinals[0]['Away Team Goals'] > fourteenFinals[0]['Home Team Goals']
) {
  console.log('Task 1 - 2014 Winner:', fourteenFinals[0]['Away Team Name']);
}

/* Task 2: Create a function called  getFinals that takes `data` as an argument and returns an array of objects with only finals data */

function getFinals(arr) {
  let finalMatches = arr.filter(function (item) {
    return item.Stage === 'Final';
  });
  return finalMatches;
}

console.log('Task 2 -', getFinals(fifaData));

/* Task 3: Impliment a higher-order function called `getYears` that accepts the callback function `getFinals`, and returns an array called `years` containing all of the years in the dataset */

function getYears(cb, arr) {
  let results = cb(arr);
  let years = [];
  results.forEach(function (item) {
    years.push(item.Year);
  });
  return years;
}

console.log('Task 3 -', getYears(getFinals, fifaData));

/* Task 5: Impliment a higher-order function called `getWinners`, that accepts the callback function `getFinals()` and determine the winner (home or away) of each `finals` game. Return the name of all winning countries in an array called `winners` */

function getWinners(cb, arr) {
  let results = cb(arr);
  let winners = [];
  results.forEach(function (item) {
    if (
      item['Home Team Goals'] > item['Away Team Goals'] ||
      item['Win conditions'].includes(item['Home Team Name'])
    ) {
      winners.push(item['Home Team Name']);
    } else if (item['Away Team Goals'] > item['Home Team Goals']) {
      winners.push(item['Away Team Name']);
    }
  });
  return winners;
}

console.log('Task 5 -', getWinners(getFinals, fifaData));

/* Task 6: Implement a higher-order function called `getWinnersByYear` that accepts the following parameters and returns a set of strings "In {year}, {country} won the world cup!" 

Parameters: 
 * callback function getWinners
 * callback function getYears
 */

function getAllWinners(finals, winners, years, arr) {
  let winningTeams = winners(finals, arr);
  let theYears = years(finals, arr);
  for (let i = 0; i < winningTeams.length; i++) {
    console.log(
      `Task 6 - In ${theYears[i]}, ${winningTeams[i]} won the world cup!`
    );
  }
}

getAllWinners(getFinals, getWinners, getYears, fifaData);

/* Task 7: Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data, initials) {
  // filter where home OR away match those initials
  const byTeam = data.filter(function (item) {
    return (
      item['Home Team Initials'] === initials ||
      item['Away Team Initials'] === initials
    );
  });
  // check if that team won or lost
  const wins = byTeam.map(function (item) {
    if (
      item['Home Team Initials'] === initials &&
      item['Home Team Goals'] > item['Away Team Goals']
    ) {
      return 1;
    } else if (
      item['Away Team Initials'] === initials &&
      item['Away Team Goals'] > item['Home Team Goals']
    ) {
      return 1;
    } else if (
      item['Home Team Initials'] === initials &&
      item['Win conditions'].includes(item['Home Team Name'])
    ) {
      return 1;
    } else if (
      item['Away Team Initials'] === initials &&
      item['Win conditions'].includes(item['Away Team Name'])
    ) {
      return 1;
    } else {
      return 0;
    }
  });
  // reduce to get total
  const total = wins.reduce(function (wins, totalWins) {
    return wins + totalWins;
  });
  return total;
}

console.log('Task 7 -', getCountryWins(getFinals(fifaData), 'BRA'));

/* Task 8: Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */

function getGoals(data) {
  // create an array to hold country names
  let teamNames = [];
  // use .forEach to go through looking at teams
  data.forEach(function (game) {
    // loop through teamData checking if that team already exists
    for (let i = 0; i < data.length; i++) {
      if (!teamNames.includes(game['Home Team Name'])) {
        teamNames.push(game['Home Team Name']);
      } else if (!teamNames.includes(game['Away Team Name'])) {
        teamNames.push(game['Away Team Name']);
      }
    }
  });
  // create an array to hold team objects
  let teamObjects = [];
  // use .forEach...
  teamNames.forEach(function (team) {
    //to create an object for each country
    let currentTeam = {};
    // set their name equal to team
    currentTeam.name = team;
    // with flat 0 for scores and games
    currentTeam.score = 0;
    currentTeam.games = 0;
    // push that into the team objects array
    teamObjects.push(currentTeam);
  });
  // go through the actual fifaData
  data.forEach(function (scores) {
    // iterate through the objects array
    for (let i = 0; i < teamObjects.length; i++) {
      //if home team name is the same as the current array index name...
      if (scores['Home Team Name'] === teamObjects[i].name) {
        //iterate scores
        teamObjects[i].score += scores['Home Team Goals'];
        //iterate games
        teamObjects[i].games++;
        //else if away team name is the same as the current array index name...
      } else if (scores['Away Team Name'] === teamObjects[i].name) {
        //iterate scores
        teamObjects[i].score += scores['Away Team Goals'];
        //iterate games
        teamObjects[i].games++;
      }
    }
  });
  //create an array to hold the objects with name/average
  let averages = [];
  //use .forEach to go through the team objects
  teamObjects.forEach(function (country) {
    //create an object to hold the current country's data
    let thisCountry = {};
    // put the country name into the new object
    thisCountry.name = country.name;
    // find the average and put that in the new object
    thisCountry.average = country.score / country.games;
    // push this country's object into the averages array
    averages.push(thisCountry);
  });
  // create a variable to hold object containing current highest average
  let currentHighest = 0;
  let currentCountry = '';
  // loop through the averages
  for (let i = 0; i < averages.length; i++) {
    // if the country's average is higher than the currentHighest...
    if (averages[i].average > currentHighest) {
      // replace currentHighest with this value
      currentHighest = averages[i].average;
      // and replace currentCountry with this country
      currentCountry = averages[i].name;
    }
  }
  return `${currentCountry} had the highest average at ${currentHighest} goals per game.`;
}

console.log('Task 8 -', getGoals(fifaData));

/* Task 9: Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */

function badDefense(data) {
  // create an array to hold country names
  let teamNames = [];
  // use .forEach to go through looking at teams
  data.forEach(function (game) {
    // loop through teamData checking if that team already exists
    for (let i = 0; i < data.length; i++) {
      if (!teamNames.includes(game['Home Team Name'])) {
        teamNames.push(game['Home Team Name']);
      } else if (!teamNames.includes(game['Away Team Name'])) {
        teamNames.push(game['Away Team Name']);
      }
    }
  });

  // create an array to hold team objects
  let teamObjects = [];
  // use .forEach...
  teamNames.forEach(function (team) {
    //to create an object for each country
    let currentTeam = {};
    // set their name equal to team
    currentTeam.name = team;
    // with flat 0 for scores and games
    currentTeam.scoredAgainst = 0;
    currentTeam.games = 0;
    // push that into the team objects array
    teamObjects.push(currentTeam);
  });

  data.forEach(function (country) {
    // iterate through the objects array
    for (let i = 0; i < teamObjects.length; i++) {
      //if home team name is the same as the current array index name...
      if (country['Home Team Name'] === teamObjects[i].name) {
        //iterate scores
        teamObjects[i].scoredAgainst += country['Away Team Goals'];
        //iterate games
        teamObjects[i].games++;
        //else if away team name is the same as the current array index name...
      } else if (country['Away Team Name'] === teamObjects[i].name) {
        //iterate scores
        teamObjects[i].scoredAgainst += country['Home Team Goals'];
        //iterate games
        teamObjects[i].games++;
      }
    }
  });

  //create an array to hold the objects with name/average
  let averageScoredAgainst = [];
  //use .forEach to go through the team objects
  teamObjects.forEach(function (country) {
    //create an object to hold the current country's data
    let thisCountry = {};
    // put the country name into the new object
    thisCountry.name = country.name;
    // find the average scored against and put that in the new object
    thisCountry.average = country.scoredAgainst / country.games;
    // push this country's object into the averages array
    averageScoredAgainst.push(thisCountry);
  });

  // create a variable to hold object containing current worst defender
  let currentWorst = 0;
  let currentCountry = '';
  // loop through the averageScoredAgainst
  for (let i = 0; i < averageScoredAgainst.length; i++) {
    // if the country's average is higher than the currentWorst...
    if (averageScoredAgainst[i].average > currentWorst) {
      // replace currentWorst with this value
      currentWorst = averageScoredAgainst[i].average;
      // and replace currentCountry with this country
      currentCountry = averageScoredAgainst[i].name;
    }
  }
  return `${currentCountry} had the worst defense with ${currentWorst} goals scored against them on average.`;
}

console.log('Task 9 -', badDefense(fifaData));

/* Task 10: Write a function called `getAverageGoals` that accepts a parameter `data` and returns the the average number of home team goals and away team goals scored per match (Hint: use .reduce and do this in 2 steps) */

function getAverageGoals(data) {
  const homeGoals = data.reduce(function (goals, game) {
    return goals + game['Home Team Goals'] / data.length;
  }, 0);
  const awayGoals = data.reduce(function (goals, game) {
    return goals + game['Away Team Goals'] / data.length;
  }, 0);
  return `An average of ${homeGoals.toFixed(
    4
  )} goals were scored in home games, and an average of ${awayGoals.toFixed(
    4
  )} goals were scored while away.`;
}

console.log('Task 10 -', getAverageGoals(fifaData));

/// STRETCH 🥅 //

/* Use the space below to work on any stretch goals of your chosing as listed in the README file. */
