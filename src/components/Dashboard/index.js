import React, { useEffect, useState } from "react";
import CanvasJSReact from "../../canvasjs.react";
import { Line } from "react-chartjs-2";
import { Navigate, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import {
  Button,
  Box,
  useColorModeValue as mode,
  VStack,
  Flex,
  CircularProgress,
  Spacer,
  Select,
  Center,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import SidebarWithHeader from "../SideNavBar";
import TableComponent from "../Tables";
import { CoinList, HistoricalChart } from "../../api";
import { APP_URL } from "../../constants";
// import { BarChart } from "./BarChart";
import { Card } from "../Card";
import { PageHeader } from "../PageHeader";
import { cryptoSymbols } from "../../CryptoData";
import { Coingecko } from "../../Coingenckoids";
import { symbolDetails } from "../../Coindeckodetails";
import PortfolioTable from "./PortfolioTable";
import { chartDays } from "../Chartdays";
import { FaTractor } from "react-icons/fa";
import { keyboard } from "@testing-library/user-event/dist/keyboard";
const API_URL = "https://stockpalapi.glassball.app";

const headers = {
  "Content-Type": "application/json",
};

let headerKeys = [
  "Asset",
  "Purchased value",
  "Current Value",
  "Holdings",
  "Difference",
];
// let token = localStorage.getItem("token");
// console.log("token", token);

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard = () => {
  const localGraphData =
    localStorage.getItem("setGraphData") &&
    JSON.parse(localStorage.getItem("setGraphData"));
  const localPortfolioValue = localStorage.getItem("setPortfolioValue");
  let token = localStorage.getItem("token");

  const { id, quantity } = useParams();
  const [flag, setflag] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [array, setArray] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [transactionData, setTransactionData] = useState();
  const [coinsLatestPrice, setCoinsLatestPrice] = useState({});
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const [graphData, setGraphData] = useState(localGraphData);
  const [isLoading, setIsLoading] = useState(false);
  // const { currency } = CryptoState();
  const [currency, setCurrency] = useState("INR");
  const [sum, setSum] = useState(0);
  const [newFlag, setNewFlag] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(localPortfolioValue);
  const [lastUpdated, setlastUpdated] = useState(new Date().toDateString());
  const [canvasOptions, setCanvasOptions] = useState("");
  const [platform, setPlatform] = useState("");
  const [portfolioData, setPortfolioData] = useState("");
  const [coinsData, setCoins] = useState();

  useEffect(() => {
    if (!cryptoData.length) {
      fetchTransactionsByTime(1);
      handleProftfolio();
      // getUserFileNames();
      // if (!localGraphData || localGraphData.length == 0) {
      //   fetchTransactionsByTime(1);
      // } else {
      //   totalCostData(localGraphData, 1);
      // }
      // if (!localPortfolioValue) {
      //   handleProftfolio();
      // }
    }
  }, [platform]);
  const getUserFileNames = () => {
    axios
      .get(APP_URL + "getuserfilenames", {
        headers: { ...headers, "x-access-token": token },
      })
      .then((response) => {
        console.log("getuserfilenames", response);
      })
      .catch((err) => {
        console.log("getuserfilenames err: ", err);
      });
  };

  const updateChartData = (day) => {
    if (day === days) {
      return;
    }
    setIsLoading(true);
    setDays(day);
    fetchTransactionsByTime(day);
  };

  let obj = {};

  const getData = () => {
    Coingecko.map((item) => {
      obj[item.symbol] = { name: item.name, id: item.id };
    });
    // console.log("Coingecko", obj);
  };
  const fetchCoins = async () => {
    // setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    console.log("coinsData", data);

    setCoins(data);
    // setLoading(false);
  };
  const handleRefresh = () => {
    setRefreshing(true);
    axios
      .get(APP_URL + "getupdate", {
        headers: { ...headers, "x-access-token": token },
      })
      .then((response) => {
        // console.log(response);
        handleProftfolio();
        fetchTransactionsByTime(1);
      })
      .catch((err) => {
        console.log("err: ", err);
        setRefreshing(false);
        setRefreshError(true);
      });
  };
  const handleProftfolio = () => {
    // setRefreshing(true);
    axios
      .post(
        APP_URL + "getportfoliodata",
        { platform: platform },
        { headers: { ...headers, "x-access-token": token } }
      )
      .then((response) => {
        // console.log(response);
        setPortfolioData(response.data);
        calculatePortFolioValue(response.data);
      })
      .catch((err) => {
        console.log("err: ", err);
        setRefreshing(false);
        setRefreshError(true);
      });
  };

  const calculatePortFolioValue = (data) => {
    const sumWithInitial = Object.values(data.totalCurrentValue).reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
    // console.log(platform, data);
    setPortfolioValue(sumWithInitial);
    setRefreshing(false);
    // symbolDetails[item.securityName.toLowerCase()].id
    localStorage.setItem("setPortfolioValue", sumWithInitial);
    // console.log("sumWithInitial", sumWithInitial);
  };
  let newReqObj = {};

  const totalCostData = (dummyData, day) => {
    // let reqData = Object.values(dummyData.totalCurrentValue).map((item) =>
    //   item.prices.slice(-100)
    // );
    let lastUpdated = dummyData.lastUpdated;
    let reqKeys = Object.keys(dummyData.totalCurrentValue);
    // console.log(Object.values(dummyData.totalCurrentValue));
    let pricesLength = Object.values(dummyData.totalCurrentValue).map(
      (item) => item.length
    );

    const min = Math.min(...pricesLength);
    const minValueIndex = pricesLength.indexOf(min);

    let array = [];
    // console.log("reqKeys", reqKeys);
    for (let index = 0; index < min; index++) {
      let sum = 0;
      for (let a = 0; a < reqKeys.length; a++) {
        // console.log(reqKeys[a]);
        // console.log(dummyData.totalCurrentValue[reqKeys[a]]);
        // console.log(dummyData.totalCurrentValue[reqKeys[a]][index][1]);
        sum =
          sum +
          dummyData.totalCurrentValue[reqKeys[a]][index][1] *
            (dummyData.holdings[reqKeys[a]]
              ? dummyData.holdings[reqKeys[a]]
              : 0);
        // sum = sum + reqData[a][index][1];
      }

      array.push({
        x: new Date(
          dummyData.totalCurrentValue[reqKeys[minValueIndex]][index][0]
        ),
        y: sum,
      });
    }
    // setSum(newReqObj[moment().format("DD-MM-YYYY")]);
    setlastUpdated(lastUpdated);
    setGraphData(array);
    returnCanvasData(array, day);
    if (isRefreshing) {
      setRefreshing(false);
    }
    setIsLoading(false);
    localStorage.setItem("setGraphData", JSON.stringify(array));
    setflag(true);
  };

  const returnCanvasData = (array, day) => {
    let reqCanvasData = {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Portfolio data",
      },
      axisX: {
        valueFormatString: day === 1 ? "DD MMM HH:mm" : "DD MMM",
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      axisY: {
        title: "Closing Price (in INR)",
        // valueFormatString: "€##0.00",
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
          labelFormatter: function (e) {
            return "₹" + CanvasJS.formatNumber(e.value, "##0.00");
          },
        },
      },
      data: [
        {
          type: "area",
          xValueFormatString: "DD MMM",
          yValueFormatString: "₹##0.00",
          dataPoints: array,
        },
      ],
    };
    // console.log("array", array);
    setCanvasOptions(reqCanvasData);
  };

  const fetchTransactionsByTime = (day) => {
    // setflag(false);
    axios
      .post(
        APP_URL + "gettransactionbyday",
        { parameter: day, platform },
        {
          headers: { ...headers, "x-access-token": token },
        }
      )
      .then((response) => {
        // console.log("gettransactionbyday", response);
        totalCostData(response.data, day);
      })
      .catch((err) => console.log("err: ", err));

    // totalCostData(dummyData);
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
            console.log("#######", holdingsObj[item.feePaidIn]);
            obj = { quantity: obj.quantity - parseFloat(item.netAmount) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          } else {
            let obj = { ...holdingsObj[item.feePaidIn] };
            console.log("*******", holdingsObj[item.feePaidIn]);
            obj = { quantity: (obj.quantity = -parseFloat(item.netAmount)) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          }
        }
        assetValue = parseFloat(assetValue) + parseFloat(item.quantity);
        holdingsObj[item.securityName].quantity += parseFloat(item.quantity);
        holdingsObj[item.securityName].costBasis = parseFloat(item.costBasis);
        holdingsObj[item.securityName].grossAmount = parseFloat(
          item.grossAmount
        );

        holdingsObj[item.securityName].name =
          symbolDetails[item.securityName.toLowerCase()].id;
        // .toLowerCase()
        // .replace(new RegExp("()", "g"), "")
        // .split(" ")
        // .join("-");
        // if (item.securityName == "BTC") {
        //   console.log("If BTC======", holdingsObj[item.securityName]);
        //   console.log("If BTC q: ", parseFloat(item.quantity));
        // }
      } else {
        if (item.feePaidIn !== "INR") {
          if (holdingsObj[item.feePaidIn]) {
            let obj = { ...holdingsObj[item.feePaidIn] };
            console.log("======", holdingsObj[item.feePaidIn]);
            obj = { quantity: obj.quantity - parseFloat(item.netAmount) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          } else {
            let obj = { ...holdingsObj[item.feePaidIn] };
            console.log("&&&&&&&", holdingsObj[item.feePaidIn]);
            obj = { quantity: (obj.quantity = -parseFloat(item.netAmount)) };
            holdingsObj[item.feePaidIn] = {
              ...holdingsObj[item.feePaidIn],
              ...obj,
            };
          }
        }

        holdingsObj[item.securityName] = {
          quantity: parseFloat(item.quantity),
          costBasis: parseFloat(item.costBasis),
          grossAmount: parseFloat(item.grossAmount),
          name: symbolDetails[item.securityName.toLowerCase()].id,
          // .toLowerCase()
          // .split(" ")
          // .join("-"),
        };
        if (item.securityName == "BTC") {
          console.log("Else BTC======", holdingsObj[item.securityName]);
          console.log("Else BTC q: ", parseFloat(item.quantity));
        }

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

    // console.log("assetValue", assetValue);
    // console.log("holdingsObj", holdingsObj);
  };

  // console.log("graphData", graphData);
  const isAuthenticated = token;
  if (!isAuthenticated) {
    // const myTimeout = setTimeout(() => {
    //   if (!isAuthenticated) {
    //     return <Navigate to="/signin" />;
    //   } else {
    //     clearTimeout(myTimeout);
    //   }
    // }, 3000);
    return <Navigate to="/signin" />;
  }

  return (
    <SidebarWithHeader>
      <Flex flexWrap={"wrap"} justifyContent={"space-between"}>
        <PageHeader portfolioValue={portfolioValue} />
        {/* <Spacer /> */}
        {/* <Box width={["100%"]}> */}
        <Flex alignItems="center" flexWrap={["nowrap", "wrap"]}>
          {refreshError && (
            <Alert status="error">
              <AlertIcon />
              There was an error in refreshing, please wait
            </Alert>
          )}
          <div className={"float"}>
            <Button
              isLoading={isRefreshing}
              loadingText="Updating will take a while... please wait"
              colorScheme="teal"
              variant="outline"
              spinnerPlacement="start"
              style={{ marginRight: "1em" }}
              onClick={() => handleRefresh()}
            >
              <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                icon={<RepeatIcon />}
              />
            </Button>
          </div>
          <Flex>
            <Select
              // placeholder="ALL"
              size="lg"
              mr={5}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">All</option>
              <option value="wazirx">Wazirx</option>
              {/* <option value="option2">CoinDcx </option> */}
              <option value="zebpay">Zebpay</option>
            </Select>
            <Spacer />
            <Spacer />
            <Select placeholder="INR" size="lg">
              <option value="inr">INR</option>
              {/* <option value="option2">USD </option> */}
            </Select>
          </Flex>
        </Flex>
        {/* </Box> */}
      </Flex>

      <div className={""}>
        {/* {!graphData | (newFlag === false) ? (
          <Center mt={3}>
            <CircularProgress isIndeterminate color="green.300" />
          </Center>
        ) : (
          <></>
        )} */}
        {!graphData | (flag === false) ? (
          <Center mt={3}>
            <CircularProgress isIndeterminate color="green.300" />
          </Center>
        ) : (
          <div className="coin-chart">
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Flex
                flexWrap={"wrap"}
                justifyContent={["flex-start", "flex-end"]}
                mt={5}
              >
                {chartDays.map((day) => (
                  <Button
                    key={day.value}
                    onClick={() => {
                      // setNewFlag(false);
                      updateChartData(day.value);
                    }}
                    isLoading={day.value === days && isLoading}
                    style={
                      day.value === days
                        ? {
                            margin: "1em 1em 0 0",
                            backgroundColor: "black",
                            color: "white",
                          }
                        : {
                            margin: "1em 1em 0 0",
                          }
                    }
                    selected={day.value === days}
                  >
                    {day.label}
                  </Button>
                ))}
              </Flex>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <p>
                Last Updated: {moment(lastUpdated).format("DD-MM-YYYY, h:mm a")}
              </p>
            </div>
            <Box bg={"white"} flex="1">
              {canvasOptions && (
                <CanvasJSChart
                  options={canvasOptions}
                  /* onRef={ref => this.chart = ref} */
                />
              )}

              {/* <Line
                data={{
                  elements: { line: { tension: 0.4 } },
                  labels: graphData.map((coin) => {
                    let date = new Date(coin[0]);
                    // let date = coin;
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                    // return date;
                  }),
                  datasets: [
                    {
                      type: "line",
                      backgroundColor: "#5AC53B",
                      tension: 0,
                      borderColor: "#5AC53B",
                      // borderColor: "#23E33E",
                      borderWidth: 2,
                      pointBorderColor: "rgba(0, 0, 0, 0)",
                      pointBackgroundColor: "rgba(0, 0, 0, 0)",
                      pointHoverBackgroundColor: "#5AC53B",
                      // pointHoverBorderColor: "#000000",
                      pointHoverBorderWidth: 4,
                      pointHoverRadius: 6,
                      data: graphData.map((data) => data[1]),
                      // backgroundColor:
                      //   "linear-gradient(180deg, #23E33E -67.46%, rgba(255, 255, 255, 0.0001) 69.63%)",
                      label: `Price in  ${currency}`,
                    },
                  ],
                }}
                options={{
                  interaction: {
                    mode: "index",
                  },
                  responsive: true,
                  legend: {
                    display: false,
                  },
                  // hover: {
                  //   intersect: false,
                  // },
                  // elements: {
                  //   line: {
                  //     tension: 0,
                  //   },
                  //   point: {
                  //     radius: 0,
                  //   },
                  // },
                  plugins: {
                    // title: {
                    //   display: true,
                    //   text: (ctx) =>
                    //     "Point Style: " + ctx.chart.data.datasets[0].pointStyle,
                    // },
                    legend: {
                      // positon: "right",
                      display: false,
                    },
                    tooltip: {
                      displayColors: false,
                      backgroundColor: "#ffffff",
                      titleFontColor: "black",
                      titleFontSize: "black",
                      titleColor: "black",
                      bodyFontColor: "blue",
                      bodyFontSize: "30",
                      bodyColor: "green",
                      // borderColor: "green",
                      borderWidth: "1",
                      padding: 30,

                      callbacks: {
                        // beforeTitle: function (context) {
                        //   return "beforeTitle";
                        // },
                        title: function (context) {
                          // console.log("context title", context);
                          return "Time : " + context[0].label;
                        },
                        // label: function (context) {
                        //   // console.log("context title", context);
                        //   return "Time : " + context[0].label;
                        // },
                        // afterTitle: function (context) {
                        //   return "afterTitle";
                        // },
                        // afterLabel: function (context) {
                        //   return "Time : " + "context[0].label";
                        // },
                      },
                    },
                  },
                  maintainAspectRatio: false,

                  // scales: {
                  // xAxes: [
                  //   {
                  //     type: "time",
                  //     time: {
                  //       format: "MM/DD/YY",
                  //       tooltipFormat: "ll",
                  //     },
                  //     ticks: {
                  //       display: false,
                  //     },
                  //   },
                  // ],
                  // yAxes: [
                  //   {
                  //     gridLines: {
                  //       display: false,
                  //     },
                  //     ticks: {
                  //       display: false,
                  //     },
                  //   },
                  // ],
                  // },
                }}
              /> */}
            </Box>
          </div>
        )}
      </div>
      {portfolioData && (
        <PortfolioTable
          data={portfolioData}
          platform={platform}
          // holdings={holdings && holdings}
          // coinsLatestPrice={coinsLatestPrice}
        />
      )}

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
