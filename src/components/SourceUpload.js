import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import FileUpload from "./FileUpload";
import SidebarWithHeader from "./SideNavBar";
import Dropzone from "./Dropzone";
import { APP_URL, headerKeys } from "../constants";
import { headers } from "../api";

export const SourceUpload = () => {
  // const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <SidebarWithHeader>
      <FileUpload />
    </SidebarWithHeader>
  );
};
