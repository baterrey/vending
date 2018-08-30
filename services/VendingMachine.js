const isPositiveInteger = require('is-positive-integer');

class VendingMachine {
    /**
     *
     * @param {int} euro
     * @return {*}
     */
    getOptimalChangeFor (euro) {
        console.log('\n=========Run getOptimalChangeFor=========');
        if (euro && isPositiveInteger(euro) && isPositiveInteger.isSafePositiveInteger(euro)) {
            let denominations = this.constructor.denominations;
            console.log(`Base euro value is ${euro}`);

            let summaryResults = this.changeCoins(euro, denominations);
            console.log('Getting Coins:');
            console.log(summaryResults.change);
            console.log('=========Finish getOptimalChangeFor=========');
            return summaryResults;
        } else {
            let error = 'Provided value of euro is not valid, it must be positive int. Processing is cancel';
            console.log(error);
            console.log('=========Finish getOptimalChangeFor=========');
            return {error: error};
        }

    }

    /**
     * @param {int} euro
     */
    getChangeFor(euro) {
        console.log('\n=========Run getChangeFor=========');
        if (euro && isPositiveInteger(euro)) {
            let coinsLimits = this.constructor.coinsLimits;
            let denominations = this.constructor.denominations;
            console.log(`Base euro value is ${euro}`);

            let summaryResults = this.changeCoins(euro, denominations, coinsLimits);
            console.log('Getting Coins:');
            console.log(summaryResults.change);

            console.log('Coins Left:');
            console.log(summaryResults.limits);
        } else {
            console.log('Sorry, but provided value of euro is not valid, it must be positive int. Processing is cancel');
        }
        console.log('=========Finish getChangeFor=========');
    }


    /**
     * Main changing process
     * @param {int} euro
     * @param {Map} denominations
     * @param {Map} [coinsLimits]
     * @returns {{change: Array}}
     */
    changeCoins(euro, denominations, coinsLimits) {
        let results = [];
        for (let coin of denominations) {
            let value = coin[0];
            let denomination = coin[1];

            /** Default coins availability */
            let coinsAvailable = Infinity;
            if (coinsLimits && coinsLimits.has(value)) {
                /** Limited coins availability */
                coinsAvailable = coinsLimits.get(value);
            }

            let coins = euro / value;
            if (coins >= 1 ) {
                /** Numbers of coins to reduce from limits, will be used only if limits are set */
                let coinsReduce;

                /** In this case we have not enough coins in vending machine, so give all what we have */
                if (coins > coinsAvailable ) {
                    results.push(`${denomination}: ${coinsAvailable}`);
                    euro -= coinsAvailable * value;
                    coinsReduce = coinsAvailable;
                } else {
                    /** In this case we have more or equal to necessary coins for giving change */
                    results.push(`${denomination}: ${Math.floor(coins)}`);
                    euro = euro % value;
                    coinsReduce = Math.floor(coins);
                }
                /** If we have limits we need to reduce them */
                if (coinsLimits) {
                    coinsLimits.set(value, coinsAvailable - coinsReduce);
                }
            }
        }

        /** This means that we don't have coins to get change, throw Exception */
        if (euro > 0) {
            throw new Error('Coins is not enough');
        }

        let summaryResults = {
            change: results
        };

        if (coinsLimits) {
            summaryResults.limits = this.getLeftCoins(coinsLimits);
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