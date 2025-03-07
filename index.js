const moment = require('moment');

function luhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10) === 0;
}

function getCardType(cardNumber) {
    const cardTypes = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
        troy: /^9[0-9]{15}$/
    };

    for (const [type, pattern] of Object.entries(cardTypes)) {
        if (pattern.test(cardNumber)) {
            return type;
        }
    }

    return 'Tanımsız';
}

function validateCreditCard(cardNumber, cvv, expDate) {
    
    if (/^0+$/.test(cardNumber)) {
        return { valid: false, message: "Geçersiz kredi kartı numarası" };
    }

    if (!luhnCheck(cardNumber)) {
        return { valid: false, message: "Geçersiz kredi kartı numarası" };
    }

    const allZerosRegex = /^0+$/;
    if (allZerosRegex.test(cardNumber)) {
        return { valid: false, message: "Geçersiz kredi kartı numarası" };
    }

    const cardType = getCardType(cardNumber);
    const cvvPattern = cardType === 'amex' ? /^\d{4}$/ : /^\d{3}$/;

    if (!cvvPattern.test(cvv)) {
        return { valid: false, message: "Geçersiz CVV" };
    }

    if (!moment(expDate, 'MM/YY', true).isValid()) {
        return { valid: false, message: "Geçersiz son kullanma tarihi formatı" };
    }

    if (moment(expDate, 'MM/YY').isBefore(moment())) {
        return { valid: false, message: "Geçmiş son kullanma tarihi" };
    }

    return { valid: true, message: `Geçerli bilgiler. Kart Tipi: ${cardType === 'Tanımsız' ? 'Tanımsız' : cardType}` };
}

module.exports = validateCreditCard;
