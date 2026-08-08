import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        unstubEnvs: true,
        setupFiles: ['dotenv/config', './src/tests/testGlobal.ts']

    },

})
