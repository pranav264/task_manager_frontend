import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Input,
  Modal,
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
import {
  AddIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  RepeatIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import CreateProject from "../Components/CreateProject";
import axios from "axios";
const { REACT_APP_URL } = process.env;

const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [createProject, setCreateProject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [changeToInput, setChangeToInput] = useState(false);

  const handleSetChangeToInput = () => setChangeToInput(!changeToInput);

  const [projects, setProjects] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState("");

  const openCreateProject = () => setCreateProject(true);

  const closeCreateProject = () => setCreateProject(false);

  const handleProjectNames = (e, index) => {
    const projectNamesCopy = projectNames.slice();
    projectNamesCopy[index] = e.target.value;
    setProjectNames(projectNamesCopy);
  };

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  }

  const navigateToProject = async (projectId) => {
    navigate('/project', { state: { username: location.state.username, projectId: projectId } })
  }

  const getAllProjects = async () => {
    setIsLoading(true);
    const response = await axios.get(
      `${REACT_APP_URL}/projects/getAllProjects/${location.state.username}`,
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    const projectsCopy = response.data.slice();
    const projectNamesCopy = [];

    projectsCopy.forEach((project) => {
      projectNamesCopy.push(project.name);
    });

    setProjectNames(projectNamesCopy);

    setProjects(response.data);
    setIsLoading(false);
  };

  const editProject = async (projectId, projectNewName) => {
    setCurrentProjectId(projectId);
    setChangeToInput(false);
    setIsEditLoading(true);
    const response = await axios.post(
      `${REACT_APP_URL}/projects/editName`,
      {
        username: location.state.username,
        projectId: projectId,
        projectNewName: projectNewName,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.data.message === "Project updated") {
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
    setIsEditLoading(false);
  };

  const deleteProject = async (projectId) => {
    setCurrentProjectId(projectId);
    setIsDeleteLoading(true);
    const response = await axios.delete(
      `${REACT_APP_URL}/projects/deleteProject/${location.state.username}/${projectId}`,
      {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.data.message === "Project deleted") {
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
    setIsDeleteLoading(false);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center gap-36 w-full h-screen p-20">
      <div className="flex justify-between items-center flex-wrap gap-5 w-full">
        <div className="flex justify-start items-center gap-7">
          <h1 className="font-bold text-2xl">Projects</h1>
          <IconButton onClick={openCreateProject}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={getAllProjects}>
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
      {isLoading && <Spinner />}
      {!isLoading && projects?.length > 0 && (
        <TableContainer className="w-full">
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
                <Th>Visit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects?.map((project, index) => {
                return (
                  <Tr key={project._id}>
                    <Td>
                      {!changeToInput && <p onClick={handleSetChangeToInput}>{project.name}</p>}
                      {changeToInput && (
                        <Input
                        border="none"
                        type="text"
                        value={projectNames[index]}
                        onChange={(e) => handleProjectNames(e, index)}
                        />
                      )}
                    </Td>
                    <Td>
                      <IconButton
                        onClick={() =>
                          editProject(project._id, projectNames[index])
                        }
                        isLoading={
                          isEditLoading && currentProjectId === project._id
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Td>
                    <Td>
                      <IconButton
                        onClick={() => deleteProject(project._id)}
                        isLoading={
                          isDeleteLoading && currentProjectId === project._id
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Td>
                    <Td>
                      <IconButton onClick={() => navigateToProject(project._id)}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Modal isOpen={createProject} onClose={closeCreateProject}>
        <CreateProject username={location.state.username} />
      </Modal>
    </div>
  );
};

export default Projects;
