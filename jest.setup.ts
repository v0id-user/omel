import { TextDecoder, TextEncoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';

Object.assign(globalThis, {
  ReadableStream,
  TextDecoder,
  TextEncoder,
  TransformStream,
  WritableStream,
});

const {
  Headers,
  Request,
  Response,
  fetch,
} = require('next/dist/compiled/@edge-runtime/primitives/fetch');

Object.assign(globalThis, {
  Headers,
  Request,
  Response,
  fetch,
});
