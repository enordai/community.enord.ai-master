import mysql from 'mysql'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'

import {
    HASHING_MAX_SALT,
    MAX_EMAIL_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_SQL_CONCURRENT_CONNECTION,
    MIN_PASSWORD_LENGTH,
} from '../../../constants/limits'
import {
    ACCESS_TOKEN_SECRET,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
    SECRET_API_KEY,
} from '../../../constants/env'
import {
    ACCESS_DENIED,
    EMAIL_LENGTH_EXCEED,
    EMAIL_REGEX,
    FAILURE,
    PASSWORD_LENGTH_EXCEED,
    PROVIDED_INCOMPLETE_DATA,
    SHORT_PASSWORD,
    SUCCESS,
    USER_ALREADY_EXIST,
    USER_ACCOUNT_IS_DISABLED,
    WRONG_PASSWORD,
    PARTIAL_SUCCESS,
    EMAIL_PATTERN_NOT_MATCHED,
    INVALID_USERNAME,
    INVALID_PASSWORD,
    TEMPORARY_EMAIL_IS_NOT_ALLOWED,
    PASSWORD_REGEX,
} from '../../../constants'
import {
    emailIsAllowedAndNotATemporaryMail,
    sendDefaultAccessDeniedResponse,
} from '../../../utils'

const database = mysql.createPool({
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    connectionLimit: MAX_SQL_CONCURRENT_CONNECTION,
})

export default function Login(request, response) {
    /**
     * if the request is not post or the key is not provided then return a fallback status response
     * without this two conditions unwanted errors may occur
     * this two condition is also important for security purpose
     */
    if (request.method !== 'POST')
        return sendDefaultAccessDeniedResponse(response)
    else if (request.headers.key !== SECRET_API_KEY)
        return sendDefaultAccessDeniedResponse(response)

    // all data we should get from the client-side...
    const email = String(request.headers.email || '')
    const password = String(request.headers.password || '')
    const username = String(request.headers.username || '')
    const ClientIPAddress = request.headers.ip

    /**
     * all the checks which are needed and are must for new account
     * checking if the email and password both exists
     * then checking if the email length is correct and email is valid.
     * then we are checking than the password is of correct length
     * and if these checks passed then we could create a new account
     */
    if (email.length <= 0 || username.length <= 0 || password.length <= 0) {
        response.status(200).json({
            code: PROVIDED_INCOMPLETE_DATA,
        })
    } else if (email.length > MAX_EMAIL_LENGTH) {
        response.status(200).json({
            code: EMAIL_LENGTH_EXCEED,
        })
    } else if (!EMAIL_REGEX.test(email)) {
        response.status(200).json({
            code: EMAIL_PATTERN_NOT_MATCHED,
        })
    } else if (username.length < 8 || username.length > 20) {
        response.status(200).json({
            code: INVALID_USERNAME,
        })
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        response.status(200).json({
            code: SHORT_PASSWORD,
        })
    } else if (password.length > MAX_PASSWORD_LENGTH) {
        response.status(200).json({
            code: PASSWORD_LENGTH_EXCEED,
        })
    } else if (!PASSWORD_REGEX.test(password)) {
        response.status(200).json({
            code: INVALID_PASSWORD,
            message:
                "Password's length must be between 8 to 30 characters. And contain at least one upper-case, one lower-case and 1 number. Special characters are optional.",
        })
    } else if (!emailIsAllowedAndNotATemporaryMail(email)) {
        response.status(200).json({
            code: TEMPORARY_EMAIL_IS_NOT_ALLOWED,
        })
    } else {
        // checking that the account already exists or not...
        database.query(
            'SELECT * FROM accounts WHERE email=? OR username=?LIMIT 1',
            [email, username],
            (err, res) => {
                // if any error occurred...
                if (err) {
                    response.status(200).json({
                        code: FAILURE,
                    })
                } else {
                    // not errors we could go on...
                    if (res.length) {
                        // if the user already present so not account to create
                        response.status(200).json({
                            code: USER_ALREADY_EXIST,
                        })
                    } else {
                        // create the excypted password and create a new account...
                        const encryptedPassword = bcrypt.hashSync(
                            password,
                            HASHING_MAX_SALT,
                        )

                        // creating new account
                        database.query(
                            'INSERT INTO accounts (email, username, password) VALUES (?, ?, ?)',
                            [email, username, encryptedPassword],
                            (err, res) => {
                                // if any error occurred during creating a new account
                                // if not go on
                                if (err) {
                                    response.status(200).json({
                                        code: FAILURE,
                                    })
                                } else {
                                    // getting the uid of the created new user...
                                    database.query(
                                        'SELECT * FROM accounts WHERE email=? LIMIT 1',
                                        [email],
                                        (err, res) => {
                                            if (err) {
                                                response.status(200).json({
                                                    code: FAILURE,
                                                })
                                                // if we have created the account but could not add the user data then we will delete that account from accounts table...
                                                database.query(
                                                    'DELETE FROM accounts WHERE email=? LIMIT 1',
                                                    [email],
                                                )
                                            } else {
                                                const uid = res[0].uid

                                                /**
                                                 * saving the access token to the database and also providing
                                                 * it to the the end client user throught response of this api...
                                                 */
                                                const access_token = jwt.sign(
                                                    {
                                                        uid: res[0].uid,
                                                        email: email,
                                                        username: username,
                                                    },
                                                    ACCESS_TOKEN_SECRET,
                                                )

                                                // add the user details finally to the database...
                                                database.query(
                                                    'INSERT INTO users (uid, email, username, fullname, created_ip, last_login_ip) VALUES (?, ?, ?, ?, ?, ?)',
                                                    [
                                                        uid,
                                                        email,
                                                        username,
                                                        username,
                                                        ClientIPAddress,
                                                        ClientIPAddress,
                                                    ],
                                                    (err, res) => {
                                                        if (err) {
                                                            console.log(err)
                                                            response
                                                                .status(200)
                                                                .json({
                                                                    code: FAILURE,
                                                                })
                                                            // if we have created the account but could not add the user data then we will delete that account from users table too...
                                                            database.query(
                                                                'DELETE FROM accounts WHERE email=? LIMIT 1',
                                                                [email],
                                                            )
                                                        } else {
                                                            database.query(
                                                                'SELECT * FROM users WHERE email=? LIMIT 1',
                                                                [email],
                                                                (err, res) => {
                                                                    if (err) {
                                                                        response
                                                                            .status(
                                                                                200,
                                                                            )
                                                                            .json(
                                                                                {
                                                                                    code: PARTIAL_SUCCESS,
                                                                                },
                                                                            )
                                                                    } else {
                                                                        response
                                                                            .status(
                                                                                200,
                                                                            )
                                                                            .json(
                                                                                {
                                                                                    code: SUCCESS,
                                                                                    data: res,
                                                                                },
                                                                            )
                                                                    }
                                                                },
                                                            )
                                                        }
                                                    },
                                                )
                                            }
                                        },
                                    )
                                }
                            },
                        )
                    }
                }
            },
        )
    }
}
