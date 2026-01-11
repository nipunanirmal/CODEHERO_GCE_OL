# 🎓 O/L ICT Learning Platform

A comprehensive interactive learning tool designed for Sri Lankan G.C.E. O/L ICT students. This platform gamifies the learning process for Algorithms, Flowcharts, Pseudo-code, and Pascal Programming.

![Platform Preview](./docs/preview.png)

## ✨ Key Features

### 1. 🔄 Interactive Flowchart Builder
- Drag-and-drop interface to build flowcharts.
- Real-time logic validation.
- Visual execution tracking.

### 2. 📝 Pseudo-code Master
- Step-by-step pseudo-code writing challenges.
- Syntax highlighting and error checking.
- Levels ranging from simple sequences to complex loops.

### 3. 🖥️ Fully Functional Pascal IDE
- **Client-Side Compiler**: Runs Pascal code directly in your browser.
- **Strict Syntax Mode**: Enforces O/L standards (e.g., proper semicolon usage, `end.` termination).
- **Inline Input/Output**: A realistic terminal experience.
- **Features**:
    - `var`, `integer`, `string`, `real`, `boolean`
    - `if..then..else`
    - `for`, `while`, `repeat` loops
    - Logic Gates (`AND`, `OR`, `NOT`)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nipunanirmal/CODEHERO_GCE_OL.git
   cd CODEHERO_GCE_OL
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

> [!NOTE]
> **Why `npm install`?**  
> Large dependency files (`node_modules`) are excluded from GitHub to keep the repository light. Running `npm install` downloads all necessary libraries listed in `package.json` to your local machine.

### Building for Production
To create an optimized build for deployment (e.g., for Coolify, Vercel, or Netlify):

1. Run the build command:
   ```bash
   npm run build
   ```
2. The output will be generated in the `dist` folder.
3. You can preview the production build locally:
   ```bash
   npm run preview
   ```

## 🛠️ Tech Stack
- **Framework**: React + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Diagrams**: React Flow

## 📚 Syllabus Coverage
This tool covers the following competency levels from the G.C.E. O/L ICT Syllabus:
- **Algorithm Design**: Flowcharts & Pseudo-code.
- **Programming**: Pascal Syntax & Logic.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is open-source and available under the MIT License.
