import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { netlifyPlugin } from '@netlify/remix-adapter/plugin'
import { copyFileSync, mkdirSync } from 'fs'
import path from 'path'

export default defineConfig({
    plugins: [
        remix(),
        netlifyPlugin(),
        tsconfigPaths(),
        {
            name: 'copy-fonts',
            apply: 'build', // Only apply during build
            enforce: 'post', // Run after other plugins
            closeBundle: () => {
                const fontSource = path.resolve(process.cwd(), './fonts/huiwen-mincho.otf') // Source path
                const fontDestinationDir = path.resolve(process.cwd(), 'build/server/fonts') // Destination directory
                const fontDestination = path.resolve(fontDestinationDir, 'huiwen-mincho.otf') // Full destination path
                mkdirSync(fontDestinationDir, { recursive: true })
                copyFileSync(fontSource, fontDestination)
                console.log('Font file copied to build/server/fonts/')
            },
        },
    ],
})
