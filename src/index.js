const Peer = require('./peer')


let peer = new Peer('127.0.0.1', 18444)

peer.connect()
  .then((res) => {
    console.log(res)
  })