import amqp from 'amqplib';

export class Publisher {
  private channel: amqp.Channel | null = null;
  private connection: amqp.Connection | null = null;

  constructor(private queue: string) {}

  async connect() {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect('amqp://localhost');
      }
      if (!this.channel) {
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queue, { durable: true });
      }
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }

  async publish(message: string) {
    try {
      
      await this.connect();
      if (this.channel) {
        this.channel.sendToQueue(this.queue, Buffer.from(message), { persistent: true });
        console.log(`Message sent to queue ${this.queue}: ${message}`);
      } else {
        console.error('RabbitMQ channel is not initialized');
      }
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }

  async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}
