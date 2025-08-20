# 🫖 ChaiNoteLLM

ChaiNoteLLM is a Retrieval Augmented Generation (RAG) application that lets you bring your own data (text, PDFs, CSVs, or websites) and chat with it using an LLM.

## Key Features

- ✍️ Direct text input (via textarea)
- 📂 File uploads (PDF, CSV, etc.)
- 🌐 Recursive website scraping to ingest knowledge from entire domains
- 💬 Chat interface to query and interact with your stored data

## 🚀 Capabilities

### Multiple Data Sources

- Text input from UI
- File upload (PDF, CSV, etc.)
- Website scraping (recursive, multi-page)

### RAG Store

- Data indexed in Qdrant (local/cloud support)
- OpenAI embeddings (text-embedding-3-small)
- Chat interface powered by LLM
- Context-based responses from uploaded data

## 🛠️ Technology Stack

- **Frontend:** Next.js + React + TailwindCSS
- **Backend:** LangChain, Qdrant
- **Vector Database:** Qdrant (local/cloud)
- **Embeddings:** OpenAI (text-embedding-3-small)
- **LLM:** OpenAI GPT models

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/
│   │   ├── Chat.tsx
│   │   ├── ChatBox.tsx
│   │   ├── MessageBox.tsx
│   │   ├── PromptBar.tsx
│   │   └── VectorContent.tsx
│   └── uploader/
│       └── uploader.tsx
├── lib/
│   ├── prompt.ts
│   ├── uploadDataToVector.ts
│   └── vectorization.ts
uploads/
```

## ⚙️ Setup & Installation

1. **Clone Repository**

```bash
git clone https://github.com/<your-username>/ChaiNoteLLM.git
cd ChaiNoteLLM
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment**
   Create `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key
QDRANT_ENDPOINT=http://localhost:6333
# For cloud:
# QDRANT_ENDPOINT=https://<cluster-id>.eu-central-1-0.aws.cloud.qdrant.io
# QDRANT_API_KEY=your-qdrant-api-key
```

4. **Launch Qdrant** (Local only)

```bash
docker-compose up -d
```

5. **Start Development**

```bash
npm run dev
```

## 🖥️ Usage

1. Access `http://localhost:3000`
2. Choose input method:
   - Direct text entry
   - File upload (PDF/CSV)
   - Website URL
3. Start chatting with your data

## 📌 Use Cases

- Research paper analysis
- Company documentation queries
- Website exploration
- Knowledge management

## Additional Information

- 🛡️ **Compatibility:** Works with local/cloud Qdrant
- 📄 **License:** MIT
- 🤝 **Contributing:** Issues and PRs welcome
