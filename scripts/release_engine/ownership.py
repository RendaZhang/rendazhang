"""Integration lease checks, called again while holding the engine mutation lock."""

from .protocol import load_json, require


def check_lease(private, ownership, generation, action, now):
    path = private / "lease.json"
    if not path.exists():
        require(ownership is None, "release lease missing")
        return None
    lease = load_json(path)
    require(ownership is not None, "release lease ownership required")
    require(
        lease["id"] == generation
        and lease["token"] == ownership["token"]
        and lease["helper"] == ownership["helper"],
        "stale release lease",
    )
    require(
        lease["expires"] > now or action in ("reconcile", "finish"),
        "release lease expired",
    )
    require(
        lease["mode"] == "deploy" or action in ("cleanup", "finish", "publish"),
        "mirror retry cannot mutate origin",
    )
    return lease
