# The Project

v0.1.2

*A simple web application that provides users with an overview of their public IP and triangulated location info, as well as provides a minimal status update system and hosting service for links or web content.*

[Live @Glitch.com](https://delightful-noble-place.glitch.me)

# Overview

The Project is an experimental application in development at Cursebreakers LLC and in closed alpha as of version 0.1.2.

## v0.1.2 Updates:

- Dashboard and profiles:
    - Avatar generator lets users randomly select a pattern.
    - Avatar acts as a sharing button on profile.

- Markdown rendering with markdown-it and new Docs section.
    - Docs *(main index)*
    - Hello World!
    - Spin-up
    - Terms
    - Legal
    - Accessibility

## Architecture & Development:

### User Experience & Application Flows

**Dashboard**

- Status Bar - Where the user controls their account.
    - Avatar, username, link to profile, and status update button
        - Create, select and delete custom statuses to show on public page
    - Current Status - *(Also shown on the public profile)*

- Session - *This information is available from user's device and is not made public by Cursebreakers.*
    - Time - *(Provided by device)*
    - Public IP - *(Determined by access point)*
    - IP Location - *(Based on public IP Address)*
    - Client/User agent - *(User's device and/or browser)*
    - Log-out button

---

**Profiles**
- Status
- Username
- Avatar (share button)
- Docs home button

### Components Overview

#### Main:

- app.js

#### Models:

- dataModel.js
- logModels.js
- userModel.js

#### Views

- layout.pug
- dashboard.pug
- profile.pug
- new_status.pug
- auth.pug
- avatar.pug
- signup.pug
- error.pug
- no_url.pug

#### Controllers
- auth.js
- avatar.js
- dash.js
- mongo.js
- pages.js

#### Routes

- router.js

#### Docs

- README.md
- index.md
- hello.md
- spin-up.md
- terms.md
- legal.md
- accessibility.md


---

# WORKING: 
    
## v0.1.3-v0.1.9

### Future Updates: *(In Progess)*

**Link hosting**
- Live/reactive content!
    - eg: opengraph and scraped/pushed, link metadata
    - Only hosts one link at a time *(archives old links)*.
- Link tree with buttons 
    - Host multiple links!
    - No live content *(buttons w/ metadata only)*.

**Improved intuitive navigation:***
- Anchor logo in footer.
- User directory menu and search function.
- /Docs with info for user support

**User Profiles & Dashboards:**
- Status Menu
    - Dropdown to select exisitng statuses.
    - Create new status messages to post to profile.
    - User avatars
    - Link Hosting


**Patches, Bug-fixes & Security**
- Fixed an authentication function that failed to re-render sign-up form with error messages.
- Uses MondoDB to manage session storage.
- Uses set-value v4.1.0 to patch [Prototype Pollution vulnerability](https://security.snyk.io/package/npm/lodash/4.17.0) from lodash.set.


---

### DevSec Concerns & Infrastructure
*Checklist for open-beta*

**Sign-up & Log in:**
- Redirects and dash lock-out if not authed
- Validation & Sanitization
- Log auth attempts to mongoDB
- Mongo connects and pings in main App.js file
- Passport & Bcryptjs authenticate users
- Auth rules and routes
- Passport integration
- Endpoint Hardening

**Authentication & Security:**
- Prototype Pollution: connect-mongodb-session vulnerability
    - From lodash.set and archetype dependencies.
    - Implement set-value when neccessary.
    -  Read more @ [Snyk.io](https://security.snyk.io/package/npm/lodash/4.17.0)

- Uses HTTPS/TLS/HSTS

- Session Management:
    - Uses secure and HttpOnly cookies.
    - Set appropriate session timeouts.
    - Ensure session identifiers are random/unpredictable.

- Security Headers: 
    - Content Security Policy (CSP)
    - HTTP Strict Transport Security (HSTS)
    - X-Content-Type-Options

- Input Validation: Validate user input both client and server side
    - Prevents injection attacks, such as SQL injection and XSS (Cross-Site Scripting).
- CSRF Protection: *Cross-Site Request Forgery*
    - Prevents unauthorized actions by validating application requests.
- Secure Password Storage:
    - Hash and salt user passwords before storing them. 

- Rate Limiting and Account Lockouts:
    - Limit number of failed login attempts to prevent brute force attacks on user passwords.

- Two-Factor Authentication (2FA): 
    - Sending one-time code to the user's mobile device or using authenticator apps, u2f, etc.

- Error Handling: 
    - Provide clear error messages to users without disclosing sensitive information.
    - eg: If emails/usernames exist or when a username and/or password is incorrect.

- Third-Party Dependencies: 
    - Keep dependencies and libraries up to date to patch security vulnerabilities promptly.

---

# References & Credits

Author: Esau Gavett @[Cursebreakers LLC](https://cursebreakers.net)

Hosting Provider: [Glitch.com](https://glitch.com)

## Made With:

- [Express](https://expressjs.com/en/starter/generator.html)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en)
- [NPM Dependencies:](https://www.npmjs.com/)
    - aws-crt v1.0.0
    - bcryptjs v2.4.3
    - bufferutil v4.0.1
    - cookie-parser v1.4.4
    - csurf v1.11.0
    - debug v2.6.9
    - dotenv v16.4.5
    - express v4.19.2
    - express-async-handler v1.2.0
    - express-flash v0.0.2
    - express-session v1.17.2
    - express-validator v6.12.0
    - geoip-lite v1.4.10
    - greenlock-express v4.0.3
    - helmet v4.6.0
    - http-errors v1.6.3
    - joi v17.4.0
    - marked v12.0.1
    - mongodb v6.5.0
    - mongoose v8.3.1
    - connect-mongodb-session v5.0.0
    - morgan v1.9.1
    - passport v0.7.x
    - passport-local v1.x
    - pug v3.x
    - request-ip v3.3.0
    - text-encoding v0.7.0
    - url-parse v1.5.10
    - utf-8-validate v5.0.2
    - winston v3.3.3
    - set-value v4.1.0