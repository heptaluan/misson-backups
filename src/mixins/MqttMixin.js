import { PahoMQTT } from './mqtt'

export const MqttMixin = {
  data() {
    return {
      ip: `${window.location.hostname}`,
      port: 61614,
      clientId:
        'mqttjs_' +
        Math.random()
          .toString(16)
          .substr(2, 8),
      mqttData: {}
    }
  },
  mounted() {
    const client = new PahoMQTT.Client(this.ip, this.port, this.clientId)

    client.onConnectionLost = responseObject => {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
      }
    }
    client.onMessageArrived = message => {
      this.mqttData = JSON.parse(message.payloadString)
    }

    client.connect({
      onSuccess: () => {
        // client.subscribe(`device_data_${gateway}`)
        // client.subscribe(`card_data_${gateway}`)
        const message = new PahoMQTT.Message('Hello')
        message.destinationName = 'World'
        client.send(message)
      }
    })
  }
}
