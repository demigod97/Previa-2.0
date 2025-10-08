
# Privia Financial AI Reconciliation — Documentation

Start here for project docs:

- docs/index.md (canonical index)
- docs/Project Brief.md
- docs/prd.md
- docs/architecture.md
- docs/PolicyAi UI-UX Specifications.md

---

# PolicyAi Fullstack Architecture Document

### Introduction

This document outlines the complete fullstack architecture for PolicyAi, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

* **Starter Template:** The project will be built upon the existing "InsightsLM" codebase, treating it as a foundational starter template.

### High Level Architecture

* **Technical Summary:** The architecture for PolicyAi is a serverless, full-stack application leveraging Supabase and N8N. The frontend is a React SPA communicating via Supabase Edge Functions with backend N8N workflows that handle the specialized RAG pipeline. This reuses the "InsightsLM" foundation while extending it with a robust, role-based security model enforced by Postgres Row Level Security.
* **Platform:** Supabase (backend) & Vercel/Netlify (frontend).
* **Repository Structure:** Monorepo, to simplify dependency management and ensure consistency.

#### High Level Architecture Diagram
```mermaid
graph TD
    subgraph "User's Browser"
        A[React SPA on Vercel/Netlify]
    end

    subgraph "Supabase Platform"
        B[Edge Functions API]
        C[Authentication]
        D[Storage]
        E[Postgres DB with RLS]
        F[Vector Store]
    end

    subgraph "N8N Cloud"
        G[RAG Ingestion Workflow]
        H[Chat Workflow]
    end

    A -- "Signs In" --> C
    A -- "Uploads Policy" --> D
    A -- "Asks Question" --> B
    
    D -- "On Upload Trigger" --> G
    B -- "Invokes Chat" --> H

    G -- "Extracts Metadata & Chunks" --> E
    G -- "Creates Embeddings" --> F

    H -- "Queries with User Role" --> F
    H -- "Retrieves Chat History" --> E
    H -- "Returns Cited Answer" --> A
````

### Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| Frontend Language | TypeScript | `~5.5.3` |
| Frontend Framework| React | `~18.3.1` |
| UI Component Lib| shadcn/ui | `N/A` |
| State Management| TanStack Query | `~5.56.2` |
| Backend Language| TypeScript | `Deno` |
| Backend Framework| N8N / Deno | `Cloud` / `~1.4` |
| API Style | REST-like | `v1` |
| Database | PostgreSQL | `15` |
| File Storage | Supabase Storage| `Cloud` |
| Authentication | Supabase Auth | `Cloud` |
| Frontend Testing| Vitest / RTL | `latest` |
| Backend Testing | Deno Test | `Deno` |
| E2E Testing | Playwright | `latest` |
| Build Tool | Vite | `~5.4.1` |
| CI/CD | GitHub Actions | `v4` |
| CSS Framework | Tailwind CSS | `~3.4.11`|

### Data Models & Database Schema

The database schema is designed to be version-aware and support RBAC, with tables for `profiles`, `user_roles`, `policies`, `policy_revisions`, `sources`, `saved_policies`, and `documents` for vector embeddings. The full SQL DDL is detailed in the previous sections.

### API Specification

The API uses an asynchronous, polling-based pattern for long-running tasks like chat and document ingestion to ensure a responsive UI. It includes endpoints for managing policies, revisions, chat, and user roles.

### Unified Project Structure

The project will use a pragmatic monorepo structure that evolves the existing codebase by adding a `shared` directory for common code like TypeScript types.

```plaintext
policy-ai-app/
├── src/                  # The React SPA frontend (existing)
├── supabase/             # Supabase-specific code (existing)
├── n8n/                  # N8N workflows (existing)
├── shared/               # NEW: For shared code
│   └── src/
│       └── types.ts
├── docs/
└── package.json
```

### Security

A multi-layered security architecture is defined with Supabase Auth for authentication and PostgreSQL's Row Level Security (RLS) for fine-grained authorization, ensuring data is protected at the database level.

### Testing Strategy

A comprehensive, three-layered testing strategy will be implemented:

1.  **Foundational Testing Pyramid:** For all deterministic code.
2.  **Real-Time E2E and AI Behavior Testing:** Using Playwright and AG-UI to test the AI's reasoning process.
3.  **AI Quality Evaluation:** Using a "golden dataset" derived from the sample policy documents to test for regressions.

### Development Workflow

The development workflow is standardized with `npm` as the package manager and clear commands for setup, development, and testing.

-----


# PolicyAi: AI-Powered Policy Management and Compliance Q&A System

> Transform your organizational policy management with AI-powered intelligence. PolicyAi helps organizations manage, search, and get instant answers from their policy documents through an intelligent Q&A interface.

**PolicyAi** is a specialized application designed to help administrators and executives navigate complex organizational policies with AI-powered search and question-answering capabilities. It provides a centralized platform for policy document management with advanced RAG (Retrieval-Augmented Generation) technology to ensure accurate, source-grounded responses.


## About The Project

PolicyAi addresses the critical challenge organizations face in managing and accessing their policy documents effectively. Traditional policy management often results in scattered documents, inconsistent interpretations, and difficulty finding relevant information when needed.

This application provides a centralized, AI-powered solution that transforms how organizations interact with their policies. Built with modern web technologies and powered by advanced RAG capabilities, PolicyAi ensures that policy-related questions receive accurate, source-backed answers.

The system is designed to be self-hostable and customizable, allowing organizations to maintain complete control over their sensitive policy data while benefiting from cutting-edge AI assistance.


<p align="center">
  <img src="https://www.theaiautomators.com/wp-content/uploads/2025/07/Group-2652.png" alt="The AI Automators Logo" width="500"/>
</p>


## Fully Local Version

This version of InsightsLM relies on cloud AI services like OpenAI and Gemini.

If you'd like to setup a fully local version of this that uses Ollama and Qwen3 along with Whisper and CoquiTTS, then check out our other repo below

[Fully Local InsightsLM](https://github.com/theaiautomators/insights-lm-local-package)

## Join Our Community

If you're interested in learning how to customize InsightsLM or build similar applications, join our community, The AI Automators.

https://www.theaiautomators.com/


## Key Features

* **Policy Document Q&A:** Upload policy documents and get instant, context-aware answers to compliance questions.
* **Verifiable Citations:** Jump directly to the source policy text to ensure accurate interpretation and compliance.
* **Administrator Experience:** Streamlined interface designed for policy administrators to manage and organize documents.
* **Executive Dashboard:** High-level overview and advanced search capabilities for executive decision-making.
* **Private and Self-Hosted:** Maintain complete control over sensitive policy data by hosting it yourself.
* **Customizable and Extensible:** Built with modern, accessible tools, making it easy to tailor to your organization's needs.


## Demo & Walkthrough

For a complete demonstration of InsightsLM, an overview of its architecture, and a step-by-step guide on how to set it up, check out our YouTube video:

<p>
  <a target="_blank" href="https://www.youtube.com/watch?v=IXJEGjfZRBE"><img src="https://raw.githubusercontent.com/theaiautomators/insights-lm-public/main/public/video.png" alt="Video" width="500"/></a>
</p>


## Built With

This project is built with a modern, powerful stack:
* **Frontend:** 
    * [Loveable](https://theaiautomators.com/go/loveable)
    * [Vite](https://vitejs.dev/)
    * [React](https://react.dev/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [shadcn-ui](https://ui.shadcn.com/)
    * [Tailwind CSS](https://tailwindcss.com/)
* **Backend:**
    * [Supabase](https://supabase.com/) - for database, authentication, and storage.
    * [N8N](https://theaiautomators.com/go/n8n) - for workflow automation and backend logic.


## Getting Started: A Guide for No-Coders to Test and Customize

This guide provides the quickest way to get InsightsLM up and running so you can test, customize, and experiment.

I recommend you following along from 17:53 in our video here for the full step by step guide - [https://youtu.be/IXJEGjfZRBE?t=1073](https://youtu.be/IXJEGjfZRBE?t=1073)

You will need a notepad file open to copy and paste in various credentials and details.

1.  **Create Supabase Account and Project**
    * Go to [Supabase.com](https://supabase.com/) and create a free account.
    * Create a new project. Paste in your `database password` into your open notepad file as you will need this later.
2.  **Create GitHub Account & Repo from Template**
    * If you don't have one, create a free account on [GitHub](https://github.com/).
    * Navigate to the InsightsLM template repository here: [**github.com/theaiautomators/insights-lm-public**](https://github.com/theaiautomators/insights-lm-public)
    * Click the `Use this template` button to create a copy of the repository in your own GitHub account. Fill out the form.
3.  **Import into an AI-Coding Editor (Bolt.new)**
    * Create an account on [Bolt.new](https://bolt.new/) as it supports Supabase integration. (While the project was built on Loveable, it is currently quite difficult to import existing Github projects into Loveable)
    * Import your newly created GitHub repository into your Bolt project. You will need to link your Github account to Bolt. Choose the repo and import.
    * Now click Integrations on the top and connect your Supabase project. You will need to link your Supabase account to Bolt.
    * Once connected, the Supabase Edge Functions will auto-deploy. You will need to approve the running of the migration script to create the data structures in Supabase.
4.  **Import and Configure N8N Workflows**
    * The `/n8n` directory in this repository contains the JSON files for the required N8N workflows. There are 2 approaches here.
        1. The easiest is to import the "Import_Insights_LM_Workflows.json" file into a new workflow in n8n and follow the steps in the video. This includes configuring an n8n API key which will be used to auto-create all workflows needed by the system. You will also need to set various credentials.
        2. Instead of using the above workflow importer, you can instead download and import the 6 JSON workflows in this directory. You will need to go node by node in each workflow to configure them for your services. (e.g. Supabase, OpenAI, Gemini, Sub-Workflows etc). Follow the TODOs in each workflow.
5.  **Add N8N Webhooks to Supabase Secrets**
    * Your N8N workflows are triggered by webhooks from the Supabase Edge Functions. If you used the workflow importer, you will have the list of N8N secrets to create. Otherwise you'll need to gather these from the various workflows.
    * In your Supabase project dashboard, navigate to `Edge Functions` -> `Secrets` and add the following secrets. This allows the Supabase Edge Functions to securely call your N8N workflows.
    * These are the secrets that need to be created
        * NOTEBOOK_CHAT_URL
        * NOTEBOOK_GENERATION_URL
        * AUDIO_GENERATION_WEBHOOK_URL
        * DOCUMENT_PROCESSING_WEBHOOK_URL
        * ADDITIONAL_SOURCES_WEBHOOK_URL
        * NOTEBOOK_GENERATION_AUTH (This is the password for the custom Header Auth for each n8n Webhook)
        * OPENAI_API_KEY (This is used in the Generate Note Title edge function)
6.  **Test & Customize**
    * That's it! Your instance of InsightsLM should now be live.
    * You can now test the application, upload documents, and start chatting.
    * Within Bolt.new you can also deploy this to Netlify

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

- Fork the Project
- Create your Feature Branch (git checkout -b feature/AmazingFeature)
- Commit your Changes (git commit -m 'Add some AmazingFeature')
- Push to the Branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## License

This codebase is distributed under the MIT License.

## A Note on n8n's Sustainable Use License

While InsightsLM is fully open-sourced and Supabase is also open source, it's important to be aware that n8n, which powers much of the backend automation, is not open source in the traditional sense.

n8n is distributed under a [Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md). This license allows free usage for internal business purposes, including hosting workflows within your company or organization.

However, if you plan to use InsightsLM as part of a commercial SaaS offering—such as reselling access or hosting a public version for multiple clients—you may need to obtain an n8n Enterprise License. We’re not lawyers, so we recommend that you review the n8n license and contacting their team if your use case falls into a commercial category.

Alternatives: If your use case is restricted by the n8n license, one potential option is to convert key workflows into Supabase Edge Functions. This would allow you to fully avoid using n8n in production.