import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';
import fetch from 'cross-fetch';

// Set up globals
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
global.fetch = fetch;

// Mock fetch
jest.spyOn(global, 'fetch').mockImplementation(() => 
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('')
    } as Response)
);

// Mock console.error
console.error = jest.fn(); 