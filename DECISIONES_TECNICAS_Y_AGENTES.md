# Decisiones tecnicas y agentes Codex

Este documento fija la pila tecnologica inicial y el modelo de trabajo con agentes para implementar el simulador de branch predictors descrito en `REQUISITOS.md` y `ARQUITECTURA.md`.

## 1. Decision ejecutiva

Implementaremos una aplicacion web local con un nucleo de simulacion puro en TypeScript, una interfaz React y una estructura modular por capas.

La decision favorece:

- Un unico lenguaje principal para dominio, aplicacion, infraestructura y UI.
- Pruebas rapidas del motor sin navegador.
- Tipado fuerte para configuraciones de predictores, trazas y YAML.
- Distribucion sencilla como carpeta local exportable.
- Extension futura hacia Tournament, TAGE, pipeline, ROB y pila de retorno sin rehacer la UI.

## 2. Pila tecnologica

| Area | Tecnologia | Decision |
| --- | --- | --- |
| Lenguaje principal | TypeScript | Lenguaje unico del producto. Tipado estricto para dominio y contratos. |
| Build/frontend | Vite | Arranque rapido, aplicacion local, poca ceremonia. |
| UI | React | Buen ecosistema para tablas, editores, estado e i18n. |
| Componentes UI | MUI Material UI | Encaja con el estilo Android/Material solicitado. |
| Estado de UI | Zustand | Estado simple y explicito para sesion, modo, ejecucion y paneles. |
| Datos servidor/async | TanStack Query, solo si hace falta | Probablemente prescindible en v1 al ser app local sin backend. |
| Tablas | TanStack Table | Tablas dinamicas por predictor, columnas configurables y renderizado controlado. |
| Editores de codigo | Monaco Editor | Buena experiencia para C y RISC-V, resaltado y bloqueo del editor C. |
| Validacion | Zod | Validar YAML, plantillas oficiales, configs y formularios. |
| YAML | yaml | Importar/exportar sesiones visibles para el usuario. |
| i18n | i18next + react-i18next | ES/EN con catalogos separados y claves estables. |
| Export CSV | PapaParse o generador propio simple | CSV desde proyecciones, no desde DOM. |
| Export Markdown | Generador propio | Es suficientemente simple y mantiene control educativo. |
| Export imagen | html-to-image en v1.1 | Posponer salvo que quede tiempo; no bloquea la v1. |
| Testing unitario | Vitest | Ideal para dominio puro TypeScript y Vite. |
| Testing UI | Testing Library | Tests de componentes y flujos criticos sin sobreactuar. |
| Testing e2e | Playwright | Verificar flujos locales completos y capturas cuando haya UI. |
| Formato/lint | ESLint + Prettier | Calidad basica y consistencia. |
| Documentacion interna | Markdown + Mermaid | Ya esta alineado con la arquitectura actual. |

## 3. Tecnologias descartadas

| Opcion | Motivo |
| --- | --- |
| Next.js | No necesitamos SSR, rutas servidor ni backend. Vite es mas ligero para una web local. |
| Angular | Robusto, pero demasiado pesado para el alcance y menos agil para iterar con Codex. |
| Vue/Svelte | Viables, pero React + MUI + TanStack ofrece mejor encaje con tablas, editores y ecosistema. |
| Python backend | Anade una frontera innecesaria. El motor puede vivir puro en TypeScript. |
| Rust/WASM | Interesante para rendimiento, innecesario para las trazas educativas de v1. |
| Electron | No hace falta empaquetar escritorio en v1; una web local basta. |

## 4. Estructura propuesta del proyecto

```text
.
+-- src/
|   +-- domain/
|   |   +-- predictors/
|   |   +-- simulation/
|   |   +-- stats/
|   |   +-- correction/
|   |   +-- source/
|   +-- application/
|   |   +-- use-cases/
|   |   +-- ports/
|   |   +-- projectors/
|   +-- infrastructure/
|   |   +-- persistence/
|   |   +-- templates/
|   |   +-- export/
|   |   +-- i18n/
|   +-- presentation/
|   |   +-- components/
|   |   +-- screens/
|   |   +-- stores/
|   |   +-- theme/
|   +-- test/
+-- public/
|   +-- templates/
+-- docs/
+-- .codex/
+-- package.json
```

Regla de dependencia:

```text
presentation -> application -> domain
infrastructure -> application/domain
domain -> nada externo de UI, YAML, LocalStorage o React
```

## 5. Decisiones v1

- Retroceso paso a paso: entra en v1 mediante historial de snapshots/traza, no con patron Command completo.
- Exportacion a imagen: se pospone a v1.1 salvo que quede margen; CSV y Markdown entran primero.
- Margen por defecto para porcentajes: `0.5%` absoluto, configurable por plantilla.
- Parser RISC-V inicial: `beq`, `bne`, `blt`, `bge`, `bgt`, `ble`, `beqz`, `bnez`, etiquetas, direcciones opcionales hexadecimales y comentarios.
- Traductor C inicial: didactico, no compilador real; cubre bucles, condicionales, enteros, flotantes basicos y operaciones aritmeticas simples.
- Plantillas oficiales: datos versionados en YAML/JSON validados con Zod y ejecutados por `TemplateValidator`.

## 6. Equipo de agentes

Usaremos agentes de Codex solo para tareas separables. El programador jefe mantiene la arquitectura, integra cambios y toma decisiones finales.

| Agente | Tipo Codex | Responsabilidad | Cuando usarlo |
| --- | --- | --- | --- |
| Arquitecto revisor | `explorer` | Revisar requisitos, detectar inconsistencias y riesgos. | Antes de cambios grandes o al cerrar hitos. |
| Motor de simulacion | `worker` | Implementar `domain/predictors`, `simulation`, `stats`. | Cuando haya contratos definidos y tests esperados. |
| UI Material | `worker` | Implementar pantallas, tablas, editores y estados visuales. | Cuando el dominio exponga casos de uso estables. |
| Persistencia | `worker` | YAML, validacion Zod, repositorios de sesion y borrador. | En paralelo al motor, con contratos cerrados. |
| Plantillas oficiales | `worker` | Extraer y versionar ejercicios 1, 2, 3, 4, 5 y 7 desde `Documentos externos/Problemas.pdf`. | Cuando el esquema de plantilla este definido. |
| QA y pruebas | `worker` o `explorer` | Crear tests Vitest/Playwright y revisar flujos. | Despues de cada bloque funcional. |
| i18n y contenido | `worker` | Catalogos ES/EN, textos de UI y enunciados. | Cuando la UI tenga claves estables. |

## 7. Como configurarlos aqui en Codex

En este entorno los agentes se lanzan desde la conversacion cuando el programador jefe los necesita. No tienes que instalar nada adicional si la herramienta `multi_agent_v1` esta disponible.

Forma de pedirlo:

```text
Usa agentes para dividir esta tarea:
- worker Motor: implementa predictores de un nivel y tests.
- worker UI: crea configurador de predictor y tabla base.
- worker Plantillas: convierte ejercicios oficiales del PDF en plantillas validadas.
- explorer QA: revisa riesgos de arquitectura y cobertura.
```

Reglas de uso:

- Cada `worker` debe recibir una zona de propiedad clara para evitar conflictos.
- Ningun agente debe revertir cambios de otros.
- Los agentes de implementacion deben devolver rutas de archivos modificadas.
- El jefe revisa, integra y ejecuta pruebas antes de dar por cerrado el trabajo.

Prompt base recomendado para un worker:

```text
Eres un worker de Codex en este proyecto. No estas solo en el codebase:
no reviertas cambios ajenos y adapta tu trabajo a lo existente.

Responsabilidad: [modulo o archivos concretos].
Objetivo: [resultado verificable].
Restricciones: sigue ARQUITECTURA.md, usa TypeScript estricto y no metas logica de dominio en React.
Entrega: modifica archivos directamente y termina indicando rutas cambiadas y pruebas ejecutadas.
```

Prompt base recomendado para un explorer:

```text
Eres un explorer de Codex. Revisa solo este aspecto: [pregunta concreta].
No modifiques archivos. Devuelve hallazgos priorizados, riesgos y referencias a documentos o codigo.
```

## 8. Primera division de trabajo recomendada

1. Jefe: crear esqueleto Vite + TypeScript, capas y contratos base.
2. Worker Motor: implementar contadores saturantes, outcomes, branch sequence, predictor de un nivel y tests.
3. Worker Persistencia: definir esquemas Zod para sesion, predictor config y repositorios YAML.
4. Worker Plantillas oficiales: convertir ejercicios 1, 2, 3, 4, 5 y 7 de `Documentos externos/Problemas.pdf` a datos versionados.
5. Worker UI: montar layout Material con editores, configurador y tabla vacia conectada a store.
6. Explorer QA: revisar si las dependencias respetan la regla de capas y si las plantillas reproducen las soluciones oficiales.

## 9. Dudas abiertas para confirmar con el usuario

- Confirmar si la prioridad academica es fidelidad a los ejercicios UCM o experiencia visual; mi recomendacion es fidelidad primero.
- Confirmar si quieres que la v1 sea solo navegador local o si mas adelante empaquetamos con Electron/Tauri.
