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
        it('should return result of change if we provide normal value of euro', function() {
            let result = VendingMachineInstance.getChangeFor(23333);
            expect(result).has.property('change').to.be.a('array');
        });
        it('should return result of change if we provide big value of euro', function() {
            let result = VendingMachineInstance.getChangeFor(2222222222222222222222222222222222222);
            expect(result).has.property('change').to.be.a('array');
        });

        it('should return result if we provide normal value of euro and we have limitations', function() {
            let result = VendingMachineInstance.getChangeFor(2400, true);
            expect(result).has.property('change').to.be.a('array');
            expect(result).has.property('limits').to.be.a('string');
            expect(result).has.property('baseLimits').to.be.a('string');
        });
    });
});