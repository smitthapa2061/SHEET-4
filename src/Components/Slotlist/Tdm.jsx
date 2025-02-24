import React, { useState, useEffect } from "react";

const apiKey = "AIzaSyCQDNN_uTOoni7xB-doWE2wGk-D5xnGa_w"; // Your Google Sheets API key
const spreadsheetId = "1RhyEWepcXa1hF6mzw6fiRSfQdQM4dJ6q9Zl_REEN934"; // Your Google Sheets ID
const range = "Tdm!A1:C21"; // Range you want to fetch (adjust this as needed)
const range2 = "setup!A2:B10";

const Tdm = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from Google Sheets API
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Sheets API");
        }

        const result = await response.json();
        const values = result.values;

        // Prepare the data in the format you want
        const formattedData = values.map((row) => ({
          ColumnA: row[0] || "",
          ColumnB: row[1] || "",
          ColumnC: row[2] || "",
        }));

        setData(formattedData); // Set the fetched data
        try {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;

          const response2 = await fetch(url);

          if (!response2.ok) {
            throw new Error("Failed to fetch data from Google Sheets API");
          }

          const result2 = await response2.json();
          const values2 = result2.values;

          // Prepare the data in the format you want
          const formattedData2 = values2.map((row) => ({
            ColumnB: row[1] || "",
          }));

          setData2(formattedData2); // Set the fetched data
        } catch (err) {
          setError(err.message);
        }
      } catch (err) {
        setError(err.message); // Set error message if any
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  console.log(data2, "data2");

  return (
    <div className="w-[1920px] h-[1080px] bg-green-800">
      <div className="text-white text-[140px] font-bebas-neue  w-[780px] h-[170px] border-[1px] border-transparent rounded-[10px] flex justify-center relative left-[550px] top-[10px] mb-[70px]">
        <div className="relative top-[-10px]">MATCH STATS</div>
      </div>

      {/*
      {data2.length > 0 && (
        <div>
          {data2[0].ColumnA}.{data2[0].ColumnB}
        </div>
      )}
*/}
      <div className="grid grid-cols-7  p-0 "></div>
    </div>
  );
};

export default Tdm;
