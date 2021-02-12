# Character Overlay

Add a character overlay for you video stream without hassle.

```bash
docker run -p 4000:4000 -v $PWD/.data:/data n1ru4l/character-overlay
```

Visit `http://localhost:4000`

## Running the App

## Development

### Available Scripts

#### `yarn codegen`

Generate code typings for the GraphQL operations.

#### `yarn start:server:dev`

Start the GraphQL backend, you must run this command first.

#### `yarn start`

Starts the snowpack development server.

#### Building the docker image

```bash
yarn build:docker
```
