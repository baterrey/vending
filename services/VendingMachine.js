const isPositiveInteger = require('is-positive-integer');

class VendingMachine {
    getOptimalChangeFor (euro) {
        console.log('\n=========Run getOptimalChangeFor=========');
        if (euro && isPositiveInteger(euro)) {
            let denominations = this.constructor.denominations;
            console.log(`Base euro value is ${euro}`);
            this.getCoinsFromSum(euro, denominations);
        } else {
            console.log('Sorry, but provided value of euro is not valid, it must be positive int. Processing is cancel');
        }
        console.log('=========Finish getOptimalChangeFor=========');
    }

    getChangeFor(euro) {
        console.log('\n=========Run getChangeFor=========');
        if (euro && isPositiveInteger(euro)) {
            let coinAmount = this.constructor.coinAmount;
            let denominations = this.constructor.denominations;
            console.log(`Base euro value is ${euro}`);
            this.getCoinsFromSum(euro, denominations, coinAmount);
        } else {
            console.log('Sorry, but provided value of euro is not valid, it must be positive int. Processing is cancel');
        }
        console.log('=========Finish getChangeFor=========');
    }

    getCoinsFromSum(euro, denominations, coinAmount) {
        let results = [];
        for (let coin of denominations) {
            let value = coin[0];
            let denomination = coin[1];

            //default
            let coinsLeft = Infinity;
            if (coinAmount && coinAmount.has(value)) {
                coinsLeft = coinAmount.get(value);
            }

            while (euro - value >= 0 && coinsLeft) {
                euro -= value;
                results.push(denomination);
                if (coinAmount && coinAmount.has(value)) {
                    coinsLeft = coinsLeft - 1;
                    coinAmount.set(value, coinsLeft);
                }
            }
        }

        if (euro > 0) {
            throw new Error('Coins is not enough');
        }

        if (coinAmount) {
            console.log('Coins left:');
            console.log(this.getLeftCoins(coinAmount));
        }

        console.log('Getting coins');
        console.log(results);
    }

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

    static get coinAmount() {
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