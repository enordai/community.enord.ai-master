export default "constant's exports"

export const ACCESS_DENIED = 'ACCESS_DENIED'

export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'
export const PARTIAL_SUCCESS = 'PARTIAL_SUCCESS'
export const ERROR = 'ERROR'
export const MISSING_DATA = 'MISSING_DATA'

export const DATA_NOT_FOUND = 'DATA_NOT_FOUND'
export const USER_NOT_FOUND = 'USER_NOT_FOUND'
export const USER_ALREADY_EXIST = 'USER_ALREADY_EXIST'
export const USERNAME_NOT_PROVIDED = 'USERNAME_NOT_PROVIDED'
export const INVALID_USERNAME = 'INVALID_USERNAME'
export const INVALID_PASSWORD = 'INVALID_PASSWORD'
export const WRONG_PASSWORD = 'WRONG_PASSWORD'
export const USER_ACCOUNT_IS_DISABLED = 'USER_ACCOUNT_IS_DISABLED'
export const PROVIDED_INCOMPLETE_DATA = 'PROVIDED_INCOMPLETE_DATA'
export const EMAIL_LENGTH_EXCEED = 'EMAIL_LENGTH_EXCEED'
export const EMAIL_PATTERN_NOT_MATCHED = 'EMAIL_PATTERN_NOT_MATCHED'
export const TEMPORARY_EMAIL_IS_NOT_ALLOWED = 'TEMPORARY_EMAIL_IS_NOT_ALLOWED'
export const SHORT_PASSWORD = 'SHORT_PASSWORD'
export const PASSWORD_LENGTH_EXCEED = 'PASSWORD_LENGTH_EXCEED'
export const INVALID_OTP = 'INVALID_OTP'
export const PASSWORD_NOT_MATCHED = 'PASSWORD_NOT_MATCHED'

export const QUESTION_NOT_FOUND = 'QUESTION_NOT_FOUND'
export const ANSWER_NOT_FOUND = 'ANSWER_NOT_FOUND'

export const BOOKMARK_ADDED = 'BOOKMARK_ADDED'
export const BOOKMARK_REMOVED = 'BOOKMARK_REMOVED'

export const VOTE_UPDATED_SUCCESSFULLY = 'VOTE_UPDATED_SUCCESSFULLY'
export const VOTE_CREATED_SUCCESSFULLY = 'VOTE_CREATED_SUCCESSFULLY'

export const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const IP_ADDRESS_REGEX =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/

// export const bannedIPs = ['127.0.0.0', '0.0.0.0', 'localhost']
export const bannedIPs = ['', '', '']

// this constant must contain a space at the end or else when making request this could not be separated from space
export const API_AUTHORIZATION_BEARER_TOKEN_PREFIX =
    'sobyte-bearer-access-token '
// this is the tag which will also be sent to the client as a response during a api requested in the client-side it can be fetched from the header of the response we sent...
export const API_DETAILS_TAG = 'sobyte-app-details'

// LINKS constants
export const GITHUB_LINK = 'https://github.com/'
export const TWITTER_LINK = 'https://twitter.com/'
