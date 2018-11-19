function fetchProgrammingLanguage() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(['javascript', 'java', 'python']), 2000);
  })
}


describe('Mock testing', () => {
  // it('fetch programming fn', async () => {
  //   const langs = await fetchProgrammingLanguage();
  //   expect(langs).toContain('java')
  // })
  it('mocks the function', async () => {
    const fetchProgrammingLanguage = jest.fn().mockResolvedValue(['php', 'scala']);

    const langs = await fetchProgrammingLanguage();

    expect(langs).toContain('php')
  })
})