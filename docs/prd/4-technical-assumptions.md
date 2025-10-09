# 4. Technical Assumptions

## Repository Structure: Monorepo
* **Rationale:** A monorepo approach is recommended to manage the codebase for both the mobile and web applications, as well as the backend services. This structure promotes code sharing between the frontend and backend, which can be highly efficient for development and maintenance.

## Service Architecture: Serverless
* **Rationale:** Given the use of n8n and Langflow for automation and AI tasks, a serverless architecture is a natural fit for the MVP. It allows for a highly scalable, pay-per-use model that is ideal for managing costs in the early stages of a startup.

## Frontend Framework: React
* **Rationale:** We will use React with a mobile-first approach for the frontend. This framework is a great choice because of its large community, extensive library of components, and ability to build both web and mobile applications with tools like React Native in the future.
* **Styling Framework:** Tailwind CSS is recommended for styling, as it allows for rapid and consistent UI development.

## LLM Provider: Google Gemini (Primary) + OpenAI GPT-4o (Optional)
* **Rationale:** The choice of LLM is critical for the AI reconciliation engine. We will use a provider that offers a balance of performance, accuracy, and cost-effectiveness for our MVP.
* **Primary Provider**: **Google's Gemini** - A powerful model with a large context window, which is ideal for processing entire documents like bank statements.
* **Optional Fallback**: **OpenAI's GPT-4o** - A well-known and robust model that is highly capable for a variety of tasks, providing redundancy.

## Testing Requirements: Unit + Integration
* **Rationale:** For the MVP, a testing strategy that focuses on Unit and Integration tests will provide a strong foundation for quality without requiring the time and resources of a full testing pyramid. This approach balances speed and quality, ensuring core functionality is reliable while allowing for rapid development.

## Additional Technical Assumptions and Requests
* **Language and Frameworks:** The primary language for the project will be JavaScript/TypeScript. The frontend will be built with a modern framework like React, and the backend services will use Node.js.
* **External Services:** We will leverage Supabase for our database and authentication needs, and use n8n and Langflow to manage our back-end workflows and AI logic.
* **UI Component Strategy:** shadcn/ui with Model Context Protocol (MCP) for rapid, consistent component generation aligned with Previa design system.
