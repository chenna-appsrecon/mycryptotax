import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

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
import axios from "axios";
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

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );
const API_URL = "https://stockpalapi.glassball.app";

const CoinDetails = () => {
  const { id, quantity } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [totalAssets, setTotalAssets] = useState(0);
  const [transactionData, setTransactionData] = useState();
  const [array, setArray] = useState([]);
  const [historicData, setHistoricData] = useState();
  const [coinData, setCoinData] = useState();
  const [days, setDays] = useState(1);
  // const { currency } = CryptoState();
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [flag, setflag] = useState(false);
  const fetchHistoricData = async (days) => {
    const { data } = await axios.get(HistoricalChart(id, days, currency));
    setflag(true);
    setHistoricData(data.prices.slice(0, 15));
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
    const { data } = await axios.get(SingleCoin(id));

    setCoinData(data);
    fetchTransactions(data.symbol);
  };

  useEffect(() => {
    fetchHistoricData(days);
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateChartData = (day) => {
    fetchHistoricData(day);
  };
  // useEffect(() => {
  //   fetchTransactions();
  // }, []);
  const fetchTransactions = (symbol) => {
    axios
      .get(APP_URL + "gettransaction", { headers: headers })
      .then((response) => {
        let data = response.data;
        let reqData = data.filter(
          (item) => item.securityName.toLowerCase() == symbol
        );
        setArray(reqData);
        // console.log("reqData", symbol, reqData);
      })
      .catch((err) => console.log("err: ", err));
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
          <b>
            {"Total asset value : Rs." +
              (coinData &&
                coinData?.market_data.current_price &&
                coinData?.market_data.current_price[currency.toLowerCase()] *
                  quantity)}
          </b>
        </Text>
        <Text fontSize="md" color="muted" mt={2}>
          {"Holdings: " + (quantity && quantity)}
        </Text>
        <Text fontSize="md" color="muted">
          {"Current Price: Rs." +
            (coinData &&
              coinData?.market_data.current_price &&
              numberWithCommas(
                coinData?.market_data.current_price[currency.toLowerCase()]
              ))}
        </Text>

        {/* </Box> */}
        <Divider />
        {/* </Flex> */}
        <div className={""}>
          {!historicData | (flag === false) ? (
            <CircularProgress
            // style={{ color: "gold" }}
            // size={250}
            // thickness={1}
            />
          ) : (
            <div style={{ width: "50%" }}>
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <div
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
                    elements: { line: { tension: 0.4 } },
                    labels: historicData.map((coin) => {
                      let date = new Date(coin[0]);
                      let time =
                        date.getHours() > 12
                          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                          : `${date.getHours()}:${date.getMinutes()} AM`;
                      return days === 1 ? time : date.toLocaleDateString();
                    }),
                    datasets: [
                      {
                        data: historicData.map((coin) => coin[1]),
                        label: `Price ( Past ${days} Days ) in ${currency}`,
                        borderColor: "#23E33E",
                        // backgroundColor:
                        //   "linear-gradient(180deg, #23E33E -67.46%, rgba(255, 255, 255, 0.0001) 69.63%)",
                        tension: 0.4,
                        pointStyle: "circle",
                        pointRadius: 6,
                        pointHoverRadius: 9,
                      },
                    ],
                    options: {
                      responsive: true,
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
                      },
                    },
                  }}
                />
              </Box>
            </div>
          )}
        </div>

        {/* <Box bg={"white"} flex="1" p="6">
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
                           {keys.map((key) => {
                      return <Td>{rowData[key]}</Td>;
                    })} 
                        </Tr>
                      );
                    })}
                </Tbody>
                 <Tfoot>
            <Tr>
              {headerKeys &&
                headerKeys.length > 0 &&
                headerKeys.map((key) => {
                  return <Th>{key}</Th>;
                })}
            </Tr>
          </Tfoot> 
              </Table>
            </TableContainer>
          </Box>
        </Box> */}
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
              {/* <Tfoot>
            <Tr>
              {headerKeys &&
                headerKeys.length > 0 &&
                headerKeys.map((key) => {
                  return <Th>{key}</Th>;
                })}
            </Tr>
          </Tfoot> */}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </SidebarWithHeader>
  );
};

export default CoinDetails;
