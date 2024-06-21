import {
    Button,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from 'axios';
const { REACT_APP_URL } = process.env;

const CreateProject = ({ username }) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");

    const handleName = (e) => setName(e.target.value);

    const createProject = async () => {
        setIsLoading(true);
        const response = await axios.post(`${REACT_APP_URL}/projects/create`, {
            username: username,
            projectName: name
        }, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })

        if(response.data.message === 'Project created') {
            toast({
                title: response.data.message,
                description: response.data.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        }
        else if(response.data.message === 'Project already exists') {
            toast({
                title: response.data.message,
                description: response.data.message,
                status: 'warning',
                duration: 3000,
                isClosable: true,
              })
        }
        else {
            toast({
                title: response.data.message,
                description: response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        }
        setIsLoading(false);
    }

    return (
        <>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Project</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input type="text" placeholder="Name" value={name} onChange={handleName} />
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="teal" onClick={createProject} isLoading={isLoading}>Create</Button>
            </ModalFooter>
        </ModalContent>
        </>
    );
};

export default CreateProject;
