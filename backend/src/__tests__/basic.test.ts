// Test básico para verificar la configuración de Jest
describe('Tests básicos', () => {
  it('debería verificar que 1 + 1 = 2', () => {
    console.log('Ejecutando test básico');
    expect(1 + 1).toBe(2);
    console.log('Test básico completado correctamente');
  });
});
