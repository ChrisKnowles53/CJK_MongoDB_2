# CJK_MongoDB_2

please read note at bottom if you want to use this code

Taking the time to teach myself how to connect a very basic REACT App which extracts data from a MongoDB. I've never used a noSQL database before and never created a backend server which the front end talks to using CORS.

Completing this I have learnt about NVM, CORS, Express, MongoDB, Mongoose, REACT and how to connect them all together.

✨✨Self learning is hard but very rewarding when you succeed✨✨

Next step - carry on learning 😀

- ✅Learn how add data
- Learn how to patch data
- Learn how to delete data
- ✅Make the front end look better (I'm focussed on the learning rather than presentation for now) Had to prioritise this as it was driving me mad!

NOTE:
This code is set up yo work with my database which has doucments in a collection called products, that have this structure:

    {  
    "id": 1,  
    "name": "C++ Hoodie",  
    "price": 49,
    "category": "Hoodie",  
    "image": "/images/cplusplus.jpg"  
    }

If you want to use this code you will need to create a .env file in the root of the backend folder, add .env to your .gitignore file and add the following to your .env file:

`DB_URI=mongodb+srv://<username>:<password>@<clustername>/store?retryWrites=true&w=majority`

Then replace the code after the = with your specific URI from your MongoDB, you will need to create a database called store and a collection called products (with your data in). You will also need to create a user and password for the database.
When you copy the URL from MongoDB it will not have the /store at the end, you will need to add this yourself.

Please review the code and make sure you refactor the following files to work with your document structure:

- productModel.js
- server.js
- App.js
- ProductForm.js
