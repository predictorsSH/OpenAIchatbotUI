// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Container, Typography, Paper, List, Box, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

const StyledPaper = styled(Paper)({
  padding: '20px',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
});

const StyledHeader = styled(Typography)({
  marginBottom: '20px',
  padding: '10px',
  color: 'black', // Blue color
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '1.5rem',
});

const StyledInputContainer = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  marginTop: '20px',
});

const StyledInput = styled(TextField)({
  flexGrow: 1,
  marginRight: '10px',
});

const StyledButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#115293',
  },
});

const ChatBubbleContainer = styled(ListItem)(({ isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: '10px',
}));

const ChatBubble = styled(Paper)(({ isUser }) => ({
  padding: '10px',
  maxWidth: '70%',
  wordWrap: 'break-word',
  backgroundColor: isUser ? '#1976d2' : '#f0f0f0',
  color: isUser ? '#ffffff' : '#000000',
  alignSelf: isUser ? 'flex-end' : 'flex-start', // Adjust alignment based on user or bot
}));

const ConversationContainer = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

function App() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const messagesEndRef = useRef(null);

  // Scroll to bottom of conversation when it updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSend = async () => {
    try {
      // Add user message to conversation
      const updatedConversation = [...conversation, { author: 'user', text: message }];
      setConversation(updatedConversation);

      // Clear input field
      setMessage('');

      // Get bot response
      const response = await axios.post('http://0.0.0.0:8000/chat', { message });
      const trimmedReply = response.data.response

//      json 처리
//      const responseData = Object.values(response.data).find(val => typeof val === 'string');
//      const jsonResponse = JSON.parse(responseData)
//      const trimmedReply = Object.values(response).find(val => typeof val === 'string');



//      const botReply = response.data.response; // Extract entire response
//      const trimmedReply = JSON.parse(botReply).response; // Extract only the "response" field

      // Simulate typing effect for chatbot response
      for (let i = 0; i <= trimmedReply.length; i++) {
        setTimeout(() => {
          setConversation([...updatedConversation, { author: 'bot', text: trimmedReply.substring(0, i) }]);
        }, 50 * i); // Adjust typing speed here (milliseconds)
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error gracefully, e.g., show error message to user
    }
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <StyledHeader variant="h4">Assistant for Sanghyun</StyledHeader>
        <ConversationContainer>
          {conversation.map((item, index) => (
            <ChatBubbleContainer key={index} isUser={item.author === 'user'}>
              <ChatBubble isUser={item.author === 'user'}>
                <ListItemText primary={item.text} />
              </ChatBubble>
            </ChatBubbleContainer>
          ))}
          <div ref={messagesEndRef} />
        </ConversationContainer>
        <StyledInputContainer>
          <StyledInput
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <StyledButton variant="contained" onClick={handleSend}>
            Send
          </StyledButton>
        </StyledInputContainer>
      </StyledPaper>
    </StyledContainer>
  );
}

export default App;
