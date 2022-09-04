import { Box, Container, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Stat } from "./Stats";
import { cryptoSymbols } from "../CryptoData";
const stats = [
  {
    label: "Total Subscribers",
    value: "71,887",
    delta: {
      value: "320",
      isUpwardsTrend: true,
    },
  },
  {
    label: "Avg. Open Rate",
    value: "56.87%",
    delta: {
      value: "2.3%",
      isUpwardsTrend: true,
    },
  },
  {
    label: "Avg. Click Rate",
    value: "12.87%",
    delta: {
      value: "0.1%",
      isUpwardsTrend: false,
    },
  },
];

let USDT = 79.35;

export const Card = ({ holdings, coinsLatestPrice }) => {
  const { id } = useParams();
  let coins = holdings ? Object.keys(holdings) : [];
  // const [coins, setCoins] = useState(data);
  useEffect(() => {
    // coins.map((item) => {
    //   getCoinDetails(item);
    // });
  }, []);

  const getCoinDetails = (coin) => {
    axios
      .get(
        "https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=" +
          cryptoSymbols[coin]
      )
      // .then((res) => res.json())
      .then((response) => {
        if (response) {
          console.log("getCoinDetails", response.data);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Box
      as="section"
      py={{
        base: "4",
        md: "8",
      }}
    >
      {/* <Container> */}
      <Flex
        wrap={"wrap"}
        columns={{
          base: 1,
          md: 5,
        }}
        gap={{
          base: "5",
          md: "6",
        }}
      >
        {coins &&
          coins.length > 0 &&
          coins.map((coin, i) => {
            // console.log(
            //   holdings[coin].name,
            //   "-",
            //   coinsLatestPrice[holdings[coin].name]
            // );
            return (
              <Link
                key={i}
                to={
                  "/coindetails/" +
                  holdings[coin].name.toLowerCase() +
                  "/" +
                  holdings[coin].quantity
                }
                // as="span"
                ms="5px"
                fontWeight="bold"
              >
                <Stat
                  key={i}
                  id={i}
                  quantity={holdings[coin].quantity}
                  grossAmount={holdings[coin].grossAmount}
                  coin={coin}
                  inr_24h_change={
                    coinsLatestPrice[holdings[coin].name.toLowerCase()] &&
                    coinsLatestPrice[holdings[coin].name.toLowerCase()]
                      .inr_24h_change
                  }
                  currentPrice={
                    coinsLatestPrice[holdings[coin].name.toLowerCase()] &&
                    coinsLatestPrice[holdings[coin].name.toLowerCase()].inr
                  }
                />
              </Link>
            );
          })}
      </Flex>
      {/* </Container> */}
    </Box>
  );
};
