import amqp from 'amqplib';

export class Subscriber {
  private channel: amqp.Channel | null = null;
  private connection: amqp.Connection | null = null;

  constructor(private queue: string, private onMessage: (msg: string) => void) {}

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      this.consumeMessages();
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }

  private consumeMessages() {
    if (!this.channel) {
      console.error('RabbitMQ channel is not initialized');
      return;
    }
    this.channel.consume(this.queue, (message) => {
      if (message !== null) {
        const messageContent = message.content.toString();
        console.log(`Message received from queue ${this.queue}: ${messageContent}`);
        this.onMessage(messageContent);
        this.channel?.ack(message);
      }
    }, { noAck: false });
  }

  async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log(`Closed connection for queue ${this.queue}`);
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}
