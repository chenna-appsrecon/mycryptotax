import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  useDisclosure,
  Input,
  Center,
} from "@chakra-ui/react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import SidebarWithHeader from "./SideNavBar";

const WalletApp = () => {
  // Use the hooks thirdweb give us.
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleApiKeyChange = (e) => setApiKey(e.target.value);
  const handleSecretKeyChange = (e) => setSecretKey(e.target.value);
  console.log("👋 Address:", address);

  const handleSubmit = () => {
    // console.log("E", apiKey, secretKey);
  };
  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <SidebarWithHeader>
        <Container maxW="2xl" bg="white" centerContent>
          <Box padding="4" maxW="md">
            You can can your wallet here
          </Box>
          <Box padding="4" bg="" color="black" maxW="md">
            <Button
              //   variant={"outline"}
              bg="#4FD1C5"
              color="white"
              onClick={connectWithMetamask}
            >
              Connect Metamask wallet
            </Button>
          </Box>
        </Container>
        <Container maxW="2xl" bg="white" mt={5} centerContent>
          <Box padding="4" maxW="md">
            Add Your Wallet/Exchange
          </Box>
          <Box padding="4" bg="" color="black" maxW="md">
            <Button
              //   variant={"outline"}
              bg="#4FD1C5"
              color="white"
              onClick={onOpen}
            >
              Wazirx
            </Button>
          </Box>
        </Container>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Setup WazirX API</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>API key</FormLabel>
                <Input
                  ref={initialRef}
                  onChange={handleApiKeyChange}
                  placeholder="API key"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>API secret</FormLabel>
                <Input
                  onChange={handleSecretKeyChange}
                  placeholder="API secret"
                />
              </FormControl>
            </ModalBody>
            <Center>We need your API details for WazirX to continue.</Center>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </SidebarWithHeader>
    );
  }

  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <SidebarWithHeader>
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Congrats Wallet Connected!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Thanks for connecting your wallet.
        </AlertDescription>
      </Alert>
    </SidebarWithHeader>
  );
};

export default WalletApp;
