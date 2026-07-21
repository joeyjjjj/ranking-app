import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

const packageName = JSON.parse(readFileSync('./package.json', 'utf-8')).name as string
const githubPagesBase = `/${packageName}/`

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? githubPagesBase : '/',
  plugins: [react(), tailwindcss()],
}))
