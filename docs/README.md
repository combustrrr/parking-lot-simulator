# Parking Lot Simulator 🚗

**Version:** 0.1.0

---

## 🌟 Overview

Welcome to the Parking Lot Simulator! This project, developed as a mini-project for term work, demonstrates memory allocation strategies (Best-Fit, First-Fit, Worst-Fit) commonly found in operating systems, applied to the practical scenario of parking lot allocation.

The project consists of two main parts:
1.  **React + TypeScript Frontend:** An interactive web application where users can define parking space sizes and vehicle sizes, choose an allocation algorithm, and visualize the simulation results.
2.  **Python Script:** A standalone script (`python/memory_allocation.py`) that implements the same memory allocation algorithms, serving as a reference and fulfilling specific term work experiment requirements.

This simulator provides a user-friendly way to understand and compare different resource allocation strategies.

## ✨ Features

*   **Interactive Simulation:** Input custom parking space and vehicle sizes.
*   **Multiple Allocation Strategies:** Choose between Best-Fit, First-Fit, and Worst-Fit algorithms.
*   **Visual Results:** View detailed allocation outcomes, total wasted space, and the success rate (percentage of vehicles parked).
*   **Reset Functionality:** Easily clear inputs and results to start a new simulation.
*   **Reference Python Implementation:** A clear Python script demonstrating the core allocation logic.

## 🛠️ Tech Stack

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite (Build Tool)
    *   Tailwind CSS (Styling)
    *   Shadcn/UI (UI Components)
*   **Backend/Scripting:**
    *   Python 3 (Standard Library)
*   **Development:**
    *   Node.js & npm
    *   ESLint (Linting)
    *   Git & GitHub (Version Control)

## 📁 Project Structure

```
parking-lot-simulator/
├── public/                     # Static assets (e.g., icons)
├── src/                        # React application source code
│   ├── assets/                 # Image assets
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Shadcn/UI components
│   │   └── ParkingLot.tsx      # Main simulation UI component
│   ├── lib/                    # Utility functions (e.g., cn for classnames)
│   ├── App.css                 # App-specific styles
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles / Tailwind directives
│   ├── index.tsx               # React entry point
│   ├── main.tsx                # Main entry point rendering App
│   ├── ParkingLot.ts           # Core allocation logic (TypeScript)
│   └── vite-env.d.ts           # Vite TypeScript environment types
├── python/                     # Python script implementation
│   └── memory_allocation.py
├── docs/                       # Documentation
│   └── README.md               # This file
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point for Vite
├── package-lock.json           # Exact dependency versions
├── package.json                # Project metadata and dependencies (React)
├── postcss.config.js           # PostCSS configuration
├── requirements.txt            # Python dependencies (empty for this project)
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.app.json           # TypeScript config for the app
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Node.js context (e.g., Vite config)
└── vite.config.ts              # Vite configuration
```

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   **Node.js:** Version 18 or higher ([Download](https://nodejs.org/))
*   **npm:** Included with Node.js installation.
*   **Python:** Version 3.8 or higher ([Download](https://python.org/))
*   **Git:** For cloning the repository ([Download](https://git-scm.com/))
*   **(Optional) Code Editor:** Visual Studio Code is recommended.

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/combustrrr/parking-lot-simulator.git
    cd parking-lot-simulator
    ```

2.  **Install React Application Dependencies:**
    This command installs all necessary Node.js packages.
    ```bash
    npm install
    # or use the custom setup script if defined:
    # npm run setup
    ```

3.  **Python Script Setup:**
    No installation is needed as the script uses only Python's standard library.

### Running the Application

1.  **Run the React Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server. Open your browser and navigate to `http://localhost:5173` (or the port specified in the output).

2.  **Run the Python Script:**
    Open a new terminal window or navigate within your existing one.
    ```bash
    cd python
    python memory_allocation.py
    ```
    The script will execute and print the simulation results for predefined inputs directly to the console.

## 💻 Usage

### React Application (Web Interface)

1.  **Input Parking Space Sizes:** Enter positive integers representing the capacity of each available parking space, separated by spaces (e.g., `10 5 20 8`).
2.  **Input Vehicle Sizes:** Enter positive integers representing the size requirement of each vehicle needing parking, separated by spaces (e.g., `4 12 7 3`).
3.  **Select Allocation Strategy:** Choose one of the available strategies: "Best Fit", "First Fit", or "Worst Fit" using the radio buttons.
4.  **Run Simulation:** Click the "Run Simulation" button.
5.  **View Results:** The application will display:
    *   Which vehicle (if any) is allocated to which space.
    *   The total amount of wasted space across all allocated spots.
    *   The success rate (percentage of vehicles successfully parked).
6.  **Reset:** Click the "Reset" button to clear all inputs and results for a new simulation.

### Python Script (`memory_allocation.py`)

*   **Execution:** Run the script directly using `python python/memory_allocation.py`.
*   **Output:** The script prints the allocation results, wasted space, and success rate for each of the three strategies (Best-Fit, First-Fit, Worst-Fit) based on predefined `block_sizes` (parking spaces) and `process_sizes` (vehicles) within the script.
*   **Customization:** To test different scenarios, directly modify the `block_sizes` and `process_sizes` lists within the `main()` function in the `memory_allocation.py` file and rerun the script.

## ✅ Verification & Troubleshooting

### Verifying the Setup

**React Application:**

1.  After running `npm run dev`, open `http://localhost:5173`.
2.  Check that the page title is "Parking Lot Simulator".
3.  Test the input fields; they should only accept positive integers separated by spaces.
4.  Select different strategies and run the simulation with sample data to ensure results are displayed correctly.
5.  Run the following commands to check for build and linting errors:
    ```bash
    npm run lint  # Check for code style issues
    npm run build # Create a production build
    npm run preview # Preview the production build
    ```

**Python Script:**

1.  Run `python python/memory_allocation.py`.
2.  Verify that the console output shows the results for all three allocation strategies.
3.  Compare the output against expected results for the predefined sample data if necessary.

### Troubleshooting

*   **Dependency Issues (React):** If you encounter problems after pulling changes or during installation, try deleting the `node_modules` directory and the `package-lock.json` file, then reinstalling:
    ```bash
    rm -rf node_modules
    rm package-lock.json
    npm install
    ```
*   **Port Conflict (React):** If `localhost:5173` is already in use, Vite might start on a different port. Check the terminal output after running `npm run dev`.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1.  **Create a Feature Branch:**
    ```bash
    git checkout -b feature/your-descriptive-feature-name
    ```
2.  **Make Your Changes:** Implement your feature or bug fix.
3.  **Commit Your Changes:** Write clear and concise commit messages.
    ```bash
    git commit -m "feat: Add explanation for new allocation strategy"
    # or
    git commit -m "fix: Correct calculation for wasted space"
    ```
4.  **Push to Your Branch:**
    ```bash
    git push origin feature/your-descriptive-feature-name
    ```
5.  **Create a Pull Request:** Open a pull request against the `main` branch of the original repository.

**Code Style:**

*   **TypeScript/React:** Follow the rules defined in the ESLint configuration (`eslint.config.js`). Run `npm run lint` to check your code.
*   **Python:** Adhere to the PEP 8 style guide.
*   **Commit Messages:** Use conventional commit messages if possible (e.g., `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`).


## 🧑‍💻 Authors & Acknowledgments

This project was developed by:

*   Sarthak Kulkarni (Roll No. 23101B0019)
*   Pulkit Saini (Roll No. 23101B0021)
*   Dhruv Tikhande (Roll No. 23101B00005)

We developed this simulator as part of our term work to gain practical experience with memory allocation algorithms. We extend our gratitude to our instructors for their guidance and support throughout this project.

---
