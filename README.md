# Text Summarizer

Text Summarizer is a web application that allows users to summarize text documents using advanced natural language processing techniques. The application provides a user-friendly interface for uploading text files or entering text directly, and generates concise summaries based on the input.

## Features

- Upload text files (supported formats: TXT, PDF, DOC, DOCX) or enter text directly
- Specify the desired compression percentage for the summary
- Generate summaries using fuzzy logic and other advanced NLP techniques
- View and manage previous summaries
- Responsive and intuitive user interface

## Technologies Used

- Frontend:
    - React: JavaScript library for building user interfaces
    - Tailwind CSS: Utility-first CSS framework for rapid UI development
    - Axios: HTTP client for making API requests
    - React Router: Library for handling navigation in a React application
    - Vite: Fast build tool and development server

- Backend:
    - Python: Programming language for backend development
    - Flask: Web framework for building APIs and handling requests
    - MongoDB Atlas: Cloud-based database service for storing text data and summaries

- Deployment:
    - Render: Platform for hosting and deploying the backend server
    - Netlify: Platform for hosting and deploying the frontend application

## Getting Started

To run the Text Summarizer application locally, follow these steps:

1. Clone the repository: git clone https://github.com/your-username/textsummarizer.git

2. Navigate to the project directory: cd textsummarizer

3. Install the dependencies: npm install

4. Set up the backend:
- Navigate to the `backend` directory:
  ```
  cd backend
  ```
- Create a virtual environment:
  ```
  python -m venv venv
  ```
- Activate the virtual environment:
    - For Windows:
      ```
      venv\Scripts\activate
      ```
    - For macOS and Linux:
      ```
      source venv/bin/activate
      ```
- Install the backend dependencies:
  ```
  pip install -r requirements.txt
  ```
- Set up the necessary environment variables for the backend, such as database connection details and API keys.

5. Start the development server: npm start

This command will concurrently run the backend server and the frontend development server.

6. Open your web browser and visit `http://localhost:3000` to access the Text Summarizer application.

## Deployment

The Text Summarizer application is deployed using the following services:

- Backend: The backend server is deployed on Render, a platform for hosting and deploying web applications. It provides scalability, reliability, and easy deployment options.

- Frontend: The frontend application is deployed on Netlify, a platform for hosting and deploying static websites and web applications. It offers continuous deployment, global CDN, and other features for optimized performance.

To deploy your own instance of the Text Summarizer application, you'll need to set up accounts with Render and Netlify, configure the necessary environment variables, and follow their respective deployment guides.

## Contributing

Contributions to the Text Summarizer project are welcome! If you find any bugs, have suggestions for improvements, or want to add new features, please open an issue or submit a pull request. Make sure to follow the project's code style and guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions, suggestions, or feedback, please feel free to contact the project maintainer at [your-email@example.com](mailto:your-email@example.com).

Happy summarizing!