const VendingMachine = require('./services/VendingMachine');
const changeMode = process.CHANGE_MODE;
const amount = process.AMOUNT;
let vendingMachine = new VendingMachine();

if (changeMode === 0) {
    vendingMachine.getOptimalChangeFor(22);
} else if(changeMode === 1) {
    vendingMachine.getChangeFor(233);
}

