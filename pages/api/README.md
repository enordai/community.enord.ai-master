# Backend API Usage Documentation

Here you will get a simple documentation what this file is doing

This file contains the details/data to use the APIs.
Following are some tag which provides some important data:

1. NAME: the name of the endpoint, its just a name which developer can understand and get to know what this api is for.
2. DETAILS: a short detail what this endpoint will do.
3. ENDPOINT: the actual endpoint url.
4. HEADER: the header which is to be passed while making requests.
5. BODY: the body which should be posted while making api request. (this is optional but where ever given should provide in the post request)
6. BODY_TYPE: wherever the above BODY field is required this is also. This could be 'text/plain', 'application/json', 'image/png', etc... Actually this is the 'Content-Type' provided in the API request through its headers.
7. CODES: list of some response codes which the backend api will return
   after making a request. and a details about why that particular code.
8. RESPONSE: the final data which is provided by the backend api to the frontend. This field will be start showing up from Questions endpoint in this docs. NOTE: this is only the response when the CODE is SUCCESS.

-   NOTE: These above data will be provided in the form of code snippet of in form ob Objects. Also please go through the above info if you want to know the full data which we would bes talking below.
-   AGAIN NOTE: Extra data will be provided inside of brackets [ ] for every above tag

<br />

# Some Constant Codes:

1. FAILURE: May be returned if any unusual error occurred in the backend

2. SUCCESS: This code will be returned when your task is completed. For example if you have made request to login endpoint than this code will be returned only if the login data is available or successfully passed all the conditions.

3. PARTIAL_SUCCESS: May be returned as response when any task is half complete. For example you have made request for editing user account. Some fields are updated and some aren't in that case this code will be returned. This might be because of any internal server error only.

# Common AND Required Header:

1. IP Address [`ip`]: ip address should be passed using with object reference 'ip'

2. API Key [`key`]: Secret API Key must be provided so that security could be maintained upto some extent.

3. User Access Token [`user_access_token`]: The individual user access token. This will be used to access each endpoint except the authentication endpoints.

4. Global Access Token [`access_token`]: The secret access token to access different services in the backend.

5. Refresh Token [`refresh_token`]: This will be used sometime to provide new `user_access_token`

<br />

# Entry Point Endpoints

## 1. Login/SignIp Endpoint:

```js
{
    NAME: Login
    DETAILS: endpoint for user login purpose
    ENDPOINT: /api/auth/signin
    HEADER: {
        user: string -> ( email/username ) [EMAIL_REGEX could be found in the constants folder]
        password: string
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if user/password field is NULL.
        EMAIL_LENGTH_EXCEED: if email length is greater than 320.
        SHORT_PASSWORD: if password's length is less than 8.
        PASSWORD_LENGTH_EXCEED: if password's length is greater than 30.
        USER_NOT_FOUND: the user you are requesting is not found in the database.
        WRONG_PASSWORD: the password you provided is wrong.
        USER_ACCOUNT_IS_DISABLED: the user account you are trying to log in is disabled or deleted.
    }
}
```

## 2. Register/SignUp Endpoint:

```js
{
    NAME: Register
    DETAILS: endpoint for creating a new user account in the database
    ENDPOINT: /api/auth/signup
    HEADER: {
        username: string
        email: string [EMAIL_REGEX could be found in the constants folder]
        password: string
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if email/username/password field is NULL.
        EMAIL_LENGTH_EXCEED: email length must be less than 320. in this case show the user invalid email prompt. but don't ever show that email must be less than 320 characters.
        USER_ACCOUNT_IS_DISABLED: the user account you are trying to log in is disabled or deleted.
        EMAIL_PATTERN_NOT_MATCHED: email is invalid.
        INVALID_USERNAME: username format is wrong (may be because the username contains special characters like /><"':;]}[{\| etc).
        SHORT_PASSWORD: password length must be greater than 8
        PASSWORD_LENGTH_EXCEED: password length must be less than 30
        TEMPORARY_EMAIL_IS_NOT_ALLOWED: email is not valid, since we aren't accepting temporary mail IDs.
        USER_ALREADY_EXIST: the username already exist in the database.
        PARTIAL_SUCCESS: User account is created by while providing the user data an error occurred. So please send the user to login page in this case.
    }
}
```

## 3. Send OTP Endpoint:

```js
{
    NAME: Request an OTP using email
    DETAILS: this endpoint will send a OTP to the registered email when provideds
    ENDPOINT: /api/auth/sendotp
    HEADER: {
        email: string [EMAIL_REGEX could be found in the constants folder]
    }
    CODES: {
        USER_NOT_FOUND: If the email is not found in the database.
        SUCCESS: If the OTP is sent successfully.
        FAILURE: If any error occurred.
        PARTIAL_SUCCESS: User account is created by while providing the user data an error occurred. So please send the user to login page in this case.
    }
}
```

## 4. Verify OTP Endpoint:

```js
{
    NAME: Verify any OTP using user account email
    DETAILS: this endpoint will test if the otp entered is correct or not
    ENDPOINT: /api/auth/verifyotp
    HEADER: {
        email: string [EMAIL_REGEX could be found in the constants folder]
        otp: number [number containing 6 digit, remember not more than 6 and also not less than 6]
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if email/otp field is NULL.
        INVALID_OTP: If the OTP is not valid or have expired. OTPs only last for 24 hours then they expires.
        SUCCESS: If the OTP is correct and verified. Save this data for the current login (in the state).
        FAILURE: If the OTP/email is not found.
    }
}
```

## 5. Forgot/Reset Password:

```js
{
    NAME: Forgot or Reset Password endpoint
    DETAILS: endpoint which will reset password of any user
    ENDPOINT: /api/auth/forgotpassword
    HEADER: {
        email: string [EMAIL_REGEX could be found in the constants folder]
        otp: number [number containing 6 digit, remember not more than 6 and also not less than 6]
        newpassword: string [PASSWORD_REGEX could be found in the constant folder]
        confirmnewpassword: string [PASSWORD_REGEX could be found in the constant folder]
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if email/otp/newpassword/confirmnewpassword field is NULL.
        INVALID_OTP: If the OTP is not valid or have expired. OTPs only last for 24 hours then they expires.
        PASSWORD_NOT_MATCHED: when the password does not match with the password regex. could also when newpassword != confirmnewpassword variable passed through the body
        PARTIAL_SUCCESS: The password is update successfully. But failed to send the user data through the reponse. In this case no auto login is available.
        SUCCESS: The password is update successfully. Also the user data is returned as a response. Frontend developer can auto login the user in this case.
        FAILURE: If the OTP/email is not found.
    }
}
```

## 6. Email Verification:

```js
{
    NAME: Account email verification
    DETAILS: endpoint which will verify any email of any account
    ENDPOINT: /api/auth/verifyaccountemail
    HEADER: {
        email: string [EMAIL_REGEX could be found in the constants folder]
        otp: number [number containing 6 digit, remember not more than 6 and also not less than 6]
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if email/otp field is NULL.
        INVALID_OTP: If the OTP is not valid or have expired. OTPs only last for 24 hours then they expires.
        PARTIAL_SUCCESS: The account email is verified successfully. But failed to send the user data through the reponse. Please get the data from other endpoint to save the latest data.
        SUCCESS: The email is successfully verified. Also the user data is returned as a response. Save this latest data so that the prompt to verify email does not shows again.
        FAILURE: If the OTP/email is not found.
    }
}
```

## 7. Update User's Last Login:

```js
{
    NAME: Update last login
    DETAILS: endpoint which takes user email/username and updated its last login time
    ENDPOINT: /api/account/updatelastlogin
    HEADER: {
        ip: string [IP_ADDRESS_REGEX could be found in the constants folder] (this field is mandatory in this route)
        user: string -> ( email/username ) [EMAIL_REGEX could be found in the constants folder]
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if ip/user field is NULL.
        USER_NOT_FOUND: If the account is not found in the database.
        PARTIAL_SUCCESS: The last login is updated but cannot provide the user data.
        SUCCESS: The last login is updated successfully. Also the user data is returned as a response.
        FAILURE: Failed to update the last login time in the database.
    }
}
```

## 8. Update User's Social Links:

```js
{
    NAME: Update Social Link or profile
    DETAILS: endpoint which updates user social media links in the database
    ENDPOINT: /api/account/updatesociallinks
    HEADER: {
        ip: string [IP_ADDRESS_REGEX could be found in the constants folder] (this field is mandatory in this route)
        user: string -> ( email/username ) [EMAIL_REGEX could be found in the constants folder]
        github: string -> ( github username not the full link )
        twitter: string -> ( twitter username not the full twitter profile link)
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if ip/user field is NULL. (github/twitter fields are optional but take care that if the fields are not change do not make api request)
        USER_NOT_FOUND: If the account is not found in the database.
        PARTIAL_SUCCESS: The profile social links are updated but cannot provide the user data.
        SUCCESS: The social links are updated successfully. Also the user data is returned as a response.
        FAILURE: Failed to update the social links in the database.
    }
}
```

## 9. Update User Profile:

```js
{
    NAME: Update User profile
    DETAILS: endpoint which updates user profile
    ENDPOINT: /api/account/updateprofile
    HEADER: {
        ip: string [IP_ADDRESS_REGEX could be found in the constants folder] (this field is mandatory in this route)
        user: string -> ( email/username ) [EMAIL_REGEX could be found in the constants folder]
        fullname: string
        gender: character -> ( m-male, f-female, o-other, p-prefer not to say )
        phone: at least 10 digit phone number with country code or no country code {OPTIONAL FIELD}
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if ip/user/fullname/gender field is NULL. (phone fields are optional but take care that if the fields are not change do not make api request)
        USER_NOT_FOUND: If the account is not found in the database.
        PARTIAL_SUCCESS: The profile is updated but cannot provide the user data. In this case no auto login is available.
        SUCCESS: The profile is updated successfully. Also the user data is returned as a response. Frontend developer can auto login the user in this case.
        FAILURE: Failed to update profile in the database.
    }
}
```

## 10. Get User Profile:

```js
{
    NAME: Get User profile
    DETAILS: endpoint which returns user profile
    ENDPOINT: /api/account/getuserdata
    HEADER: {
        user: string -> ( email/username ) [EMAIL_REGEX could be found in the constants folder]
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: If user field is NULL.
        USER_NOT_FOUND: If the account is not found in the database.
        SUCCESS: The user data is returned as response.
        FAILURE: Failed to provide the user data.
    }
}
```

## 11. Update Password:

```js
{
    NAME: Update password
    DETAILS: endpoint to update password with old password
    ENDPOINT: /api/account/updatepassword
    HEADER: {
        user: string -> ( email/username ) [EMAIL_REGEX could be found in the constants folder]
        oldpassword: string [PASSWORD_REGEX could be found in the constant folder] (this is the old or current password)
        newpassword: string [PASSWORD_REGEX could be found in the constant folder] (the password which will will be updated)
        confirmnewpassword: string [PASSWORD_REGEX could be found in the constant folder] (the same password which will will be updated)
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if user/oldpassword/newpassword/confirmnewpassword field is NULL.
        USER_NOT_FOUND: If the account is not found in the database.
        WRONG_PASSWORD: when the old password is old
        PASSWORD_NOT_MATCHED: when the password does not match with the password regex. could also when newpassword != confirmnewpassword variable passed through the body
        SUCCESS: The password is update successfully.
        FAILURE: Internal Errors.
    }
}
```

# Questions/Answers Endpoints

## 1. Add Question

```ts
{
    NAME: Add new question
    DETAILS: endpoint to add new question in the database
    ENDPOINT: /api/question/add
    HEADER: {
        uid: the id of the user who have requested to add new question
        title: title of the question
        tags: space separated tags string. maximum tags = 5. for example - 'react react-native android java kotlin', here each tag must not contain any spaces in itself
        ip: ip address
        browser: the browser name of the client
        os: the operating system of the client
    }
    BODY: the exact body of the question which shows the full description of the question asked.
    BODY_TYPE: 'text/plain'
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the uid/title/body/tags/ip/browser/os field is NULL.
        FAILURE: Failed to add the question to the database.
        SUCCESS: successfully added the question to the database.
    }
    RESPONSE: {
        qid: the id provided to the qid. here you can redirect the user to a url where you show the questions data and get the question data from other endpoint discussed below
        time: the time when the question was added
    }
}
```

## 2. Get Full Data of any Question

```ts
{
    NAME: Get question data
    DETAILS: endpoint to fetch the full data of any question including comments, answers and its comments, etc
    ENDPOINT: /api/question/get
    HEADER: {
        qid: the id of the question (deprecated for now but will work fine just like with search tag)
        uid: (REQUIRED) the user id who have requested the question data (this will be used to check wheather the user has voted/bookmarked in any answer/question)
        search: the search tag of question
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the search field is NULL.
        QUESTION_NOT_FOUND: the question is not found in the database.
        SUCCESS: fethced the full question data and returned in the response too.
    }
    RESPONSE: {
        warning: optional field. if uid is <= 0 then it will warn that please provide uid in headers
        id: a unique id for the current request
        timestamp: the current time when the questions where fetched
        data: {
            question: {
                qid: the id of the question
                uid: user id who added the question
                search: an unique search tag to search the question
                title: the title of the question
                body: main body of the question
                added_at: time when the question was added
                tags: space separated tags
                edited_at: time when the question was edited last time
                total_answers: total number of answers the question has
                comments: total comments the question has
                upvotes: total upvotes the question got
                bookmarks: total number of users bookmarked the question
                verified: is the question verified or not
                hidden: if the question is blocked or hidden
                username: username of the user who provided the question
                fullname: fullname of the user
                profile_image: profile image of the same user
                followers: number of followers of the user
                followings: number of followings of the user
                github: github username of the same user
                twitter: twitter username of the user
            }
            questionVoted: -1/0/-1 depending on if the user has voted or not (here the user is the currently logged in user for whom the uid is related to)
            questionBookmarked: 0 and 1 if bookmarked and not bookmarked the question respectively by the user
            questionCommentsPage: [
                0: starting point of the comments
                1: ending point of the comments
            ]
            questionComments: Array<{
                id: id of the comment
                qid: id of the question for which the comment is related to
                uid: id of the user who added the comment
                search: an unique search tag for the comment
                comment: the actual comment of the question
                added_at: time when the comment was added
                edited_at: time when the question was edited
                verified: if the comment verified or not
                hidden: if the comment is blocked or not
                username: the username of the user who added the comment
                fullname: the fullname of the user who added the comment
                profile_image: the profile iamge of the user who added the comment
            }>
            answers: Array<{
                aid: id of the answer
                qid: the question id
                uid: user id who added the answer
                search: an unique search tag to search the answer
                body: the main body of the answer
                added_at: time when the answer was added
                edited_at: time when the answer was edited last time
                comments: total number of comments the answer has
                upvotes: total upvotes the answer has
                verified: if the answer if verified or not
                hidden: if the answer is blocked or not
                username: username of the user who provided the answer
                fullname: fullname of the user
                profile_image: profile image of the same user
                followers: number of followers of the user
                followings: number of followings of the user
                github: github username of the same user
                twitter: twitter username of the user
            }>
            answersVoted: Array<{
                vote: -1/0/1 depending on what the user have voted
                aid: in which particular answer the user voted
            }>
            answersComments: Array<{
                id: id of the comment
                qid: id of the question for which the comment is related to
                aid: the id of the answer for which this comment is related to
                uid: id of the user who added the comment
                search: an unique search tag for the comment
                comment: the actual comment of the question
                added_at: time when the comment was added
                edited_at: time when the question was edited
                verified: if the comment verified or not
                hidden: if the comment is blocked or not
                username: the username of the user who added the comment
                fullname: the fullname of the user who added the comment
                profile_image: the profile iamge of the user who added the comment
            }>
        }
    }
}
```

## 3. Add Comment To Question

```ts
{
    NAME: Add a new comment to the question
    DETAILS: endpoint to add new comment to any question in the database
    ENDPOINT: /api/question/addcomment
    HEADER: {
        qid: id of the question for which the comment is to be added
        uid: the id of the user who have requested to add new question
        comment: the actual comment string
        ip: ip address
        browser: the browser name of the client
        os: the operating system of the client
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid/uid/comment/ip/browser/os field is NULL.
        FAILURE: Failed to add the comment to the question to the database.
        SUCCESS: successfully added the comment for the question to the database.
    }
    RESPONSE: {}
}
```

## 4. Get Comments Of Question

```ts
{
    NAME: get comments of question
    DETAILS: endpoint to get some comments of any question
    ENDPOINT: /api/question/getcomments
    HEADER: {
        qid: id of the question for which the comment is to be added
        low: the starting point of the data
        high: limit of comments wanted. NOTE: the absolute difference between high and low must be <= 15 and both the value (low and high) must be >= 0
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid field is NULL. Or low < 0 or high < 0. or abs(low - high) > 15
        FAILURE: Failed to add the comment to the question to the database.
        SUCCESS: successfully added the comment for the question to the database.
        DATA_NOT_FOUND: when any comments for the particular question is not present in the database.
    }
    RESPONSE: {
        data: Array<{
            id: id of the comment
            qid: the id of question for which the comment is related to
            uid: id of user who commented
            username: the username of the user who commented
            fullname: fullname of the user who commented
            search: a random search tag for the comment
            comment: the actual comment
            added_at: the time when the comment was added
            edited_at: time when the comment was last edited
            verified: is the comment verified or not
            hidden: is the comment blocked/hidden
        }>
        page: [
            0: starting point
            1: end point of the comments
        ]
    }
}
```

## 5. Bookmark Question

```ts
{
    NAME: Add bookmark to the question
    DETAILS: endpoint to add bookmark to any question in the database
    ENDPOINT: /api/question/bookmark
    HEADER: {
        qid: id of the question
        uid: id of the user
        ip: ip address
        browser: the browser name of the client
        os: the operating system of the client
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid/uid/ip/browser/os field is NULL.
        FAILURE: Failed to add or remove the bookmark
        BOOKMARK_ADDED: the bookmark is added successfully
        BOOKMARK_REMOVED: the bookmark is removed successfully
    }
    RESPONSE: {}
}
```

## 6. Vote A Question

```ts
{
    NAME: vote a question
    DETAILS: endpoint to add vote to any question in the database
    ENDPOINT: /api/question/vote
    HEADER: {
        qid: id of the question
        uid: id of the user
        vote: vote value that may be upvote=1, novote=0, downvote=-1
        ip: ip address
        browser: the browser name of the client
        os: the operating system of the client
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid/uid/comment/ip/browser/os field is NULL.
        FAILURE: Failed to add the vote to the question
        VOTE_UPDATED_SUCCESSFULLY: successfully added the vote to the question
        VOTE_CREATED_SUCCESSFULLY: new vote created successfully (both this and the above code is exactly same result)
    }
    RESPONSE: {}
}
```

## 7. Search Questions

```ts
{
    NAME: search question
    DETAILS: endpoint to get some questions by search tag
    ENDPOINT: /api/question/search
    HEADER: {
        query: the query to search
        latest: > 0 to get the latest data else to get old data
        low: starting point
        high: ending point NOTE: absolute difference of low and high must be <= 15
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the query field is NULL.
        QUESTION_NOT_FOUND: the question is not found in the database.
        SUCCESS: fethced the question data and returned in the response too.
        FAILURE: failed to fetched the question data
    }
    RESPONSE: {
        data: Array<{
            qid: the id of the question
            uid: user id who added the question
            search: an unique search tag to search the question
            title: the title of the question
            body: main body of the question
            added_at: time when the question was added
            tags: space separated tags
            edited_at: time when the question was edited last time
            total_answers: total number of answers the question has
            comments: total comments the question has
            upvotes: total upvotes the question got
            bookmarks: total number of users bookmarked the question
            verified: is the question verified or not
            hidden: if the question is blocked or hidden
            username: the username who added the question
            fullname: fullname of the user who added the question
            profile_image: profile image of the user who added the question
        }>
    }
}
```

## 8. Advance Search Questions (DEPRECATED ENDPOINT)

```ts
{
    NAME: advance question search
    DETAILS: endpoint to search questions in advance way
    ENDPOINT: /api/question/searchadv
    HEADER: {
        query: the query to search
        latest: > 0 to get the latest data else to get old data
        low: starting point
        high: ending point NOTE: absolute difference of low and high must be <= 15
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the query field is NULL.
        QUESTION_NOT_FOUND: the question is not found in the database.
        SUCCESS: fethced the question data and returned in the response too.
        FAILURE: failed to fetched the question data
    }
    RESPONSE: {
        data: {
            qid: the id of the question
            uid: user id who added the question
            search: an unique search tag to search the question
            title: the title of the question
            body: main body of the question
            added_at: time when the question was added
            tags: space separated tags
            edited_at: time when the question was edited last time
            total_answers: total number of answers the question has
            comments: total comments the question has
            upvotes: total upvotes the question got
            bookmarks: total number of users bookmarked the question
            verified: is the question verified or not
            hidden: if the question is blocked or hidden
        }
    }
}
```

## 9. Get Question by qid/search tag

```ts
{
    NAME: get question by search tag
    DETAILS: get any question data by its search tag or id
    ENDPOINT: /api/question/getbyid
    HEADER: {
        id: search tag of the question or the id of the question
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the id field is NULL.
        FAILURE: failed to fetched the question data
        SUCCESS: the question data is returned in the response
        QUESTION_NOT_FOUND: the question is not found in the database
    }
    RESPONSE: {
        data: {
            qid: the id of the question
            uid: user id who added the question
            search: an unique search tag to search the question
            title: the title of the question
            body: main body of the question
            added_at: time when the question was added
            tags: space separated tags
            edited_at: time when the question was edited last time
            total_answers: total number of answers the question has
            comments: total comments the question has
            upvotes: total upvotes the question got
            bookmarks: total number of users bookmarked the question
            verified: is the question verified or not
            hidden: if the question is blocked or hidden
            username: the username who added the question
            fullname: fullname of the user who added the question
            profile_image: profile image of the user who added the question
        }
    }
}
```

## 10. Get Question By uid

```ts
{
    NAME: get question by uid
    DETAILS: get question of particular user
    ENDPOINT: /api/question/getbyuid
    HEADER: {
        uid: id of the user
        latest: > 0 to get the latest data else to get old data
        low: starting point
        high: ending point NOTE: absolute difference of low and high must be <= 15
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the id field is NULL.
        FAILURE: failed to fetched the question data
        SUCCESS: the question data is returned in the response
        QUESTION_NOT_FOUND: the question is not found in the database
    }
    RESPONSE: {
        data: Array<{
            qid: the id of the question
            uid: user id who added the question
            search: an unique search tag to search the question
            title: the title of the question
            body: main body of the question
            added_at: time when the question was added
            tags: space separated tags
            edited_at: time when the question was edited last time
            total_answers: total number of answers the question has
            comments: total comments the question has
            upvotes: total upvotes the question got
            bookmarks: total number of users bookmarked the question
            verified: is the question verified or not
            hidden: if the question is blocked or hidden
        }>
    }
}
```

## 11. Add New Answer For Question

```ts
{
    NAME: Add a new answer to the question
    DETAILS: endpoint to add new answer to any question in the database
    ENDPOINT: /api/question/answer/add
    HEADER: {
        qid: id of the question
        uid: id of the user
        ip: the ip address of the user
        browser: browser the user using
        os: operating system the user using
    }
    BODY: the exact body of the answer
    BODY_TYPE: 'text/plain'
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid/uid/body/ip/browser/os field is NULL.
        FAILURE: Failed to add the answer to the question to the database.
        SUCCESS: successfully added new answer for the question to the database.
    }
    RESPONSE: {
        aid: the search id of the answer
        time: the current time when the answer was added
    }
}
```

## 12. Get Answer by id/search tag

```ts
{
    NAME: get answer data
    DETAILS: endpoint to get a particular answer data of a particular question
    ENDPOINT: /api/question/answer/getbyid
    HEADER: {
        id: search tag or the aid of answer
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the id field is NULL.
        ANSWER_NOT_FOUND: the search tag is not valid
        FAILURE: Failed to fetch the answer
        SUCCESS: successfully fetched the answer
    }
    RESPONSE: {
        data: {
            aid: id of the answer
            qid: the question id
            uid: user id who added the answer
            search: an unique search tag to search the answer
            body: the main body of the answer
            added_at: time when the answer was added
            edited_at: time when the answer was edited last time
            comments: total number of comments the answer has
            upvotes: total upvotes the answer has
            verified: if the answer if verified or not
            hidden: if the answer is blocked or not
            username: the username who added the answer
            fullname: fullname of the user who added the answer
            profile_image: profile image of the user who added the answer
        }
    }
}
```

## 13. Add Comment To Answer

```ts
{
    NAME: Add a new comment to the answer
    DETAILS: endpoint to add new comment to any answer in the database
    ENDPOINT: /api/question/answer/addcomment
    HEADER: {
        qid: id of the question
        aid: if of the answer
        uid: if of the user
        comment: the comment
        ip: ip address
        browser: browser name the user using
        os: operating system the user is using
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid/aid/uid/comment/ip/browser/os field is NULL.
        FAILURE: Failed to add the comment to the answer to the database.
        SUCCESS: successfully added the comment for the answer to the database.
    }
    RESPONSE: {}
}
```

## 14. Get Comments Of Answer

```ts
{
    NAME: get comment of answer
    DETAILS: endpoint to fetch comment to any answer in the database
    ENDPOINT: /api/question/answer/getcomment
    HEADER: {
        aid: id of the answer
        low: starting point of the searching
        high: limit of comments wanted. NOTE: the absolute difference between high and low must be <= 15 and both the value (low and high) must be >= 0
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the aid field is NULL.
        DATA_NOT_FOUND: no comments available currently
        SUCCESS: provided the comments in the response
    }
    RESPONSE: {
        data: Array<{
            username: username who added the comment
            fullname: fullname of the user who added comment
            id: id of the comment
            aid: id of the answer
            uid: id of the user
            search: search tag for the comment
            comment: the actual comment
            added_at: time when the comment was added
            edited_at: time when the comment was last edited
            verified: if the comment is verified or not
            hidden: is the comment blocked or not
        }>
    }
}
```

## 15. Vote An Answer

```ts
{
    NAME: Add a vote to any answer
    DETAILS: endpoint to add vote to any answer in the database
    ENDPOINT: /api/question/answer/vote
    HEADER: {
        qid: id of the question
        aid: id of the answer
        uid: id of the user
        vote: vote value that may be upvote=1, novote=0, downvote=-1
        ip: ip address of the user
        browser: browser the user using
        os: operating system the user using
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if any of the qid/uid/comment/ip/browser/os field is NULL.
        FAILURE: Failed to add the vote to the answer
        VOTE_UPDATED_SUCCESSFULLY: successfully added the vote to the answer
        VOTE_CREATED_SUCCESSFULLY: new vote created successfully (both this and the above code is exactly same result)
    }
    RESPONSE: {}
}
```

## 16. Get Latest Questions

```ts
{
    NAME: Get Latest Questions
    DETAILS: endpoint to get list of latest quetsion data
    ENDPOINT: /api/question/latest
    HEADER: {
        low: starting point of the searching
        high: limit of comments wanted. NOTE: the absolute difference between high and low must be <= 15 and both the value (low and high) must be >= 0
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if abs(low-high) > 15
        FAILURE: Failed to fetch the required questions
        SUCCESS: Successfully returned the data
        QUESTION_NOT_FOUND: Questions not found in the db
    }
    RESPONSE: {
        data: Array<{
            qid: the id of the question
            uid: user id who added the question
            search: an unique search tag to search the question
            title: the title of the question
            body: main body of the question
            added_at: time when the question was added
            tags: space separated tags
            edited_at: time when the question was edited last time
            total_answers: total number of answers the question has
            comments: total comments the question has
            upvotes: total upvotes the question got
            bookmarks: total number of users bookmarked the question
            verified: is the question verified or not
            hidden: if the question is blocked or hidden
            username: the username who added the question
            fullname: fullname of the user who added the question
            profile_image: profile image of the user who added the question
        }>
    }
}
```

## 17. Get Un-Answered Question

```ts
{
    NAME: Get Un-Answered Question
    DETAILS: endpoint to get questions data which are not answered yet
    ENDPOINT: /api/question/unanwered
    HEADER: {
        low: starting point of the searching
        high: limit of comments wanted. NOTE: the absolute difference between high and low must be <= 15 and both the value (low and high) must be >= 0
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if abs(low-high) > 15
        FAILURE: Failed to fetch the required questions
        SUCCESS: Successfully returned the data
        QUESTION_NOT_FOUND: Questions not found in the db
    }
    RESPONSE: {
        data: Array<{
            qid: the id of the question
            uid: user id who added the question
            search: an unique search tag to search the question
            title: the title of the question
            body: main body of the question
            added_at: time when the question was added
            tags: space separated tags
            edited_at: time when the question was edited last time
            total_answers: total number of answers the question has
            comments: total comments the question has
            upvotes: total upvotes the question got
            bookmarks: total number of users bookmarked the question
            verified: is the question verified or not
            hidden: if the question is blocked or hidden
            username: the username who added the question
            fullname: fullname of the user who added the question
            profile_image: profile image of the user who added the question
        }>
    }
}
```

# Other User Specific Endpoints:

## Get User Data

```ts
{
    NAME: Get user data for other user
    DETAILS: endpoint to get user data using username or fullname
    ENDPOINT: /api/users/get
    HEADER: {
        username: username or the fullname of any user
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if username field is NULL.
        FAILURE: Failed to fetch the user data
        SUCCESS: user data provided
        USER_NOT_FOUND: the user is not found in the database.
    }
    RESPONSE: {
        data: {
            username: username of the user
            fullname: full name of the user
            profile_image: profile image
            gender: gender
            created_on: account created on or joined on
            last_login_on: last seen on
            github: github username
            twitter: twitter username
        }
    }
}
```

## Search Users

```ts
{
    NAME: Search users
    DETAILS: endpoint to search users using username or fullname
    ENDPOINT: /api/users/search
    HEADER: {
        query: username or the fullname of any user
        low: the starting point of the data
        high: limit of users wanted. NOTE: the absolute difference between high and low must be <= 15 and both the value (low and high) must be >= 0
    }
    CODES: {
        PROVIDED_INCOMPLETE_DATA: if username field is NULL.
        FAILURE: Failed to fetch the user data
        SUCCESS: users data provided
        USER_NOT_FOUND: the users are not found in the database.
    }
    RESPONSE: {
        data: {
            username: username of the user
            fullname: full name of the user
            profile_image: profile image
            gender: gender
            created_on: account created on or joined on
            last_login_on: last seen on
            github: github username
            twitter: twitter username
        }
    }
}
```
