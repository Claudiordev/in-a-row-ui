"use client"

import {createContext, useContext, useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { PlayerDTO, Message } from "@/app/types/types";

type MessagesType = {
    messages: { username: string; message: string }[];
    sendMessage: (data: Message) => void;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username: string
    uuid: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setUuid: React.Dispatch<React.SetStateAction<string>>;
    loggedInPlayers: PlayerDTO[];
    setLoggedInPlayers: React.Dispatch<React.SetStateAction<PlayerDTO[]>>;
}

const MessagesContext = createContext<MessagesType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode}> = ({children}) => {
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const stompClientRef = useRef<Client | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [uuid, setUuid] = useState("");
    const [loggedInPlayers, setLoggedInPlayers] = useState<PlayerDTO[]>([]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/websocket");
        const stompClient = new Client({
            webSocketFactory: () => socket as never,
            debug: (str) => console.log("[STOMP]", str),
        });

        stompClient.onConnect = () => {
            console.log("Connected to WebSocket server");

            stompClient.subscribe("/topic/lobby", (msg) => {
                const data = JSON.parse(msg.body);
                setMessages((prev) => [...prev, {
                    username: data.player.username,
                    message: data.message
                }]);
            });
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {

                const res = await fetch(`http://localhost:8080/api/v1/players/loggedIn`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });

                if (!res.ok) {
                    throw new Error(res.statusText);
                }

                const players = await res.json();
                setLoggedInPlayers(players);
            } catch (err) {
                console.error(err)
            }

        },5000)

        return () => clearInterval(interval);
    }, [loggedInPlayers]);
    
    const sendMessage = (data: Message) => {
        if (!stompClientRef.current || !stompClientRef.current.connected) return;

        stompClientRef.current.publish({
            destination: "/app/chat", // matches your Spring @MessageMapping("/chat")
            body: JSON.stringify(data),
        });
    };

    return (
        <MessagesContext value={{
            messages,
            sendMessage,
            loggedIn,
            setLoggedIn,
            username,
            uuid,
            setUsername,
            setUuid,
            loggedInPlayers,
            setLoggedInPlayers
        }}>
            {children}
        </MessagesContext>
    );
};

export const useChat = () => {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error("useChat must be used inside MessageProvider");
    }

    return context;
}