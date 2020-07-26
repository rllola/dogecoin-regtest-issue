# Dogecoin Regtest issue

Related to https://github.com/dogecoin/dogecoin/issues/1606

## Run

Terminal 1
```
$ make init
$ make start
```

Terminal 2
```
$ node src/index.js
```
You should have connect to your regtest dogecoin node

Terminal 1
```
$ make generate
```
You might want to do that several time and check on Terminal 2 that you have 5 inv message received each time you call it.

Terminal 1
```
$ make stop
```
To stop dogecoind