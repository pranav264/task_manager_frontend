import React, { useState } from "react";
import {
  Button,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@chakra-ui/icons";
const { REACT_APP_URL } = process.env;

const Authentication = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleToggle = () => setToggle(!toggle);

  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const signUp = async () => {
    setIsLoading(true);
    const response = await axios.post(`${REACT_APP_URL}/users/signUp`, {
      username: username,
      password: password,
    });

    if (response.data.message === "Sign up successful") {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else if (response.data.message === "User already exists") {
      toast({
        title: "Duplicate User",
        description: response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error Occured",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const login = async () => {
    setIsLoading(true);
    const response = await axios.post(`${REACT_APP_URL}/users/login`, {
      username: username,
      password: password,
    });

    if (response.data.message === "Login successful") {
      sessionStorage.setItem("token", response.data.token);
      navigate("/projects", { state: { username: username } });
      setIsLoading(false);
    } else if (
      response.data.message === "Incorrect password" ||
      response.data.message === "Incorrect username"
    ) {
      toast({
        title: "Duplicate User",
        description: response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error Occured",
        description: response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-32 justify-center items-center h-screen">
      <div className="flex justify-start items-center gap-7">
        <CheckCircleIcon boxSize={8} />
        <h1 className="font-bold text-3xl">Task Assigner</h1>
      </div>
      <div className="flex flex-col gap-10 border-[1px] rounded-sm p-10">
        <div>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {toggle ? (
          <div className="flex flex-col gap-3">
            <Button colorScheme="teal" onClick={signUp} isLoading={isLoading}>
              Sign up
            </Button>
            <p className="hover:cursor-pointer" onClick={handleToggle}>
              Login instead
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button colorScheme="teal" onClick={login} isLoading={isLoading}>
              Login
            </Button>
            <p className="hover:cursor-pointer" onClick={handleToggle}>
              Sign up instead
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 border-[1px] rounded-sm p-10">
        <div>
          <p className="font-semibold">Test credentials</p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <p className="font-semibold">Username</p>
          <p>-</p>
          <p>Pranav</p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <p className="font-semibold">Password</p>
          <p>-</p>
          <p>pranav234</p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
