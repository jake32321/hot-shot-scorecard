'use strict';
const controller = require('../../../../../src/hotshot/controller');
const { expect } = require('chai');
const dummyScores = require('../../../../data/dummy-scores.json');
const dummyScoresFinalHeatCheck = require('../../../../data/dummy-scores-final-heatcheck.json');
const dummyScoresFinalGOAT = require('../../../../data/dummy-scores-final-goat.json');
const dummyScoresFinalCombination = require('../../../../data/dummy-scores-final-goat-heatcheck.json');

describe('functional:hotshot:controller', () => {
    const expectedTypicalResult = [ 9, 21, 56, 68, 75, 75, 90, 100, 114, 129 ];

    it('should calculate the expected score for a typical game of hotshot', () => {
        const result = controller.buildScoreCard(dummyScores);
        expect(result).deep.equals(expectedTypicalResult);
    });

    describe('when the final round is a heatcheck round', () => {
        const expectedFinalHeatcheckResult = [ 9,  21,  42, 138, 145, 145, 160, 170, 184, 274 ];

        it('should calculate the expected score for a typical game of hotshot with a final round heatcheck', () => {
            const result = controller.buildScoreCard(dummyScoresFinalHeatCheck);
            expect(result).deep.equals(expectedFinalHeatcheckResult);
        });
    });

    describe('when the final round is a GOAT round', () => {
        const expectedFinalGOATResult = [ 9, 21,  56,  68,  75, 75, 90, 100, 138, 173 ];

        it('should calculate the expected score for a typical game of hotshot with a final round GOAT', () => {
            const result = controller.buildScoreCard(dummyScoresFinalGOAT);
            expect(result).deep.equals(expectedFinalGOATResult);
        });
    });

    describe('when the final round is a GOAT and Heatcheck round', () => {
        const expectedFinalCombinationResult = [ 9, 21,  56,  68,  75, 75, 90, 100, 258, 404 ];

        it('should calculate the expected score for a typical game of hotshot with a final round GOAT', () => {
            const result = controller.buildScoreCard(dummyScoresFinalCombination);
            expect(result).deep.equals(expectedFinalCombinationResult);
        });
    });
});
