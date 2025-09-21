"use client"

import { useChat} from "@/app/hooks/useChat";
import {useEffect, useRef, useState} from "react";
import { PlayerDTO, Message } from "@/app/types/types";
import PlayerSidebar from "@/app/PlayerSideBar";
import LoginDialog from "./LoginDialog";
import Button from "@mui/material/Button";

export default function Home() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, username, uuid, loggedIn, loggedInPlayers } = useChat(); // call your hook
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const player: PlayerDTO = {
            id: `${uuid}`,
            username: `${username}`,
            gamePoints: 0,
            score: 0
        }

        const msg : Message = {
            player: player,
            message: `${input.trim()}`,
        }

        // Send any JSON object
        sendMessage(msg);

        setInput("");
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loggedIn]);

  return (
      <div style={{ display: "flex", height: "100vh", padding: 20 }}>

          <LoginDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <div style={{ flex: 1, marginRight: 20, float: "right" }}>
          <h1>Chat</h1>

          { loggedIn ? (
              <>
                  <div style={{
                      border: "1px solid #ccc",
                      padding: 10,
                      height: 500,
                      width: 1200,
                      overflowY: "scroll",
                      marginBottom: 10,
                  }}>
                      {messages.map((msg, idx) => (
                          <div key={idx}><strong>{msg.username}:</strong> {msg.message}</div>
                      ))}

                      <div ref={endOfMessagesRef}/>
                  </div>
                  <input
                      type="text"
                      placeholder="Type a message"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      style={{width: 300, marginRight: 10}}
                      maxLength={50}/>
                  <button onClick={handleSend}>Send</button>
              </>
          ): (
              <div>
                  <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Login</Button>
              </div>
          )}
      </div>
          <div style={{ flexGrow: 1}}>
              <PlayerSidebar players={loggedInPlayers}></PlayerSidebar>
          </div>
      </div>
  );
}
