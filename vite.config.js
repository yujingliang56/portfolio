import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const repo = process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.split('/')[1]
const isCI = !!process.env.GITHUB_ACTIONS
const base = isCI && repo ? `/${repo}/` : '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        polaroid: resolve(__dirname, 'polaroid-topics.html'),
        lucky: resolve(__dirname, 'lucky-cookie.html'),
      }
    }
  }
})
