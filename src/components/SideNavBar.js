import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";
import { RepeatIcon } from "@chakra-ui/icons";

import { IconType } from "react-icons";
import { ReactText } from "react";
import TableComponent from "./Tables";
import { APP_URL } from "../constants";
import axios from "axios";
import { headers } from "../api";

const LinkItems = [
  { name: "Dashboard", icon: FiHome, path: "/dashboard" },
  { name: "Transactions", icon: FiTrendingUp, path: "/transactions" },
  { name: "Add Sources", icon: FiCompass, path: "/fileUpload" },
  { name: "Wallets", icon: FiStar, path: "/connectwallet" },
  // { name: "Documents", icon: FiSettings, path: "/dashboard" },
];

export default function SidebarWithHeader({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log("SidebarWithHeader");
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" padding={30} background="white">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link href={"/"} style={{ textDecoration: "none" }}>
          <Text fontSize="2xl" fontWeight="bold">
            MyCryptoTax
          </Text>
        </Link>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ path, icon, children, ...rest }) => {
  return (
    <Link
      href={path}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const [data, setData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };
  const handleProfile = () => {
    // setMessage("");
    // setIsLoading(true);
    fetch(APP_URL + "profile", {
      method: "GET",
      headers: headers,
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

  const updateCurrentValues = () => {
    axios
      .get(APP_URL + "gettransaction", { headers: headers })
      .then((response) => {
        // console.log("response", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Link href={"/"} style={{ textDecoration: "none" }}>
        <Text
          display={{ base: "flex", md: "none" }}
          fontSize="2xl"
          // fontFamily="monospace"
          fontWeight="bold"
        >
          MyCryptoTax
        </Text>
      </Link>
      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<RepeatIcon />}
        />

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm"> {data && data.name} </Text>
                  <Text fontSize="xs" color="gray.600">
                    {/* Admin */}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Link
                href={"/profile"}
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                <MenuItem>Profile</MenuItem>
              </Link>
              {/* <MenuItem>Settings</MenuItem> */}
              <MenuItem>Account Details</MenuItem>
              <MenuDivider />
              {/* <Link
                href={"/signin"}
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              > */}
              <MenuItem onClick={() => handleLogout()}>Sign out</MenuItem>
              {/* </Link>s */}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
