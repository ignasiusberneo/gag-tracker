"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [weather, setWeather] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const userId = "neo0519";
    const ws = new WebSocket(
      `wss://websocket.joshlei.com/growagarden?user_id=${encodeURIComponent(
        userId
      )}`
    );

    const playSound = () => {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    };

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed Data:", data);

        if (data.seed_stock) {
          setStocks(data.seed_stock);
          const specialStock = [
            "beanstalk",
            "ember_lily",
            "sugar_apple",
            "burning_bud",
            "giant_pinecone",
          ];
          const filteredStocks = data.seed_stock.filter((stock) =>
            specialStock.includes(data.seed_stock.item_id)
          );
          if (filteredStocks.length > 0) {
            playSound();
          }
        }
        if (data.weather) {
          const activeWeather = data.weather.filter(
            (weather) => weather.active
          );
          if (activeWeather.length > 0) {
            playSound();
            setWeather(activeWeather[0].weather_name);
          } else {
            setWeather("Clear");
          }
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [enabled]);

  return (
    <Box mx={10} my={5}>
      {!enabled && (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
          my={5}
        >
          <Button onClick={() => setEnabled(true)} variant="contained">
            Enable Notification
          </Button>
        </Box>
      )}
      {enabled && (
        <>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={2}
            my={5}
          >
            <Typography variant="h5">Weather</Typography>
            <Typography variant="h7">{weather}</Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={2}
            border={"1px solid white"}
            borderRadius={4}
            p={2}
          >
            <Typography variant="h5">Available Seeds</Typography>
            <Grid container spacing={5} justifyContent={"center"}>
              {stocks.map((stock) => (
                <Grid
                  size={2}
                  key={stock.item_id}
                  style={{ textAlign: "center" }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img
                      src={stock.icon}
                      alt={stock.display_name}
                      style={{ width: 60, height: 60 }}
                    />
                    <Typography variant="subtitle2" align="center">
                      {stock.display_name}
                    </Typography>
                    <Typography variant="body2" align="center">
                      x{stock.quantity}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}
