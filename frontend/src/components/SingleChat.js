import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import './styles.css'
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'


const ENDPOINT = "http://localhost:1239";
var socket , selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected,setSocketConnected] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const [typing,setTyping] = useState(false);


 const toast = useToast();




  const fetchMessages = async () => {
    if(!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      setLoading(true);
      const {data} = await axios.get(`http://localhost:1239/api/message/${selectedChat._id}`,config);
      console.log(data,selectedChat._id);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    }
    catch(error) {
      toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
      });
    }
  }
    useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

   useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  
   useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if(event.key === 'Enter' && newMessage){
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
        setNewMessage("");
          const {data} = await axios.post('http://localhost:1239/api/message',{
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        )
        console.log(newMessage);
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages,data]);
      }
      catch(error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }




    const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Safe check for selectedChat and selectedChat.users
  if (selectedChat && selectedChat.users) {
    console.log(selectedChat.users);
  }

  return (
    
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Arial"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                Sender: {getSender(user, selectedChat.users)}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="lightblue"
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
           {loading ? (
            <Spinner
              size="xl"
              w={25}
              h={25}
              alignSelf="center"
              margin="auto"
            />
           ) : (
            <div className="messages">
              <ScrollableChat messages={messages} />
            </div>
           )}
           <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping? <div style={{fontStyle:"Bold" }}>TYPING...</div> : <></>}
            <Input
            variant = "filled"
            bg="lightgrey"
            placeholder="Enter a message"
            value={newMessage}
            onChange={typingHandler}
            fontFamily="Arial"
            fontSize={15}
            fontStyle="bold"
            />
           </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          bg="lightblue"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Arial" color="black">
            Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
