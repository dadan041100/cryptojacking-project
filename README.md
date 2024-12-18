# Cryptojacking Detection System

A **Cryptojacking Detection System** built with Python Flask that monitors your system for cryptojacking activities, utilizing CPU, GPU, and network resources to detect unauthorized mining operations. The system interface resembles the **Windows 11 Task Manager** and displays real-time CPU core usage in a dashboard. This project is aimed at providing desktop-based cryptojacking detection.

## Features
- **Real-time CPU Monitoring**: Display the current usage of CPU cores, number of sockets, and processors.
- **Quadrant Layout Dashboard**: A clean interface that presents core usage charts, with each chart organized in a quadrant layout.
- **Cryptojacking Scanning**: Detects cryptojacking by scanning system activities for unusual usage spikes.
- **Ad-Blocker with Script Detector**: Detects cryptojacking scripts on the websites that you might think it's sketchy.
- **Task Manager-like UI**: The front end is inspired by the **Windows 11 Task Manager** for ease of use.
- **Separation of Concerns**: The JavaScript and CSS files are separated for better organization and readability.

## Technologies Used
- **Python** (Flask framework)
- **HTML**, **CSS**, **JavaScript** 
- **Chart.js** for real-time graph displays

## Project Setup
- Python
**Download Link:**
```bash
https://www.python.org/downloads/
```
Make sure the PATH is set up correctly in order to run python commands.
- **pip requirements (run cmd as admin):**
```bash
pip install flask
pip install psutil
pip install gputil
pip intstall matplotlib
pip install numpy
pip install requests
```

### Prerequisites
To run this project locally, you need the following installed:
- **Python 3.x**
- **Flask**
- **pip** (Python package manager)

### Download Guide


### Step-by-Step Setup Guide

1. **Clone the Repository**
   Open your terminal/command prompt and run the following command:
   ```bash
   cd path/to/your/file
   git clone https://github.com/dadan041100/cryptojacking-project.git
   cd cryptojacking-project
   ```
2. **Create a Virtual Environment (Optional but Recommended) You can set up a Python virtual environment to isolate your dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install Dependencies Install the necessary dependencies from the requirements.txt file:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set Up Flask Inside the root directory of the project, you need to set up Flask:**
   ```bash
   export FLASK_APP=app.py  # On Windows: set FLASK_APP=app.py
   export FLASK_ENV=development  # On Windows: set FLASK_ENV=development
   ```
5. **Run the Flask Application After setting up, you can start the Flask development server by running:**
   ```bash
   flask run
   python app.py (if running locally)
   ```
   This will start the application locally. Open your browser and go to:
   ```bash
   https://127.0.0.1:5000
   ```
### To Simulate sample_morpheus.py on your device: 
1. **Install PyTorch and each dependency**
   - This is a sample malware that simulates the attack for CPU, RAM, and GPU through matrix concurrent multiplication.
   - To run it locally, you must install PyTorch and its dependencies.
   - Run this pip command on your terminal **(as an admin)**:
   ```bash
   pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```
   - Make sure you have Python 3.6 or later versions installed on your device, see **Project Setup** section for step-by-step installation.
2. **Run the Project**
   - Assuming you cloned my repository, go to the file directory of the project.
   - Copy the file path
   - Open terminal
   **Run the command:**
   ```bash
   cd path/to/your/file
   python app.py
   ```
   Then navigate to ```https://127.0.0.1:5000```
3. **Run sample_morpheus.py:**
   - To run the sample malware, you need a separate terminal
   - Open another terminal **(as an admin)**
   **Run the command:**
   ```bash
   cd path/to/your/file
   python sample_morpheus.py
   ```
   Then you can monitor the charts on the project if the sample malware is working as expected.

## NOTE: You may configure the duration and number of concurrent operations of sample_morpheus.py to your liking. 

# Contributing
## Contributions are welcome! If you find any issues or have suggestions, feel free to open an issue or submit a pull request.

- Fork the repository
- Create a new branch (git checkout -b feature-branch)
- Commit your changes (git commit -m 'Add a feature')
- Push the branch (git push origin feature-branch)
- Open a Pull Request

   
