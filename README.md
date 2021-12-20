# Atlas

![actions badge](https://github.com/ATLAS-ohtuprojekti/ATLAS/actions/workflows/node.js.yml/badge.svg)

Helsinki University / Department of Computer Science / Software Engineering Project Course, autumn 2021

Client: Luomus (Finnish Museum of Natural History)

Objective: Develop a new API to serve Atlas data dissemination and publishing

Atlas data refers to the observations collected and stored in connection with the national bird and plant surveys. This project concentrated on the data on the distribution of Finnish bird species, which has been studied in three atlas surveys: the third atlas was conducted in 2006-10, the second one during 1986-89 and the first one 1974-79. The fourth atlas is coming up in 2022.

The API is in this ATLAS repository, whereas [Lintuatlas](https://github.com/ATLAS-ohtuprojekti/Lintuatlas) repository contains a simple front-end example. The project focus has been on developing the API.

## Quick link

[API in Rahti container platform (staging)](https://atlas-staging.rahtiapp.fi)

## Documentation

* [Map Service structure](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/dokumentaatio/mapservice.png)
* [Database structure](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/dokumentaatio/database_diagram.png)
* [JSDoc](https://atlas-ohtuprojekti.github.io/ATLAS/index.html)
* [OpenAPI](https://atlas-staging.rahtiapp.fi/doc/)

## Deployment locally

Clone the ATLAS repository to your machine.

Open the .env.example file at the root of the project and modify it so that it contains the valid Oracle login credentials. Rename to .env.

Initiate VPN connection to the Helsinki University network. This is needed for the Oracle database connection to work.

While at the root of the project install dependencies with `npm install`. For a list of necessary dependencies, see [package.json file](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/package.json). In addition, Oracle Instant Client software is needed and should be downloaded from [here](https://www.oracle.com/database/technologies/instant-client.html).

Run program with `node .\src\main\start.js`. You can now see the available API endpoints in your browser on http://localhost:3000. Stop the program with Ctrl+C.







## Project management files

* [Working Hours](https://docs.google.com/spreadsheets/d/19Y2sjV4hNleklp-nDP_OXDvz_ATXy6dcdp0JDMt3L9Q/edit#gid=1182794126)
* [Product and sprint backlogs](https://docs.google.com/spreadsheets/d/19Y2sjV4hNleklp-nDP_OXDvz_ATXy6dcdp0JDMt3L9Q/edit#gid=1236889651)
* [Definition of Done](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/dokumentaatio/dod.md)

