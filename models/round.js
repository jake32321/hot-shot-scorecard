'use strict';
const { scoring, scoringSpots } = require('../lib/constants');

class Round {
    constructor(opts) {
        const {
            round_num,
            made_shots,
            attempted_shots,
            made_bonus_shots
        } = opts;

        this.roundNum = round_num;
        this.madeShots = made_shots;
        this.attemptedShots = attempted_shots;
        this.bonusShots = made_bonus_shots;
        this.isGOAT = this.checkIsGOAT(); 
    }

    set roundNum(roundNumber = 1) {
        if (typeof roundNumber !== 'number') {
            throw new Error('"round_num" must be an instance of a number');
        }

        this._roundNum = roundNumber;
    }

    set madeShots(madeShotsArr = []) {
        if (!Array.isArray(madeShotsArr)) {
            throw new Error('"made_shots" must be an instance of an Array');
        }

        this._madeShots = madeShotsArr;
    }

    set attemptedShots(attemptedShotsArr = []) {
        if (!Array.isArray(attemptedShotsArr)) {
            throw new Error('"attempted_shots" must be an instance of an Array');
        }

        this._attemptedShots = attemptedShotsArr;
    }

    set bonusShots(bonusShotsArr = []) {
        if (!Array.isArray(bonusShotsArr)) {
            throw new Error('"bonus_shots" must be an instance of an Array');
        }

        this._bonusShots = bonusShotsArr;
    }

    get roundNum() {
        return this._roundNum;
    }

    get attemptedShots() {
        return this._attemptedShots;
    }

    get madeShots() {
        return this._madeShots;
    }

    get bonusShots() {
        return this._bonusShots;
    }

    checkIsGOAT() {
        for (const scoringSpot of Object.keys(scoringSpots)) {
            if (!this.madeShots.includes(scoringSpot)) {
                return false;
            }
        }

        return true;
    }

    isHeatcheck() {

    }

    calcScore() {
        
    }
}

module.exports = Round;