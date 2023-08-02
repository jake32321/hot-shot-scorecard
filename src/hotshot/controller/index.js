'use strict';
const Round = require('../../../models/round');
const { scoringSpots } = require('../../../utils/constants');

const factory = {
    _private: {}
};

factory._private.calculateHeatcheckPoints = function (round, scoreCardArr) {
    const madeShots = round._bonusShots.filter(({ type }) => type === 'heatcheck');

    let multiplier = 3;
    if (round._roundNum === 10) {
        const roundsOverThirty = scoreCardArr.filter(round => round._baseScore >= 30);
        const totalAllowedBonusShots = roundsOverThirty.length*2;

        // Ensure the player is not taking more than the alotted number of shots.
        if (madeShots.length > totalAllowedBonusShots) {
            throw new Error('More than twice the shots with thirty points were taken in the final round with the Heatcheck modifier.');
        }

        // Multiplier is swapped for a 2x modifier for the final round.
        multiplier = 2;
    } else if (madeShots.length > 3) {
        throw new Error('More than three bonus shots were taken in a non-final round with a Heatcheck modifier.');
    }

    for (const { spot } of madeShots) {
        round._bonusScore += scoringSpots[spot]*multiplier;
    }
}

factory._private.calculateGOATPoints = function(round) {
    const madeShots = round._bonusShots.filter(({ type }) => type === 'goat');

    if (round._roundNum === 10) {
        const madeShotSpots = madeShots.map(({ spot }) => spot);
        const appearsMoreThanOnce = madeShotSpots.filter((spot, index) => madeShotSpots.indexOf(spot) !== index );

        // Only allow for someone to make a shot from each spot once.
        if (appearsMoreThanOnce.length !== 0) {
            throw new Error('A bonus shot from a spot was made more than once for a final round with a GOAT modifier.');
        } 
    } else if (madeShots.length > 4) {
        throw new Error('More than four bonus shots were taken in a non-final round with a GOAT modifier.');
    }

    for (const { spot } of madeShots) {
        round._bonusScore += scoringSpots[spot];
    }
}

factory._private.caculateFinalScores = function(roundScores) {
    const finalScores = [];

    let runningTotal = 0;
    for (const { _bonusScore, _baseScore } of roundScores) {
        runningTotal += _bonusScore + _baseScore;
        finalScores.push(runningTotal);
    }

    return finalScores;
};

factory.buildScoreCard = function(jsonData) {
    if(!jsonData.rounds) {
        throw new Error('"rounds" is required in the provided JSON data.');
    }

    const rounds = jsonData.rounds;

    // Basic check to make sure that all ten rounds are completed before proceeding with scoring.
    if (!Array.isArray(rounds) || rounds.length !== 10) {
        throw new Error('"rounds" must be an instance of an Array with ten entries in the provided JSON data.');
    }

    const scoreCardArr = [];
    for (const [index, round] of rounds.entries()) {
        const currRound = new Round({ round_num: index + 1, ...round });

         // Apply moddifiers
         // We need to have all of the scores before confirming the heatcheck bonus for round #10
        if (currRound._isHeatcheck && currRound._roundNum !== 10) {
            factory._private.calculateHeatcheckPoints(currRound, scoreCardArr);
        }

        if (currRound._isGOAT) {
            factory._private.calculateGOATPoints(currRound);
        }

        scoreCardArr.push(currRound);
    }

    // Calculate the final with a heatcheck modifier now that we have all of the previous base scores.
    const roundTen = scoreCardArr[scoreCardArr.length - 1];
    if (roundTen._isHeatcheck) {
        factory._private.calculateHeatcheckPoints(roundTen, scoreCardArr);
    }

    return factory._private.caculateFinalScores(scoreCardArr);
}

module.exports = factory;
