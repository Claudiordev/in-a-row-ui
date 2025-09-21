"use client";

import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {PlayerDTO} from "@/app/types/types";
import {Avatar, ListItemAvatar} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';

interface PlayerSidebarProps {
    players: PlayerDTO[];
    width?: number;
}

const PlayerSidebar: React.FC<PlayerSidebarProps> = ({ players, width = 240 }) => {
    return (
        <Drawer
            anchor="right"
            variant="permanent"
            sx={{
                width,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" },
            }}
        >
            <Toolbar>
                <Typography variant="h6">Players</Typography>
            </Toolbar>
            <List>
                {players.map((player) => (
                    <React.Fragment key={player.id}>
                        <ListItem key={player.id}>
                        <ListItemAvatar>
                            <Avatar>
                                <ImageIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={player.username}
                            secondary={`Score: ${player.score}, Points: ${player.gamePoints}`}/>
                    </ListItem><Divider/>
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );
};

export default PlayerSidebar;