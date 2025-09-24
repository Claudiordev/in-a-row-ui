import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {useChat} from "@/app/hooks/useChat";
import {afterWrite} from "@popperjs/core";
import {TextField} from "@mui/material";

export type LoginDialogProps = {
    open: boolean;
    onClose: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginDialog(props: LoginDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { setUsername, setUuid, username, setLoggedIn } = useChat();


    const handleLogin = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/players/login?username=${encodeURIComponent(username)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const data = await res.json();
            setUuid(data.id);

            setLoggedIn(true);

            props.onClose();
        } catch (err) {
            console.log("Login failed:",err);
        }
    }

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"In A Row"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        What should be your name?
                    </DialogContentText>
                        <TextField
                            type="text"
                            placeholder="Enter your username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            variant="outlined"
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogin} autoFocus>
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}