# Pushing a new image to Rahti



### Create an image
Build the image locally at the root of the project with
`docker build . -t image_name`

Test the image locally with
`docker run image_name`


### Terminal login to Rahti
For the first time:  

Go to [Rahti web console](https://rahti.csc.fi:8443/login) to retrieve the login command (top right corner of the page)
![pic](https://github.com/ATLAS-ohtuprojekti/ATLAS/blob/main/rahti.png?raw=true)

In terminal paste the login command:
`oc login https://rahti.csc.fi:8443 --token=xxxxx`


After the first time:
```
`oc login`

own_username
own_password
```

### Terminal login to Docker

Get your token with
`oc whoami -t`

Copy the token.

Login to docker with:
`docker login -u own_username -p token docker-registry.rahti.csc.fi`




### Pushing the image
```
docker tag image_name docker-registry.rahti.csc.fi/atlas-dev/atlas:latest
docker push docker-registry.rahti.csc.fi/atlas-dev/atlas:latest
