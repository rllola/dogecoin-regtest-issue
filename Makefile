init:
	npm install exp-net
	wget https://github.com/dogecoin/dogecoin/releases/download/v1.14.2/dogecoin-1.14.2-i686-pc-linux-gnu.tar.gz
	tar -xvzf dogecoin-1.14.2-i686-pc-linux-gnu.tar.gz

start:
	./dogecoin-1.14.2/bin/dogecoind -regtest -datadir=data -rpcuser=lola -rpcpassword=123456 -daemon

generate:
	./dogecoin-1.14.2/bin/dogecoin-cli -rpcuser=lola -rpcpassword=123456 -regtest generate 5

stop:
	./dogecoin-1.14.2/bin/dogecoin-cli -rpcuser=lola -rpcpassword=123456 -regtest stop
