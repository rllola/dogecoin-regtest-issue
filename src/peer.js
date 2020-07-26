var net = require('net')
var EventEmitter = require('events')

const { readU64 } = require('./utils/write64')

var packet = require('./packet')
var version = require('./version')
var inv = require('./inv')

class Peer extends EventEmitter {
  constructor (ip, port) {
    super()

    this.id = -1
    this.socket = new net.Socket()
    this.ip = ip
    this.port = port
    this.servcies
    this.version
    this.agent
    this.verack = false
    this.closed = false
    this.incompleteData
    this.bestHeight = 0
    this.count = 0

    this.socket.on('data', this._onData.bind(this))
  }

  connect () {
    return new Promise ((resolve, reject) => {
      let something = this.socket.connect(this.port, this.ip, (res) => {
        console.log('Connecting to', this.ip)
        var message = version.versionMessage()
        const versionPacket = packet.preparePacket('version', message)

        this.on('verack', function () {
          console.log('Connected !')
          resolve()
        })

        this.on('closed', function () {
          this.closed = true
          reject('closed')
        })

        this.on('error', function () {
          console.log('error while connecting')
          this.closed = true
          reject('error')
        })

        this.on('timeout', function () {
          this.closed = true
          reject('timeout')
        })

        this.socket.write(versionPacket)
      })
    })
  }

  _onData (data) {
    if (this.incompleteData) {
      data = Buffer.concat([this.incompleteData, data], this.incompleteData.length + data.length)
      this.incompleteData = null
    }

    var decodedResponses = []

    // decode packet need to be able to decode several message in one packet
    // https://stackoverflow.com/questions/1010753/missed-socket-message#1010777
    while (data.length > 0) {
      var decodedResponse = packet.decodePacket(data)
      if (!decodedResponse) {
        this.incompleteData = Buffer.allocUnsafe(data.length)
        data.copy(this.incompleteData)
        break
      }
      data = data.slice(decodedResponse.length + 24)
      decodedResponses.push(decodedResponse)
    }

    decodedResponses.forEach((msg) => {
      switch (msg.cmd) {
        case 'version':
          const versionMessage = version.decodeVersionMessage(msg.payload)
          this._handleVersionMessage(versionMessage)
          break
        case 'verack':
          this._handleVerackMessage()
          break
        case 'inv':
          const invMessage = inv.decodeInvMessage(msg.payload)
          this._handleInvMessage(invMessage)
          break
        default:
          console.log("command :",msg.cmd)
      }
    })
  }
  
  _sendVerackMessage () {
    var verackMessage = packet.preparePacket('verack', Buffer.alloc(0))
    this.socket.write(verackMessage)
  }
  
  _handleVersionMessage (versionMessage) {
    this.bestHeight = versionMessage.height
    console.log(versionMessage)
    this._sendVerackMessage()
  }

  _handleVerackMessage () {
    this.verack = true
    this.emit('verack')
  }

  _handleInvMessage (invMessage) {
    console.log(invMessage)
  }

}

module.exports = Peer