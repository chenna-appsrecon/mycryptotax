import React, { useEffect, useState } from "react";
import { Box, Stack, Skeleton } from "@chakra-ui/react";
import SidebarWithHeader from "../SideNavBar";
import TableComponent from "../Tables";
import axios from "axios";
import { headers } from "../../api";
import { APP_URL } from "../../constants";
import { BarChart } from "./BarChart";
const API_URL = "https://stockpalapi.glassball.app";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  let token = localStorage.getItem("token");

  useEffect(() => {
    console.log("err");

    if (!cryptoData.length) {
      GetCryptoData();
    }
  }, []);

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

  // console.log("cryptoData", cryptoData);
  return (
    <SidebarWithHeader>
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
