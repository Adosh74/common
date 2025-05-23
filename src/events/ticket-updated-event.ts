import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
    subject: Subjects.TickerUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    }
}