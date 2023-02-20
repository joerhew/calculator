const START_VALUE = 0;
const DISPLAY_DIVISION_BY_ZERO = 'Nice try!';
const DISPLAY_TOO_MANY_DIGITS = 'Too many digits...';
const DEFAULT_FONT_SIZE = '100px';
const MAX_DIGITS = 18;

let tempDigitStorage = [];
let operationStorage = [];

let screenDisplayContainer = document.querySelector('.calculator-screen-container');
let screenDisplay = document.querySelector('.calculator-screen');
let operatorButtons = document.querySelectorAll('.operator');
let nonZeroButtons = document.querySelectorAll('.non-zero');
let zeroButton = document.querySelector('.zero');
let decimalButton = document.querySelector('.decimal');
let clearButton = document.querySelector('.clear');
let equalSignButton = document.querySelector('.equal-sign');

// Include a backspace functionality - delete the last entered digit or operator

window.addEventListener('keydown', enterKey);

operatorButtons.forEach((operatorButton) => {
    operatorButton.addEventListener('click', () => {
        addOperator(operatorButton.value);
    })
});

equalSignButton.addEventListener('click', () => {
    pressEquals();
})

decimalButton.addEventListener('click', () => {
    addDecimal(tempDigitStorage, decimalButton.value);
})

nonZeroButtons.forEach((nonZeroButton) => {
    nonZeroButton.addEventListener('click', () => {
        addDigit(nonZeroButton.value);
        console.log(nonZeroButton.value);
        
    });
});
zeroButton.addEventListener('click', () => {
    addDigit(zeroButton.value);
    
});
clearButton.addEventListener('click', () => {
    clearAll();
});

function displayValue(obj) {
    let displayValueText;
    
    if (isArray(obj)) {
        displayValueText = obj.join('');
    } else {
        displayValueText = obj;    
    };

    if (displayValueText.length > MAX_DIGITS && displayValueText !== DISPLAY_DIVISION_BY_ZERO) {
        screenDisplay.innerHTML = DISPLAY_TOO_MANY_DIGITS;
    } else {
        screenDisplay.innerHTML = displayValueText;
        processDisplay();
    }
    
};

function resizeDisplayFont() {
    let fontSize = window.getComputedStyle(screenDisplay).fontSize;
    screenDisplay.style.fontSize = (parseFloat(fontSize) - 1) + 'px';

    if (screenDisplay.clientHeight >= screenDisplayContainer.clientHeight) {
        resizeDisplayFont();
    } 
}; 

function processDisplay() {
    screenDisplay.style.fontSize = DEFAULT_FONT_SIZE;
    resizeDisplayFont();
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
function isEmpty(array) {
    return array.length === 0;
}
function isNumber(obj) {
    return typeof obj === 'number';
}
function isArray(obj) {
    return obj.constructor === Array;
}
function replaceRecentOperator(operator) {
    if(typeof operationStorage.at(-1) === 'string') {
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
    } else if (isNumber(operationStorage.at(-1))) {
        clearOperationStorage();
        tempDigitStorage.push(num);
    } else {
        tempDigitStorage.push(num);
    }
    displayValue(tempDigitStorage)
}
function addDecimal(array, value) {
    if (isDecimalPresent(array)) {
        return;
    } else if (isEmpty(array)) {
        array.push(0,value);
        displayValue(array);
    } else {
        array.push(value);
        displayValue(array);
    }
}
function isDecimalPresent(array) {
    return !!array.find(decimal => decimal === '.');
}
function setOperand(array) {
    let numBeforeDecimal;

    if(array.length === 0 || isNumber(operationStorage.at(-1))) {
        return;
    }

    if(!isDecimalPresent(array)) {
        numBeforeDecimal = parseInt(array.join(''));
        console.log(numBeforeDecimal);
        return operationStorage.push(numBeforeDecimal);
        
    } else {
        let arrAfterDecimal;
        let numAfterDecimal;
        
        function findDecimalIndex(array) {
            return array.findIndex((element) => element === '.');
        }
        function turnArrIntoNum(array) {
            return parseInt(array.join(''));
        }

        numBeforeDecimal = turnArrIntoNum(array.slice(0,findDecimalIndex(array)));
        arrAfterDecimal = array.slice(findDecimalIndex(array)+1,array.length);
        numAfterDecimal = turnArrIntoNum(arrAfterDecimal)/(10**arrAfterDecimal.length);
        
        return operationStorage.push(numBeforeDecimal+numAfterDecimal);
    }
}
function addOperator(val) {
    if(!isEmpty(tempDigitStorage)) {
        setOperand(tempDigitStorage);
    }
    switch (operationStorage.length) {
        case 0:
            break;
        case 1:
            setOperator(val);
            break;
        case 2:
            replaceRecentOperator(val);
            break;
        case 3:
            operate(operationStorage);
            setOperator(val);
            break;
    }
    console.log(operationStorage);
}
function setOperator(operator) {
    operationStorage.push(operator);
    clearTempStorage();
}
function pressEquals() {
    setOperand(tempDigitStorage);
    if(operationStorage.length !== 3) {
        return;
    } else {
        operate(operationStorage);
    }
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
            if (array[2] === 0) {
                displayValue(DISPLAY_DIVISION_BY_ZERO);
                break;
            }
            operation = array[0] / array[2];
            updateResultWith(operation);
            break;
    }
}
function enterKey(e) {
    let keyPressed = e.key;
    switch (keyPressed) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            addDigit(keyPressed);
            console.log(keyPressed);
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            addOperator(keyPressed); 
            break;
        case '=':
            pressEquals();
            break;
    }
}

window.onload = () => {
    clearAll();
}