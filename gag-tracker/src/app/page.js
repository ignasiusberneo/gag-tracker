"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Tabs, Tab, Modal } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [eggStocks, setEggStock] = useState([]);
  const [tools, setTools] = useState([]);
  const [weather, setWeather] = useState([]);
  const [lastSpecialWeatherIds, setLastSpecialWeatherIds] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [userId, setUserId] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const specialWeather = new Set([
    "disco",
    "auroraborealis",
    "beenado",
    "beestorm",
    "beeswarm",
    "heatwave",
    "jandelfloat",
    "jandelzombie",
    "jandelstorm",
    "meteorshower",
    "meteorstrike",
    "solarflare",
    "spacetravel",
    "sungod",
    "thunderstorm",
    "volcano",
    "workingbeeswarm",
    "frost",
    "blackhole",
    "alieninvasion",
    "zenaura",
  ]);

  useEffect(() => {
    const unixMillis = Date.now();
    setUserId(unixMillis.toString());
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let ws;
    let reconnectTimeout;

    const connectWebSocket = () => {
      ws = new WebSocket(
        `wss://websocket.joshlei.com/growagarden?user_id=${encodeURIComponent(
          userId
        )}`
      );

      const playSound = (message = "Rare Item!") => {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });

        toast.info(message, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
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
              "cacao",
              "pepper",
              "mushroom",
              "grape",
            ];
            const filteredStocks = data.seed_stock.filter((stock) =>
              specialStock.includes(stock.item_id)
            );
            if (filteredStocks.length > 0) {
              playSound("🎉 Special Seed(s) Available!");
            }
          }

          if (data.egg_stock) {
            const mergedStock = [];
            const map = new Map();

            for (const item of data.egg_stock) {
              if (map.has(item.item_id)) {
                const existing = map.get(item.item_id);
                existing.quantity += item.quantity;
              } else {
                map.set(item.item_id, { ...item });
              }
            }

            for (const merged of map.values()) {
              mergedStock.push(merged);
            }

            setEggStock(mergedStock);

            const specialEggs = ["mythical_egg", "paradise_egg", "bug_egg"];
            const filteredEggs = mergedStock.filter((egg) =>
              specialEggs.includes(egg.item_id)
            );
            if (filteredEggs.length > 0) {
              const eggNames = filteredEggs
                .map((egg) => egg.display_name)
                .join(", ");
              playSound(`🥚 Special Egg(s): ${eggNames}`);
            }
          }

          if (data.gear_stock) {
            setTools(data.gear_stock);
            const specialTools = ["godly_sprinkler", "master_sprinkler"];
            const filteredTools = data.gear_stock.filter((tool) =>
              specialTools.includes(tool.item_id)
            );
            if (filteredTools.length > 0) {
              playSound("🛠️ Rare Gear(s) Available!");
            }
          }

          if (data.weather) {
            const newWeathers = [...weather];
            const newlyActivatedSpecials = [];

            data.weather.forEach((weatherUpdate) => {
              const index = newWeathers.findIndex(
                (w) => w.weather_id === weatherUpdate.weather_id
              );

              if (weatherUpdate.active) {
                if (index === -1) {
                  newWeathers.push(weatherUpdate);
                  if (specialWeather.has(weatherUpdate.weather_id)) {
                    newlyActivatedSpecials.push(weatherUpdate.weather_name);
                  }
                }
              } else {
                if (index !== -1) {
                  newWeathers.splice(index, 1);
                }
              }
            });

            setWeather(newWeathers);

            if (newlyActivatedSpecials.length > 0) {
              setTimeout(() => {
                newlyActivatedSpecials.forEach((name) => {
                  playSound(`⚡ Special Weather: ${name}`);
                });
              }, 0);
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
        console.log("WebSocket closed. Reconnecting in 5 seconds...");
        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    };

    connectWebSocket();

    return () => {
      ws.close();
      clearTimeout(reconnectTimeout);
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
            <Typography variant="h7">
              {weather.length === 0 ? "-" : weather}
            </Typography>
          </Box>

          {/* Tabs */}
          <Box mb={4}>
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => setTabIndex(newValue)}
              centered
              textColor="inherit"
              indicatorColor="primary"
            >
              <Tab label="All Stocks" />
              <Tab label="Seeds" />
              <Tab label="Gears" />
              <Tab label="Eggs" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {tabIndex === 0 && (
            <>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                gap={2}
                border={"1px solid white"}
                borderRadius={4}
                p={2}
                mb={2}
              >
                <Typography variant="h5">Available Seeds</Typography>
                <Grid container spacing={5} justifyContent={"center"}>
                  {stocks.map((stock) => (
                    <Grid key={stock.item_id} size={{ xs: 6, sm: 3, md: 2 }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
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
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                gap={2}
                border={"1px solid white"}
                borderRadius={4}
                p={2}
                mb={2}
              >
                <Typography variant="h5">Available Gears</Typography>
                <Grid container spacing={5} justifyContent={"center"}>
                  {tools.map((tool) => (
                    <Grid key={tool.item_id} size={{ xs: 6, sm: 3, md: 2 }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <img
                          src={tool.icon}
                          alt={tool.display_name}
                          style={{ width: 60, height: 60 }}
                        />
                        <Typography variant="subtitle2" align="center">
                          {tool.display_name}
                        </Typography>
                        <Typography variant="body2" align="center">
                          x{tool.quantity}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
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
                <Typography variant="h5">Available Eggs</Typography>
                <Grid container spacing={15} justifyContent={"center"}>
                  {eggStocks.map((egg) => (
                    <Grid key={egg.item_id} size={{ xs: 6, sm: 3, md: 2 }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <img
                          src={egg.icon}
                          alt={egg.display_name}
                          style={{ width: 60, height: 60 }}
                        />
                        <Typography variant="subtitle2" align="center">
                          {egg.display_name}
                        </Typography>
                        <Typography variant="body2" align="center">
                          x{egg.quantity}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}

          {tabIndex === 1 && (
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
                  <Grid key={stock.item_id} size={{ xs: 6, sm: 3, md: 2 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
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
          )}

          {tabIndex === 2 && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              gap={2}
              border={"1px solid white"}
              borderRadius={4}
              p={2}
            >
              <Typography variant="h5">Available Gears</Typography>
              <Grid container spacing={5} justifyContent={"center"}>
                {tools.map((tool) => (
                  <Grid key={tool.item_id} size={{ xs: 6, sm: 3, md: 2 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <img
                        src={tool.icon}
                        alt={tool.display_name}
                        style={{ width: 60, height: 60 }}
                      />
                      <Typography variant="subtitle2" align="center">
                        {tool.display_name}
                      </Typography>
                      <Typography variant="body2" align="center">
                        x{tool.quantity}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {tabIndex === 3 && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              gap={2}
              border={"1px solid white"}
              borderRadius={4}
              p={2}
            >
              <Typography variant="h5">Available Eggs</Typography>
              <Grid container spacing={15} justifyContent={"center"}>
                {eggStocks.map((egg) => (
                  <Grid key={egg.item_id} size={{ xs: 6, sm: 3, md: 2 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <img
                        src={egg.icon}
                        alt={egg.display_name}
                        style={{ width: 60, height: 60 }}
                      />
                      <Typography variant="subtitle2" align="center">
                        {egg.display_name}
                      </Typography>
                      <Typography variant="body2" align="center">
                        x{egg.quantity}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          <ToastContainer position="top-right" autoClose={10000} />
        </>
      )}
    </Box>
  );
}
