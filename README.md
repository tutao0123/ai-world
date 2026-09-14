# AI World

**An interactive map for learning AI. Created by Tao · Guide: Xiaotao.**

Explore concepts through a draggable world map, short explanations, practical examples, and small experiments. No account, backend, or paid AI API is required.

[English demo](https://world.tao55s.com/?lang=en) · [中文演示](https://world.tao55s.com/?lang=zh) · [简体中文说明](README.zh-CN.md)

The live demo includes the English and Chinese content in release **0.3.0**.

## Explore the map

The atlas covers **4 regions, 13 chapters, and all 101 numbered source topics**. Each chapter includes three takeaways and a learning challenge.

| Region | Chapters |
| --- | --- |
| Model Origins | 1 AI systems · 2 Machine learning · 3 Neural networks and Transformer · 4 Model training lifecycle |
| Application Isles | 5 Prompts and context · 6 RAG · 7 Agents and tools · 8 Evaluation and production |
| Systems & Governance | 9 Multimodal AI · 10 Infrastructure and the open-model ecosystem · 11 Safety and governance |
| Builder’s Bay | 12 AI coding · 13 Careers and learning paths |

- Pan and zoom the map, open a landmark, or search with `Ctrl+K` / `⌘K`. Keyboard navigation and touch controls are supported.
- Choose a complete, product, application development, model research, or infrastructure learning route. Chapters and topics have shareable links.
- Try five labs: **Token Village, Embedding Valley, Attention Range, LLM City, and Quantization Mine**.
- Collect chapter and lab stamps in your explorer passport. A stamp records a completed challenge, not mastery of the topic.

Use the language selector to switch between English and Chinese. The choice is saved in the current browser; both languages share the same chapter and lab progress. On a first visit, the interface follows the browser language. An explicit `?lang=en` or `?lang=zh` takes priority.

Use `/?lang=en` to open English directly, `/?lang=en&view=labs` to open the labs, or `/?lang=en#chapter/c06/6.2` to share a specific topic. Switching languages keeps the selected chapter, search or dialog, learning route, and experiment settings.

## Run locally

Use **Node.js 24+** and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open [localhost:5178](http://127.0.0.1:5178/), or [the English interface](http://127.0.0.1:5178/?lang=en). The development server listens on localhost only.

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Tests cover the teaching calculations, curriculum contracts, translations, and browser exploration flows. The build runs TypeScript checks and creates the static site in `dist/`. Browser tests use Chromium. Use `npm run preview` to preview the build locally; stop the development server first if it occupies the same port.

## Teaching boundaries and sources

The curriculum adapts **AI Entry Knowledge Map v1.0.4** into summaries, examples, and quizzes. It preserves chapter and topic coverage without reproducing the full original document or claiming fresh verification of every external fact. See [source mapping and provenance](docs/source-mapping.md). Complete source archives remain local; the repository uses a provenance manifest for coverage checks.

Map geography is a learning metaphor. Token splitting, two-dimensional embeddings, attention links, and continuation choices are manually authored teaching illustrations, not outputs from a live model.

The quantization lab estimates memory for a rounded 70B model with Llama 3.1 70B-style GQA, FP16 KV cache, batch size 1, and an assumed 3 GiB reserve. It does not model all quantization metadata or actual memory peaks. Fitting the teaching budget is neither a hardware benchmark nor a deployment guarantee. See [formulas and assumptions](docs/learning-model.md).

## Code map

| Files | Purpose |
| --- | --- |
| `src/atlas.ts`, `src/atlas-map.ts`, `src/atlas.css` | Atlas, chapter reader, search, routes, passport, and map rendering |
| `src/curriculum*.ts` | Chapter content, English translations, shared IDs, and content contracts |
| `src/i18n.ts`, `src/ui-en.ts` | Locale selection and interface copy |
| `src/main.ts`, `src/world-map.ts`, `src/learning.ts` | Five labs, lab map, and memory calculations |
| `src/source-index.ts` | Generated source heading and terminology index; do not edit by hand |
| `tests/`, `src/*.test.ts` | Browser flows and deterministic checks |

## Rights

No open-source license has been granted. Source code and learning content remain subject to their existing rights; availability of the source does not grant unrestricted reuse. Xiaotao’s character asset has separate usage rights. See [asset provenance](docs/assets.md).
