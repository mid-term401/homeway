
# Project Name: *Homeway*
- [Heroku Deployment Link]()
// Google APi key: AIzaSyC5H2DJ2O_Qzq7SLNIRx7-QB4R5yqwyAwo
## Our team:
* Boshra Jaber 
* Haneen Khasawneh
* Abdalrhman Albdahat
* Samer Alnajjar
* Ibrahim Aljabr

## Tools Used
- Microsoft Visual Studio
  - Node.js
  - Express

## API used:
[Country's name API](https://restcountries.eu/)

## Libraries and Packages: 
[Node Mailer](https://nodemailer.com/about/)

## Getting Started
1. Clone this repository to your local machine `git clone https://github.com/mid-term401/homeway.git`
2. Once downloaded, you can either use the dotnet CLI utilities or Visual Studio 2017 (or greater) to build the web application.
3. cd homeway
4. Install all dependencies needed for the project. `npm i`, `npm start`

## User Stories:
1.	As a host, I want the ability to register on this site and ask for certain services.
 - Feature Tasks:
    * Host can sign up/ sign in/ sign up with Google
    * Host can add one or many services.
    * Host can edit and delete a service.
    * Host can accept or decline a volunteer
 - Acceptance Tests:
    * Basic Auth
    * Bearer Auth
    * ACL/ only authorized users can access hosts information.
2.	As a volunteer, I want the ability to search for working opportunity in different fields in different countries.
  - Feature Tasks:
    * Volunteer can sign up/ sign in/ sign up with Google
    * Volunteer can search for opportunities in a specific field and country.
    * Volunteer can view the host profile.
    * Volunteer can apply for a service.
	- Acceptance Tests:
    * Basic Auth
    * Bearer Auth
    * ACL/ only authorized users can access volunteer information.
3.	As a host, I want the ability to communicate with the volunteer before accepting the request for the services through live chat or email.
  - Feature Tasks:
    * Host can send emails to the volunteer and ask for further info.
    * Host and volunteer can have a live chat.
  - Acceptance Tests:
    * E-mail test (nodemailer)
    * Live Chat test (socket io)
4.	As a user, I want my data to be safe and secure and only shared after my consent.
  - Feature Tasks:
    * All data is saved in the database.
    * Access control is applied
  - Acceptance Tests:
    * ACL test
5.	As a volunteer, I want the ability to rate my host and see other’s feedback.
  - Feature Tasks:
    * Display feedbacks on the home page in the feedback section.
    * A form to write a feedback
    * The ability to rate a user
  - Acceptance Tests:
    * Feedback is working
    * Rating is saved and displayed properly
6.	As a user, I want the ability to post in the websites journal. (stretch goal)
7.	As an admin, I want the ability to do CRUD to all users (stretch goal)
8.	As a user, I can ask for help from the technical support (admins) / Socket.io

## Domain Modeling:

![Modeling](https://github.com/mid-term401/homeway/blob/main/assets/Modeling.png)

## Database Relationships:

![Database](https://github.com/mid-term401/homeway/blob/main/assets/DatabaseStructure.png)

## Wire frames:

### Home Page

![image1](assets/1.png)

### Sign in Page

![image1](assets/2.png)

### Search Page

![image1](assets/3.png)

### Profile Page

![image1](assets/4.png)





