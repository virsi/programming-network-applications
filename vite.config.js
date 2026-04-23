export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
};
