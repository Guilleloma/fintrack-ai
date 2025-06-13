# Flujos de desarrollo y CI/CD para FinTrack AI

## Desarrollo local

### Proceso de desarrollo
1. Crear una rama nueva para cada feature/fix desde `trunk`
   - Formato de nombre: `feature/nombre-descriptivo` o `fix/nombre-descriptivo`
2. Desarrollar y probar localmente
3. Ejecutar validaciones locales antes de push:
   ```bash
   npm run validate  # Ejecuta lint + test + validación de traducción
   ```
4. Crear Pull Request hacia `trunk`
5. Esperar revisión de código por pares
6. Mergear cuando el PR sea aprobado y todas las validaciones automáticas pasen
   - **Importante**: Utilizar siempre merge con `--no-ff` (no fast-forward) para mantener el historial de la rama de feature visible en el gráfico de Git
   ```bash
   git checkout trunk
   git merge --no-ff feature/nombre-descriptivo
   ```
   - Esto crea un commit de merge explícito, preservando el contexto y la historia de la rama de feature

### Convenciones de código
- **Commits**: Usar formato [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat: añadir funcionalidad de registro de activos
  fix: corregir error en cálculo de rentabilidad
  docs: actualizar documentación de API
  style: mejorar formato del código sin cambios funcionales
  refactor: restructurar código sin cambios funcionales
  test: añadir o actualizar tests
  chore: actualizar dependencias o configuración
  ```
- **Comentarios**: Documentar funciones complejas con JSDoc
- **Logs**: Utilizar niveles de log apropiados (error, warn, info, debug)

## CI/CD

### GitHub Actions
Se configurarán los siguientes workflows automáticos:

1. **Validación de Pull Request**:
   - Ejecutado en cada PR hacia `trunk`
   - Pasos:
     - Instalación de dependencias
     - Linting con ESLint/Prettier: `npm run lint`
     - Tests unitarios con Jest: `npm run test`
     - Validación de archivos JSON: `npm run validate:json`

2. **Despliegue de Preview**:
   - Ejecutado en cada PR hacia `trunk`
   - Genera un despliegue de preview en Vercel/Netlify
   - URL de preview añadida como comentario en el PR

3. **Despliegue a Producción**:
   - Ejecutado en cada push a `trunk` (post-merge de PR)
   - Despliegue automático a entorno de producción

### Protección de rama principal
- La rama `trunk` estará protegida:
  - No se permite push directo
  - Requiere al menos 1 aprobación de PR
  - Requiere que pasen todas las validaciones automáticas

## Control de calidad

### Tests
- **Unitarios**: Para funciones, componentes aislados y utilidades
- **Integración**: Para interacciones entre componentes y módulos
- **E2E**: Para flujos completos de usuario
- **Cobertura**: Mantener >80% de cobertura de código

### Linting y formato
- ESLint para validar reglas de código
- Prettier para formato consistente
- Husky para hooks de pre-commit que ejecuten validaciones

### Revisión de código
- Cada PR debe ser revisado por al menos un desarrollador
- Utilizar comentarios constructivos y específicos
- Verificar cumplimiento de los estándares definidos

## Gestión de versiones
- Seguir [Semantic Versioning](https://semver.org/)
  - MAJOR: Cambios incompatibles con versiones anteriores
  - MINOR: Nuevas funcionalidades compatibles con versiones anteriores
  - PATCH: Correcciones de errores compatibles con versiones anteriores
- Mantener un CHANGELOG actualizado

## Estrategia de ramificación y Continuous Development

### Modelo de ramificación
- Utilizamos un modelo basado en `trunk` (anteriormente conocido como `main`)
- Todas las ramas de feature/fix se crean desde `trunk` y se fusionan de vuelta a `trunk`

### Merge con No Fast-Forward
- **Siempre** utilizamos merge con la opción `--no-ff` (no fast-forward)
- Beneficios:
  - Preserva el historial completo y el contexto de la rama de feature
  - Facilita la visualización del trabajo en herramientas como GitGraph
  - Permite identificar fácilmente qué commits pertenecen a qué feature
  - Simplifica el rollback de features completas si es necesario

### Visualización del historial
- El historial de Git con `--no-ff` muestra claramente las ramas de feature:
  ```
  *--*--*--*--*--*--*--* trunk
         \         /
          *--*--*--* feature/A
              \
               *--*--* feature/B
  ```
- Para visualizar el gráfico de commits:
  ```bash
  git log --graph --oneline --all
  ```

### Continuous Integration
- Cada rama de feature tiene CI automático que ejecuta tests
- Las ramas se mantienen sincronizadas con `trunk` mediante rebase o merge frecuentes

### Continuous Deployment
- Cada merge a `trunk` desencadena un despliegue automático
- Los entornos de staging/QA se actualizan automáticamente
- El despliegue a producción requiere aprobación manual

## Documentación
- Actualizar README.md con cada feature significativa
- Mantener documentación de API actualizada
- Documentar decisiones de arquitectura importantes

---

Este documento debe ser consultado y seguido por todos los desarrolladores del proyecto para mantener un alto estándar de calidad en el código y los procesos.
