interface WordStats {
  games: number; // number of games played
  wins: number; // number of games won
  streak: number; // number of games won in a row
  maxStreak: number; // longest streak of wins
  solves: number[]; // number of solves per level
  lastTry: number; // timestamp of last try
  success: boolean; // whether the last try was successful
}

export default WordStats;
