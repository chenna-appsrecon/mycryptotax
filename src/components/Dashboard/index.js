import React, { useEffect, useState } from "react";
import { Box, Stack, Skeleton } from "@chakra-ui/react";
import SidebarWithHeader from "../SideNavBar";
import TableComponent from "../Tables";
import axios from "axios";
import { headers } from "../../api";
import { APP_URL } from "../../constants";
import { BarChart } from "./BarChart";
import { Card } from "../Card";
import { PageHeader } from "../PageHeader";
import { cryptoSymbols } from "../../CryptoData";
const API_URL = "https://stockpalapi.glassball.app";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [totalAssets, setTotalAssets] = useState(0);
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    if (!cryptoData.length) {
      GetCryptoData();
      fetchTransactions();
    }
  }, []);
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
  const GetCryptoData = () => {
    axios
      .get("https://api.wazirx.com/sapi/v1/tickers/24hr")
      // .then((res) => res.json())
      .then((response) => {
        if (response) {
          // console.log("response", response.data);
          let data = response.data.slice(0, 20);
          // setCryptoData(data);
          setChartData(data);
          setIsLoaded(true);
        }
      })
      .catch((e) => console.log(e));
  };
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
        assetValue = parseFloat(assetValue) + parseFloat(item.quantity);
        holdingsObj[item.securityName] = {
          quantity: parseFloat(item.quantity),
          grossAmount: parseFloat(item.grossAmount),
        };
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
    console.log("holdingsObj", holdingsObj);
  };

  // console.log("transactionData", transactionData);
  return (
    <SidebarWithHeader>
      <PageHeader totalAssets={totalAssets} />
      <Card holdings={holdings && holdings} />
      {/* <BarChart chartData={chartData} /> */}
      {isLoaded ? (
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
      )}
    </SidebarWithHeader>
  );
};

export default Dashboard;
