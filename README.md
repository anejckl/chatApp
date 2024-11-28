# ChatApp

This project is a chat application built with Angular and Node.js. It includes user authentication via Auth0, a chat interface, and various administrative functionalities.

## Project Structure


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Backend server

Run `npm run start-backend` to start the backend server. The backend server runs on `http://localhost:3000/`.

## Start both frontend and backend

Run `npm run start:all` to start both the frontend and backend servers concurrently.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Environment Variables

Create a `.env` file in the `api/` directory with the following content:

OpenAI
OPENAI_API_KEY=your-openai-api-key 
MODEL_NAME=gpt-4 
TEMPERATURE=0.7

Security
SECRET_KEY=your-secret-key

Cors
ORIGIN=http://localhost:4200

Database
DB_HOST=localhost 
DB_USER=root 
DB_PASSWORD=your-db-password 
DB_NAME=chat_app

## API Endpoints

- `POST /api/user` - Save user details to session
- `POST /api/user/logout` - Logout user and destroy session
- `GET /api/chat` - Get chat messages
- `GET /api/chat/history` - Get chat history
- `GET /api/model` - Get model information
- `GET /api/terms` - Get terms and conditions
- `GET /api/admin` - Admin functionalities

## License

This project is open-source and available under the [MIT License](LICENSE).
