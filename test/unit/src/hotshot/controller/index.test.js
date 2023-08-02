'use strict';
const controller = require('../../../../../src/hotshot/controller');
const { expect } = require('chai');

describe('unit:hotshot:controller', () => {
    describe('_private', () => {
        describe('calculateHeatcheckPoints', () => {
            const expectedScoreCardArr = [
                { _roundNum: 1, _bonusShots: [{ type: 'heatcheck', spot: 'red1' }], _baseScore: 30, _bonusScore: 0 },
                { _roundNum: 2, _bonusShots: [{ type: 'heatcheck', spot: 'red2' }], _baseScore: 10, _bonusScore: 0},
                { _roundNum: 3, _bonusShots: [{ type: 'heatcheck', spot: 'red2' }], _baseScore: 10, _bonusScore: 0 },
                { _roundNum: 10, _bonusShots: [{ type: 'heatcheck', spot: 'red1' }], _baseScore: 10, _bonusScore: 0 }
            ];

            let expectedRound = expectedScoreCardArr[0];
            const setup = function (opts = {}) {
                if (opts.expectedRound) {
                    expectedRound = opts.expectedRound;
                }
                
                controller._private.calculateHeatcheckPoints(expectedRound, expectedScoreCardArr);
            }

            
            beforeEach(() => {
                setup()
            });

            afterEach(() => {
                expectedRound._bonusScore = 0;
            });

            it('should be able to calculate the heatcheck bonus points for a non-final round with a multiplier of three', () => {
                expect(expectedRound._bonusScore).equals(3);
            });

            describe('when it is the final round', () => {
                beforeEach(() => {
                    setup({ expectedRound: expectedScoreCardArr[3] });
                });
    
                afterEach(() => {
                    expectedRound._bonusScore = 0;
                });

                it('should be able to calculate the heatcheck bonus points for a final round with a multiplier of two', () => {
                    expect(expectedRound._bonusScore).equals(2);
                })
            });

            describe('when the round is a non-final round and more than three bonus shots were taken', () => {
                const expectedScoreCardArr = [
                    { 
                        _roundNum: 1,
                        _bonusShots: [
                            { type: 'heatcheck', spot: 'red1' },
                            { type: 'heatcheck', spot: 'red1' },
                            { type: 'heatcheck', spot: 'red1' }, 
                            { type: 'heatcheck', spot: 'red1' }
                        ],
                        _baseScore: 30,
                        _bonusScore: 0
                    }
                ];
    
                const expectedRound = expectedScoreCardArr[0];

                it('should throw an error stating that more than three bonus shots were taken', () => {
                    expect(() => controller._private.calculateHeatcheckPoints(expectedRound, expectedScoreCardArr)).throws(/More than three bonus shots were taken/);
                })
            });

            describe('when the round is a final round and more than two times the number of shots for rounds over thirty points were taken', () => {
                const expectedScoreCardArr = [
                    { _roundNum: 1, _bonusShots: [{ type: 'heatcheck', spot: 'red1' }], _baseScore: 30, _bonusScore: 0 },
                    { _roundNum: 2, _bonusShots: [{ type: 'heatcheck', spot: 'red2' }], _baseScore: 10, _bonusScore: 0},
                    { _roundNum: 3, _bonusShots: [{ type: 'heatcheck', spot: 'red2' }], _baseScore: 10, _bonusScore: 0 },
                    { _roundNum: 10, _bonusShots: [{ type: 'heatcheck', spot: 'red1' }, { type: 'heatcheck', spot: 'red1' }, { type: 'heatcheck', spot: 'red1' }], _baseScore: 10, _bonusScore: 0 }
                ];
    
                const expectedRound = expectedScoreCardArr[3];

                
                it('should throw an error stating that more than twice bonus shots were taken', () => {
                    expect(() => controller._private.calculateHeatcheckPoints(expectedRound, expectedScoreCardArr)).throws(/More than twice the shots with thirty/);
                })
            })
        });

        describe('calculateGOATPoints', () => {
            const expectedRound  = { 
                _roundNum: 1, 
                _bonusShots: [
                    { type: 'goat', spot: 'red1' }
                ], 
                _baseScore: 30, 
                _bonusScore: 0 
            };

            beforeEach(() => {
                controller._private.calculateGOATPoints(expectedRound);
            });

            afterEach(() => {
                expectedRound._bonusScore = 0;
            });

            it('should be able to calculate the GOAT bonus for a non-final round', () => {
                expect(expectedRound._bonusScore).equals(1);
            });

            describe('when more than four bonus shots are made in a non-final round', () => {
                const expectedRound  = { 
                    _roundNum: 1, 
                    _bonusShots: [
                        { type: 'goat', spot: 'red1' },
                        { type: 'goat', spot: 'red1' },
                        { type: 'goat', spot: 'red1' },
                        { type: 'goat', spot: 'red1' },
                        { type: 'goat', spot: 'red1' }
                    ], 
                    _baseScore: 30, 
                    _bonusScore: 0 
                };

                it('should throw an error stating more than four bonus shots were taken in a non-final round', () => {
                    expect(() => controller._private.calculateGOATPoints(expectedRound)).throws(/More than four bonus shots were taken in a non-final round/);
                });
            });

            describe('when it is a final round with a GOAT bonus', () => {
                const expectedRound  = { 
                    _roundNum: 10, 
                    _bonusShots: [
                        { type: 'goat', spot: 'green1' },
                        { type: 'goat', spot: 'red1' }
                    ], 
                    _baseScore: 30, 
                    _bonusScore: 0 
                };

                beforeEach(() => {
                    controller._private.calculateGOATPoints(expectedRound);
                });
    
                afterEach(() => {
                    expectedRound._bonusScore = 0;
                });

                it('should be able to calculate the GOAT bonus for a final round', () => {
                    expect(expectedRound._bonusScore).equals(6);
                });
            });

            describe('when it is a final round and more than one shot is taken from a single spot', () => {
                const expectedRound  = { 
                    _roundNum: 10, 
                    _bonusShots: [
                        { type: 'goat', spot: 'green1' },
                        { type: 'goat', spot: 'green1' }
                    ], 
                    _baseScore: 30, 
                    _bonusScore: 0 
                };

                it('should throw an error stating that a shot location was repeated more than once', () => {
                    expect(() => controller._private.calculateGOATPoints(expectedRound)).throws(/A bonus shot from a spot was made more than once/);
                });
            });
        });

        describe('caculateFinalScores', () => {
            const scores = [
                { _bonusScore: 10, _baseScore: 10 },
                { _bonusScore: 10, _baseScore: 10 },
                { _bonusScore: 10, _baseScore: 10 },
                { _bonusScore: 10, _baseScore: 10 },
                { _bonusScore: 10, _baseScore: 10 },
            ];
            const expectedFinalScores = [ 20, 40, 60, 80, 100 ];

            it('should be able to calculate the total final scores', () => {
                const resultingScores = controller._private.caculateFinalScores(scores);
                expect(resultingScores).deep.equals(expectedFinalScores);
            });
        });
    });

    describe('buildScoreCard', () => {
        describe('when the passed JSON data does not include "rounds"', () => {
            const jsonData = {};

            it('should throw an error that "rounds" must be present in the JSON', () => {
                expect(() => controller.buildScoreCard(jsonData)).throws(/"rounds" is required/);
            });
        });

        describe('when the passed JSON data includes rounds but rounds is not an array', () => {
            const jsonData = { rounds: 'cat' };

            it('should throw an error that "rounds" must be present in the JSON', () => {
                expect(() => controller.buildScoreCard(jsonData)).throws(/"rounds" must be an instance of an array with ten entries/);
            });
        });

        describe('when the passed JSON data includes rounds but rounds does not have 10 entries', () => {
            const jsonData = { rounds: [{ _roundNum: 1 }] };

            it('should throw an error that "rounds" must be present in the JSON', () => {
                expect(() => controller.buildScoreCard(jsonData)).throws(/"rounds" must be an instance of an array with ten entries/);
            });
        });
    });
});
