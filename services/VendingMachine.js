const isPositiveInteger = require('is-positive-integer');

class VendingMachine {
    /**
     * @param {int} euro
     * @param {boolean} withLimits
     */
    getChangeFor(euro, withLimits = false) {
        //try to get number from string
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
        if (withLimits) {
            coinsLimits = this.constructor.coinsLimits;
        }

        let denominations = this.constructor.denominations;
        /** Loop for check how much coins of each denomination we can give for change */
        for (let coin of denominations) {
            let value = coin[0];
            let denomination = coin[1];

            /** Default coins availability,
             * Check if we have limit for this coin
             * */
            let coinsAvailable = Infinity;
            if (coinsLimits && coinsLimits.has(value)) {
                /** Limited coins availability */
                coinsAvailable = coinsLimits.get(value);
                if (coinsAvailable === 0) {
                    /** We don't have available coins for giving change **/
                    continue;
                }
            }

            /** This value is max amount of coins of one denomination we can give for change **/
            let coins = euro / value;
            if (coins >= 1 ) {
                /** Numbers of coins to reduce from limits, will be used only if limits are set */
                let coinsReduce;

                /** In this case we have not enough coins in vending machine, so give all what we have
                 *  Subtract from the euro amount the value that we gave out with coins
                 * */
                if (coins > coinsAvailable ) {
                    results.push(`${denomination}: ${coinsAvailable}`);
                    euro -= coinsAvailable * value;
                    /** the number of coins that was needed, then we will take it away from the existing limit if we have ir **/
                    coinsReduce = coinsAvailable;
                } else {
                    /** In this case we have more or equal to necessary coins for giving change
                     * In this case, we take the remainder from the division, or we do not have a limit of coins, or there are enough coins to exchange them
                     * */
                    coins = Math.floor(coins);//only integer part
                    results.push(`${denomination}: ${coins}`);
                    euro = euro % value;
                    /** the number of coins that was needed, then we will take it away from the existing limit if we have ir **/
                    coinsReduce = coins;
                }
                /** If we have limits we need to reduce them */
                if (coinsLimits) {
                    coinsLimits.set(value, coinsAvailable - coinsReduce);
                }
            }
        }

        /** This means that we don't have coins to get change, throw Exception */
        if (euro > 0) {
            throw Error('Coins is not enough');
        }

        let summaryResults = {
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