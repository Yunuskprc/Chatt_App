# Chat App Backend Project
This project creates the backend side of a chat application that provides real-time communication. It supports features such as messaging between users, file sharing Dec.

For a while now, I haven't had the opportunity to work on a Node.js backend project. That's why I decided to develop this project to refresh my memory on things I may have forgotten. 
Please note that this project doesn't have a client, so Socket.io may not function fully. 
However, you are welcome to take this backend and use it in your own projects.
## Contents

- [Requirements]
- [Setup]
- [Usage]
- [Projt Structure]
  

## Requirements

- **Node.js** (minimum version 12)
- **Express** (framework)
- **Socket.io** (real-time communication)
- **JWT** (authentication and authorization)
- **Multer** (file upload handling)
- **MySQL** (database)

## Setup

To install and run the project, follow the steps below:

1. **Clone the repository**
    ```bash
    git clone https://github.com/Yunuskprc/Chatt_App.git
    cd Chatt_App
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up MySQL database and Mail Settings**
   ``` bash
    Update the DATABASE_URL variable in the .env file to match your MySQL database configuration,
   then adjust your Gmail address and app password
   ```

4. **Run the backend server**
    ```bash
    npm start
    ```


## Usage

- When the backend is running, you can access the APIs using the address http://localhost:8080.
  

## Projt Structure

- `config/authorization.json`: This file contains the roles assigned to users and which endpoints they can access.
- `middleware/JWT.js`: This class generates JWT tokens and contains methods for authentication, authorization, and token parsing..
- `middleware/upload.js`: This class provides middleware for handling image upload operations.
- `prisma/schema.prisma` : tables to be created in the database and relationships between these tables are defined.
- `repository/` :This file contains two database repository classes: userRepo and chatRepo.
- `service/MailService.js` :Here, there is a mail.service class for handling email sending operations.










