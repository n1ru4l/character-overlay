# Character Overlay

Add a character overlay for you video stream without hazzle.

```bash
docker run -p 4000:4000 -v $PWD/.data:/data n1ru4l/character-overlay
```

Visit `http://localhost:4000`

## Running the App

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

#### `yarn codegen`

Generate code typings for the GraphQL operations.

#### `yarn start:server:dev`

Start the GraphQL backend, you must run this command first.

#### `yarn start`

Starts the react development server.

#### Building the docker image

```bash
docker build -t n1ru4l/character-overlay
```
