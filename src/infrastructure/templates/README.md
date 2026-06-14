# Official Templates

This directory contains versioned templates derived from `ref_docs/Problems.pdf`.

Current status:

- Exercise 1: verified against the canonical engine.
- Exercises 2, 3, 4, 5, and 7: present as working data and marked as `draft`.
- Exercise 6: outside v1 because it requires Tournament.

Each template must declare:

- `id`, `exerciseNumber`, `title`, `statement`, and PDF reference.
- `branchSequence` with the canonical branch sequence.
- One or more `variants` with `predictorConfig`, initial state, official solution summary, and expected statistics.
- `verificationStatus`, to distinguish verified templates from drafts.

Templates must not treat hand-written calculated solutions as the source of truth. They must be validated by running the same domain engine used by the application.
