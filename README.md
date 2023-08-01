# hot-shot-scorecard

A Node.js module for scoring a basketball game of "Hotshot". 

## Features
- Ten-round scoring for a single game of "Hotshot".
- Ability to apply "GOAT" and "Heatcheck" modifiers for scoring bonus points.
- Portability with minimal third-party dependencies for a lean module.
- Support for Node.js 18.x.x or newer. 
- Low execution time for quick score calculation.
- Custom models for defining constants between rounds and the overall scorecard.
- Use of Common.js standards

## Rules of Hotshot
1. There are 8 spots on the court that can be used for scoring in Hotshot.
    a. Top of the three point line = 5 points
    b. Middle of the free-throw line = 4 points
    c. Left/right of the free-throw line = 3 points
    d. Left/right of the basket outside the box = 2 points
    e. Left/right layups = 1 point
2. You can only earn 2 total points from baskets made in the layup spots per round. A round is forfeited and given a 0 score if you forget this rule and make more than 2 layups in a round. 
3. A heatcheck upgrade is when you score at least 45 points in a round (not including bonus points).
4. A GOAT round upgrade indicates you made at least one shot from each spot in a single round.
5. Scoring for each round is based on the number of points you accumulate in that round from made shots + bonus shots made points.
    a. Rounds 1-9 scoring:
        - For a heatcheck round, you get 3 bonus shot attempts, worth triple points. 
        - Earning a GOAT round earns you 4 bonus shots for that round.
    b. Final round (10th) scoring:
        - In a heatcheck final round, you get two bonus shot attempts for each round you made 30+ points (excludes bonus points) over the course of the entire game. These bonus shots are worth double points. 
        - In a GOAT final round, you get one bonus shot from each of the 8 hotshot spots.
    c. Two points are deducted for missed layup shots. No points deducted for missed bonus layup shots.
6. Upgrades are not mutually exclusive, meaning GOATs and heatchecks can both be earned in individual rounds. Upgrades are only earned with non-bonus shot makes.
7. Winner is determined by the player with the most points.

## Quickstart

Since we are just providing an algorithm and means to calculate the overall scoring for a game of "Hotshot", the overall usage instructions are simple for the time being.

Install the dependencies first. This is only required when installing necessary testing harnesses like `mocha` and `chai`. Else, you can continue past this point and get right to using the code.
```shell
$ npm install
```

### Node.js REPL
Next you can use this directly from the Node.js REPL if so desired. The required JSON file with the data can be swapped with a pure JSON object or a different `require`'d file from the example below.
```shell
$ node
$ Welcome to Node.js v18.17.0.
$ Type ".help" for more information.
$ > const json = require('./test/fixtures/dummy-scores.json'); 
$ undefined 
$ > const ScoreCard = require('.');
$ undefined
$ > const { scoreCard } = new ScoreCard(json);
$ undefined
$ > scoreCard 
$ [
   9, 21,  56,  68,  75,
  75, 90, 100, 114, 129
]
```

### Importing as A Module
There is a possibility to require this as a module using `npm link`. This will need to be used in place of the typical install methon (i.e. `npm install`) since the module is not published to a registry. Once done, you can use this as you would any other module in the Node.js ecosystem and use it as described in **Node.js REPL** above.
```shell
$ npm link # From within this project's directory
$ npm link hot-shot-scorecard # From within the project where you wish to require this as a module
```

## Test Execution/Coverage Reporting
As with many Node.js modules, this module comes packed with tests, the ability to execute those tests via Mocha, and the ability to generate coverage reports using Istanbul.
```shell
$ npm test # Execute just the inclueded tests without including coverage results.
$ npm run coverage # Execute the included tests and generate a coverage report.
$ open coverage/index.html # Opens the generated HTML coverage report if more detail about test coverage is required.
```

## Data and Models
Included below is a brief description of the data models and expected data formating.

### Ingested JSON Model
Below is the model for the expected JSON input to the module. 
- `rounds`: An array of JSON objects indicating the scoring positions, attempted shots, and scoring bonus shots. There will always be ten entries in this array indicating each of the ten rounds played.
    - `made_shots`: An array of scoring positions where a basket was made that isn't a bonus shot.
    - `attempted_shots`: An array of attempted shots and their positions. Shots that have been made will be included here as well.
    - `made_bonus_shots`: An array of made bonus shots.
        - `type`: The type of bonus shot made indicating the modifier that will be applied. This will be one of `goat` or `heatcheck`.
        - `spot`: The scoring position for the made bonus shot.

```json
{
    "rounds": [
        {
            "made_shots": ["green1", "gray2", "red2"],
            "attempted_shots": ["green1", "gray2", "blue2", "red2"]
        },
        {
            "made_shots": ["green1", "yellow1", "gray2", "blue1"],
            "attempted_shots": ["green1", "yellow1", "gray2", "blue1", "red2"]
        },
        {
            "made_shots": ["green1", "yellow1", "blue2", "red1", "blue2", "gray2", "gray1", "red2", "blue1"],
            "attempted_shots":  ["green1", "yellow1", "blue2", "red1", "blue2", "gray2", "gray1", "red2", "blue1"],
            "made_bonus_shots": [
                { "type": "goat", "spot": "green1" },
                { "type": "goat", "spot": "yellow1" },
                { "type": "goat", "spot": "gray2" }
            ]
        }
    ]
}
```

### Round
A round data model is used to store specific information about a particular round including information about scoring and the modifiers that are being applied. 
- `_roundNum`: The number indicating which round of the game this is for.
- `_madeShots`: An array of made shots and their position.
- `_bonusShots`: An array of made bonus shots and their position.
- `_bonusScore`: A number representing the bonus points accumulated from made `_bonusShots`.
- `_baseScore`: A number representing the base score of the `_madeShots`.
- `_isGOAT`: A boolean value indicating whether or not a "GOAT" multiplier is applied to any `_bonusShots` of that type.
- `_isHeatcheck`: A boolean value indicating whether or not a "Heatcheck" multiplier is applied to any `_bonusShots` of that type.

```shell
Round {
    _roundNum: 2,
    _madeShots: [ 'green1', 'yellow1', 'gray2', 'blue1' ],
    _attemptedShots: [ 'green1', 'yellow1', 'gray2', 'blue1', 'red2' ],
    _bonusShots: [],
    _bonusScore: 0,
    _baseScore: 12,
    _isGOAT: false,
    _isHeatcheck: false
  }
```

### ScoreCard
A score card acting as the collection point for each of the `Rounds` in the game. 
- `_jsonInput`: The provided and parsed JSON object representing the game details for each of the rounds.
- `_scoreCard`: An array of `Rounds` each containing relevant information about the scoring and multipliers for each round.

```shell
ScoreCard {
  _jsonInput: {
    rounds: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ]
  },
  _scoreCard: [
    Round {
      _roundNum: 1,
      _madeShots: [Array],
      _attemptedShots: [Array],
      _bonusShots: [],
      _bonusScore: 0,
      _baseScore: 9,
      _isGOAT: false,
      _isHeatcheck: false
    },
    Round {
      _roundNum: 2,
      _madeShots: [Array],
      _attemptedShots: [Array],
      _bonusShots: [],
      _bonusScore: 0,
      _baseScore: 12,
      _isGOAT: false,
      _isHeatcheck: false
    },
    # ...
  ]
}
```
