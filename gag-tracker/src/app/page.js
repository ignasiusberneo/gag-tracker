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
  const [weather, setWeather] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [userId, setUserId] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  // const seedList = [
  //   {
  //     item_id: "carrot",
  //     display_name: "Carrot",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/carrot",
  //   },
  //   {
  //     item_id: "strawberry",
  //     display_name: "Strawberry",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/strawberry",
  //   },
  //   {
  //     item_id: "blueberry",
  //     display_name: "Blueberry",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/blueberry",
  //   },
  //   {
  //     item_id: "orange_tulip",
  //     display_name: "Orange Tulip",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/orange_tulip",
  //   },
  //   {
  //     item_id: "tomato",
  //     display_name: "Tomato",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/tomato",
  //   },
  //   {
  //     item_id: "corn",
  //     display_name: "Corn",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/corn",
  //   },
  //   {
  //     item_id: "daffodil",
  //     display_name: "Daffodil",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/daffodil",
  //   },
  //   {
  //     item_id: "watermelon",
  //     display_name: "Watermelon",
  //     icon: "https://api.joshlei.com/v2/growagarden/image/watermelon",
  //   },
  //   {
  //     item_id: "pumpkin",
  //     display_name: "Pumpkin",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/pumpkin",
  //   },
  //   {
  //     item_id: "apple",
  //     display_name: "Apple",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/apple",
  //   },
  //   {
  //     item_id: "bamboo",
  //     display_name: "Bamboo",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/bamboo",
  //   },
  //   {
  //     item_id: "coconut",
  //     display_name: "Coconut",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/coconut",
  //   },
  //   {
  //     item_id: "cactus",
  //     display_name: "Cactus",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/cactus",
  //   },
  //   {
  //     item_id: "dragon_fruit",
  //     display_name: "Dragon Fruit",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/dragon_fruit",
  //   },
  //   {
  //     item_id: "mango",
  //     display_name: "Mango",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/mango",
  //   },
  //   {
  //     item_id: "grape",
  //     display_name: "Grape",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/grape",
  //   },
  //   {
  //     item_id: "mushroom",
  //     display_name: "Mushroom",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/mushroom",
  //   },
  //   {
  //     item_id: "pepper",
  //     display_name: "Pepper",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/pepper",
  //   },
  //   {
  //     item_id: "cacao",
  //     display_name: "Cacao",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/cacao",
  //   },
  //   {
  //     item_id: "beanstalk",
  //     display_name: "Beanstalk",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/beanstalk",
  //   },
  //   {
  //     item_id: "ember_lily",
  //     display_name: "Ember Lily",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/ember_lily",
  //   },
  //   {
  //     item_id: "burning_bud",
  //     display_name: "Burning Bud",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/burning_bud",
  //   },
  //   {
  //     item_id: "giant_pinecone",
  //     display_name: "Giant Pinecone",

  //     icon: "https://api.joshlei.com/v2/growagarden/image/giant_pinecone",
  //   },
  // ];

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
            const specialTools = [
              "godly_sprinkler",
              "master_sprinkler",
              "advanced_sprinkler",
            ];
            const filteredTools = data.gear_stock.filter((tool) =>
              specialTools.includes(tool.item_id)
            );
            if (filteredTools.length > 0) {
              playSound("🛠️ Rare Gear(s) Available!");
            }
          }

          if (data.weather) {
            const activeWeather = data.weather.filter(
              (weather) => weather.active
            );
            if (activeWeather.length > 0) {
              const specialWeather = [
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
              ];
              const filteredWeather = activeWeather.filter((weather) =>
                specialWeather.includes(weather.weather_id)
              );
              if (filteredWeather.length > 0) {
                playSound(
                  `⚡ Special Weather: ${filteredWeather[0].weather_name}`
                );
              }
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
            <Typography variant="h7">{weather}</Typography>
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
