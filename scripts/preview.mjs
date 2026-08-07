import { preview } from 'vite';

const server = await preview({
  root: process.cwd(),
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});

server.printUrls();
