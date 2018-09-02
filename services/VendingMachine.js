const isPositiveInteger = require('is-positive-integer');

class VendingMachine {
    /**
     * @param {int} euro
     * @param {boolean} withLimits
     */
    getChangeFor(euro, withLimits = false) {
        /** Try to get number if argument is string*/
        euro = Number(euro);
        let summaryResults;
        if (euro === 0) {
            return {error: 'Amount of euro must to be bigger then 0'};
        }
        if (euro && isPositiveInteger(euro)) {
            console.log(`Run getChangeFor with euro value is ${euro}`);
            try {
                summaryResults = this.changeCoins(euro, withLimits);
            } catch (e) {
                console.log('error with calculations:', e.message);
                summaryResults = {error: e.message}
            }
        } else {
            summaryResults = {error: 'Sorry, but provided value of euro is not valid, it must be positive int. Processing is cancel'};
        }

        console.log('Finish getChangeFor');
        return summaryResults;
    }


    /**
     * Main changing process
     * @param {int} euro
     * @param {boolean} withLimits
     * @returns {{change: Array}}
     */
    changeCoins(euro, withLimits) {
        let results = [];
        let coinsLimits;
        let summaryResults;
        let denominations = this.constructor.denominations;
        if (withLimits) {
            coinsLimits = this.constructor.coinsLimits;
        }
        /**
         * 1) Looping all available coins
         * 2) Check for limitation. (Let's assume that the limits are a constant)
         * 3) Getting amount of coins, what we want to get from vending machine
         * 4)
         *    a) if we have not enough coins in vending machine, so give all what we have for current denomination,
         *       Subtract from the euro amount the value that we gave out with coins;
         *    b) if we have more or equal to necessary coins for giving change,
         *       taking remainder from the division as euro amount, or we do not have a limit of coins, or there are enough coins to exchange them
         *
         * */
        for (let coin of denominations) {
            let value = coin[0];
            let denomination = coin[1];

            let coinsAvailable = Infinity;
            if (coinsLimits && coinsLimits.has(value)) {
                coinsAvailable = coinsLimits.get(value);
                if (coinsAvailable === 0) {
                    /** We don't have available coins for giving change **/
                    continue;
                }
            }

            /** This value is max amount of coins of one denomination we can give for change **/
            let coinsWantGet = euro / value;

            if (coinsWantGet < 1) {
                continue;
            }

            /** Numbers of coins to reduce from limits, will be used only if limits are set */
            let coinsReduce;

            /** Main process **/
            if (coinsWantGet > coinsAvailable ) {
                results.push(`${denomination}: ${coinsAvailable}`);
                euro -= coinsAvailable * value;
                coinsReduce = coinsAvailable;
            } else {
                coinsWantGet = Math.floor(coinsWantGet);//only integer part
                results.push(`${denomination}: ${coinsWantGet}`);
                euro = euro % value;
                coinsReduce = coinsWantGet;
            }
            /** If we have limits we need to reduce them */
            if (coinsLimits) {
                coinsLimits.set(value, coinsAvailable - coinsReduce);
            }
        }

        /** This means that we don't have coins to get change, throw Exception */
        if (euro > 0) {
            throw Error('Coins is not enough');
        }

        summaryResults = {
            change: results
        };

        /** Limitations */
        if (coinsLimits) {
            summaryResults.limits = this.getLeftCoins(coinsLimits);
            summaryResults.baseLimits = this.getLeftCoins(this.constructor.coinsLimits);
        }

        return summaryResults;
    }

    /**
     * Just mapping coins denominations by value
     * @param coinAmount
     * @returns {string}
     */
    getLeftCoins(coinAmount) {
        let result = '';
        for (let amount of coinAmount) {
            let denomination = this.constructor.denominations.get(amount[0]);
            result += denomination + ": " + amount[1] + "\n";
        }
        return result;
    }

    static get denominations() {
        return new Map([
            [100, "One Euro"],
            [50, "Fifty cents"],
            [20, "Twenty cents"],
            [10, "Ten cents"],
            [5, "Five cents"],
            [2, "Two cents"],
            [1, "One cent"],
        ])
    }

    static get coinsLimits() {
        return new Map([
            [100, 11],
            [50, 24],
            [20, 0],
            [10, 99],
            [5, 200],
            [2, 11],
            [1, 23],
        ])
    }
}

module.exports = VendingMachine;