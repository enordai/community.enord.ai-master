# Frontend  Documentation

## Landing Page

![image-20211122185324372](./demo-images/homepage.png)

# Login/Signup Page

### Login

![image-20211122185806981](./demo-images/loginpage.png)

1. Username: The username can be the email or the username provided during signup.
2. Forgot Password: If you don’t remember your password then click on this link to send a password reset email.
3. Signup: Link to the signup page.

![image-20211122195933164](./demo-images/loginerror.png)

If any error occurs during login then it will be shown as an alert.

### Forgot Password

![image-20211122200258541](./demo-images/verifyemail.png)

To reset your password:

1. Enter your email address and click on `Send OTP`.
2. You will receive a mail which will contain an OTP.
3. Enter the OTP and your new password and click `Reset`.

### Signup

![image-20211122190049234](./demo-images/signuppage.png)

1. Username: 
2. Email: Email length must be less than 320 and must be valid email format. Temporary emails are also not allowed.
3. Password: Password length must be between 8 and 30 characters and must contain at least 1 uppercase letter 1 lowercase letter and 1 number.
4. Login: Link to the Login page.

## Forum Page

![image-20211122200142041](./demo-images/forumpage.png)

This page is accessible only when you are logged in. It contains all the recent posts. To view any question click on the `View` button next below that question. To ask a question click on `Ask a Question` button.

## Ask a Question Page

![image-20211122200736103](./demo-images/askquestion.png)

This page is accessible only if your email has been verified. To verify your email go to your profile page by clicking on your username in the Navbar.

You can use markdown in the body section of the question.

## Profile Page

![image-20211122201133860](./demo-images/userprofile.png)

In this page you can view your profile and change your personal details. You can also change your password here and verify your email.

## Full Post Page

![image-20211122201133860](./demo-images/fullpost1.png)
![image-20211122201133860](./demo-images/fullpost2.png)

This page shows the full question along with comments and answers. You can bookmark the question, upvote/downvote it , add comments and add a new answer.