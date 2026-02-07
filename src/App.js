// Super Bowl Prop Contest – React + MUI
// Read-only public board with admin edits
// Ready for GitHub Pages deployment

import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

import SuperBowlLogo from "./assets/Super_Bowl_LX_Logo.png";
import PatriotsLogo from "./assets/Patriots.png";
import SeahawksLogo from "./assets/Seahawks.png";

// ---------------- CONFIG ---------------- //

// Admin mode is unlocked via URL: ?admin=1
 // CHANGE THIS

const QUESTIONS = [
  { id: 1, text: "1) Length of National Anthem", options: ["Over 120 sec", "Under 120 sec"] },
  { id: 2, text: "2) Coin Toss", options: ["Heads", "Tails"] },
  { id: 3, text: "3) First Offensive Play", options: ["Run", "Pass"] },
  { id: 4, text: "4) Team to Score First", options: ["Patriots", "Seahawks"] },
  { id: 5, text: "5) First Turnover", options: ["Fumble", "Interception", "Turnover on Downs", "Missed FG"] },
  { id: 6, text: "6) First Accepted Penalty", options: ["Patriots", "Seahawks"] },
  { id: 7, text: "7) First Team to 10 Points", options: ["Patriots", "Seahawks", "Neither"] },
  { id: 8, text: "8) Score in Last 2 Minutes of 1st Half", options: ["Yes", "No"] },
  { id: 9, text: "9) First Halftime Song", options: ["ALAMBRE PuA", "La Mudanza", "Titi Me Pregunto", "NUEVAYoL", "Other"] },
  { id: 10, text: "10) Guest Performer Appears", options: ["Yes", "No"] },
  { id: 11, text: "11) Total Halftime Songs", options: ["Over 11.5", "Under 11.5"] },
  { id: 12, text: "12) Players to Attempt a Pass", options: ["Over 2.5", "Under 2.5"] },
  { id: 13, text: "13) Most Passing Yards", options: ["Drake Maye", "Sam Darnold", "Other"] },
  { id: 14, text: "14) Most Rushing Yards", options: ["Rhamondre Stevenson", "Kenneth Walker III", "Other"] },
  { id: 15, text: "15) Most Receiving Yards", options: ["Stephon Diggs", "Hunter Henry", "JSN", "Cooper Kupp", "Other"] },
  { id: 16, text: "16) Gatorade Color", options: ["Lime/Green/Yellow", "Clear/Water", "Red/Pink", "Blue", "Orange", "Purple"] },
  { id: 17, text: "17) Score in Last 2 Minutes of 4th Qtr", options: ["Yes", "No"] },
  { id: 18, text: "18) Super Bowl Winner", options: ["Patriots", "Seahawks"] },
  { id: 19, text: "19) Total Points O/U 46.5", options: ["Over 46.5", "Under 46.5"] },
  { id: 20, text: "20) Super Bowl MVP", options: ["Drake Maye", "Sam Darnold", "Any Other Player"] },
];

const PLAYERS = [
  { id: "bob", name: "Bob" },
  { id: "tara", name: "Tara" },
  { id: "frank", name: "Frank" },
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  
  const [picks, setPicks] = useState(() => JSON.parse(localStorage.getItem("picks")) || {});
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("answers")) || {});

  useEffect(() => {
    localStorage.setItem("picks", JSON.stringify(picks));
  }, [picks]);

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") {
      setIsAdmin(true);
    }
  }, []);

  const setPick = (playerId, qid, value) => {
    if (!isAdmin) return;
    setPicks(prev => ({ ...prev, [playerId]: { ...prev[playerId], [qid]: value } }));
  };

  const setAnswer = (qid, value) => {
    if (!isAdmin) return;
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };
  const scoreFor = pid => QUESTIONS.reduce((s, q) => s + (pid in picks && q.id in answers && picks[pid]?.[q.id] === answers[q.id] ? 1 : 0), 0);

  // const rankedPlayers = [...PLAYERS].sort((a, b) => scoreFor(b.id) - scoreFor(a.id));
  const rankedPlayers = (() => {
    const sorted = [...PLAYERS]
      .map(p => ({ ...p, score: scoreFor(p.id) }))
      .sort((a, b) => b.score - a.score);

    let lastScore = null;
    let lastRank = 0;


    return sorted.map((p, idx) => {
      const rank = p.score === lastScore ? lastRank : idx + 1;
      lastScore = p.score;
      lastRank = rank;
      return { ...p, rank };
    });
  })();

  return (
    <Container maxWidth="xl" sx={{ py: 0 }}>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4, mb: 4 }}>
        {/* Super Bowl LX Logo (smaller and centered) */}
        {/* Seahawks and Pat Patriot side by side, centered */}
        <Box display="flex" gap={10} alignItems="center" sx={{ mb: 3 }}>
          <Box
            component="img"
            src={SeahawksLogo}
            alt="Seattle Seahawks Logo"
            sx={{ width: { xs: 60, sm: 80, md: 100 } }}
          />
          <Box
            component="img"
            src={SuperBowlLogo}
            alt="Super Bowl LX Logo"
            sx={{ width: { xs: 70, sm: 90, md: 200 }, mb: 3 }}
          />
          <Box
            component="img"
            src={PatriotsLogo}
            alt="Pat Patriot (Retro Patriots Logo)"
            sx={{ width: { xs: 60, sm: 80, md: 100 } }}
          />
        </Box>

        {/* Title centered under logos */}
        {/*<Typography variant="h4" align="center">
          Super Bowl Prop Contest
        </Typography>*/}
      </Box>

      {isAdmin && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>Correct Answers</Typography>
          <Stack spacing={2}>
            {QUESTIONS.map(q => (
              <Select key={q.id} value={answers[q.id] || ""} displayEmpty onChange={e => setAnswer(q.id, e.target.value)}>
                <MenuItem value="">{q.text}</MenuItem>
                {q.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </Select>
            ))}
          </Stack>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Prop</strong></TableCell>
              <TableCell><strong>Correct Answer</strong></TableCell>
              {PLAYERS.map(p => (
                <TableCell key={p.id}>
                  <strong>{p.name}</strong>
                  <Typography variant="caption" display="block">
                    {scoreFor(p.id)} / {QUESTIONS.length}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {QUESTIONS.map(q => (
              <TableRow key={q.id}>
                <TableCell>{q.text}</TableCell>

                {/* Correct Answer Column */}
                <TableCell sx={{ bgcolor: answers[q.id] ? '#e3f2fd' : 'inherit' }}>
                  {isAdmin ? (
                    <Select
                      value={answers[q.id] || ""}
                      displayEmpty
                      size="small"
                      onChange={e => setAnswer(q.id, e.target.value)}
                    >
                      <MenuItem value="">—</MenuItem>
                      {q.options.map(o => (
                        <MenuItem key={o} value={o}>{o}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    answers[q.id] || "—"
                  )}
                </TableCell>

                {/* Player Picks */}
                {PLAYERS.map(p => {
                  const val = picks[p.id]?.[q.id] || "";
                  const isCorrect = answers[q.id] && val === answers[q.id];

                  return (
                    <TableCell
                      key={p.id}
                      sx={{
                        bgcolor: answers[q.id]
                          ? isCorrect
                            ? '#e8f5e9'
                            : val
                            ? '#ffebee'
                            : 'inherit'
                          : 'inherit',
                      }}
                    >
                      {isAdmin ? (
                        <Select
                          value={val}
                          displayEmpty
                          size="small"
                          onChange={e => setPick(p.id, q.id, e.target.value)}
                        >
                          <MenuItem value="">—</MenuItem>
                          {q.options.map(o => (
                            <MenuItem key={o} value={o}>{o}</MenuItem>
                          ))}
                        </Select>
                      ) : (
                        val || "—"
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Leaderboard
        </Typography>

        <List disablePadding>
          {rankedPlayers.map((p, idx) => (
            <ListItem
              key={p.id}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: p.rank === 1 ? "#fff8e1" : "background.paper",
                boxShadow: p.rank === 1 ? 1 : 0,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      p.rank === 1
                        ? "warning.main"
                        : idx === 2
                        ? "grey.400"
                        : idx === 3
                        ? "brown"
                        : "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {p.rank}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={p.name}
                secondary={`${scoreFor(p.id)} / ${QUESTIONS.length} correct`}
              />

              <Chip
                label={`${scoreFor(p.id)}`}
                color={p.rank === 1 ? "warning" : "default"}
                sx={{ fontWeight: "bold" }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>

    </Container>
  );
}
