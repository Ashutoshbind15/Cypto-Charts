import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Chart } from "react-chartjs-2";
import "chart.js/auto";
import { format } from "date-fns";
import Navbar from "./components/Navbar";

function App() {
  const [curr, setCurr] = useState();
  const [chartData, setCharData] = useState();
  const [coinChartData, setCoinCharData] = useState();
  const [currId, setCurrId] = useState();
  const [time, setTime] = useState(10);
  const [dateFormat, setDateFormat] = useState("PP");

  useEffect(() => {
    const helper = async () => {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/search/trending"
      );

      setCurr(data.coins);
      setCurrId(data.coins[0].item.id);

      setCharData({
        labels: data.coins.map((el) => el.item.name),
        datasets: [
          {
            label: "Learning about charts",
            data: data.coins.map((el) => el.item.price_btc),
            backgroundColor: "rgb(200,200,200)",
          },
        ],
      });
    };

    helper();
  }, []);

  useEffect(() => {
    if (time === "24h") setDateFormat("p");
    if (time === "10") setDateFormat("PP");
  }, [time]);

  useEffect(() => {
    const help = async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${currId}/market_chart?vs_currency=usd&days=${time}
        `
      );

      setCoinCharData({
        labels: data.prices.map((el) => format(el[0], dateFormat)),
        datasets: [
          {
            label: "Learning about charts",
            data: data.prices.map((el) => el[1]),
            backgroundColor: "rgb(200,200,200)",
          },
        ],
      });
    };

    if (currId) help();
  }, [currId, time, dateFormat]);

  return (
    <div>
      <Navbar />

      <h1 className="text-center font-bold my-4 text-4xl text-pink-700">
        Explore Trending coins and thier relative prices
      </h1>

      {chartData && (
        <div className="w-2/3 mx-auto my-12">
          <Chart type="line" data={chartData} />{" "}
        </div>
      )}

      <div className=" px-12 ">
        <h1 className="text-center font-bold my-4 text-4xl text-pink-700">
          Visualize the data for the coins
        </h1>
        <div className="flex">
          <div className="flex  flex-col w-1/4 items-start justify-center">
            {curr?.map((el) => (
              <span
                className={`mx-4 font-semibold text-xl py-2 px-4 ${
                  currId === el.item.id
                    ? "bg-blue-700 text-white scale-105 "
                    : null
                }`}
                key={el.item.coin_id}
                onClick={() => setCurrId(el.item.id)}
              >
                {el.item.name}
              </span>
            ))}
          </div>

          <div className="flex flex-col w-3/4 items-center justify-center">
            <select
              className="bg-blue-700 px-4 py-2 text-white my-3 mr-auto ml-4"
              name="time"
              id=""
              onChange={(e) => setTime(e.target.value)}
            >
              <option
                value="10"
                className={`bg-white hover:bg-blue-700 hover:text-white text-black py-2`}
              >
                10 Days
              </option>
              <option
                value="24h"
                className={`bg-white hover:bg-blue-700 hover:text-white text-black py-2`}
              >
                Past 24 hours
              </option>
            </select>

            {coinChartData && (
              <div className="w-full">
                <Chart type="line" data={coinChartData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
