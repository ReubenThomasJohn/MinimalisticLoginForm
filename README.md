# MinimalisticLoginForm

A simple, minimalist login + registration form built using Node.js, Express, MongoDB and HTML(ejs) + CSS

TODO:

- [x] Add CSS styling and JS to indicate the re-typed password does not match the password in the registration form.
- [x] Fix login, logout and register routes
- [x] Add bcrypt encryption
- [x] Add cookies and sessions to autheticate users using passport.js
- [ ] Add the toast when email ID is already in the system: https://getbootstrap.com/docs/4.3/components/toasts/
- [x] Upon pressing register button, email needs to be sent with a 'confirm email' prompt: Done to validate mail ID input.
- [x] Add Google OAuth2
- [ ] Try adding style like: https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ

## To run:

1. docker build . -t <username>/node-web-app
2. docker run -d -p 3001:3001 -d <username>/node-web-app
3. open up localhost:3001 to view the app
