# GEMINI.md

## Project Overview

This is a Next.js web application called "SENDO". Based on the file structure and content, it appears to be a frontend for a service that provides wallet analysis, AI-powered "workers" to automate actions, and educational content related to blockchain and crypto.

The main features seem to be:

*   **Wallet Analyzer:** Users can input a Solana wallet address to analyze its performance and see "missed opportunities".
*   **AI Worker:** Users can configure and run AI agents (workers) to perform automated actions, likely related to trading or other on-chain activities.
*   **Educational Content:** The application provides educational material about the blockchain.

The project is built with the following technologies:

*   **Framework:** Next.js with Turbopack
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with Shadcn UI components
*   **State Management:** TanStack Query
*   **Linting and Formatting:** Biome

## Building and Running

To get the project running locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Run the development server:**
    ```bash
    bun run dev
    ```

3.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

*   **Build for production:**
    ```bash
    bun run build
    ```
*   **Start the production server:**
    ```bash
    bun run start
    ```
*   **Lint the code:**
    ```bash
    bun run lint
    ```
*   **Format the code:**
    ```bash
    bun run format
    ```

## Development Conventions

*   **Component-Based Architecture:** The project follows a component-based architecture, with components organized in the `src/components` directory.
*   **Styling:** The project uses Tailwind CSS for styling, with some components from Shadcn UI.
*   **State Management:** React Query is used for managing server state.
*   **API Communication:** The application communicates with a backend service called "Eliza" and a "sendo-worker" plugin. The `agent.service.ts` file manages the WebSocket connection and communication with the backend.
*   **Linting and Formatting:** The project uses Biome for linting and formatting, with a pre-commit hook to ensure code quality.
