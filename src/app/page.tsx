"use client"

import { useChat} from "@/app/hooks/useChat";
import {useEffect, useRef, useState} from "react";
import { PlayerDTO, Message } from "@/app/types/types";
import PlayerSidebar from "@/app/PlayerSideBar";
import {LoginForm} from "@/app/atoms/LoginForm";
import { Box, IconButton, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";

export default function Home() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, username, uuid, loggedIn, loggedInPlayers } = useChat(); // call your hook
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

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
      <div className="background">
          { loggedIn ? (
              <><Box
                  sx={{
                      display: "flex",
                      justifyContent: "center", // horizontally center
                      alignItems: "center", // vertically center
                      height: "80vh",
                      backgroundColor: "#f0f2f5",
                      borderRadius: 5,
                      p: 2,
                  }}
              >
                  {/* Chat Window */}
                  <Box
                      sx={{
                          flexDirection: "column",
                          gap: 2,
                          width: 800, // fixed width
                          height: 500, // fixed height
                          display: "flex",
                      }}
                  >
                      <Typography variant="h4" sx={{mb: 1, textAlign: "center"}}>
                          Chat Room
                      </Typography>

                      <Paper
                          elevation={3}
                          sx={{
                              flex: 1,
                              p: 2,
                              display: "flex",
                              flexDirection: "column",
                              overflowY: "auto",
                              overflowX: "auto", // horizontal scroll for long messages
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              minWidth: 0,
                          }}
                      >
                          <List sx={{width: "100%", minWidth: 0}}>
                              {messages.map((msg, idx) => (
                                  <ListItem key={idx} alignItems="flex-start">
                                      <ListItemText
                                          primary={<Typography
                                              variant="body1"
                                              color="text.primary"
                                              sx={{
                                                  whiteSpace: "nowrap", // no wrapping
                                              }}
                                          >
                                              {msg.username}: {msg.message}
                                          </Typography>}/>
                                  </ListItem>
                              ))}
                          </List>
                          <div ref={endOfMessagesRef}/>
                      </Paper>

                      {/* Input Area */}
                      <Box sx={{display: "flex", gap: 1}}>
                          <TextField
                              fullWidth
                              placeholder="Type a message..."
                              variant="outlined"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSend()}
                              inputProps={{maxLength: 64}}/>
                          <IconButton
                              color="primary"
                              size="large"
                              onClick={handleSend}
                              sx={{
                                  bgcolor: "primary.main",
                                  "&:hover": {bgcolor: "primary.dark"},
                                  color: "#fff",
                              }}
                          >
                              <SendIcon/>
                          </IconButton>
                      </Box>
                  </Box>
              </Box>
                  <div>
                      <PlayerSidebar players={loggedInPlayers}></PlayerSidebar>
                  </div>
              </>
          ):(<LoginForm></LoginForm>)}
      </div>
  );
}
