test('async code', (done) => {
 setTimeout(() => {
  expect(1).toBe(1)
  done()
 }, 3000)
})
