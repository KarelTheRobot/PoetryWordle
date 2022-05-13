# PoetryWordle

An interactive tool for creating and solving semantics-based poetry puzzles.

![Imgur](https://imgur.com/xpByae1.png)

To run:

`yarn install`

If installation from package.json doesn't work, run

`yarn add socket.io socket.io-client express`

Then for the python Word2Vec server, install some pip libraries.

`pip3 install gensim aiohttp python-socketio`

Run the python server:

`python3 python-server.py`

Then run the node server:

`node index.js`

Then access the local webpage at `localhost:3000`.