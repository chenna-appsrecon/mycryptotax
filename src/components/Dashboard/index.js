import React, { useEffect, useState } from "react";
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
import { CoinList, headers, HistoricalChart } from "../../api";
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
const API_URL = "https://stockpalapi.glassball.app";

let headerKeys = [
  "Asset",
  "Purchased value",
  "Current Value",
  "Holdings",
  "Difference",
];
let token = localStorage.getItem("token");

const Dashboard = () => {
  const localGraphData = JSON.parse(localStorage.getItem("setGraphData"));
  const localPortfolioValue = localStorage.getItem("setPortfolioValue");
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

  useEffect(() => {
    if (!cryptoData.length) {
      // GetCryptoData();
      // fetchTransactions();
      fetchCoinsData();
      // fetchHistoricData(days);
      if (!localGraphData || localGraphData.length == 0) {
        fetchTransactionsByTime(1);
      }
      if (!localPortfolioValue) {
        handleProftfolio();
      }
      // totalCostData(dummyData);
    }
  }, []);

  const updateChartData = (day) => {
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
  const handleRefresh = () => {
    setRefreshing(true);
    axios
      .get(APP_URL + "getupdate", { headers: headers })
      .then((response) => {
        console.log(response);
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
      .get(APP_URL + "getportfoliodata", { headers: headers })
      .then((response) => {
        console.log(response);
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
    setPortfolioValue(sumWithInitial);
    setRefreshing(false);
    localStorage.setItem("setPortfolioValue", sumWithInitial);
    console.log("sumWithInitial", sumWithInitial);
  };
  let newReqObj = {};

  const totalCostData = (dummyData) => {
    // let reqData = Object.values(dummyData.totalCurrentValue).map((item) =>
    //   item.prices.slice(-100)
    // );
    let lastUpdated = dummyData.lastUpdated;
    let reqKeys = Object.keys(dummyData.holdings);
    console.log(Object.values(dummyData.totalCurrentValue));
    let pricesLength = Object.values(dummyData.totalCurrentValue).map(
      (item) => item.length
    );

    const min = Math.min(...pricesLength);
    let array = [];
    for (let index = 0; index < min; index++) {
      let sum = 0;
      for (const key in reqKeys) {
        sum =
          sum +
          dummyData.totalCurrentValue[reqKeys[key]][index][1] *
            (dummyData.holdings[reqKeys[key]]
              ? dummyData.holdings[reqKeys[key]]
              : 0);

        // sum = sum + reqData[a][index][1];
      }
      array.push([
        dummyData.totalCurrentValue[reqKeys[reqKeys.length - 1]][index][0],
        sum,
      ]);
    }
    // setSum(newReqObj[moment().format("DD-MM-YYYY")]);
    setlastUpdated(lastUpdated);
    setGraphData(array);
    setIsLoading(false);
    localStorage.setItem("setGraphData", JSON.stringify(array));
    setflag(true);
  };

  const fetchHistoricData = async (days) => {
    const { data } = await axios.get(CoinList(currency));
    setflag(true);

    setHistoricData(data);
  };

  const fetchTransactions = () => {
    axios
      .get(APP_URL + "gettransaction", { headers: headers })
      .then((response) => {
        setTransactionData(response.data);
        getCryptoDetails(response.data);
        console.log("setTransactionData====", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  const fetchTransactionsByTime = (day) => {
    // setflag(false);
    axios
      .post(
        APP_URL + "gettransactionbyweek",
        { parameter: day },
        {
          headers: headers,
        }
      )
      .then((response) => {
        console.log("gettransactionbyweek", response);
        totalCostData(response.data);
      })
      .catch((err) => console.log("err: ", err));

    // totalCostData(dummyData);
  };

  const fetchCoinsData = () => {
    axios
      .get(APP_URL + "getcoinsdata", { headers: headers })
      .then((response) => {
        // console.log("response", response);
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

    console.log("assetValue", assetValue);
    console.log("holdingsObj", holdingsObj);
  };

  console.log("graphData", graphData);
  const isAuthenticated = token;
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <SidebarWithHeader>
      <Flex>
        <PageHeader portfolioValue={portfolioValue} />
        <Spacer />
        <Box>
          <Flex alignItems="center">
            {refreshError && (
              <Alert status="error">
                <AlertIcon />
                There was an error in refreshing, please wait
              </Alert>
            )}
            <div className={"float"}>
              <Button
                isLoading={isRefreshing}
                loadingText="Updating will take several minutes please wait"
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
              <Select placeholder="Zebpay" size="lg" mr={5}>
                {/* <option value="wazirx">Wazirx</option> */}
                {/* <option value="option2">CoinDcx </option> */}
                <option value="zebpay">Zebpay</option>
              </Select>
              <Spacer />
              <Spacer />
              <Select placeholder="INR" size="lg">
                <option value="option1">INR</option>
                {/* <option value="option2">USD </option> */}
              </Select>
            </Flex>
          </Flex>
        </Box>
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
              <div
                className=""
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "flex-end",
                  width: "100%",
                  // maxWidth: "50%",
                  minWidth: "300px",
                }}
              >
                {chartDays.map((day) => (
                  <Button
                    key={day.value}
                    onClick={() => {
                      // setNewFlag(false);
                      setIsLoading(true);
                      updateChartData(day.value);
                    }}
                    isLoading={day.value === days && isLoading}
                    style={
                      day.value === days
                        ? {
                            marginRight: "1em",
                            backgroundColor: "black",
                            color: "white",
                          }
                        : {
                            marginRight: "1em",
                          }
                    }
                    selected={day.value === days}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
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
              <Line
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

                  options: {
                    interaction: {
                      mode: "index",
                    },
                    responsive: true,
                    legend: {
                      display: false,
                    },
                    hover: {
                      intersect: false,
                    },
                    elements: {
                      line: {
                        tension: 0,
                      },
                      point: {
                        radius: 0,
                      },
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: (ctx) =>
                          "Point Style: " +
                          ctx.chart.data.datasets[0].pointStyle,
                      },
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        displayColors: false,
                        backgroundColor: "blue",
                        titleFontColor: "blue",
                        bodyFontColor: "blue",
                      },
                    },
                    maintainAspectRatio: false,
                    tooltips: {
                      backgroundColor: "rgba(0,0,0,0.8)",
                      bodyAlign: "left",
                      bodyFontColor: "#fff",
                      bodySpacing: 2,
                      borderColor: "rgba(0,0,0,0)",
                      borderWidth: 0,
                      caretPadding: 2,
                      caretSize: 5,
                      cornerRadius: 6,
                      custom: null,
                      displayColors: true,
                      enabled: true,
                      footerAlign: "left",
                      footerFontColor: "#fff",
                      footerFontStyle: "bold",
                      footerMarginTop: 6,
                      footerSpacing: 2,
                      intersect: true,
                      mode: "nearest",
                      multiKeyBackground: "#fff",
                      position: "average",
                      titleAlign: "left",
                      titleFontColor: "#fff",
                      titleFontStyle: "bold",
                      titleMarginBottom: 6,
                      titleSpacing: 2,
                      xPadding: 6,
                      yPadding: 6,
                    },
                    // tooltips: {
                    //   displayColors: false,
                    //   backgroundColor: "white",
                    //   titleFontColor: "blue",
                    //   mode: "index",
                    //   intersect: false,
                    //   callbacks: {
                    //     title: function (item, everything) {
                    //       let xLabel = item.xLabel;
                    //       let yLabel = item.yLabel;
                    //       let label = "Good" + xLabel + " and " + yLabel;
                    //       console.log("title item", item);
                    //       return label;
                    //     },
                    //     label: function (item, everything) {
                    //       let xLabel = item.xLabel;
                    //       let yLabel = item.yLabel;
                    //       let label = "Good" + xLabel + " and " + yLabel;
                    //       console.log("label item", item);
                    //       return label;
                    //     },
                    //   },
                    // },
                    scales: {
                      xAxes: [
                        {
                          type: "time",
                          time: {
                            format: "MM/DD/YY",
                            tooltipFormat: "ll",
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      ],
                      yAxes: [
                        {
                          gridLines: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      ],
                    },
                  },
                  // options: {
                  //   responsive: true,
                  //   plugins: {
                  //     title: {
                  //       display: true,
                  //       text: (ctx) =>
                  //         "Point Style: " +
                  //         ctx.chart.data.datasets[0].pointStyle,
                  //     },
                  //     legend: {
                  //       display: false,
                  //     },
                  //   },
                  // },
                }}
              />
            </Box>
          </div>
        )}
      </div>
      <div id="wrapper">
        <canvas id="canvas">
          {/* <!-- your chart will be generated here! --> */}
        </canvas>
      </div>
      <PortfolioTable
      // holdings={holdings && holdings}
      // coinsLatestPrice={coinsLatestPrice}
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
