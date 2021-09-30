# Web based version of [Mesmerize](https://github.com/ruidfigueiredo/mesmerize-viewer)

Check [here](https://www.blinkingcaret.com/2021/09/29/the-power-of-native/) for context

You need nodejs installed to run this.

To run:

    cd client
    yarn install
    yarn build
    cd ../server
    npm install


After this from the server do:

    npm run start

Open browser at http://localhost:48383/

Pictures will be served from $HOME/Pictures. 

NOTE: The server is using a relative path to find the client build
