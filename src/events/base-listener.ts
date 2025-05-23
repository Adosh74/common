import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

abstract class Listener <T extends Event> {
    abstract subject: T['subject'];
    abstract groupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    private client: Stan;
    protected ackWait: number = 5 * 1000;
    
    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.groupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.groupName,
            this.subscriptionOptions()
        )

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.groupName}`);  

            const parsedMessage = this.parseMessage(msg)
            this.onMessage(parsedMessage, msg)
        })
    }

    parseMessage(msg: Message) {
            const data = msg.getData()
            return typeof data === 'string' 
                ? JSON.parse(data)
                : JSON.parse(data.toString('utf8'))
    }

}

export { Listener }