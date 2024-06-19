# chit-chat

This is a chat application built using React, Node.js, and MongoDB. The application supports text messaging, voice calls, and video calls between users.

## Features

- Text messaging
- Voice calls
- Video calls
- Message deletion within 2 minutes of sending

## Technologies Used

- **Frontend:** React, Socket.io-client, Zustand, Tailwind-css, MUI
- **Backend:** Node.js, Express, Socket.io, MongoDB, Mongoose
- **WebRTC:** Simple-peer for peer-to-peer connections

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running

### Installation

1. **Clone this repository and Install client dependencies:**
    ```sh
    git clone https://github.com/bensondavis/chit-chat.git
    cd chit-chat
    npm install
    ```

2. **Clone the server repository and Install server dependencies:**
    ```sh
    git clone https://github.com/bensondavis/chit-chat-server.git
    cd chit-chat-server
    npm install
    ```

3. **Start the MongoDB server:**
    Make sure your MongoDB server is running on the default port (27017).

4. **Run the server:**
    ```sh
    cd ../chit-chat-server
    npm run start:dev
    ```

5. **Run the client:**
    ```sh
    cd ../chit-chat
    npm start
    ```

### Configuration

You can configure the server and client settings using environment variables.

- **Server (chit-chat-server/.env):**
    ```
    PORT=5000
    MONGODB_URL=mongodb://0.0.0.0:27017/yourDb
    JWT_SECRET=yourPassword
    JWT_TOKEN_EXPIRY=1h
    ```
- **Server (chit-chat-server/socket/socket.js)**
    ```
    const io = new Server(server, {
        cors: {
            origin: "your client address",
            methods: ["GET", "POST", "DELETE"],
        },
    });
    ```

- **Client (chit-chat/.env):**
    ```
    REACT_APP_API_URI=http://localhost:5000/api
    REACT_APP_SERVER_URI=http://localhost:5000
    ```

## Usage

1. **Open the application:**
    Open your browser and navigate to `http://localhost:3000`

2. **Create an account or log in:**
    Enter your email/username/password to join the app.

3. **Add user to contact list:** 
    Enter the username of the user to need to the text message to.

4. **Send messages:**
    Select a user from the contact list and start chatting.

5. **Make voice or video calls:**
    Click on the "Voice Call" or "Video Call" button next to a user's name to start a call.


## Socket Events

- **sendMessage**
    - Sends a message to the specified user.
    - Data:
      ```json
      {
        "from": "me",
        "to": "user2",
        "message": "Hello!"
      }
      ```

- **callUser**
    - Initiates a call to the specified user.
    - Data:
      ```json
      {
        "userToCall": "user2",
        "signalData": "signal-data",
        "from": "me",
        "isVideoCall": true
      }
      ```

- **answerCall**
    - Answers an incoming call.
    - Data:
      ```json
      {
        "signal": "signal-data",
        "to": "caller"
      }
      ```

- **endCall**
    - Ends the current call.
    - Data:
      ```json
      {
        "to": "user2"
      }
      ```

## Acknowledgments

- This project uses [Simple-peer](https://github.com/feross/simple-peer) for WebRTC implementation.
- Inspired by various chat application tutorials and examples.

---
