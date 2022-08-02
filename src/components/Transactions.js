import { Box, Container, FormControl, FormLabel } from "@chakra-ui/react";
import * as React from "react";
import FileUpload from "./FileUpload";
import SidebarWithHeader from "./SideNavBar";
import Dropzone from "./Dropzone";

export const Transactions = () => (
  <SidebarWithHeader>
    <FileUpload />
  </SidebarWithHeader>
);
