# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type‑aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Project Overview

- Agentic platform used: Antigravity

**LetoiledOrée — Restaurant Web** is a modern, responsive restaurant web application built with **React** and **Vite**. It demonstrates a full‑stack workflow with Vercel deployment, showcasing a sleek UI, dynamic menu rendering and client‑side routing.

## Features
- Clean, component‑based architecture with React hooks
- Fast development server and build optimization via Vite
- Responsive design with dark‑mode support
- Easy deployment to Vercel (continuous integration)
- Ready for extension: add a backend API, authentication or a CMS

## Getting Started
1. **Clone the repository** (already done) or ensure you have the project folder.
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
4. **Build for production**
   ```bash
   npm run build
   ```
   The output will be in the `dist/` directory.

## Deployment to Vercel
The project is already linked to Vercel. After pushing changes to the `main` branch, Vercel will automatically deploy. You can also trigger a redeploy from the Vercel dashboard.

## Contributing
Feel free to open issues or submit pull requests. Follow the standard Git workflow:
```bash
git checkout -b feature/your-feature
# make changes
git commit -m "Add new feature"
git push origin feature/your-feature
# open a PR
```

## License
MIT License – see the `LICENSE` file for details.
