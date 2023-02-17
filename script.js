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
        if(!isEmpty(tempDigitStorage)) {
            setOperand(tempDigitStorage);
        }
        switch (operationStorage.length) {
            case 0:
                break;
            case 1:
                setOperator(operatorButton.value);
                break;
            case 2:
                replaceRecentOperator(operatorButton.value);
                break;
            case 3:
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

decimalButton.addEventListener('click', () => {
    addDecimal();
})

nonZeroButtons.forEach((nonZeroButton) => {
    nonZeroButton.addEventListener('click', () => {
        addDigit(nonZeroButton.value);
        
    });
});
zeroButton.addEventListener('click', () => {
    addDigit(zeroButton.value);
    
});
clearButton.addEventListener('click', () => {
    clearAll();
});

function displayValue(obj) {
    if (typeof obj === 'number') {
        screenDisplay.value = obj;
    } else if (obj.constructor === Array) {
        screenDisplay.value = obj.join('');
    }  
};
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
function isEmpty(array) {
    return array.length === 0;
}
function replaceRecentOperator(operator) {
    if(typeof operationStorage[operationStorage.length-1] === 'string') {
        operationStorage.pop();
    }
    operationStorage.push(operator);
}
function addDigit(num) {
    if (tempDigitStorage.length === 1 && tempDigitStorage[0] === '0') {
        if (num === '0') {
            return;
        } else {
            tempDigitStorage.shift();
            tempDigitStorage.unshift(num);
        }
    } else {
        tempDigitStorage.push(num);
    }
    displayValue(tempDigitStorage)
}
function addDecimal() {
    let isDecimalAlreadyPresent = !!tempDigitStorage.find(decimal => decimal === '.');
    if (isDecimalAlreadyPresent) {
        return;
    } else if (isEmpty(tempDigitStorage)) {
        tempDigitStorage.push(0,decimalButton.value);
        displayValue(tempDigitStorage);
    } else {
        tempDigitStorage.push(decimalButton.value);
        displayValue(tempDigitStorage);
    }
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