import {Client} from "@stomp/stompjs";
import {SocketMessage, SocketType} from "../types.ts";

const stompClient = new Client({
    brokerURL: "ws://localhost/websocket"
});

stompClient.onConnect = (frame) => {
    console.log("Connected: " + frame);
    stompClient.subscribe("/topic/greetings", (greeting) => {
        console.log(JSON.parse(greeting.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error("Error with websocket", error);
};

stompClient.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
};

async function connect(): Promise<void> {
    if (!stompClient.connected) {
        return new Promise((resolve) => {
            stompClient.activate();
            stompClient.onConnect = () => {
                resolve();
            };
        });
    }
}

export async function subscribeTo(destination: string, callback: (arg0: SocketMessage) => void) {
    await connect();
    stompClient.subscribe(`/${destination}`, (message) => callback(JSON.parse(message.body)));
    console.log("Subscribed to " + destination + "!");
}

export function unsubscribeTo(destination: string) {
    stompClient.unsubscribe(destination);
    console.log("Unsubscribed to " + destination + "!");
}

export async function sendTo(destination: string, type: SocketType, owner: { id: number, name: string }) {
    await connect();
    stompClient.publish({
        destination: `/app/${destination}`,
        body: JSON.stringify({type, owner} as SocketMessage)
    });
    console.log("Send to " + destination + "!");
}


