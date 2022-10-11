import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
  const [graphData, setGraphData] = useState([]);
  const [historicData, setHistoricData] = useState([]);
  const [coinData, setCoinData] = useState();
  const [days, setDays] = useState(1);
  const [sum, setSum] = useState(0);
  // const { currency } = CryptoState();
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [currentPrice, setCurrentPrice] = useState(0);

  const fetchHistoricData = async (days) => {
    setDays(days);
    const { data } = await axios.get(
      HistoricalChart(symbolDetails[id.toLowerCase()].id, days, currency)
    );
    setHistoricData(data.prices);
    let res = [...data.prices].reverse();
    setSum(res[0][1] * quantity);
    setCurrentPrice(res[0][1]);
    setflag(true);
  };

  const downloadCSV = (csvStr) => {
    var hiddenElement = document.createElement("a");
    // hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvStr);
    hiddenElement.href = "data:attachment/csv," + csvStr;
    hiddenElement.target = "_blank";
    hiddenElement.download = "MyCryptoTaxDetails.csv";
    hiddenElement.click();
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
    fetchCoin();
  }, []);

  const updateChartData = (day) => {
    fetchHistoricData(day);
  };

  const fetchTransactionsbyCoin = () => {
    axios
      .post(
        APP_URL + "gettransactionbycoin",
        { coin: `${id}` },
        { headers: headers }
      )
      .then((response) => {
        let data = response.data;
        setArray(data);
        // console.log("reqData", symbol, reqData);
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
    console.log("newReqObj", newReqObj);
    setSum(newReqObj[moment().format("DD-MM-YYYY")].costBasis);
    setCurrentPrice(newReqObj[moment().format("DD-MM-YYYY")].current_price);
    setGraphData(newReqObj);
    setflag(true);
  };

  // console.log("coinData", coinData);
  return (
    <SidebarWithHeader>
      <Box
        bg="bg-surface"
        borderRadius="lg"
        // boxShadow={"0px 12px 40px rgba(16, 24, 64, 0.24)"}
        bgColor={"white"}
        padding={5}
        //   maxWidth={"100%"}
        //   minWidth={"200px"}
      >
        {/* <Flex alignItems={"flex-start"} justifyContent="flex-start" mb={6}> */}
        {/* <Box> */}
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
          <b>{"Total asset value : Rs." + sum}</b>
        </Text>
        <Text fontSize="md" color="muted" mt={2}>
          {"Holdings: " + (quantity && quantity)}
        </Text>
        <Text fontSize="md" color="muted">
          {"Current Price: Rs." + (currentPrice && currentPrice)}
        </Text>

        {/* </Box> */}
        <Divider />
        {/* </Flex> */}
        <div className={"coin-graph-container"}>
          {!historicData | (flag === false) ? (
            <Center mt={3}>
              <CircularProgress isIndeterminate color="green.300" />
            </Center>
          ) : (
            <div className="coin-chart" style={{}}>
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
                    maxWidth: "50%",
                    minWidth: "300px",
                  }}
                >
                  {chartDays.map((day) => (
                    <Button
                      style={{ marginRight: "0.5em" }}
                      key={day.value}
                      onClick={() => {
                        setflag(false);
                        updateChartData(day.value);
                      }}
                      selected={day.value === days}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Box bg={"white"} flex="1">
                <Line
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
                />
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
      <Box bg={"white"} flex="1" p="6">
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
