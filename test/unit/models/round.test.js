'use strict';
const Round = require('../../../models/round');
const { expect } = require('chai');

describe('unit:models:Round', () => {
    const round = new Round({
        round_num: 1,
        made_shots: ["green1", "gray2", "red2"],
        attempted_shots: ["green1", "gray2", "blue2", "red2"]
    });

    it('should include the "_roundNum"', () => {
        expect(round._roundNum).to.exist;
    });

    it('should include the "_madeShots"', () => {
        expect(round._madeShots).to.exist;
    });

    it('should include the "_attemptedShots"', () => {
        expect(round._attemptedShots).to.exist;
    });

    it('should include the "_bonusShots"', () => {
        expect(round._bonusShots).to.exist;
    });

    it('should include the "_bonusScore"', () => {
        expect(round._bonusScore).to.exist;
    });

    it('should include the "_baseScore" with appropriate score', () => {
        expect(round._baseScore).to.exist;
        expect(round._baseScore).equals(9);
    });

    it('should include the "_isGOAT" flag', () => {
        expect(round._isGOAT).to.exist;
    });

    it('should include the "_isHeatcheck" flag', () => {
        expect(round._isHeatcheck).to.exist;
    });


    describe('when a round qualifies for a Heatcheck bonus', () => {
        const heatCheckRound = new Round({
            round_num: 1,
            made_shots: ["green1", "yellow1", "blue2", "red2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2"],
            attempted_shots: ["green1", "yellow1", "blue2", "red2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2", "yellow1", "blue2"],
            made_bonus_shots: [
                { type: "heatcheck", spot: "green1" },
                { type: "heatcheck", spot: "yellow1" },
                { type: "heatcheck", spot: "gray2" }
            ]
        });

        it('should set the "_isHeatcheck" flag to "true"', () => {
            expect(heatCheckRound._isHeatcheck).true;
        });

        it('should not set the "_isGOAT" flag to "true"', () => {
            expect(heatCheckRound._isGOAT).false;
        });
    });

    describe('when a round qualifies for a GOAT bonus', () => {
        const goatRound = new Round({
            round_num: 1,
            made_shots: ["green1", "yellow1", "blue2", "red1", "blue2", "gray2", "gray1", "red2", "blue1"],
            attempted_shots:  ["green1", "yellow1", "blue2", "red1", "blue2", "gray2", "gray1", "red2", "blue1"],
            made_bonus_shots: [
                { type: "goat", spot: "green1" },
                { type: "goat", spot: "yellow1" },
                { type: "goat", spot: "gray2" }
            ]
        });

        it('should not set the "_isHeatcheck" flag to "true"', () => {
            expect(goatRound._isHeatcheck).false;
        });

        it('should  set the "_isGOAT" flag to "true"', () => {
            expect(goatRound._isGOAT).true;
        });
    });

    describe('when a round is grounds for a disqualification', () => {
        const dqRound = new Round({
            round_num: 1,
            made_shots: ["red1", "red1", "red2"],
            attempted_shots:  ["red1", "red1", "red2"],
            made_bonus_shots: []
        });

        it('should not set the "_isHeatcheck" flag to "true"', () => {
            expect(dqRound._isHeatcheck).false;
        });

        it('should not set the "_isGOAT" flag to "true"', () => {
            expect(dqRound._isGOAT).false;
        });

        it('should set the round score to zero', () => {
            expect(dqRound._baseScore).equals(0);
        });
    });
});