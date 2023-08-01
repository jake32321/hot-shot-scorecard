'use strict';
const { scoringSpots } = require('../lib/constants');

class Round {
    constructor({
        round_num,
        made_shots = [],
        attempted_shots = [],
        made_bonus_shots = []
    }) {
        // Round information
        this._roundNum = round_num;
        this._madeShots = made_shots;
        this._attemptedShots = attempted_shots;
        this._bonusShots = made_bonus_shots;

        // Round scoring
        if (this.#checkIsDQ()) {
            this._bonusScore = 0;
            this._baseScore = 0;
            this._isGOAT = false;
            this._isHeatcheck = false;
        } else {
            this._bonusScore = 0;
            this._baseScore = this.#calcBaseScore();
            this._isGOAT = this.#checkIsGOAT();
            this._isHeatcheck = this.#checkIsHeatcheck(this._baseScore);
        }
    }

    #checkIsDQ() {
        const redShots = this._madeShots.filter(shotLoc => shotLoc.includes('red'));

        if (redShots.length > 2) return true;

        return false;
    }

    #checkIsGOAT() {
        for (const scoringSpot of Object.keys(scoringSpots)) {
            if (!this._madeShots.includes(scoringSpot)) return false;
        }

        return true;
    }

    #checkIsHeatcheck(score) {
        return score >= 45
    }

    #calcBaseScore() {
        let score = 0;
        for (const madeShot of this._madeShots) {
            score += scoringSpots[madeShot];
        }

        score -= this.#calcDeductions();

        return score;
    }

    #calcDeductions() {
        const missedRedShots = this._attemptedShots
            .filter(shotLoc => !this._madeShots.includes(shotLoc) && shotLoc.includes('red'));

        return missedRedShots.length*2;
    }
}

module.exports = Round;
