import React, { useEffect, useState } from "react";
import { Box, Stack, Skeleton } from "@chakra-ui/react";
import SidebarWithHeader from "../SideNavBar";
import TableComponent from "../Tables";

const API_URL = "https://stockpalapi.glassball.app";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);

  let token = localStorage.getItem("token");

  useEffect(() => {
    console.log("err");
    if (!tableData.length) {
      GetTransactions();
    }
  }, []);

  const GetTransactions = () => {
    // setMessage("");
    fetch(API_URL + "/api/portfolio/transactions/?account__id=24", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + token,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          console.log("response", response);
          setTableData(response);
          setIsLoaded(true);
        }
      })
      .catch((e) => console.log(e));
    // if (token) {
    //   console.log("token", token);
    //   // setLoading(false);
    // }
  };
  return (
    <SidebarWithHeader>
      {isLoaded ? (
        <Box w="100%" bg="white">
          <TableComponent tableData={tableData} />
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
