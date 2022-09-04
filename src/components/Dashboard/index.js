import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Box,
  Container,
  Center,
  HStack,
  Icon,
  Square,
  Text,
  useColorModeValue as mode,
  VStack,
  Flex,
  Link,
} from "@chakra-ui/react";
import SidebarWithHeader from "../SideNavBar";
import TableComponent from "../Tables";
import axios from "axios";
import { headers } from "../../api";
import { APP_URL } from "../../constants";
// import { BarChart } from "./BarChart";
import { Card } from "../Card";
import { PageHeader } from "../PageHeader";
import { cryptoSymbols } from "../../CryptoData";
import { Coingecko } from "../../Coingenckoids";
import { symbolDetails } from "../../Coindeckodetails";
import PortfolioTable from "./PortfolioTable";
const API_URL = "https://stockpalapi.glassball.app";
let headerKeys = ["Asset", "Purchased value", "Current Value", "Holdings"];
const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [array, setArray] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [transactionData, setTransactionData] = useState();
  const [coinsLatestPrice, setCoinsLatestPrice] = useState({});

  useEffect(() => {
    if (!cryptoData.length) {
      // GetCryptoData();
      fetchTransactions();
      fetchCoinsData();
      // getData();
    }
  }, []);
  let obj = {};
  const getData = () => {
    Coingecko.map((item) => {
      obj[item.symbol] = { name: item.name, id: item.id };
    });
    // console.log("Coingecko", obj);
  };
  const fetchTransactions = () => {
    axios
      .get(APP_URL + "gettransaction", { headers: headers })
      .then((response) => {
        setTransactionData(response.data);
        getCryptoDetails(response.data);
        // console.log("response", response);
      })
      .catch((err) => console.log("err: ", err));
  };
  // const GetCryptoData = () => {
  //   axios
  //     .get("https://api.wazirx.com/sapi/v1/tickers/24hr")
  //     // .then((res) => res.json())
  //     .then((response) => {
  //       if (response) {
  //         // console.log("response", response.data);
  //         let data = response.data.slice(0, 20);
  //         // setCryptoData(data);
  //         setChartData(data);
  //         setIsLoaded(true);
  //       }
  //     })
  //     .catch((e) => console.log(e));
  // };
  const fetchCoinsData = () => {
    axios
      .get(APP_URL + "getcoinsdata", { headers: headers })
      .then((response) => {
        console.log("response", response);
        setCoinsLatestPrice(response.data);
      })
      .catch((err) => console.log("err: ", err));
  };

  // let details = {};

  const getCryptoDetails = (data) => {
    // console.log(data);
    let holdingsObj = {};
    let assetValue = 0;
    data.map((item) => {
      if (holdingsObj[item.securityName]) {
        if (item.feePaidIn !== "INR") {
          if (holdingsObj[item.feePaidIn]) {
            let obj = { ...holdingsObj[item.feePaidIn] };
            obj = { quantity: obj.quantity - parseFloat(item.netAmount) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          } else {
            let obj = { ...holdingsObj[item.feePaidIn] };
            obj = { quantity: (obj.quantity = -parseFloat(item.netAmount)) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          }
        }
        assetValue = parseFloat(assetValue) + parseFloat(item.quantity);
        holdingsObj[item.securityName].quantity += parseFloat(item.quantity);
        holdingsObj[item.securityName].grossAmount = parseFloat(
          item.grossAmount
        );

        holdingsObj[item.securityName].name =
          symbolDetails[item.securityName.toLowerCase()].id;
        // .toLowerCase()
        // .replace(new RegExp("()", "g"), "")
        // .split(" ")
        // .join("-");
      } else {
        if (item.feePaidIn !== "INR") {
          if (holdingsObj[item.feePaidIn]) {
            let obj = { ...holdingsObj[item.feePaidIn] };
            obj = { quantity: obj.quantity - parseFloat(item.netAmount) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          } else {
            let obj = { ...holdingsObj[item.feePaidIn] };
            obj = { quantity: (obj.quantity = -parseFloat(item.netAmount)) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          }
        }
        holdingsObj[item.securityName] = {
          quantity: parseFloat(item.quantity),
          grossAmount: parseFloat(item.grossAmount),
          name: symbolDetails[item.securityName.toLowerCase()].id,
          // .toLowerCase()
          // .split(" ")
          // .join("-"),
        };
        assetValue = parseFloat(assetValue) + parseFloat(item.quantity);
      }
    });
    setTotalAssets(assetValue);
    // details &&
    //   Object.keys(details) &&
    //   Object.keys(details).length > 0 &&
    //   Object.keys(details).map(async (coin) => {
    //     const apiResponse = await fetch(
    //       "https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=" +
    //         cryptoSymbols[coin]
    //     );
    //     const apiResponseJson = await apiResponse.json();
    //   });
    setHoldings(holdingsObj);

    // console.log("details", details);
    // console.log("holdingsObj", holdingsObj);
  };

  // console.log("array", array);
  return (
    <SidebarWithHeader>
      <PageHeader
        holdings={holdings && holdings}
        totalAssets={totalAssets}
        coinsLatestPrice={coinsLatestPrice}
      />

      <Card
        holdings={holdings && holdings}
        coinsLatestPrice={coinsLatestPrice}
      />
      <PortfolioTable
        holdings={holdings && holdings}
        coinsLatestPrice={coinsLatestPrice}
      />

      {/* <BarChart chartData={chartData} /> */}
      {/* {isLoaded ? (
        <Box w="100%" bg="white">
          <TableComponent tableData={chartData} />
        </Box>
      ) : (
        <Stack>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      )} */}
    </SidebarWithHeader>
  );
};

export default Dashboard;
