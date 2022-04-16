import dayjs from 'dayjs'
import {
    ACCESS_DENIED,
    EMAIL_PATTERN_NOT_MATCHED,
    EMAIL_REGEX,
    IP_ADDRESS_REGEX,
    PROVIDED_INCOMPLETE_DATA,
} from '../constants'
import {SECRET_API_KEY} from '../constants/env'
import {FakeMailsList} from '../constants/fakemails'

export const sendDefaultAccessDeniedResponse = response => {
    response.status(200).json({
        code: ACCESS_DENIED,
        message:
            'Only verified IPs can fetch data from this endpoint. Please try contacting developer team if you are in same organization, So that you could get an API key.',
    })
}

export function emailIsAllowedAndNotATemporaryMail(email = '') {
    for (let i in FakeMailsList)
        if (email.includes(FakeMailsList[i])) return false
    return true
}

/**
 *
 * @param {request} request the request variable
 * @param {response} response the response variable
 * @returns if the request type is not POST or SECRET api is not provided than will return false else true
 * if returned true than the api request could continue to perform the actual task else the request will end
 */
export function canContinueAPIRequests(request, response) {
    /**
     * if the request is not post or the key is not provided then return a fallback status response
     * without this two conditions unwanted errors may occur
     * this two condition is also important for security purpose
     */
    if (request.method !== 'POST') {
        sendDefaultAccessDeniedResponse(response)
        return false
    } else if (request.headers.key !== SECRET_API_KEY) {
        sendDefaultAccessDeniedResponse(response)
        return false
    } else if (
        !IP_ADDRESS_REGEX.test(String(request.headers.ip)) ||
        String(request.headers.ip) === '0.0.0.0'
    ) {
        sendDefaultAccessDeniedResponse(response)
        return false
    }
    return true
}

/**
 * if all the elements in the args array are valid and not null than return true else false
 * @param  {...any} args the list or array of arguments or variables
 * @returns {boolean} if true then api requests can be made and continued else nope
 */
export function allAreNonNullAndValidValues(...args) {
    for (let i = 0; i < args.length; ++i) {
        if (
            !args ||
            args[i] === null ||
            args[i] === undefined ||
            args[i] === '' ||
            args[i] === 0 ||
            args[i] === false
        )
            return false
    }
    return true
}

/**
 * this is a wrapper function for the {allAreNonNullAndValidValues} function and helper for parent level API requests...
 * @param {NextResponse} response the response variable
 * @param  {...any} headers the vartables which are to be test against
 * @returns if all the variables are valid then continue else return a response already
 */
export function canContinueAPIRequestsForHeaderElements(response, ...headers) {
    if (allAreNonNullAndValidValues(...headers)) {
        return true
    } else {
        response.status(200).json({
            code: PROVIDED_INCOMPLETE_DATA,
        })
        return false
    }
}

/**
 * email validator function
 * @param {string} email email id in string form
 * @returns if the provided email is valid
 */
export function isValidEmail(response, email = '') {
    // if the email is valid and also allowed by the system then pass the function else error response
    if (emailIsAllowedAndNotATemporaryMail(email) && email.match(EMAIL_REGEX)) {
        return true
    } else {
        response.status(200).json({
            code: EMAIL_PATTERN_NOT_MATCHED,
        })
        return false
    }
}

/**
 * @param {Array | any} array any object
 * @returns true if the provided array is a valid array type
 */
export function isValidArray(array) {
    return Array.isArray(array)
}

/**
 * @param {Array | any} array any object
 * @returns if the array is valid and also contains elements in it then return true else false
 */
export function arrayContainElements(array) {
    return isValidArray(array) && array.length > 0
}

/**
 * a random OTP generator function...
 * @param {number} length the number of digits the OTP should contain, here minimum length is 1 and maximum is Infinite
 * @returns {number} the OTP containing {length} digits
 */
export function randomOTPGenerator(length = 6) {
    const minOTPRangeString = '1' + '0'.repeat(length - 1)
    const maxOTPRangeString = '9' + '8'.repeat(length - 1)

    const minOTPRange = Number(minOTPRangeString)
    const maxOTPRange = Number(maxOTPRangeString)

    return Math.floor(minOTPRange + Math.random() * maxOTPRange)

    // shorthand would be like
    return Math.floor(
        Number('1' + '0'.repeat(length)) +
            Math.random() * Number('9' + '8'.repeat(length)),
    )
}

/**
 *
 * @param {string} format the format of the date
 * @returns the actual date value in string form..
 */
export function getFormattedCurrentTime(format = 'YYYY-MM-DD HH:mm') {
    return dayjs().format(format)
}

/**
 * @param {number} milli any number which is denoting any milliseconds
 * @returns first converts the milliseconds value to hours and return it
 */
export function millisecondsToHours(milli = 1000 * 60 * 60) {
    return milli / 3.6e6 // milliseconds divides by 3.6e+6 will give hours
}

/**
 * @param {number} number any integer
 * @returns returned the absolute value of that integer passed in the parameter
 */
export function abs(number = -1) {
    return Math.abs(number)
}

/**
 * capitalize all words of a string
 * @param string the sentence or the statement
 * @returns a string which contains capital letter after each spaces...
 */
export function capitalizeWords(string) {
    /**
     * we are converting the whole string to lowercase because
     * the input string may be like this:
     * Input:- THIS IS A SENTENCE OR STRING
     * Output:- THIS IS A SENTENCE OR STRING
     * But We Want:- This Is A Sentence Or String
     * that's why
     *
     * this is one of the edge case....
     */
    return string
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, function (character) {
            // upper case character after every space
            return character.toUpperCase()
        })
        .replace(/(?:\.)\S/g, function (character) {
            /**
             * uppercase character after every period
             * this will be helpful to show artist name
             * like - a.r. rahman will be A.r. Rahman without this function
             * and with this function it will be A.R. Rahman
             * which is the correct format of the artists to show in the UI
             */
            return character.toUpperCase()
        })
}

/**
 *
 * @returns random unique id everytime
 */
export function uuidv4() {
    return (
        Math.random().toString(36).substr(2, 9) +
        Date.now().toString(36) +
        Math.random().toString(36).substr(2)
    )
    // old code
    return (
        ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16),
        ) +
        '-' +
        new Date().getTime().toString()
    )
}
