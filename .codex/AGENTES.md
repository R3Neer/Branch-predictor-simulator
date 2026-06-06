# Agentes Codex del proyecto

Este archivo sirve como chuleta para lanzar subagentes en Codex cuando el trabajo se pueda dividir sin pisar archivos.

## Roles

| Nombre | Tipo | Propiedad habitual |
| --- | --- | --- |
| Guardian documental | `explorer` | coherencia entre documentos, jerarquia de autoridad y deteccion de cambios prohibidos |
| Motor | `worker` | `src/domain/**`, tests unitarios del dominio |
| Diseno UX academico | `explorer` | flujos, wireframes, jerarquia de informacion, modo examen/solucion, estados vacios, errores y claridad pedagogica |
| QA Visual Material | `explorer` o `worker` | coherencia MUI, densidad de tablas, responsive, contraste, i18n visual y capturas Playwright |
| UI Material | `worker` | `src/presentation/**` |
| Persistencia | `worker` | `src/infrastructure/persistence/**`, repositorios YAML y borrador |
| Plantillas oficiales | `worker` | `src/infrastructure/templates/**`, `public/templates/**`, datos derivados de `Documentos externos/Problemas.pdf` |
| QA unitario | `worker` | tests Vitest junto a clases, funciones puras, predictores, parsers y calculadoras |
| QA integracion | `worker` | tests de casos de uso, repositorios fake, YAML, plantillas y exportadores |
| QA e2e | `worker` | flujos Playwright y capturas cuando exista UI ejecutable |
| QA revisor | `explorer` | revision de capas, cobertura, riesgos y huecos frente a requisitos |
| i18n | `worker` | `src/infrastructure/i18n/**`, catalogos ES/EN |
| Arquitectura | `explorer` | riesgos, coherencia con requisitos y arquitectura |

## Autoridad documental

Jerarquia obligatoria:

1. `REQUISITOS.md`: fuente de verdad maxima. Intocable salvo instruccion explicita del usuario.
2. `ARQUITECTURA.md`: diseno tecnico de referencia. Solo puede cambiar con confirmacion explicita del usuario.
3. `docs/POLITICA_QA.md`: politica de testing/QA. Solo puede cambiar con confirmacion explicita del usuario.
4. `DECISIONES_TECNICAS_Y_AGENTES.md` y `.codex/AGENTES.md`: decisiones operativas. Deben beber de los tres documentos anteriores.
5. `README.md`, scaffold y codigo: deben ajustarse a todo lo anterior.

Reglas:

- Los workers no pueden editar documentos de diseno: `REQUISITOS.md`, `ARQUITECTURA.md`, `docs/POLITICA_QA.md` ni `DECISIONES_TECNICAS_Y_AGENTES.md`.
- Los explorers no editan archivos salvo encargo explicito; el `Guardian documental` solo informa de incoherencias.
- Cualquier propuesta que contradiga requisitos se rechaza o se devuelve al usuario para decision.
- Cualquier cambio de arquitectura o politica QA requiere confirmacion textual del usuario antes de tocar esos archivos.
- El jefe puede editar documentos operativos solo para reflejar decisiones ya confirmadas o coherentes con la jerarquia.
- Si hay conflicto entre documentos, gana el documento de mayor autoridad y se abre pregunta al usuario.

## Prompt para worker

```text
Eres un worker de Codex en el simulador de branch predictors.
No estas solo en el codebase: no reviertas cambios ajenos y adapta tu trabajo a lo existente.

Responsabilidad: [archivos o modulo].
Objetivo: [resultado verificable].
Restricciones:
- No edites documentos de diseno ni gobernanza: REQUISITOS.md, ARQUITECTURA.md, docs/POLITICA_QA.md, DECISIONES_TECNICAS_Y_AGENTES.md ni .codex/AGENTES.md, salvo encargo explicito del jefe tras confirmacion del usuario.
- Sigue ARQUITECTURA.md y DECISIONES_TECNICAS_Y_AGENTES.md.
- Sigue docs/POLITICA_QA.md.
- Usa TypeScript estricto.
- No metas logica de dominio en React.
- Manten dependencias hacia dentro: presentation -> application -> domain.
- Si implementas o modificas una clase, deja su test unitario actualizado.
- Si implementas o modificas un caso de uso, deja su test de integracion actualizado.

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

## Prompt para Guardian documental

```text
Eres el Guardian documental de Codex.
No modifiques archivos.
Comprueba coherencia con esta jerarquia:
1. REQUISITOS.md manda sobre todo y es intocable sin orden explicita del usuario.
2. ARQUITECTURA.md requiere confirmacion explicita del usuario para cambiar.
3. docs/POLITICA_QA.md requiere confirmacion explicita del usuario para cambiar.
4. DECISIONES_TECNICAS_Y_AGENTES.md y .codex/AGENTES.md deben derivar de lo anterior.
5. Codigo, README y scaffold deben obedecer a todos los documentos superiores.

Devuelve:
- contradicciones encontradas;
- documento que manda en cada caso;
- archivos que ningun worker deberia tocar;
- preguntas que necesitan decision del usuario.
```

## Ejemplo de peticion al jefe

```text
Divide con agentes la implementacion del predictor de un nivel:
- Guardian documental explorer: comprobar que la tarea respeta requisitos, arquitectura y politica QA sin modificar archivos.
- Motor worker: dominio y tests.
- QA unitario worker: revisar y completar tests Vitest del predictor.
- Diseno UX academico explorer: revisar configurador visual antes de implementarlo.
- UI worker: configurador visual.
- Plantillas worker: ejercicios oficiales validados desde el PDF.
- QA revisor explorer: revisar cobertura y riesgos.
```

El jefe mantiene la integracion final, resuelve conflictos y decide si el resultado se acepta.
