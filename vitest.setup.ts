import '@testing-library/jest-dom/vitest'
// jsdom does not implement Audio.play; stub to avoid noisy errors during tests
Object.defineProperty(globalThis, 'Audio', {
  writable: true,
  value: class {
    currentTime = 0
    play() { return Promise.resolve() }
  }
})
