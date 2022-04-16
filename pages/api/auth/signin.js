import mysql from 'mysql'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'

import {
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
    USER_ACCOUNT_IS_DISABLED,
    USER_NOT_FOUND,
    WRONG_PASSWORD,
} from '../../../constants'
import {sendDefaultAccessDeniedResponse} from '../../../utils'

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

    const currentDateTime = dayjs().$d

    // user recognizer string this may be the username or email id
    // since we are supporting both login with email and username at the same time
    const user = String(request.headers.user || '')
    const password = String(request.headers.password || '')
    const ClientIPAddress = request.headers.ip

    if (user.length <= 0 || password.length <= 0) {
        // if no username or email is provided
        response.status(200).json({
            code: PROVIDED_INCOMPLETE_DATA,
        })
    } else if (EMAIL_REGEX.test(user) && user.length > MAX_EMAIL_LENGTH) {
        // if email length is not valid
        response.status(200).json({
            code: EMAIL_LENGTH_EXCEED,
        })
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        // if password length is very short
        response.status(200).json({
            code: SHORT_PASSWORD,
        })
    } else if (password.length > MAX_PASSWORD_LENGTH) {
        // if password length is very long
        response.status(200).json({
            code: PASSWORD_LENGTH_EXCEED,
        })
    } else {
        // all checks passed continue to provide the data

        // we are knowing what the user have provided username or email.
        let whatTypeOfDataIsProvided = 'email=?'
        if (EMAIL_REGEX.test(user)) {
            whatTypeOfDataIsProvided = 'email=?'
        } else {
            whatTypeOfDataIsProvided = 'username=?'
        }

        // getting the data of the particular user...
        database.query(
            `SELECT * FROM accounts WHERE ${whatTypeOfDataIsProvided} LIMIT 1`,
            [user],
            (err, res) => {
                if (err) {
                    response.status(200).json({
                        code: FAILURE,
                        err,
                    })
                } else {
                    // if the account does not exists in the database...
                    if (!res.length) {
                        response.status(200).json({
                            code: USER_NOT_FOUND,
                        })
                    } else {
                        // if the account exists continue to check if the account is disabled or not...
                        if (res[0].disabled === 0) {
                            // check if the password is correct or not
                            // if password is wrong return a warning
                            // else continue...
                            if (bcrypt.compareSync(password, res[0].password)) {
                                // password is correct get the user data
                                database.query(
                                    `SELECT * FROM users WHERE ${whatTypeOfDataIsProvided} LIMIT 1`,
                                    [user],
                                    (err2, userDetails) => {
                                        const access_token = jwt.sign(
                                            {
                                                uid: userDetails[0].uid,
                                                email: userDetails[0].email,
                                                username:
                                                    userDetails[0].username,
                                            },
                                            ACCESS_TOKEN_SECRET,
                                        )

                                        database.query(
                                            `UPDATE users SET last_login_on=?, last_login_ip=?, access_token=? WHERE ${whatTypeOfDataIsProvided}`,
                                            [
                                                currentDateTime,
                                                ClientIPAddress,
                                                access_token,
                                                user,
                                            ],
                                        )

                                        response.status(200).json({
                                            code: SUCCESS,
                                            data: {
                                                /**
                                                 * access_token is under data because we also have this field in database
                                                 * but we are providing the old access_token previously so by providing the new one and updating on the database we could make one less query to the database
                                                 *
                                                 * since we could only check if the user exists by one query and by other query we could update the user's last login and get the data by last query and provide it
                                                 * but if we does not provide this access_token inside data then we have to make another query of updating, and reading the then providing it the the client...
                                                 * so this way is used...
                                                 */
                                                ...userDetails[0],
                                                access_token: access_token,
                                            },
                                            time: currentDateTime,
                                        })
                                    },
                                )
                            } else {
                                // password is wrong
                                response.status(200).json({
                                    code: WRONG_PASSWORD,
                                })
                            }
                        } else {
                            // account is disabled cannot login the user
                            response.status(200).json({
                                code: USER_ACCOUNT_IS_DISABLED,
                            })
                        }
                    }
                }
            },
        )
    }
}
