export type PlayerDTO = {
    id: string;       // UUID represented as a string
    username: string;
    gamePoints: number;
    score: number;
}

export type Message = {
    player: PlayerDTO;
    message: string;
};
