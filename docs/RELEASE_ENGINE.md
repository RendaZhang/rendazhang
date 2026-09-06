<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Frontend Release Engine (Inactive)](#frontend-release-engine-inactive)
  - [Ownership](#ownership)
  - [Artifact And Resource Contract](#artifact-and-resource-contract)
  - [Transaction And Failure Behavior](#transaction-and-failure-behavior)
  - [Budgets And Evidence](#budgets-and-evidence)
  - [Validation And Remaining Integration](#validation-and-remaining-integration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Frontend Release Engine (Inactive)

This branch implements a local atomic-release engine and isolated Linux tests. It is **not active
in production**. The existing `deploy.yml` and current delivery instructions are unchanged. Do not
use this helper against a production directory until workflow integration and first-migration
approval are complete.

## Ownership

- `scripts/release_engine/artifact.py`: bounded artifact, manifest, resource and inline-CSP checks.
- `scripts/release_engine/protocol.py`: lightweight shared identity and JSON primitives. The outer
  CLI does not import the full engine/scanner or create state directories; worker validation stays
  authoritative.
- `scripts/release_engine/system.py`: filesystem durability, Linux exchange, capacity and transient
  systemd boundaries.
- `scripts/release_engine/engine.py`: private transaction journal, release views and reconciliation.
- `scripts/release.py`: local CLI. Mutations run in a bounded transient worker; the recovery guard
  is independent of the calling CLI.
- `scripts/release-dependencies.mjs`: runner-only extraction using the existing TypeScript parser.
  The target host does not install Node, npm or additional Python packages for this helper.
- `tests/release/`: disposable fixture tests, including opt-in real systemd cases.

The stdlib code targets Python 3.12 or newer. The isolated Ubuntu 24.04 job uses its OS
`/usr/bin/python3`, not the backend virtual environment. Actual target OS Python and libc/systemd
capabilities still require a separately approved integration preflight.

## Artifact And Resource Contract

`pack` creates one gzip/USTAR archive and a separate JSON envelope. The canonical, sorted compact
JSON payload binds source SHA, run ID, attempt, per-file hashes/modes/sizes and the static JS graph.
Its digest excludes the envelope. The envelope separately binds the complete archive digest and
length. A generated public `release-identity.json` contains only public build identifiers and
digests, is not part of the archive, and creates no self-referential hash. Private journals and
view manifests remain outside the served tree.

Extraction reads bounded headers and chunks, rejecting extension metadata before allocating its
advertised body. It rejects traversal, duplicate members, links, special files, missing/modified
files, unsafe modes, sourcemaps and reserved identity paths. Required routes, HTML resource and
Astro hydration attributes, CSS URLs, and executable inline hashes are checked before activation.
HTML/CSS inspection is capped at 4 MiB per file.

The runner AST graph covers imports/exports, literal dynamic imports, Vite preload maps and literal
`new URL` assets/Workers based on `import.meta.url`, including literal nested bases. A URL used only
as another constructor's resolution base is not a fetch. Runtime CSS templates are not parsed as
static CSS. Computed imports/URLs, runtime-generated markup, remote resources and browser execution
are **not** exhaustively proven by this graph; real browser/network acceptance remains mandatory
at integration. Dependency validation must not be described as a complete browser substitute.

All `_astro/` resources, plus recognized hash-named assets elsewhere (including PDFs), retain their
original paths. Candidate and rollback views include the promised hash union. Same-path/different-
byte collisions and changed, added or removed unversioned resources are refused. Stable-resource
incompatibility is a separate prerequisite, not permission to rewrite application code.

## Transaction And Failure Behavior

The CLI boundaries are `prepare`, `activate`, `accept`, `recover`, `status` and `cleanup`; `pack`
runs on the build runner. Internal `worker` and `guard` entry points belong to transient systemd
orchestration, not workflow call sites. There are no capacity/time bypass CLI flags.

Preparation verifies and copies an initial real directory into an immutable bootstrap. The first
activation journals/fsyncs ownership and uses actual same-filesystem Linux `RENAME_EXCHANGE` to
replace the nonempty serving directory with an equivalent symlink without a missing-root window.
The displaced directory remains until after first acceptance. Later switches atomically replace
the symlink. `.well-known` bytes and readable modes are preserved.

Explicit previous-accepted and fresh-master inputs, increasing run/attempt generations, a shared
bounded lock and exact-run identity prevent stale or concurrent activation. The later workflow
must obtain the actual fresh master SHA; the helper does not contact GitHub. Reconciliation uses
the actual pointer plus durable manifests/journal, never a successful log line alone. A recovered
deployment remains a failed outcome (exit 2); it does not become a successful deployment simply
because the old version serves again. Repeated acceptance is idempotent, but late acknowledgements
cannot accept recovered or newer runs. Explicit rollback requires the retained previous target
and constructs a view retaining resources exposed by later failed runs too.

A successful new `prepare` or `activate` returns zero even when `last` still records an older
recovered failure. That historical outcome remains intact; recovery and status still report the
failed deployment rather than rewriting it as a success.

Explicit rollback staging has a durable ownership intent, so an interrupted copy can be rebuilt
without deleting an unowned path. Once its pending journal exists, a fresh transient guard must
report ready before the recovery journal/pointer switch. Its worker has 30 seconds to finish;
guard reconciliation shares a total 60-second deadline from explicit preparation. Death during
preparation before guard readiness leaves the accepted pointer unchanged and requires a retry;
death after the recovery journal is independently recoverable.

A delayed retry may refresh a pre-arm explicit transaction only while its accepted candidate is
still serving and its journal is still `explicit_prepared`. Once armed/switching, deadlines are
not renewed. Readiness binds a unique transaction token, deadlines and a unique CLI worker key,
not merely a reused accepted build ID. Stale guards cannot terminate a later retry's worker or
accept/recover a different receipt.

Before a pointer switch, an independent transient guard must report readiness. Acceptance is due
within 180 seconds; recovery shares the lock with a total 60-second budget, including contention.
The worker is hard-bounded to 30 seconds, each lock wait to 15 seconds, and the guard unit to
245 seconds. The guard can terminate only its exact generation's worker, not unrelated services.
No browser/network wait occurs while holding the release lock. No permanent daemon/timer is added.

`accept` requires exact identity and successful origin/browser evidence from future integration.
It does not publish mirrors or purge a CDN. Those later operations cannot implicitly roll back an
already accepted origin. Cleanup preserves current/previous/pending state and retained assets;
superseded full HTML views may expire separately from their seven-day asset promise. Unreferenced
failed staging must be at least 24 hours old. Cleanup failures stay visible.

## Budgets And Evidence

| Boundary | Limit |
| --- | --- |
| Archive / base / base files | 16 MiB / 32 MiB / 2,000 |
| Retained asset union | 128 MiB / 5,000 assets |
| Retired manifests | At most 20; seven days plus pinned dependencies |
| Total allocation envelope | 832 MiB, including reserved archive/workspace overhead |
| Remaining disk / inodes | 5 GiB / 100,000 after a 30,000-inode envelope |
| Admission MemAvailable | At least 224 MiB = 96 MiB process budget + 128 MiB physical reserve |
| Temporary processes | Combined sampled RSS must remain below 96 MiB |
| Per-service hard memory cap | Worker 32 MiB; guard 32 MiB |

The initial 64 MiB combined estimate failed in three isolated Linux runs. It covered the two
service caps without allowance for the outer CLI, systemd clients or process variation. The
reviewed 96 MiB budget adds 32 MiB for that overhead; admission increases from 192 to 224 MiB to
preserve the same 128 MiB physical reserve. The prior failures remain failures, not retroactive
passes. Any further excess requires review, not an automatic budget increase.

These are design/admission limits, not measurements of production peaks. The two `MemoryMax`
limits alone do not enforce a hard aggregate bound on the outer CLI and systemd clients. Linux
tests sample the combined matching CLI/worker/guard/client RSS every 20 ms and fail on monitor
errors, missing observations or exceeded budget. They report per-phase samples for real CLI
prepare/activate/accept/recover/cleanup using a 166-file, roughly 7.2 MiB synthetic public payload
(larger than the audited current site's logical bytes). Samples can miss short spikes; deployment
resource acceptance and any stricter aggregate enforcement remain explicit integration gates.
Integration must also bound concurrent callers and account for upload/SSH wrappers and kernel/cache
overhead. Passing fixture samples does not replace fresh admission immediately before allocation
and activation or establish a hard aggregate cgroup limit.

## Validation And Remaining Integration

`release-engine-validation.yml` is validation-only, on the scoped feature branch and relevant PRs,
with read-only repository permissions and no production secrets, SSH or deployment. It runs
portable artifact tests, actual Linux exchange/crash tests, and required real systemd tests.
Parent death and stopped lock-owner cases use the real 180-second deadline; one adds a competing
bounded maintenance lock. An unconditional step removes only suite-owned fixture units/files.

Local focused commands (with the project Node bin first on PATH for the runner AST parser):

```bash
python3 -B -m unittest discover -s tests/release -p 'test_artifact.py' -v
python3 -B -m unittest discover -s tests/release -p 'test_engine.py' -v
```

Linux-only skips on macOS are not passing Linux evidence. Real systemd tests require the isolated
job and `RELEASE_SYSTEMD_TESTS=1`; missing runner capabilities fail that gate rather than being
silently mocked. Existing application coverage/browser/build gates may be deferred for this
engine-only branch, but must run during integration alongside source/CSP/identity binding,
same-filesystem migration capability, runner acceptance, old-tab resource use, actual HTTP
permissions, Certbot compatibility, publication ordering and production resource observation.
