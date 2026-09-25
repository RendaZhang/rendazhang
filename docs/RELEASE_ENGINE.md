<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Frontend Release Engine (Inactive)](#frontend-release-engine-inactive)
  - [Ownership](#ownership)
  - [Artifact And Resource Contract](#artifact-and-resource-contract)
  - [Transaction And Failure Behavior](#transaction-and-failure-behavior)
  - [Budgets And Evidence](#budgets-and-evidence)
  - [Prepared Workflow Integration](#prepared-workflow-integration)
  - [Recovery Operations After Migration Approval](#recovery-operations-after-migration-approval)
    - [Intentional Previous-Version Rollback](#intentional-previous-version-rollback)
  - [Validation And Remaining Integration](#validation-and-remaining-integration)
  - [Checkpoint B Prerequisites](#checkpoint-b-prerequisites)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Frontend Release Engine (Inactive)

This branch prepares the atomic engine and workflow integration. It is **not active in production**.
Checkpoint A permits feature-branch CI only. Do not merge/push master, dispatch production delivery
or access a production directory before separate Checkpoint B approval. Never rerun a historical
destructive upload workflow after migration: it does not understand retained views or the symlink.

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
- `release_bundle.py` / `release_bootstrap.py`: immutable artifact/helper packaging and installation.
- `release_host.py` / `release_transport.py` / `release_runner.py`: transfer ownership, bounded host
  workers, exact leases and runner transaction ordering.
- `release_engine/origin.py` / `release_acceptance.py` / `tests/acceptance/`: actual HTTP bytes,
  identity/security headers and explicitly external, no-paid-call browser acceptance.
- `release_distribution.py`: publication only for the still-accepted origin.

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

`accept` requires exact identity and successful origin/browser evidence from runner integration.
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

## Prepared Workflow Integration

The candidate workflow serializes master push/manual-master transactions without cancelling active
runs. Sentry configuration is unchanged. Maps are deleted before canonical packaging; preview and
activation use the same archive, never a rebuild. Immutable bundles are retained as
`frontend-release-<run>-<attempt>` for seven days. The lexical deployment parent is derived without
traversing `html/..`; incoming files and content-addressed helpers stay outside the served tree.

There are at most three incoming directories and a 4 MiB/40-entry helper installation cap, all
within the existing allocation envelope. Resolved owned transfers may be removed immediately.
Unreferenced failed inputs and partial helpers require 24 hours plus matching ownership records.
Current/previous, pending, lease and guard helper references are protected. Stale HTTP contracts
expire after those references end. Unknown files are not cleanup authority.

Bootstrap/upload/host operations run as transient 32 MiB workers with hard 20/110/30-second
runtime limits and two-second stop grace, including stopped lock owners. Runner subprocess groups
are also bounded. The 600-second transaction lease is checked again under the mutation lock.
An abandoned prepared generation must be reconciled with its exact original helper/identity before
another deployment starts; its failed outcome is not erased.

Restored pointer and HTTP verification happen outside the lock under one 60-second deadline.
Failed verification remains unresolved. After both that deadline and the lease expire, only the
exact owner may start a fresh bounded verification of the already-restored known pointer. This
cannot re-expose the candidate or extend an active attempt; old receipts cannot finalize it.

HTTP checks bind actual core HTML/resource bytes, not just a marker. They reject duplicate security
headers, wrong MIME/encoding, inexact identity types and false `no-cache` extensions. Absolute
deadlines include slow headers and bodies. External Playwright acceptance has no `webServer` or
build step and makes no paid Chat calls. It covers homepage hydration/theme/mobile navigation,
same-origin Widget readiness, direct Chat, bidirectional Docs diagrams and Credly framing.
Activation through acknowledgement is bounded below 165 seconds, leaving the 180-second guard margin.

Publication only follows origin acceptance. The fixed release branch advances by fast-forward;
the fixed tag is replaced in that namespace, then release assets and CDN purge are required.
Every external write rechecks the lease and accepted origin. Publication has an absolute group
deadline. A failed mirror reports `origin_accepted=true, distribution_complete=false` without
origin rollback. Mirror-only retry verifies and reuses the original master workflow artifact,
does not build/upload/prepare/activate origin, and cannot overwrite a newer distribution.

The exact retry command, **only after migration approval**, is:

```bash
gh workflow run deploy.yml --ref master -f mirror_run_id=<original-run-id> -f mirror_attempt=<original-attempt>
```

Missing/expired immutable artifacts fail closed; do not rebuild different bytes under an old ID.

## Recovery Operations After Migration Approval

These are operator templates, not Checkpoint A permission. Use the reviewed runner checkout,
the original immutable bundle and private runner key/known-host files. Keep shell tracing off;
never print the returned lease, its token, or private connection variables. Do not install a
new helper merely to inspect an old transaction. Its original digest must still be installed.

With `RELEASE_BUNDLE` pointing to that verified bundle and the same private `DEPLOY_*` environment
used by the workflow, inspect only redacted generation state from the runner:

```bash
PYTHONPATH=scripts python3 -B - <<'PY'
import json, os
from pathlib import Path
from release_engine.protocol import load_json
from release_transport import HostClient

bundle = Path(os.environ['RELEASE_BUNDLE'])
client = HostClient(os.environ['DEPLOY_HOST'], os.environ['DEPLOY_USER'],
                    os.environ['DEPLOY_KEY_FILE'], os.environ['DEPLOY_KNOWN_HOSTS_FILE'],
                    os.environ['DEPLOY_PATH'], load_json(bundle / 'helpers.json'))
snapshot = client.call('status')
state = snapshot['state']
print(json.dumps({key: state[key] for key in ('serving', 'accepted', 'previous', 'last')}))
print(json.dumps({'pending_id': (state['pending'] or {}).get('id'),
                  'lease_expired': bool(snapshot['lease'] and
                    snapshot['lease']['expires'] < snapshot['server_time'])}))
PY
```

Compare pending ID, original source/run/attempt/build identity, and helper digest with the failed
run's bundle before allowing recovery. For a lost connection, obtain a fresh snapshot with the
same template. If the lease is unexpired, postpone; do not clear it or start a conflicting run.
For an expired exact pending generation, replace only the two redacted print statements above
with the following reconciliation body. It passes the original lease in memory and selects its
immutable helper; it does not rebuild, upload, activate or publish:

```python
from release_engine.protocol import ReleaseError, require
from release_runner import reconcile
identity = load_json(bundle / 'identity.json')
lease = snapshot['lease']
require(lease is not None and lease['id'] == identity['build_id'] and
        lease['helper'] == client.helper, 'stop: original transaction mismatch')
try:
    reconcile(client, snapshot)
except ReleaseError:
    print('Recovery attempt ended; inspect redacted state before further action.')
    raise SystemExit(2)
```

Exit 2 remains expected for the original failed deployment, including a successfully restored
origin. It is not enough by itself: inspect fresh state for no pending transaction, the known
restored serving identity, `last.outcome=failed` and `last.origin_verified=true`. Unconfirmed
HTTP or guard collection remains a failure. Reconciliation includes actual restored HTTP checks;
afterward run the bounded browser check below against the retained original artifact, without
publishing or changing the journal. A pre-migration bootstrap has no runner bundle: stop for a
reviewed original-inventory check rather than inventing an identity/artifact.

### Intentional Previous-Version Rollback

This differs from recovery of a failed pending deployment. Require separate operator approval,
no running/queued deployment, no pending transaction or lease, a verified pinned installed helper,
and the exact retained `previous` target from fresh status. The existing low-level command below
is executed only in the authorized host session with all placeholders replaced after review:

```bash
/usr/bin/python3 -B <release-parent>/.release-state/tools/<verified-helper-digest>/release.py recover --root <release-parent> --generation <accepted-build-id> --target <retained-previous-view>
```

The command uses the bounded worker/independent guard and preserves later exposed hashed assets.
It records a failed/recovered outcome (exit 2), **not** a new successful deployment. This raw CLI
rollback proves filesystem/journal recovery only; it does not create the integration HTTP contract
or claim browser verification. Inspect the resulting pointer/identity and guard collection, then
on the runner verify the restored origin using the exact previous bundle:

```bash
python3 -B scripts/release_acceptance.py --origin <reviewed-https-origin> --bundle <verified-previous-bundle>
```

That command has one 120-second HTTP/browser budget and never builds or changes origin state.
Record its result separately from the failed deployment outcome. Missing previous artifact,
unexpected identity, unresolved guard, or failed HTTP/browser verification is a stop condition,
not permission to delete journals, reset pointers, relax CSP, or deploy unrelated revisions.
Intentional rollback does not silently republish mirrors; distribution reconciliation needs its
own reviewed identity decision.

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
silently mocked. The original 51 engine/systemd cases remain. Integration adds real unprivileged
HTTP permissions, retained-resource recovery, stopped wrapper owners, stale leases, publication
failures and exact retries. Continuous 20 ms disk/inode samples supplement combined RSS; samples
are not mathematical peak proof. Hard caps and fresh admission still apply. The HTTP fixture
represents already-resident Nginx and is excluded from incremental process RSS. Actual SSH/host
overhead still requires approved observation, not a budget increase. Full frontend checks,
coverage, browser smoke and same-artifact preview are mandatory integration gates.

## Checkpoint B Prerequisites

- No production access, master push or dispatch is authorized by this branch documentation.
- The reviewed `SSH_KNOWN_HOSTS` pin is currently missing. Resolve it explicitly before master
  push; never silently keyscan/trust a replacement or change SSH/firewall policy.
- Confirm no historical destructive deploy or overlapping Nginx/Certbot operation is active.
- Approved bounded preflight must verify lexical parent, modes, OS Python/systemd, old inventory,
  capacity, CSP and disposable same-filesystem exchange capability outside the served tree.
  Unsupported capability or incompatible unversioned resources is No-Go.
- No target Node/browser install, backend/Nginx service action or permanent timer is included.
  The 2026-09-25 locked-install audits report 8 production findings (1 critical, 5 high,
  2 moderate) and 16 full findings (1 critical, 6 high, 8 moderate, 1 low). These remain a
  prioritized, separately scoped dependency follow-up. Reviewed exposure is build/config/dev
  tooling: no current public-runtime trigger was found, not a claim that the packages are safe
  or patched. Do not process untrusted image/config inputs or expose development servers.
  No package change or claim of a clean audit is made here.
- Only after review may normal master integration trigger migration. Confirm identity, HTTP,
  browsers, guard collection, retained assets and actual resource headroom; then update this
  prepared/not-active status with independently verified production evidence.
