const START_VALUE = 0;

let tempDigitStorage = [];
let operationStorage = [];

let screenDisplay = document.querySelector('.calculator-screen');
let operatorButtons = document.querySelectorAll('.operator');
let nonZeroButtons = document.querySelectorAll('.non-zero');
let zeroButton = document.querySelector('.zero');
let decimalButton = document.querySelector('.decimal');
let clearButton = document.querySelector('.clear');
let equalSignButton = document.querySelector('.equal-sign');

operatorButtons.forEach((operatorButton) => {
    operatorButton.addEventListener('click', () => {
        if(tempDigitStorage.length !== 0) {
            setOperand(tempDigitStorage);
        }
    
        switch (operationStorage.length) {
            case 0:
                console.log(operationStorage);
                break;
            case 1:
                console.log(operationStorage);
                setOperator(operatorButton.value);
                break;
            case 2:
                console.log(operationStorage);
                replaceRecentOperator(operatorButton.value);
                break;
            case 3:
                console.log(operationStorage);
                operate(operationStorage);
                setOperator(operatorButton.value);
                break;
        }
        console.log(operationStorage);
    })
});

equalSignButton.addEventListener('click', () => {
    setOperand(tempDigitStorage);
    if(operationStorage.length !== 3) {
        return;
    } else {
        operate(operationStorage);
    }
})

nonZeroButtons.forEach((nonZeroButton) => {
    nonZeroButton.addEventListener('click', () => {
        addDigit(nonZeroButton.value);
        displayValue(showArrayOfDigitsAsNumber(tempDigitStorage));
        
    });
});
zeroButton.addEventListener('click', () => {
    addDigit(zeroButton.value);
    displayValue(showArrayOfDigitsAsNumber(tempDigitStorage));
    
});
clearButton.addEventListener('click', () => {
    clearAll();
});

function displayValue(num) {
    screenDisplay.value = num;
};
function showArrayOfDigitsAsNumber(array) {
    return array.join('');
}
function clearAll() {
    clearTempStorage();
    clearOperationStorage();
    displayValue(START_VALUE);

};
function clearTempStorage() {
    tempDigitStorage = [];
}
function clearOperationStorage() {
    operationStorage = [];
}
function replaceRecentOperator(operator) {
    if(typeof operationStorage[operationStorage.length-1] === 'string') {
        operationStorage.pop();
    }
    operationStorage.push(operator);
}
function addDigit(num) {
    tempDigitStorage.push(parseInt(num));
}
function setOperand(array) {
    let updatedNumber = array.reduce((accumulator, currentDigit, currentIndex) => {
        if (currentDigit === 0) {
            return accumulator;
        } else {
            return accumulator + currentDigit * (10**(array.length-currentIndex-1));
        };
    },0);
    
    operationStorage.push(updatedNumber);
}
function setOperator(operator) {
    operationStorage.push(operator);
    clearTempStorage();
}
function operate(array) {
    let result;

    function updateResultWith(num) {
        operationStorage =[num];
        clearTempStorage();
        displayValue(operationStorage[0]);
    }

    switch (array[1]) {
        case '+':
            operation = array[0] + array[2];
            updateResultWith(operation);
            break;
        case '-':
            operation = array[0] - array[2];
            updateResultWith(operation);
            break;
        case '*':
            operation = array[0] * array[2];
            updateResultWith(operation);
            break;
        case '/':
            operation = array[0] / array[2];
            updateResultWith(operation);
            break;
    }
}

window.onload = () => {
    clearAll();
}