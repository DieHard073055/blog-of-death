# Blog of Death #

## Development Installation Requirements ##

NPM
```
npm install
```


MongoDB
```
npm install mongodb
```

nodemon
```
npm install nodemon
```
*Should anything happen:*

Kerberos -- make sure dependencies are met
```
npm install kerberos
```

## Instructions ##
Make sure to run the MongoDB server first before starting the application.  Stop *mongod service* first if there is an issue starting it.

MongoDB can be started using the following command on the project root using the port 27017. The database directory is the db directory

```
$sudo mongod --port 27017 --dbpath=./data
```

In order to get this server started, you must do an npm install in the project root.
To start the server run the following command

```
$ DEBUG=testport:* npm start
```

For Windows
You need to install MongoDB by following this video:

```
https://www.youtube.com/watch?v=sBdaRlgb4N8&feature=youtu.be&t=120
```
