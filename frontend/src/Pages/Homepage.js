import { Container , Box, Text, Tab, Tabs, TabList, TabPanel, TabPanels  } from '@chakra-ui/react';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';


function Homepage() {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(!user) {
      history.push("/");
    }

  },[history]);
  return (
    <Container maxW = 'xl' centerContent>
      <Box
        display="flex" 
        justifyContent="center" 
        p="3px 3px 3px 3px"
        bg="#1c1c1c"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text fontSize='4xl' fontFamily="Arial" color="white">Welcome to Chatify</Text>
      </Box>
      <Box bg="#1c1c1c" w="100%" p={4} borderRadius="1g" borderWidth="1px" color="white">
        <Tabs variant='enclosed'>
          <TabList mb="1em">
            <Tab width="50%" color="white">Login</Tab>
            <Tab width="50%" color="white">SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;