import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  HStack,
  InputRightElement,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// Assets
// import BgSignUp from "assets/img/BgSignUp.png";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { APP_URL } from "../constants";

function SignUp() {
  const navigate = useNavigate();
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("teal.200", "rgba(255, 255, 255, 0.5)");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCopy, setPasswordCopy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleEmailInputChange = (e) => setEmail(e.target.value);
  const handleFirstNameInputChange = (e) => setFirstName(e.target.value);
  const handleLastNameInputChange = (e) => setLastName(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);
  const handlePasswordCopyInputChange = (e) => setPasswordCopy(e.target.value);

  const isError = input === "";
  const handleRegistration = () => {
    // setMessage("");
    setIsLoading(true);
    fetch(APP_URL + "register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        password2: passwordCopy,
        firstname,
        lastname,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("response = ", response);
        if (response.token) {
          localStorage.setItem("token", response.token);
          handleMiddleWareLogin(response.token);
        }
      })
      .catch((e) => console.log(e));
    // if (token) {
    //   console.log("token", token);
    //   // setLoading(false);
    // }
  };

  const handleSubmit = () => {
    console.log("E", email, password);
    handleRegistration();
  };
  const handleMiddleWareLogin = (token) => {
    fetch(APP_URL + "middlewarelogin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        // bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
      ></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        mb="30px"
      >
        <Text fontSize="4xl" color={textColor} fontWeight="bold">
          Welcome!
        </Text>
        <Text
          fontSize="md"
          color={textColor}
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
        >
          Get to know your crypto taxes
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p={[6, 10]}
          // mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            Register here
          </Text>
          {/* <HStack spacing="15px" justify="center" mb="22px">
            <Flex
              justify="center"
              align="center"
              w="75px"
              h="75px"
              borderRadius="15px"
              border="1px solid lightgray"
              cursor="pointer"
              transition="all .25s ease"
              _hover={{ filter: "brightness(120%)", bg: bgIcons }}
            >
              <Link href="#">
                <Icon
                  as={FaFacebook}
                  w="30px"
                  h="30px"
                  _hover={{ filter: "brightness(120%)" }}
                />
              </Link>
            </Flex>
            <Flex
              justify="center"
              align="center"
              w="75px"
              h="75px"
              borderRadius="15px"
              border="1px solid lightgray"
              cursor="pointer"
              transition="all .25s ease"
              _hover={{ filter: "brightness(120%)", bg: bgIcons }}
            >
              <Link href="#">
                <Icon
                  as={FaApple}
                  w="30px"
                  h="30px"
                  _hover={{ filter: "brightness(120%)" }}
                />
              </Link>
            </Flex>
            <Flex
              justify="center"
              align="center"
              w="75px"
              h="75px"
              borderRadius="15px"
              border="1px solid lightgray"
              cursor="pointer"
              transition="all .25s ease"
              _hover={{ filter: "brightness(120%)", bg: bgIcons }}
            >
              <Link href="#">
                <Icon
                  as={FaGoogle}
                  w="30px"
                  h="30px"
                  _hover={{ filter: "brightness(120%)" }}
                />
              </Link>
            </Flex>
          </HStack>
          <Text
            fontSize="lg"
            color="gray.400"
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            or
          </Text> */}
          <HStack>
            <Box>
              <FormControl id="firstname" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Your first name "
                  onChange={handleFirstNameInputChange}
                  mb="24px"
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="lastname">
                <FormLabel>Last Name</FormLabel>
                <Input
                  fontSize="sm"
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="Your last name "
                  onChange={handleLastNameInputChange}
                  mb="24px"
                />
              </FormControl>
            </Box>
          </HStack>
          <FormControl>
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              Email
            </FormLabel>
            <Input
              fontSize="sm"
              ms="4px"
              borderRadius="15px"
              type="email"
              placeholder="Your email address"
              onChange={handleEmailInputChange}
              mb="24px"
              size="lg"
            />

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  fontSize="sm"
                  ms="4px"
                  name="password"
                  borderRadius="15px"
                  placeholder="Your password"
                  onChange={handlePasswordInputChange}
                  mb="24px"
                  size="lg"
                />
                <InputRightElement h={"auto"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="password2" isRequired>
              <FormLabel>ReEnter Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword2 ? "text" : "password"}
                  fontSize="sm"
                  ms="4px"
                  name="password2"
                  borderRadius="15px"
                  placeholder="ReRenter Your password"
                  onChange={handlePasswordCopyInputChange}
                  mb="24px"
                  size="lg"
                />
                <InputRightElement h={"auto"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword2((showPassword2) => !showPassword2)
                    }
                  >
                    {showPassword2 ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {/* <FormControl display="flex" alignItems="center" mb="24px">
              <Switch id="remember-login" colorScheme="teal" me="10px" />
              <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                Remember me
              </FormLabel>
            </FormControl> */}
            <Button
              type="submit"
              bg="teal.300"
              fontSize="10px"
              color="white"
              fontWeight="bold"
              w="100%"
              h="45"
              mb="24px"
              _hover={{
                bg: "teal.200",
              }}
              _active={{
                bg: "teal.400",
              }}
              isLoading={isLoading}
              loadingText="Signing up"
              onClick={handleSubmit}
            >
              SIGN UP
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColor} fontWeight="medium">
              Already have an account?
              <Link
                color={titleColor}
                ms="5px"
                href="/signin"
                fontWeight="bold"
              >
                Sign In
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
