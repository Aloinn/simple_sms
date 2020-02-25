# Simple SMS
This is my simple SMS service, view the demo here: [demo](https://aloin-simple-sms.herokuapp.com/)
This app features real time messaging and persistent message data between users and groups.

## Usage
### Login / Registration

Registration or authentication is required before any services are available.
All usernames must be unique and password is hashed before storing into the database

![](1.gif)

### Messaging

To message an online user, click on the 'msg' link beside their name.
If you do not have a chat with said user, a new chat object will be created.
AFter initially messaging a user, you may message them in the future even if they are offline.
The messages will stay inside the conversation indefinitely.
Messages may only be accessed by parties that sent or recieved them.

![](2.gif)

### Group Messaging

To message a group of people, click on the '+' button beside the names of users you wish to add.
Once you are satisfied with the group, click on the "Start Group Chat" button.
A new group chat will be created and all members of the group will have access to the group chat on the side panel.
Messages are also persistent and may be sent even if others are offline.
Multiple group chats with the same people may be created.

![](3.gif)

### Accessing Old Messages

To access an old chat, click on one of the avalible existing chats to re-open them.
All messages sent in the chat are saved indefinitely.

![](4.gif)

## Backend
### Models
#### Mongoose
Users|Chats|Messages
-----|-----|------
Username | Users |Content
Password | Messages |Sender
Group_chat | |Type
Single_chat | |Date

#### Javascript
Rooms|Messages
-----|-------
Identifier| Content
Usersmax| Sender
Users| Type
OldMessages| Date
Messages|

I switch between Javascript and Mongoose models to achieve a balance between realtime and persistent data. There are two Messages classes, the Mongoose is for storage while the Javascript is for real time processing. 

#### Rooms
The Javascript Room class touches on both persistent and real-time data. Rooms are created to support the organization of a real-time chat but they also read and write data to and from the database.

Rooms are based around the socket.io channels, a room's unique 4 digit identifier is used as the channel's name. Whenever a user tries to start a chat with another user (1 to 1), the rooms class checks the MongoDB database to see if a chat already exists between the two users. The room constructor always tries to load previous messages from the database. Previous messages are saved to the room's 'oldMessages' array variable while newly recieved ones are saved into the 'Messages' array variable.

If all users leave a room, it is automatically destroyed. All data in the 'Messages' array are saved onto the corresponding Mongoose Chat Object to be accessed again if the chat is reopenned.

### Handlers


