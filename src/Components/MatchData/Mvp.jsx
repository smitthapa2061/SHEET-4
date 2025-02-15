import React, { useState, useEffect } from "react";
import "./MatchData.css"; // Import the CSS file
import axios from "axios";
import { motion } from "framer-motion";

const apiKey = "AIzaSyCQDNN_uTOoni7xB-doWE2wGk-D5xnGa_w"; // Your Google Sheets API key
const spreadsheetId = "1RhyEWepcXa1hF6mzw6fiRSfQdQM4dJ6q9Zl_REEN934";

const Mvp = () => {
  const [matchData, setMatchData] = useState([]);
  const [setupData, setSetupData] = useState([]); // State for setup sheet data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlMatchData =
    "https://script.google.com/macros/s/AKfycbzw1dOMbr133E59hgnm3SZVfXxjR7pJxfXkRRaDGDbibmVl6X4-XYPfGRSpY3OIljE/exec";

  const urlSetupData = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`;

  useEffect(() => {
    // Fetch match data
    axios
      .get(urlMatchData) // Using axios for the GET request
      .then((response) => {
        const data = response.data;

        if (data.error) {
          setError(data.error);
        } else {
          // Keep all data (no duplicate filtering)
          const sortedData = data.match_info.sort((a, b) => {
            if (b.player_kills !== a.player_kills) {
              return b.player_kills - a.player_kills; // Sort by player_kills first
            }
            return b.contribution - a.contribution; // If kills are same, sort by contribution
          });

          setMatchData(sortedData);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching data.");
        setLoading(false);
      });

    // Fetch setup data
    axios
      .get(urlSetupData)
      .then((response) => {
        const setupValues = response.data.values;
        if (setupValues) {
          const formattedSetupData = setupValues.map((row) => ({
            ColumnB: row[1] || "", // Using column B as an example
          }));
          setSetupData(formattedSetupData);
        }
      })
      .catch(() => {
        setError("Error fetching setup data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (matchData.length === 0) {
    return <p>No match data available.</p>;
  }

  const primaryColor = setupData[5]?.ColumnB || "#850505"; // Default to red if API fails

  return (
    <div className="font-bebas-neue font-[500]">
      <motion.div
        key="matchData"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Fade out on exit
        transition={{ duration: 2 }}
      >
        {/*#1 data start*/}
        <div className=" ">
          {matchData?.slice(0, 1).map((team, index) => {
            // Find the player with the highest kills within the team
            const highestKillsPlayer =
              team.player_name && team.team_kills > 0 ? team : null;

            return highestKillsPlayer &&
              highestKillsPlayer.player_kills ===
                Math.max(...matchData.map((t) => t.player_kills)) ? (
              <div key={index} className=" w-[1920px] h-[1080px]">
                <div
                  className="text-white text-[200px] left-[1390px] absolute top-[20px] font-teko"
                  style={{ color: primaryColor }}
                >
                  PLAYER
                </div>
                <div className="text-white text-[200px] left-[820px] absolute top-[170px]">
                  MOST VALUEABLE
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 680 }} // Start completely below the screen
                  animate={{ opacity: 1, y: 0 }} // Slide up to its position
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className=" absolute top-[134px] scale-110 left-[90px]">
                    <img
                      src={
                        highestKillsPlayer?.player_photo ||
                        "https://res.cloudinary.com/dqckienxj/image/upload/v1737809848/Layer_6_cnd9gl_ugaxek.png"
                      }
                      alt=""
                    />
                  </div>
                </motion.div>
                <div className="text-white font-teko font-[300]">
                  <div className="bg-[#ebebeb] w-[200px] h-[200px] relative left-[1000px] top-[450px]">
                    <img src={highestKillsPlayer?.team_logo} alt="" />
                  </div>

                  <div
                    className="absolute left-[1200px]  h-[170px] w-[600px] text-center top-[480px]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="text-[200px] relative top-[-50px]">
                      {highestKillsPlayer?.player_name}
                    </div>
                    <div
                      className="w-[200px] h-[140px] bg-black absolute left-[-200px] top-[230px]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="text-[100px]">1</div>
                      <div className="text-[50px] bg-white text-black h-[60px] absolute w-[200px] top-[140px]">
                        RANK
                      </div>
                    </div>{" "}
                    <div
                      className="w-[200px] h-[140px] bg-black absolute left-[100px] top-[230px]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="text-[100px]">
                        {highestKillsPlayer?.player_kills}
                      </div>
                      <div className="text-[50px] bg-white text-black h-[60px] absolute w-[200px] top-[140px]">
                        KILLS
                      </div>
                    </div>{" "}
                    <div
                      className="w-[200px] h-[140px] bg-black absolute left-[400px] top-[230px]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="text-[100px]">
                        {highestKillsPlayer?.contribution}%
                      </div>
                      <div className="text-[50px] bg-white text-black h-[60px] absolute w-[200px] top-[140px]">
                        CONTRIBUTION
                      </div>
                    </div>
                    <div
                      style={{ backgroundColor: primaryColor }}
                      className="text-[90px] bg-red-900 text-white h-[90px] absolute w-[380px] left-[20px] top-[500px] flex justify-center items-center"
                    >
                      <div className="relative top-[5px]">
                        TEAM {team.team_name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Mvp;
