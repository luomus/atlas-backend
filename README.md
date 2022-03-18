# Atlas

![actions badge](https://github.com/ATLAS-ohtuprojekti/ATLAS/actions/workflows/node.js.yml/badge.svg)

Atlas data refers to the observations collected and stored in connection with the national bird and plant surveys. This project concentrated on the data on the distribution of Finnish bird species, which has been studied in three atlas surveys: the third atlas was conducted in 2006-10, the second one during 1986-89 and the first one 1974-79. The fourth atlas has begun in 2022.

This repostory contains only the backend API responsible for storing old atlas data and the grids, and retrieving the data for currently ongoing 4th atlas from laji.fi:s API.

## Quick link

[API in Rahti container platform (staging)](https://atlas-api-dev.rahtiapp.fi)
[API in Rahti container platform (production)](https://atlas-api.rahtiapp.fi)

## Documentation

<!--* [Map Service structure](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/dokumentaatio/mapservice.png)
* [Database structure](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/dokumentaatio/database_diagram.png)
* [JSDoc](https://atlas-ohtuprojekti.github.io/ATLAS/index.html)-->
* [OpenAPI (staging)](https://atlas-api-dev.rahtiapp.fi/doc/)
* [OpenAPI (production)](https://atlas-api.rahtiapp.fi/doc/)

## Deployment locally

Clone the ATLAS repository to your machine.

Open the .env.example file at the root of the project and modify it so that it contains the valid Oracle login credentials. Rename to .env.

Initiate VPN connection to the Helsinki University network. This is needed for the Oracle database connection to work.

While at the root of the project install dependencies with `npm install`. For a list of necessary dependencies, see [package.json file](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/package.json). In addition, Oracle Instant Client software is needed and should be downloaded from [here](https://www.oracle.com/database/technologies/instant-client.html).

Run program with `node .\src\main\start.js`. You can now see the available API endpoints in your browser on http://localhost:3000. Stop the program with Ctrl+C.

## Deployment of new versions to Rahti

The repository has webhooks set up that trigger automatic builds on Rahti, simply pushing changes to development- and main-branches will update staging and production versions, respectively.