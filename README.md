# TwitterClone-by-manishthef

A Twitter clone project built with MERN stack.
`Change cookie settings to Allow All in the browser,for the web app to run.`

## Demo

https://github.com/manish-singh-bisht/TwitterClone-by-manishthef/assets/114493480/c63ec15b-52df-4ec8-ad21-94fa28116fb8

## Table of Contents

- [Problem It Solves](#Problem-It-Solves)
- [Features](#Features)
- [ShortComings](#ShortComings)
- [Development](#Development)
- [Contributing](#Contributing)

## Problem It Solves

- _**Information Sharing**_:
  TwitterClone is a platform for sharing news, updates, and information on a wide range of topics.

- _**Connectivity**_:
  The TwitterClone helps users connect with friends, colleagues, celebrities, and people,however no algorithm is present for doing this.

- _**Promotion and Brand Building**_:
  The TwitterClone can be widely used for marketing, promotion, and brand building. Individuals, businesses, and organizations can use the TwitterClone to reach a global audience, promote products or services, and build brand awareness.

- _**Expression and Opinion Sharing**_:
  The TwitterClone provides a platform for users to express their thoughts, opinions, and viewpoints on various topics. It encourages open dialogue and discussions on social, political, and cultural issues.

- _**Networking**_:
  The TwitterClone is a valuable networking tool for professionals and individuals looking to expand their professional and social circles.

- _**Awareness and Activism**_:
  The TwitterClone has played a significant role in raising awareness about social and political issues.

- _**Entertainment**_:
  The TwitterClone is a source of entertainment, humor, and viral content. Users can follow comedians, celebrities, and entertainment accounts for a dose of entertainment and laughter.

- _**Personal Expression**_:
  The TwitterClone allows users to express their individuality through creative tweets, photos, videos, and memes. It encourages self-expression and creativity.

## Features

### Features different from average Twitter Clones

- _**Mentions**_ : can mention users with a @.

- _**Threads**_ :multiple tweets like X,no images as of now.

- _**Draft**_ :can save upto 5 unfinished tweets.

- _**NestedComments**_ : comments inside comments.

- _**WhoCanReply**_ : choose who can reply to your tweet.

- _**Chat**_ : reply to a message,image messages,soft delete,hard delete,latest message,pin conversation,reverse infinite scroll,copy messages.

### Other Features

- Create single tweets with images.

- Responsive Design.

- Like,Bookmark,Retweet,Delete tweets.

- Follow,unfollow other users.

- Profile section, edit profile.

- Pin tweet.

- Search User-debouncing

- Infinite Scroll

- Authentication:Jwt.

## ShortComings

1. no real time chat updates, otherwise i woudnt be able to deploy,as no free provider support websockets
2. no real time comment updates,had their been web sockets i would have done it, but otherwise it will do multiple api calls.
3. using tiptap editor for mention feature,so might cause error sometimes,pause a bit after typing @.
4. use chat in shorter screen like a tablet or mobile,so that one can go back to refresh and come back to chat.If done in laptop(15.5inch) or bigger screens then back means going to home page and then coming to chat,so smaller screens save some api calls.

`NOTE`:not using tiptap for any other purposes than mention,apart from necessary packages needed to work with React, I am only using tiptap editor(tippy.js and awesome-debounce-promise are needed with it) for mentions,react-infinite-scroll-component,react-sticky-box,react-toastify, rest everthing is done by me.

## Development

Here are the steps to run the project locally.

1. Clone the repository

```
 git clone https://github.com/manish-singh-bisht/TwitterClone--by-manishthef.git
```

2. Install dependencies
   - Open terminal, then do `npm install`.This installs dependencies of the backend.
   - Open another terminal and do
     `cd Frontend` ,then do `npm install`.This installs dependencies in the frontend folder.
3. Create a .env file in the main folder,not in the backend folder and not in the frontend folder.
4. In the .env file add the following

   ```
    PORT=4000
    DB_URI="Add your own"
    JWT_SECRET="Create your own"
    CLOUDINARY_NAME= 'add your own'
    CLOUDINARY_API_KEY= 'add your own'
    CLOUDINARY_API_SECRET= 'add your own'
   ```

   1. For `DB_URI`
      - download MongoDB or create an account in MongoDB Atlas
      - create your database
      - copy the connection string, looks something like this `mongodb://localhost:27017`
      - add the name of your database infront of the connection string,like `mongodb://localhost:27017/databaseName`
      - this is your `DB_URI`, paste it in .env file
   2. For `JWT_SECRET`
      - write anything,for example JWT_SECRET="fdsfsdfsdfsd"
   3. For `CLOUDINARY_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET`
      - create an account in cloudinary and copy from there.

   Your .env file is ready.

5. Delete these lines of code and add the line of code in point 6,
   ` Go to Backend -> controllers -> userController.js`

```
            const meAuthor = await Users.findById(process.env.USERID);

            if (!meAuthor) {
                return next(new ErrorHandler("Use Correct USERID in env file", 404));
            }

            user = await Users.create({ handle, name, email, password, profile: userProfile, location, website });

            user.following.push(meAuthor._id);
            meAuthor.followers.push(user._id);

            user.followingCount += 1;
            meAuthor.followersCount += 1;

            await user.save();
            await meAuthor.save();
```

6. Add this line of code
   ` user = await Users.create({ handle, name, email, password, profile: userProfile, location, website });`
7. Create another .env file,this time inside Frontend folder and add this

```
VITE_REACT_APP_API_BASE_URL=http://localhost:4000/api/v1

```

8. Now go to `Backend->app.js`, here change this `app.use(cors({ credentials: true, origin: "https://twitter-clone-by-manishthef.vercel.app/" }));`

to `app.use(cors({ credentials: true, origin: "http://localhost:5173" }));`.

9. Close all the terminals,and open two terminals
   - In first,write `npm run start`
   - In second, do `cd Frontend` then do `npm run dev`
   - Now copy or click on the link in the second terminal,in the one in which you did cd Frontend,and your app should be running.

`NOTE`:If during login,it doesn't happen as it should or if there is some error in console,then in the .env file in the main folder(this env file has many things like DB_URI,etc ) try changing the `mongodb://localhost:27017` to `mongodb://127.0.0.1:27017`.If it doesn't even after this,try google or ChatGpt or Gemini.

## Contributing

Close to any contribution as of now.
