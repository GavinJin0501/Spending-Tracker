# Spending Tracker 

## Overview

Many people want to keep track of their daily spendings. However, doing that with pen & paper or regular notes is way too difficult and inconvenient. Therefore, that's where Spending Tracker comes in!

Spending Tracker is a web app that will allow users to keep track of their daliy spendings. Users can register and login. Once they're logged in, they can create or view their (past) spendings, categorized by some default and customized types. For each category of the spendings that they have, they can add, edit, or delete items.


## Data Model

The application will store Users, Categories and Spendings.

* Users: user obj, storing the username, password hash, and the types of spending the user have
    * Users can have multiple categories (via names)
* Categories: category obj, storing the user reference, name of the category, and the 
    * each category can have multiple spendings (by embedding)
* Spendings: spendign obj, storing each single spending including date, money amount, and notes

An Example User:

```javascript
{
    username: "shannonshopper",
    hash: , // a password hash
    categories: // an array of names of Category documents
}
```

An Example Category with Embedded Spendings:

```javascript
{
    user: // a reference to a User object
    name: "Food",
    spendings: [
        { date: "2022-03-22 15:24:38", amount: 34.2, notes: "my lunch"},
        { date: "2022-03-23 15:24:38", amount: 50.0, notes: "mt dinner"}
    ]
}
```


## [Link to Commented First Draft Schema](db.js) 


## Wireframes

/home - page for showing all shopping catrgories

![category](documentation/category.png)

/home/slug - page for showing specific shopping category

![category](documentation/category-slug.png)

/home/create-category - page for creating a new spending category

![category create](documentation/category-create.png)



## Site map

![site map](documentation/site-map.png)


## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new spending category
4. as a user, I can view all of the spending categories by default or created by myself
5. as a user, I can view all my spendings in either a specific category or in all categories as a whole, with the ability to: select date range, rank them by date or amount
6. as a user, I can add, edit, or delete spendings to an existing category


## Research Topics

* (3 points) Integrate user authentication
    * User authentication is the process of determining whehter or not users are who they claim to be
    * By using user authentication, the communication between client and server will be more secure, thus clients' privacy being protected
    * I'm going to be using passport for user authentication
* (3 points) Deploy the applicaiton using Heroku + Mongodb Altas
    * Deployment is to keep running an app on a server so that it can be used by more users
    * By deploying with Heroku and Mongodb Altas, this project will survive after the course unlike the courant server, and I may keep working on it
    * I'm going to be using Heroku and Mongodb Altas
* (2 points) Using Bootstrap CSS
    * CSS is a crucial part for a website design
    * Bootstrap CSS is lightweight and customized, making the elements on my websites more organizable
    * I'm going to be using Bootstrap
* (1 point) External API -- Google Chart API
    * API -- application programming interface, is a connection between computers or computer programs.
    * By using API, I can achieve my goals (in this case, drawing charts) more easily and more conconvenient.
    * I'm going to be using Google Chart api to visualize some information on my website.
* (1 point) External API -- OpenWeather API
    * API -- application programming interface, is a connection between computers or computer programs.
    * By using API, I can achieve my goals (in this case, showing today's weather) more easily and more conconvenient.
    * I'm going to be using OpenWeather api to display today's the weather on my website.

10 points total out of 8 required points


## [Link to Initial Main Project File](app.js) 


## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs)
2. [heroku deploy docs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
3. [bootstrap docs](https://getbootstrap.com/docs/3.4/css/)
4. [google chart developers docs](https://developers.google.com/chart)
5. [OpenWeather docs](https://openweathermap.org/current)

