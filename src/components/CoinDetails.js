import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import CanvasJSReact from "../canvasjs.react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Stack,
  Skeleton,
  Container,
  Badge,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  Flex,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  Link,
  CircularProgress,
  Image,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Grid,
} from "@chakra-ui/react";

import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiMoreVertical,
} from "react-icons/fi";
import SidebarWithHeader from "./SideNavBar";
import TableComponent from "./Tables";
import { headers, HistoricalChart, SingleCoin } from "../api";
import { APP_URL, headerKeys, numberWithCommas } from "../constants";
import { CryptoState } from "./CryptoContext";
import { chartDays } from "./Chartdays";
import { symbolDetails } from "../Coindeckodetails";
const API_URL = "https://stockpalapi.glassball.app";

const CoinDetails = () => {
  let token = localStorage.getItem("token");
  const { id, quantity } = useParams();
  const [flag, setflag] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [totalAssets, setTotalAssets] = useState(0);
  const [transactionData, setTransactionData] = useState();
  const [array, setArray] = useState([]);
  const [holdingsData, setHoldingsData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [historicData, setHistoricData] = useState([]);
  const [coinData, setCoinData] = useState();
  const [days, setDays] = useState(1);
  const [sum, setSum] = useState(0);
  const [coinsList, setCoinsList] = useState(Object.keys(symbolDetails));
  const [isCoinError, setIsCoinError] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("");
  // const { currency } = CryptoState();
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [canvasOptions, setCanvasOptions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [platform, setPlatform] = useState("zebpay");
  const [typeofChange, settypeofChange] = useState("above");
  const [typeofValue, settypeofvalue] = useState("percentage");
  const [value, setValue] = useState(0);
  const [trackBy, setTrackBy] = useState("costbasis");
  const [comments, setComments] = useState("Alert");
  const coinId = id;
  // console.log("coinId", coinId);
  // const [isRefreshing, setRefreshing] = useState(false);
  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const fetchHistoricData = async (days) => {
    setDays(days);
    const { data } = await axios.get(
      HistoricalChart(symbolDetails[id.toLowerCase()].id, days, currency)
    );
    // setHistoricData(data.prices);

    formatDatainto(data.prices, days);
    let res = [...data.prices].reverse();
    setSum(res[0][1] * quantity);
    setCurrentPrice(res[0][1]);
    setIsLoading(false);
    setflag(true);
  };

  const getHoldingsDetailsFromAPI = (platform) => {
    axios
      .post(
        APP_URL + "getportfoliodata",
        { platform: platform },
        { headers: { ...headers, "x-access-token": token } }
      )
      .then((response) => {
        // console.log("getportfoliodata", response);
        calculatingHoldings(response.data);
      })
      .catch((err) => console.log("err: ", err));
  };

  const calculatingHoldings = (givenData) => {
    let data = [];
    let keys = Object.keys(givenData.totalCurrentValue);
    let totalCoinHoldings = 0;
    // keys.map((key) => {
    let obj = {};
    //   obj["Asset"] = key;
    obj["Holdings"] = givenData.totalQuantity[id]
      ? givenData.totalQuantity[id]
      : 0;

    obj["Purchased value"] = givenData.totalPurchaseValue[id]
      ? givenData.totalPurchaseValue[id]
      : 0;

    // obj["Current Value"] = givenData.totalCurrentValue[key];
    // obj["Difference"] = givenData.totalDiff[key];
    // data.push(obj);
    // });
    setHoldingsData(obj);
  };

  const formatDatainto = (historicData, days) => {
    const data = historicData.map((coin) => {
      return { x: new Date(coin[0]), y: coin[1] * quantity };
    });
    returnCanvasData(data, days);
  };

  const downloadCSV = (csvStr) => {
    var hiddenElement = document.createElement("a");
    // hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvStr);
    hiddenElement.href = "data:attachment/csv," + csvStr;
    hiddenElement.target = "_blank";
    hiddenElement.download = "MyCryptoTaxDetails.csv";
    hiddenElement.click();
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
    setCanvasOptions(reqCanvasData);
  };

  const exportCSVFromTable = (columns, csvData) => {
    // console.log("columns", columns);
    // console.log("csvData", csvData);
    var csvRow = [];
    var A = [["id", ...columns.map((item) => item)]];
    var re = csvData;

    for (let index = 0; index < re.length; index++) {
      A.push([
        index,
        ...columns.map((item) => {
          return re[index][item];
        }),
      ]);
    }
    // console.log("A", A);
    for (let index = 0; index < A.length; ++index) {
      csvRow.push(A[index].join(","));
    }
    // console.log("csvRow", csvRow);
    var csvString = csvRow.join("%0A");
    // console.log("csvString", csvString);
    downloadCSV(csvString);
  };

  const handlePlatform = (platform) => {
    setPlatform(platform);
    getHoldingsDetailsFromAPI(platform);
  };
  const handleTypeofChange = (typeofChange) => {
    settypeofChange(typeofChange);
  };
  const handleTypeofValue = (typeofValue) => {
    settypeofvalue(typeofValue);
  };
  const handleValue = (value) => {
    setValue(value);
    console.log("=========value", value);
  };

  const handleAlertSubmit = () => {
    // console.log({
    //   coin: coinId,
    //   platform: platform,
    //   typeofchange: typeofChange,
    //   typeofvalue: typeofValue,
    //   value: value,
    // });
    // return;
    axios
      .post(
        APP_URL + "setalert",
        {
          platform,
          typeofchange: typeofChange,
          comment: comments,
          typeofalert: trackBy,
          coin: coinId,
          platform: platform,
          typeofvalue: typeofValue,
          value: value || 0,
        },
        { headers: { ...headers, "x-access-token": token } }
      )
      .then((response) => {
        // let data = response.data;
        // setGraphData(data);
        // setisLoadingTransaction(false);
        // setTransactionSuccess(true);
        // fetchTransactions();
        // setPlatform("");
        // settypeofChange("");
        // settypeofvalue("");
        // setValue("");
        onClose();
        // console.log("reqData", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  const fetchCoin = async () => {
    const { data } = await axios.get(
      SingleCoin(symbolDetails[id.toLowerCase()].id)
    );
    setCoinData(data);
  };

  useEffect(() => {
    fetchHistoricData(days);
    fetchTransactionsbyCoin();
    // fetchGraphbyCoin();
    getHoldingsDetailsFromAPI(platform);
    fetchTransactionsByPlatform();
    fetchCoin();
  }, []);

  const updateChartData = (day) => {
    if (day === days) {
      return;
    }
    setIsLoading(true);
    fetchHistoricData(day);
  };

  const fetchTransactionsbyCoin = () => {
    axios
      .post(
        APP_URL + "gettransactionbycoin",
        { coin: `${id}`, platform: platform },
        { headers: headers }
      )
      .then((response) => {
        let data = response.data;
        setArray(data);
        totalCostData(data);
        // console.log("reqData", symbol, data);
      })
      .catch((err) => console.log("err: ", err));
  };

  const fetchTransactionsByPlatform = () => {
    console.log("token", token);
    console.log("headers", headers);
    axios
      .post(
        APP_URL + "gettransactionsbyplatform",
        { platform, securityName: id },
        { headers: { ...headers, "x-access-token": token } }
      )
      .then((response) => {
        let data = response;
        // setGraphData(data);
        // console.log("reqData", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  const fetchAlerts = () => {
    axios
      .get(
        APP_URL + "getalertsbyuser",
        { coin: `${id}`, parameter: "1week" },
        { headers: headers }
      )
      .then((response) => {
        let data = response;
        // setGraphData(data);
        console.log("reqData", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  const fetchGraphbyCoin = () => {
    axios
      .post(
        APP_URL + "getgraphbycoin",
        { coin: `${id}`, parameter: "1week" },
        { headers: headers }
      )
      .then((response) => {
        let data = response.data;
        setGraphData(data);

        // console.log("reqData", symbol, reqData);
      })
      .catch((err) => console.log("err: ", err));
  };
  const handleTrackBy = (selectedTrackBy) => {
    setTrackBy(selectedTrackBy);
  };
  const handleComments = (value) => {
    setComments(value);
  };

  const totalCostData = (dummyData) => {
    let newReqObj = {};
    Object.values(dummyData)
      .flat()
      .map((item) => {
        if (newReqObj[item[0]]) {
          // console.log(newReqObj[item[0]]);
          newReqObj[item[0]] = newReqObj[item[0]] + (item[1] ? item[1] : 0);
        } else {
          newReqObj[item[0]] = item[1] ? item[1] : 0;
        }
      });
    // console.log("newReqObj", newReqObj);
    setSum(newReqObj[moment().format("DD-MM-YYYY")].costBasis);
    setCurrentPrice(newReqObj[moment().format("DD-MM-YYYY")].current_price);
    setGraphData(newReqObj);
    setflag(true);
  };

  const trackingPrice = () => {
    let result = 0;
    let givenValue = value || 0;
    if (typeofChange == "above") {
      if (trackBy == "currentvalue") {
        if (typeofValue == "percentage") {
          result =
            parseFloat(currentPrice) +
            parseFloat(currentPrice) * (parseFloat(givenValue) / 100);
        } else {
          result = parseFloat(currentPrice) + parseFloat(givenValue);
        }
      } else {
        if (typeofValue == "percentage") {
          result =
            parseFloat(holdingsData["Purchased value"]) +
            parseFloat(holdingsData["Purchased value"]) *
              (parseFloat(givenValue) / 100);
        } else {
          result =
            parseFloat(holdingsData["Purchased value"]) +
            parseFloat(givenValue);
        }
      }
    } else {
      if (trackBy == "currentvalue") {
        if (typeofValue == "percentage") {
          result =
            parseFloat(currentPrice) -
            parseFloat(currentPrice) * (parseFloat(givenValue) / 100);
        } else {
          result = parseFloat(currentPrice) - parseFloat(givenValue);
        }
      } else {
        if (typeofValue == "percentage") {
          result =
            parseFloat(holdingsData["Purchased value"]) -
            parseFloat(holdingsData["Purchased value"]) *
              (parseFloat(givenValue) / 100);
        } else {
          result =
            parseFloat(holdingsData["Purchased value"]) -
            parseFloat(givenValue);
        }
      }
    }

    return result.toFixed(2);
  };

  // console.log("coinData", coinData);
  return (
    <SidebarWithHeader>
      <Box
        bg="bg-surface"
        borderRadius="lg"
        // boxShadow={"0px 12px 40px rgba(16, 24, 64, 0.24)"}
        bgColor={"white"}
        padding={[1, 5]}
        //   maxWidth={"100%"}
        //   minWidth={"200px"}
      >
        <Flex alignItems={"flex-start"} justifyContent="space-between" mb={6}>
          <Box>
            <HStack justify="flex-start">
              {/* <img
                  src={coinData?.image.small}
                  alt={coinData?.name}
                  height="200"
                  style={{ marginBottom: 20 }}
                /> */}
              <Image
                src={coinData && coinData?.image?.small}
                alt={coinData?.name}
              />

              <Heading
                size={useBreakpointValue({
                  base: "sm",
                  md: "md",
                })}
              >
                {coinData?.name}
              </Heading>

              {/* <Icon as={FiMoreVertical} boxSize="5" color="muted" /> */}
            </HStack>
            <HStack justify="space-between">
              {/* <Text fontSize="sm" color="muted">
                  {"36"}
                </Text> */}

              {/* <Badge variant="subtle" colorScheme={true ? "green" : "red"}>
                  <HStack spacing="1">
                    <Icon as={true ? FiArrowUpRight : FiArrowDownRight} />
                    <Text>2</Text>
                  </HStack>
                </Badge> */}
            </HStack>
            <Text fontSize="lg" color="muted" mt={1}>
              <b>
                {"Total asset value : Rs." +
                  Intl.NumberFormat("en-IN").format(sum)}
              </b>
            </Text>
            <Text fontSize="md" color="muted" mt={2}>
              {"Holdings: " + (quantity && quantity)}
            </Text>
            <Text fontSize="md" color="muted">
              {"Current Price: Rs." + (currentPrice && currentPrice)}
            </Text>
          </Box>
          <Button colorScheme="teal" variant="outline" onClick={() => onOpen()}>
            + Add Alert
          </Button>
        </Flex>
        <Modal
          style={{ minWidth: "1000px" }}
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          size={"2xl"}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Your Alert</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Grid
                templateColumns={["none", "none", "repeat(2, 1fr)"]}
                gap={4}
              >
                {/* <Flex flexWrap={["wrap", "wrap", "nowrap"]}> */}
                <FormControl mt={4} mb={4}>
                  <FormLabel>Platform</FormLabel>
                  <Select
                    value={platform}
                    onChange={(e) => {
                      handlePlatform(e.target.value);
                    }}
                  >
                    <option value="wazirx">Wazirx</option>
                    <option value="zebpay">Zebpay</option>
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Selected Asset</FormLabel>
                  <Input placeholder="Selected Coin" value={id} readOnly />
                </FormControl>
              </Grid>
              <Grid
                templateColumns={["none", "none", "repeat(3, 1fr)"]}
                gap={4}
              >
                <FormControl mt={4}>
                  <FormLabel>Total {id}</FormLabel>
                  <Input
                    placeholder={id + " value"}
                    value={
                      holdingsData &&
                      holdingsData.Holdings &&
                      Intl.NumberFormat("en-IN").format(holdingsData.Holdings)
                    }
                    readOnly
                    // onChange={(e) => handleValue(e.target.value)}
                  />
                  {console.log("holdingsData", holdingsData)}
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>{id} Cost basis</FormLabel>
                  <Input
                    placeholder="Cost basis"
                    value={
                      holdingsData &&
                      holdingsData["Purchased value"] &&
                      Intl.NumberFormat("en-IN").format(
                        holdingsData["Purchased value"]
                      )
                    }
                    readOnly
                    // onChange={(e) => handleValue(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>{id} Current Price</FormLabel>
                  <Input
                    placeholder="current price"
                    value={
                      currentPrice &&
                      Intl.NumberFormat("en-IN").format(currentPrice)
                    }
                    readOnly
                    // onChange={(e) => handleValue(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid
                templateColumns={["none", "none", "repeat(4, 1fr)"]}
                gap={4}
              >
                <FormControl mt={4} mb={4}>
                  <FormLabel>Track</FormLabel>
                  <Select
                    value={trackBy}
                    onChange={(e) => {
                      handleTrackBy(e.target.value);
                    }}
                  >
                    <option value="costbasis">Cost Basis</option>
                    <option value="currentvalue">Current Value</option>
                  </Select>
                </FormControl>
                <FormControl mt={4} mb={4}>
                  <FormLabel>Alert For</FormLabel>
                  <Select
                    value={typeofChange}
                    onChange={(e) => {
                      handleTypeofChange(e.target.value);
                    }}
                  >
                    <option value="above">Increases by</option>
                    <option value="below">Decreases by</option>
                  </Select>
                </FormControl>
                <FormControl mt={4} mb={4}>
                  <FormLabel>Change In</FormLabel>
                  <Select
                    value={typeofValue}
                    onChange={(e) => {
                      handleTypeofValue(e.target.value);
                    }}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="number">Number</option>
                  </Select>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Value</FormLabel>
                  <Input
                    placeholder="Value"
                    value={
                      value &&
                      Intl.NumberFormat("en-IN").format(parseFloat(value))
                    }
                    onChange={(e) => handleValue(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Text>
                Example1 : If Current {id} portfolio value increases by 20% WRT
                to cost basis send me an alert.
              </Text>
              <Text>
                Example 2: If tracking prices decreases by Rs 2000 send me an
                alert.
              </Text>
              <FormControl mt={4}>
                <FormLabel>Your tracking price</FormLabel>
                <Input
                  placeholder="price"
                  value={
                    trackingPrice() &&
                    Intl.NumberFormat("en-IN").format(trackingPrice())
                  }
                  readOnly
                  // onChange={(e) => handleValue(e.target.value)}
                />
              </FormControl>
              <Text>
                You will be sent an alert when your {id} portfolio value reaches
                Rs.{" "}
                {trackingPrice() &&
                  Intl.NumberFormat("en-IN").format(trackingPrice())}
              </Text>
              <FormControl mt={4}>
                <FormLabel>Add Comments</FormLabel>
                <Input
                  placeholder="Add some comments here"
                  value={comments}
                  onChange={(e) => handleComments(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                // disabled={true}
                onClick={() => handleAlertSubmit()}
              >
                Create Alert
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Divider />
        <div className={"coin-graph-container"}>
          {!historicData | (flag === false) ? (
            <Center mt={3}>
              <CircularProgress isIndeterminate color="green.300" />
            </Center>
          ) : (
            <div className="coin-chart">
              <Flex
                flexWrap={"wrap"}
                justifyContent={["flex-start", "flex-end"]}
                mt={5}
              >
                {chartDays.map((day) => (
                  <Button
                    isLoading={day.value === days && isLoading}
                    style={
                      day.value === days
                        ? {
                            margin: "1em 1em 0.5em 0",
                            backgroundColor: "black",
                            color: "white",
                          }
                        : {
                            margin: "1em 1em 0.5em 0",
                          }
                    }
                    key={day.value}
                    onClick={() => {
                      // setflag(false);

                      updateChartData(day.value);
                    }}
                    selected={day.value === days}
                  >
                    {day.label}
                  </Button>
                ))}
              </Flex>

              <Box bg={"white"} flex="1">
                {canvasOptions && (
                  <CanvasJSChart
                    options={canvasOptions}
                    /* onRef={ref => this.chart = ref} */
                  />
                )}
                {/* <Line
                  data={{
                    elements: { line: { tension: 0 } },
                    labels: historicData.map((coin) => {
                      let date = new Date(coin[0]);
                      let time =
                        date.getHours() > 12
                          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                          : `${date.getHours()}:${date.getMinutes()} AM`;
                      return days === 1
                        ? time
                        : date.toLocaleDateString() + " " + time;
                    }),
                    datasets: [
                      {
                        type: "line",
                        // backgroundColor: "#5AC53B",
                        borderColor: "#5AC53B",
                        borderWidth: 2,
                        pointBorderColor: "rgba(0, 0, 0, 0)",
                        pointBackgroundColor: "rgba(0, 0, 0, 0)",
                        pointHoverBackgroundColor: "#5AC53B",
                        // pointHoverBorderColor: "#000000",
                        pointHoverBorderWidth: 4,
                        pointHoverRadius: 6,
                        data: historicData.map((coin) => coin[1] * quantity),
                        label: `Price ( Past ${days} Days ) in ${currency}`,
                        tension: 0.4,
                      },
                    ],
                    options: {
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
                      maintainAspectRatio: false,
                      tooltips: {
                        mode: "index",
                        intersect: false,
                        callbacks: {},
                      },
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
                /> */}
              </Box>
            </div>
          )}
        </div>
      </Box>
      <Flex justifyContent={"flex-end"}>
        <Button
          mb={6}
          colorScheme="blue"
          mt={4}
          disabled={!(array && array.length > 0)}
          onClick={(e) => {
            exportCSVFromTable(headerKeys, array);
          }}
        >
          Export
        </Button>
      </Flex>
      <Box bg={"white"} flex="1" p={[1, 5]}>
        <Box
          w="full"
          h="full"
          rounded="lg"
          // border="3px dashed currentColor"
          // color={mode("gray.200", "gray.700")}
        >
          {array.length == 0 && (
            <Center>
              <Flex
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text>No Transactions Found! </Text>
                <Text>
                  Please Upload transactions from
                  <Link ms="5px" fontWeight="bold" href={"/fileUpload"}>
                    Add Sources tab
                  </Link>
                </Text>
              </Flex>
            </Center>
          )}
          <TableContainer>
            <Table variant="simple">
              {/* <TableCaption>Preview Data Here</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>Symbol</Th>
                  {array &&
                    array.length > 0 &&
                    headerKeys.map((key, i) => {
                      return <Th key={i}>{key}</Th>;
                    })}
                </Tr>
              </Thead>
              <Tbody>
                {array &&
                  array.length > 0 &&
                  array.map((rowData, i) => {
                    return (
                      <Tr key={i}>
                        <Td>
                          <Image
                            src={coinData && coinData?.image?.small}
                            alt={coinData?.name}
                          />
                        </Td>
                        {headerKeys.map((val, i) => (
                          <Td key={i}>{rowData[val]}</Td>
                        ))}
                        {/* {keys.map((key) => {
                      return <Td>{rowData[key]}</Td>;
                    })} */}
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </SidebarWithHeader>
  );
};

export default CoinDetails;
