'use strict';
const Round = require('./round');

class ScoreCard {
    constructor(jsonInput) {
        this.jsonInput = jsonInput;
        this.scoreCard = this.#buildScoreCardFromJSON();
    }

    set jsonInput(json) {
        if (typeof json === 'string') { // If we get a string, attempt to convert it to a JSON object
            try {
                json = JSON.parse(json);
            } catch (err) {
                throw new Error(`Recieved invalid JSON string data. Please validate your JSON's structure`);
            }
        }

        if (Array.isArray(json)) { // Arrays themselves are valid and parseable JSON. We need to make sure an JSON object is what the caller passed.
            throw new Error(`The provided JSON data must be a JSON object and not an array. Please verify the JSON's structure.`);
        }

        this._jsonInput = json;
    }

    get jsonInput() {
        return this._jsonInput;
    }

    #buildScoreCardFromJSON() {
        if(!this._jsonInput.rounds) {
            throw new Error('"rounds" is required in the provided JSON data.');
        }

        const rounds = this._jsonInput.rounds;

        if (!Array.isArray(rounds) || rounds.length !== 10) {
            throw new Error('"rounds" must be an instance of an Array with ten entries in the provided JSON data.');
        }

        const scoreCardArr = [];
        for (const [index, round] of rounds.entries()) {
            scoreCardArr.push(new Round({
                round_num: index + 1,
                ...round
            }));
        }

        // TODO: call calculation scripts and add overall score for a round

        return scoreCardArr;
    }
}

module.exports = ScoreCard;
