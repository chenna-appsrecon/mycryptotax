import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";
import { APP_URL } from "../../constants";
let headerKeys = [
  "Asset",
  "Holdings",
  // "Current Price",
  // "Purchased value",
  // "Difference",
  "Current Value",
];

const headers = {
  "Content-Type": "application/json",
};

const PortfolioTable = () => {
  let token = localStorage.getItem("token");
  const [array, setArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHoldingsDetailsFromAPI();
  }, []);

  const getHoldingsDetailsFromAPI = () => {
    axios
      .post(
        APP_URL + "getportfoliodata",
        { platform: "zebpay" },
        { headers: { ...headers, "x-access-token": token } }
      )
      .then((response) => {
        console.log("response", response);
        calculatingHoldings(response.data);
      })
      .catch((err) => console.log("err: ", err));
  };

  const calculatingHoldings = (givenData) => {
    let data = [];
    let keys = Object.keys(givenData.totalCurrentValue);
    keys.map((key) => {
      let obj = {};
      obj["Asset"] = key;
      obj["Holdings"] = givenData.totalQuantity[key]
        ? givenData.totalQuantity[key]
        : 0;
      obj["Purchased value"] = givenData.totalPurchaseValue[key];
      obj["Current Value"] = givenData.totalCurrentValue[key];
      obj["Difference"] = givenData.totalDiff[key];
      data.push(obj);
    });

    setArray(data);
  };
  // const getHoldingsDetails = () => {
  //   let data = [];
  //   Object.keys(holdings).map((key) => {
  //     let obj = {};
  //     obj["Asset"] = key;
  //     obj["Holdings"] = holdings[key].quantity.toFixed(5);
  //     obj["Purchased value"] = holdings[key].costBasis;
  //     obj["Current Value"] =
  //       coinsLatestPrice[holdings[key].name.toLowerCase()] &&
  //       coinsLatestPrice[holdings[key].name.toLowerCase()].inr *
  //         holdings[key].quantity;
  //     obj["Current Price"] =
  //       coinsLatestPrice[holdings[key].name.toLowerCase()] &&
  //       coinsLatestPrice[holdings[key].name.toLowerCase()].inr;
  //     data.push(obj);
  //   });
  //   setArray(data);
  // };
  // console.log("array", array);
  return (
    <Box flex="1" p="6">
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
                    <Tr
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate({
                          pathname:
                            "/coindetails/" +
                            rowData.Asset +
                            "/" +
                            rowData.Holdings,
                        })
                      }
                    >
                      {headerKeys.map((val, i) => {
                        if (val == "Difference" && parseInt(rowData[val]) < 0) {
                          return (
                            <Td style={{ color: "#FF0000" }} key={i}>
                              {parseFloat(rowData[val]).toFixed(2)}
                            </Td>
                          );
                        } else if (
                          val == "Difference" &&
                          parseInt(rowData[val]) > 0
                        ) {
                          return (
                            <Td style={{ color: "#5AC53B" }} key={i}>
                              {parseFloat(rowData[val]).toFixed(2)}
                            </Td>
                          );
                        } else {
                          return <Td key={i}>{rowData[val]}</Td>;
                        }
                      })}
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
  );
};

export default PortfolioTable;
