import * as React from 'react';
import {Box, Paper, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useChat} from "@/app/hooks/useChat";

export function LoginForm() {
    const {username, setUsername, setUuid, setLoggedIn} = useChat();

    const login = async ()=> {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/players/login?username=${encodeURIComponent(username)}`,
                {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            setUuid(data.id);
            setLoggedIn(true);
        } catch (err) {
            console.log("Login failed:",err);
        }
    }

    return (
    <Box
        sx={{
            height: "30vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
        }}
    >
        <Paper
            elevation={3}
            sx={{
                padding: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 300,
            }}
        >
            {/* Logo / Title */}
            <Typography variant="h5" sx={{ marginBottom: 3 }}>
                In A Row
            </Typography>

            {/* Username Input */}
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2 }}
            />

            {/* Login Button */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={()=>login()}
            >
                Log in
            </Button>
        </Paper>
    </Box>
    );
}