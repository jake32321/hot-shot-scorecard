'use strict';
const Round = require('./round');
const { scoringSpots } = require('../lib/constants');

class ScoreCard {
    constructor(jsonInput) {
        this._jsonInput = jsonInput;
        this._scoreCard = [];

        this.#calculateScoreCard();

        console.log(this._scoreCard)
    }

    set jsonInput(json) {
        // If we get a string, attempt to convert it to a JSON object
        if (typeof json === 'string') {
            try {
                json = JSON.parse(json);
            } catch (err) {
                throw new Error(`Recieved invalid JSON string data. Please validate your JSON's structure`);
            }
        }

        // Arrays themselves are valid and parseable JSON. We need to make sure an JSON object is what the caller passed.
        if (Array.isArray(json)) {
            throw new Error(`The provided JSON data must be a JSON object and not an array. Please verify the JSON's structure.`);
        }

        this._jsonInput = json;
    }

    get jsonInput() {
        return this._jsonInput;
    }

    get scoreCard() {
        const scoreCardArr = [];

        let runningTotal = 0;
        for (const { _bonusScore, _baseScore } of this._scoreCard) {
            runningTotal += _bonusScore + _baseScore;
            scoreCardArr.push(runningTotal);
        }

        return scoreCardArr;
    }

    #calculateScoreCard() {
        if(!this._jsonInput.rounds) {
            throw new Error('"rounds" is required in the provided JSON data.');
        }

        const rounds = this._jsonInput.rounds;

        // Basic check to make sure that all ten rounds are completed before proceeding with scoring.
        if (!Array.isArray(rounds) || rounds.length !== 10) {
            throw new Error('"rounds" must be an instance of an Array with ten entries in the provided JSON data.');
        }

        for (const [index, round] of rounds.entries()) {
            const currRound = new Round({ round_num: index + 1, ...round });

             // Apply moddifiers
             // We need to have all of the scores before confirming the heatcheck bonus for round #10
            if (currRound._isHeatcheck && currRound._roundNum !== 10) {
                this.#calculateHeatcheckPoints(currRound);
            }

            if (currRound._isGOAT) {
                this.#calculateGOATPoints(currRound);
            }

            this._scoreCard.push(currRound);
        }

        // Calculate the final with a heatcheck modifier now that we have all of the previous base scores.
        const roundTen = this._scoreCard[this._scoreCard.length - 1];
        if (roundTen._isHeatcheck) {
            this.#calculateHeatcheckPoints(roundTen);
        }
    }

    #calculateHeatcheckPoints(round) {
        const madeShots = round._bonusShots.filter(({ type }) => type === 'heatcheck');

        let multiplier = 3;
        if (round._roundNum === 10) {
            const roundsOverThirty = this._scoreCard.filter(round => round._baseScore >= 30);
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
    
    #calculateGOATPoints(round) {
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
}

module.exports = ScoreCard;
