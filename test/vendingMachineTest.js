"use strict";
const expect = require("chai").expect;
const VendingMachine = require("../services/VendingMachine");
const VendingMachineInstance = new VendingMachine();

describe('VendingMachineInstance', function() {
    describe('#getChangeFor()', function() {
        /** Negative tests */
        it('should return error if we provide empty value of euro', function() {
            let result = VendingMachineInstance.getChangeFor();
            expect(result).has.property('error').to.be.a('string');
        });
        it('should return error if we provide negative value of euro', function() {
            let result = VendingMachineInstance.getChangeFor(-111);
            expect(result).has.property('error').to.be.a('string');
        });
        it('should return error if we provide string value of euro', function() {
            let result = VendingMachineInstance.getChangeFor('some string');
            expect(result).has.property('error').to.be.a('string');
        });
        it('should return error if we provide object value of euro', function() {
            let result = VendingMachineInstance.getChangeFor({a: 'b'});
            expect(result).has.property('error').to.be.a('string');
        });
        it('should return error if we provide big value of euro and we have limitations', function() {
            let result = VendingMachineInstance.getChangeFor(2222222222222222222222222222222222222, true);
            expect(result).has.property('error').to.be.a('string');
        });

        /** Positive tests */
        it('should return result of change if we provide normal value of euro. Alse we want to see', function() {
            let result = VendingMachineInstance.getChangeFor(234);
            expect(result).has.property('change').to.be.a('string');
        });
        it('should return result of change if we provide big value of euro', function() {
            let result = VendingMachineInstance.getChangeFor(2222222222222222222222222222222222222);
            expect(result).has.property('change').to.be.a('string');
        });

        it('should return result if we provide normal value of euro and we have limitations', function() {
            let result = VendingMachineInstance.getChangeFor(2400, true);
            expect(result).has.property('change').to.be.a('string');
            expect(result).has.property('limits').to.be.a('string');
            expect(result).has.property('baseLimits').to.be.a('string');
        });
    });
    describe('#__changeCoins()', function() {
        it('should return result if we want to change for example 234. It will be' +
            '2 coins of 1 euro, 1 coin of 20 cents, 1 coin of 10 cents, 2 coins of 2 cents', function() {
            let result = VendingMachineInstance.__changeCoins(234);
            expect(result).has.property('change').to.be.a('Map');
            expect(result.change.get('One Euro')).to.equal(2);
            expect(result.change.get('Twenty cents')).to.equal(1);
            expect(result.change.get('Two cents')).to.equal(2);
        });
    })

});