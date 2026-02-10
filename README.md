# NestJS Encryption Service API

This project provides an API for encrypting and decrypting data using AES and RSA algorithms.

## 🚀 Getting Started

### 1. Install Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Install Project Dependencies
Open your terminal (Command Prompt or PowerShell) in this folder and run:
```bash
npm install
```

### 3. Start the Server
Run the following command to start the API server:
```bash
npm run start
```
*You should see logs indicating the server has started and keys have been generated.*

---

## 🧪 How to Test

There are 3 easy ways to test the API.

### Method 1: The "One-Click" Script (Recommended)
We have prepared a script that automatically tests encryption and decryption for you.

1.  Keep the server running in your first terminal.
2.  Open a **new** terminal window.
3.  Run:
    ```bash
    node verify-api.js
    ```
4.  You will see `✅ SUCCESS` if everything works!

### Method 2: Visual Interface (Swagger UI)
You can test manually using a web page.

1.  Open your browser and go to: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
2.  Click on **POST /get-encrypt-data** -> **Try it out**.
3.  Enter a payload (e.g., `{"payload": "Hello"}`) and click **Execute**.
4.  Copy the `data1` and `data2` from the response.
5.  Go to **POST /get-decrypt-data** -> **Try it out**.
6.  Paste the values and click **Execute** to see your original message.

### Method 3: Automated Code Tests
If you want to run the developer unit tests:
```bash
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
```

---

## 🔧 Git Commands

If you are initializing this project with Git, here are the useful commands:

```bash
# Initialize git repository
git init

# Add all files (respecting .gitignore)
git add .

# Commit changes
git commit -m "Initial commit"
```