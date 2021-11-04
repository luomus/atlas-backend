# Uuden imagen pushaus rahtiin



### Imagen luonti
Buildaa image omalla koneella projektin juurikansiossa
`docker build . -t imagen_nimi`

Kokeile toimiiko image paikallisesti
`docker run imagen_nimi`


### Kirjautuminen rahtiin
Kirjautuminen ensimmäistä kertaa  

Hae rahdista komento, jossa kirjautumistoken sivun oikeasta yläkulmasta
![kuva rahdista](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/rahti.png?raw=true)



Terminaalissa:
`oc login https://rahti.csc.fi:8443 --token=rahdista_saatu_token`


Kirjautuminen ensimmäisen kerran jälkeen
```
oc login

oma_tunnus
oma_salasana
```


### Kirjautuminen dockeriin

Hae token
`oc whoami -t`

Terminaaliin tulostuu token

Kirjaudu dockeriin
`docker login -u oma_tunnus -p saatu_token docker-registry.rahti.csc.fi`




### Imagen pushaus
```
docker tag imagen_nimi docker-registry.rahti.csc.fi/atlas-dev/atlas:latest
docker push docker-registry.rahti.csc.fi/atlas-dev/atlas:latest