import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  RepeatIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateTask from "../Components/CreateTask";
const { REACT_APP_URL } = process.env;

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [isTaskEditLoading, setIsTaskEditLoading] = useState(false);
  const [isTaskDeleteLoading, setIsTaskDeleteLoading] = useState(false);
  const [createTask, setCreateTask] = useState(false);

  const [project, setProject] = useState({});
  const [taskNames, setTaskNames] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [addUsersToTask, setAddUsersToTask] = useState([]);
  const [removeUsersToTask, setRemoveUsersToTask] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState("");

  const openCreateTask = () => setCreateTask(true);

  const closeCreateTask = () => setCreateTask(false);

  const [changeToInput, setChangeToInput] = useState(false);

  const handleSetChangeToInput = () => setChangeToInput(!changeToInput);

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleTaskNames = (e, index) => {
    let array = taskNames.slice();
    array[index] = e.target.value;
    setTaskNames(array);
  }

  const getProjects = async () => {
    setIsLoading(true);
    const responseOne = await axios.get(
      `${REACT_APP_URL}/projects/getSingleProject/${location.state.username}/${location.state.projectId}`,
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    setProject(responseOne.data);

    const responseTwo = await axios.get(
      `${REACT_APP_URL}/tasks/getAllTasks/${location.state.username}/${location.state.projectId}`,
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    responseTwo.data.forEach((task) => {
      taskNames.push(task.name);
    })
    setTasks(responseTwo.data);
    setIsLoading(false);
  };

  const getUsers = async () => {
    const response = await axios.get(`${REACT_APP_URL}/users/getUsers/${location.state.username}`, {
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
    })

    setUsers(response.data);
  }

  const editName = async (taskId, taskNewName) => {
    setCurrentTaskId(taskId);
    setChangeToInput(false);
    setIsTaskEditLoading(true);
    const response = await axios.post(
      `${REACT_APP_URL}/tasks/editName`,
      {
        username: location.state.username,
        taskId: taskId,
        taskNewName: taskNewName
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.data.message === "Task name updated") {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else if (response.data.message === "Access Denied") {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsTaskEditLoading(false);
  }

  const updateStatus = async (e, taskId) => {
    setCurrentTaskId(taskId);
    setIsTaskLoading(true);
    const response = await axios.post(
      `${REACT_APP_URL}/tasks/editStatus`,
      {
        username: location.state.username,
        taskId: taskId,
        taskStatus: e.target.value,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.data.message === "Task Status updated") {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsTaskLoading(false);
  };

  const deleteTask = async (taskId) => {
    setCurrentTaskId(taskId);
    setIsTaskDeleteLoading(true);
    const response = await axios.delete(
      `${REACT_APP_URL}/tasks/deleteTask/${location.state.username}/${taskId}`,
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.data.message === "Task deleted") {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsTaskDeleteLoading(false);
  };

  const handleAddUsersToTask = (user) => setAddUsersToTask([...addUsersToTask, user]);

  const handleRemoveUsersToTask = (user) => setRemoveUsersToTask([...removeUsersToTask, user]);

  const addUsersToTaskFunction = async (taskId) => {
    const response = await axios.post(`${REACT_APP_URL}/tasks/addUsers`, {
      username: location.state.username,
      taskId: taskId,
      users: addUsersToTask
    }, {
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
    })

    if (response.data.message === "Users added") {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setAddUsersToTask([]);
    } else {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const removeUsersToTaskFunction = async (taskId) => {
    const response = await axios.post(`${REACT_APP_URL}/tasks/removeUsers`, {
      username: location.state.username,
      taskId: taskId,
      users: removeUsersToTask
    }, {
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
    })

    if (response.data.message === "Users removed") {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setRemoveUsersToTask([]);
    } else {
      toast({
        title: response.data.message,
        description: response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    getUsers();
  },[])

  return (
    <div className="flex flex-col justify-start items-center gap-36 w-full h-screen p-20">
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="flex justify-between items-center flex-wrap gap-5 w-full">
          <div className="flex justify-start items-center gap-7">
            <h1 className="font-bold text-2xl">{project?.name}</h1>
            <IconButton onClick={openCreateTask}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={getProjects}>
              <RepeatIcon />
            </IconButton>
          </div>
          <div className="flex justify-start items-center gap-7">
            <Tooltip label={location.state.username} fontSize="md">
              <Avatar
                bg="orange"
                textColor="white"
                name={location.state.username}
              />
            </Tooltip>
            <Tooltip label="Logout" fontSize="md">
              <IconButton onClick={logout}>
                <UnlockIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
      {!isLoading && (
        <TableContainer className="w-full">
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
                <Th>Status</Th>
                <Th>Update Status</Th>
                <Th>Users</Th>
                <Th>Add Users</Th>
                <Th>Remove Users</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks?.map((task, index) => {
                return (
                  <Tr key={task._id}>
                    <Td>
                    {!changeToInput && <p onClick={handleSetChangeToInput}>{task.name}</p>}
                    {changeToInput && (
                      <Input
                      border="none"
                      type="text"
                      value={taskNames[index]}
                      onChange={(e) => handleTaskNames(e, index)}
                      />
                    )}
                    </Td>
                    <Td>
                      <IconButton
                      onClick={() => editName(task._id, taskNames[index])}
                      isLoading={isTaskEditLoading && currentTaskId === task._id}>
                        <EditIcon />
                      </IconButton>
                    </Td>
                    <Td>
                      {isTaskDeleteLoading && task._id === currentTaskId && (
                        <Spinner />
                      )}
                      {(!isTaskDeleteLoading || task._id !== currentTaskId) && (
                        <IconButton>
                          <DeleteIcon onClick={() => deleteTask(task._id)} />
                        </IconButton>
                      )}
                    </Td>
                    <Td>{task.status}</Td>
                    <Td>
                      {isTaskLoading && task._id === currentTaskId && (
                        <Spinner />
                      )}
                      {(!isTaskLoading || task._id !== currentTaskId) && (
                        <Select
                          placeholder="Select"
                          onChange={(e) => updateStatus(e, task._id)}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </Select>
                      )}
                    </Td>
                    <Td>
                      {task.users.length === 0 && "No users present"}
                      {task.users.length > 0 && (
                        <AvatarGroup size="md" max={2}>
                          {task.users.map((user) => {
                            return <Avatar bg="lightgray" key={user._id} name={user.name || user.username} />
                          })}
                        </AvatarGroup>
                      )}
                    </Td>
                    <Td>
                      <Menu closeOnSelect={false}>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Actions
                        </MenuButton>
                        <MenuList>
                          <MenuItem>
                            <AddIcon onClick={() => addUsersToTaskFunction(task._id)} />
                          </MenuItem>
                          {users?.map((user) => {
                            return (
                              <MenuItem key={user._id} className="w-full">
                                <div className="flex jusitfy-start items-center gap-3" onClick={() => handleAddUsersToTask(user)}>
                                  <Avatar bg="lightgray" size="sm" name={user.username} />
                                  <p>{user.username}</p>
                                </div>
                              </MenuItem>
                              ) 
                          })}
                        </MenuList>
                      </Menu>
                    </Td>
                    <Td>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Actions
                        </MenuButton>
                        <MenuList>
                        <MenuItem onClick={() => removeUsersToTaskFunction(task._id)}>Delete</MenuItem>
                          {task.users.map((user) => {
                            return (
                              <MenuItem key={user._id} className="w-full">
                                <div className="flex jusitfy-start items-center gap-3" onClick={() => handleRemoveUsersToTask(user)}>
                                  <DeleteIcon />
                                  <p>{user.name || user.username}</p>
                                </div>
                              </MenuItem>
                              ) 
                          })}
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Modal isOpen={createTask} onClose={closeCreateTask}>
        <CreateTask
          username={location.state.username}
          projectId={location.state.projectId}
        />
      </Modal>
    </div>
  );
};

export default Project;
