import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box,
  Text,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { APP_URL } from "./constants";
// import { headers } from "./api";
import SidebarWithHeader from "./components/SideNavBar";

const headers = {
  "Content-Type": "application/json",
};

export default function UserProfileEdit() {
  let token = localStorage.getItem("token");
  const [data, setData] = useState("");
  useEffect(() => {
    handleProfile();
    // handleProfileAxios();
  }, []);

  const handleProfile = () => {
    // setMessage("");
    // setIsLoading(true);
    fetch(APP_URL + "profile", {
      method: "GET",
      headers: { ...headers, "x-access-token": token },
    })
      .then((res) => res.json())
      .then((response) => {
        setData(response);
        // if (response.token) {
        //   localStorage.setItem("token", response.token);
        //   //   setIsLoading(false);
        //   //   navigate("/dashboard");
        // }
        return response;
      })
      .catch((e) => console.log(e));
    // if (token) {
    //   console.log("token", token);
    //   // setLoading(false);
    // }
  };

  const handleProfileAxios = () => {
    axios({
      // Endpoint to send files
      url: APP_URL + "profile",
      method: "GET",
      headers: headers,
    })
      // Handle the response from backend here
      .then((res) => {
        console.log("handleProfileAxios res", res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <SidebarWithHeader>
      <Flex
      // minH={"100vh"}
      // align={"center"}
      // justify={"center"}
      // bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Profile Details
          </Heading>
          {data && (
            <Box>
              <Text>{data.name}</Text>
              <Text>{data.email}</Text>
            </Box>
          )}
        </Stack>
      </Flex>
    </SidebarWithHeader>
  );
}
