# 🏥 Ollama Node Agent: The Coding Doctor 🚀

![Ollama Node Agent](https://img.shields.io/badge/Status-Stable-92ff92?style=for-the-badge&logo=aiengine)
![Node.js](https://img.shields.io/badge/Runtime-Node.js_18-339933?style=for-the-badge&logo=nodedotjs)
![Local LLM](https://img.shields.io/badge/Powered_By-Ollama-ed8b00?style=for-the-badge&logo=ollama)
![Platform](https://img.shields.io/badge/Platform-Windows_11-0078d4?style=for-the-badge&logo=windows11)

> **"Don't just chat with your code—have a doctor perform surgery on it."**

The **Ollama Node Agent** is a high-performance, autonomous AI assistant that lives directly on your Windows machine. Unlike standard LLM interfaces, this agent is equipped with internal **Nodes** that allow it to diagnose project needs, write complex source files, execute terminal commands, and build full-scale applications—all using **100% local models**.

---

## 💎 Why "Doctor Mode"?

Standard agents often "give up" or ask you to copy-paste code. The **Coding Doctor** is designed with a **Persistence-First** methodology:
- **Autonomous Surgery**: It writes files directly to your disk. No copy-pasting required.
- **Internal Nodes**: Uses built-in Node.js modules for JS/File operations—faster and more reliable than MCP servers.
- **Self-Healing**: If a build fails, the agent reads the error, modifies the `package.json` or source, and tries again until the app is healthy.
- **Premium Aesthetics**: A high-visibility, bright ANSI-colored CLI designed for modern black terminals.

---

## 🔥 Key Features

- **🦾 Solo-Executable**: Packaged via `pkg` into a single, zero-dependency `.exe` file.
- **📂 Deep FS Integration**: Creates parent directories on the fly and manages complex project structures.
- **⚡ Fast-Track Build**: Can bundle Electron apps and generate **NSIS Windows Installers** automatically.
- **🌈 High-Contrast UI**: Optimized color palette (Bright Green, Cyan, Magenta) for crystal-clear readability.
- **🧠 Model Hot-Swapping**: Switch between `qwen2.5-coder`, `gpt-oss:120b`, or any other Ollama model with a simple slash command.

---

## 🛠️ Architecture: The "Nodes" 

The agent operates through a set of internal **Nodes**:

| Node | Purpose | Capability |
| :--- | :--- | :--- |
| **`fs_node`** | 📁 File System | Read/Write (UTF8/Base64), Directory Listing, recursive mkdir. |
| **`exec_node`** | 💻 Terminal | Run any bash/powershell command, npm scripts, and installers. |

---

## 🚀 Getting Started

### 1. Requirements
- [Ollama](https://ollama.com/) must be running locally.
- Recommended Model: `qwen2.5-coder:latest` (or your preferred local powerhouse).

### 2. Fast Launch (Standalone)
Run the pre-compiled executable from the `dist` folder:
```powershell
./ollama-node-agent.exe
```

### 3. Developer Install
```bash
# Clone the repository
git clone https://github.com/your-username/ollama-node-agent.git

# Install dependencies
npm install

# Start the agent
node agent.js
```

---

## 🕹️ Command Center

Talk to the agent naturally:
- 💡 *"Create a digital clock app with Electron and make me a Windows installer."*
- 💡 *"Analyze the current directory and find all todo comments."*
- 💡 *"Install express and setup a hello-world server."*

### Slash Commands
- `/model <name>` : Switch the active Ollama model instantly.
- `/clear` : (Planned) Clear session history.
- `exit` : Close the clinic.

---

## 📦 Building your own Executable
```bash
npm run build
```
*This uses Vercel's `pkg` to bundle the Node runtime into a single standalone binary for Windows.*

---

## 🛡️ License
Distributed under the **ISC License**. See `LICENSE` for more information.

---
<p align="center">
  <i>Built with ❤️ for the Local LLM Revolution by <b>Ionel jupanu tau</b></i>
</p>
