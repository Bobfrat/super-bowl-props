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
  { id: 1, text: "National Anthem (O/U 120s)", options: ["Over", "Under"] },
  { id: 2, text: "Coin Toss", options: ["Heads", "Tails"] },
  { id: 3, text: "First Offensive Play", options: ["Run", "Pass"] },
  { id: 4, text: "Team to Score 1st", options: ["Pats", "Hawks"] },
  { id: 5, text: "First Turnover", options: ["Fumble", "Int", "Downs", "Missed FG"] },
  { id: 6, text: "First Accepted Penalty", options: ["Pats", "Hawks"] },
  { id: 7, text: "First Team to 10 Pts", options: ["Pats", "Hawks", "Neither"] },
  { id: 8, text: "Score in Last 2 Mins of 1st Half", options: ["Yes", "No"] },
  { id: 9, text: "First Halftime Song", options: ["ALAMBRE PuA", "La Mudanza", "Titi Me Pregunto", "NUEVAYoL", "Other"] },
  { id: 10, text: "Guest Performer Appears", options: ["Yes", "No"] },
  { id: 11, text: "Halftime Songs (O/U 11.5)", options: ["Over", "Under"] },
  { id: 12, text: "Players to Attempt a Pass (O/U 2.5)", options: ["Over", "Under"] },
  { id: 13, text: "Most Pass Yds", options: ["Maye", "Darnold", "Other"] },
  { id: 14, text: "Most Rush Yds", options: ["Stevenson", "Walker", "Other"] },
  { id: 15, text: "Most Rec Yds", options: ["Diggs", "Henry", "JSN", "Kupp", "Other"] },
  { id: 16, text: "Gatorade Color", options: ["Lime/Green/Yellow", "Clear/Water", "Red/Pink", "Blue", "Orange", "Purple"] },
  { id: 17, text: "Score in Last 2 Minutes of 4th", options: ["Yes", "No"] },
  { id: 18, text: "Winner", options: ["Pats", "Hawks"] },
  { id: 19, text: "Total Points (O/U 46.4)", options: ["Over", "Under"] },
  { id: 20, text: "MVP", options: ["Maye", "Darnold", "Other"] },
];

const PLAYERS = [
  { id: "bob", name: "Bob" },
  { id: "tara", name: "Tara" },
  { id: "frank", name: "Frank" },
  { id: "crystal", name: "Crystal" },
  { id: "mike", name: "Mike" },
  { id: "monica", name: "Monica" },
  { id: "adam", name: "Adam" },
];

const DEFAULT_PICKS = {
  // bob: {
  //   1: "Over 120 sec",
  //   2: "Heads",
  //   3: "Pass",
  //   // ...
  // },
  // tara: {
  //   1: "Under 120 sec",
  //   2: "Tails",
  //   // ...
  // }
};

const DEFAULT_ANSWERS = {
  // 1: "Over 120 sec",
  // 2: "Heads",
  // ...
};


export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const [picks, setPicks] = useState(() => JSON.parse(localStorage.getItem("picks")) || DEFAULT_PICKS);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("answers")) || DEFAULT_ANSWERS);


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

      <TableContainer component={Paper} sx={{ mb: 4, maxHeight: '70vh', overflowX: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120, position: 'sticky', left: 0, zIndex: 3, backgroundColor: 'background.paper', borderRight: '1px solid #e0e0e0' }}><strong>Prop</strong></TableCell>
              <TableCell sx={{ minWidth: 60, borderRight: '1px solid #e0e0e0' }}><strong>Correct Answer</strong></TableCell>
              {PLAYERS.map(p => (
                <TableCell key={p.id} sx={{ borderRight: '1px solid #f0f0f0' }}>
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
                <TableCell sx={{ position: 'sticky', left: 0, zIndex: 2, backgroundColor: 'background.paper', borderRight: '1px solid #f0f0f0' }}>{q.text}</TableCell>

                {/* Correct Answer Column */}
                <TableCell sx={{ borderRight: '1px solid #f0f0f0', bgcolor: answers[q.id] ? '#e3f2fd' : 'inherit' }}>
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
                        borderRight: '1px solid #f0f0f0',
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
                        : p.rank === 2
                        ? "grey.400"
                        : p.rank === 3
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
