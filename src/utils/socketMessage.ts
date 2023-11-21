import {Client} from "@stomp/stompjs";
import {SocketMessage, SocketType} from "../types.ts";

export const stompClient = new Client({
    brokerURL: 'ws://localhost/websocket'
});

stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (greeting) => {
        console.log(JSON.parse(greeting.body).content);
    });
};

stompClient.onWebSocketError = (error: any) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

stompClient.activate()

export function subscribeToChannel(room: string, callback: (arg0: SocketMessage) => void) {
    console.log("subscribed to " + room + "!");

    stompClient.subscribe(`/channel/${room}`, (message) => callback(JSON.parse(message.body)));
}

export function joinChannel(channelId: number) {
    stompClient.publish({
        destination: `/app/channel/${channelId}`,
        body: JSON.stringify({content: "new message", type: SocketType.JOIN} as SocketMessage)
    });
}

export function sendToChannel(channelId: number) {
    stompClient.publish({
        destination: `/app/channel/${channelId}`,
        body: JSON.stringify({content: "new message", type: SocketType.CHAT} as SocketMessage)
    });
}

export function leaveChannel(channelId: number) {
    stompClient.publish({
        destination: `/app/channel/${channelId}`,
        body: JSON.stringify({content: "new message", type: SocketType.LEAVE} as SocketMessage)
    });
}

