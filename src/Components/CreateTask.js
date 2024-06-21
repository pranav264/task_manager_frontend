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

const CreateTask = ({ username, projectId }) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");

    const handleName = (e) => setName(e.target.value);

    const createTask = async () => {
        setIsLoading(true);
        const response = await axios.post(`${REACT_APP_URL}/tasks/create`, {
            username: username,
            projectId: projectId,
            taskName: name
        }, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })

        if(response.data.message === 'Task created') {
            toast({
                title: response.data.message,
                description: response.data.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        }
        else if(response.data.message === 'Task already exists') {
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
            <ModalHeader>Create Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input type="text" placeholder="Name" value={name} onChange={handleName} />
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="teal" onClick={createTask} isLoading={isLoading}>Create</Button>
            </ModalFooter>
        </ModalContent>
        </>
    );
};

export default CreateTask;