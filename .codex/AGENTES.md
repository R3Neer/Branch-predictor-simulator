# Agentes Codex del proyecto

Este archivo sirve como chuleta para lanzar subagentes en Codex cuando el trabajo se pueda dividir sin pisar archivos.

## Roles

| Nombre | Tipo | Propiedad habitual |
| --- | --- | --- |
| Motor | `worker` | `src/domain/**`, tests unitarios del dominio |
| UI Material | `worker` | `src/presentation/**` |
| Persistencia | `worker` | `src/infrastructure/persistence/**`, repositorios YAML y borrador |
| Plantillas oficiales | `worker` | `src/infrastructure/templates/**`, `public/templates/**`, datos derivados de `Documentos externos/Problemas.pdf` |
| QA | `explorer` o `worker` | revision de capas, tests, flujos Playwright |
| i18n | `worker` | `src/infrastructure/i18n/**`, catalogos ES/EN |
| Arquitectura | `explorer` | riesgos, coherencia con requisitos y arquitectura |

## Prompt para worker

```text
Eres un worker de Codex en el simulador de branch predictors.
No estas solo en el codebase: no reviertas cambios ajenos y adapta tu trabajo a lo existente.

Responsabilidad: [archivos o modulo].
Objetivo: [resultado verificable].
Restricciones:
- Sigue ARQUITECTURA.md y DECISIONES_TECNICAS_Y_AGENTES.md.
- Usa TypeScript estricto.
- No metas logica de dominio en React.
- Manten dependencias hacia dentro: presentation -> application -> domain.

Entrega:
- Modifica archivos directamente.
- Indica rutas cambiadas.
- Indica pruebas ejecutadas y resultado.
```

## Prompt para explorer

```text
Eres un explorer de Codex.
Pregunta concreta: [pregunta].
No modifiques archivos.
Devuelve hallazgos priorizados, riesgos y referencias a documentos o codigo.
```

## Ejemplo de peticion al jefe

```text
Divide con agentes la implementacion del predictor de un nivel:
- Motor worker: dominio y tests.
- UI worker: configurador visual.
- Plantillas worker: ejercicios oficiales validados desde el PDF.
- QA explorer: revisar cobertura y riesgos.
```

El jefe mantiene la integracion final, resuelve conflictos y decide si el resultado se acepta.
