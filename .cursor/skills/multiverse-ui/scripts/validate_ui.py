#!/usr/bin/env python3

import argparse
import hashlib
import json
import re
import struct
import sys
from pathlib import Path


REQUIRED_FILES = (
    "index.html",
    "styles.css",
    "public/fonts/ibm-plex-sans-latin-variable.woff2",
    "public/fonts/ibm-plex-mono-latin-variable.woff2",
    "public/fonts/IBM-Plex-OFL.txt",
    ".cursor/skills/multiverse-ui/SKILL.md",
    ".cursor/skills/multiverse-ui/anti-generated-ui.md",
    ".cursor/skills/multiverse-ui/language-and-copy.md",
    ".cursor/skills/multiverse-ui/tokens.md",
    ".cursor/skills/multiverse-ui/research-and-technical.md",
    ".cursor/skills/multiverse-ui/quality-checklist.md",
)

CANONICAL_SCREENSHOTS = {
    ".cursor/skills/multiverse-ui/reference-media/14-canonical-phone-390.png": 390,
    ".cursor/skills/multiverse-ui/reference-media/15-canonical-laptop-1024.png": 1024,
    ".cursor/skills/multiverse-ui/reference-media/16-canonical-desktop-1440.png": 1440,
}

STALE_PATTERNS = {
    "Manrope": "stale Manrope typography reference",
    "Peer Reviewed": "unsupported peer-review claim",
    "arXiv:": "unsupported paper identifier",
    "research-paper-card": "retired research dashboard component",
    "metric-pill": "retired metric-card pattern",
    "evidence-grid": "retired evidence-card stack",
    "status-dot": "forbidden circular status-dot indicator",
    "pulse-dot": "forbidden pulsing status-dot indicator",
    "#22c55e": "forbidden green status-dot color",
    "#d6ffbf": "forbidden green status-dot color",
}

LIVE_UI_PATTERNS = {
    "icon-spark": "generic sparkle icon used as AI shorthand",
    "placeMediaMarks": "randomized media decoration script",
    "data-mark=": "randomized geometric media marks",
    "--media-dot": "decorative media-dot token",
    "All Systems Ready": "generic readiness label",
    "Interface guide": "stale design-system-facing action copy",
    "System notes": "self-referential design-system section copy",
    "How this interface works": "self-referential design-system heading",
    "8px base": "design-token demonstration in product UI",
    "A visual system": "self-referential design-system closing copy",
    "Research Paper Edition": "generic showcase metadata",
}


def parse_args() -> argparse.Namespace:
    default_root = Path(__file__).resolve().parents[4]
    parser = argparse.ArgumentParser(description="Validate the Multiverse UI system.")
    parser.add_argument("root", nargs="?", type=Path, default=default_root)
    parser.add_argument("--json", action="store_true", dest="as_json")
    return parser.parse_args()


def png_dimensions(path: Path) -> tuple[int, int]:
    with path.open("rb") as file:
        signature = file.read(24)
    if len(signature) != 24 or signature[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a valid PNG")
    return struct.unpack(">II", signature[16:24])


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for block in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def local_asset_paths(html: str, css: str) -> set[str]:
    paths = set(re.findall(r'(?:src|href)="([^"]+)"', html))
    paths.update(re.findall(r"url\(['\"]?([^'\")]+)", css))
    return {
        value.split("?", 1)[0].split("#", 1)[0]
        for value in paths
        if value and not re.match(r"^(?:https?:|data:|mailto:|tel:|#|var\()", value)
    }


def main() -> int:
    args = parse_args()
    root = args.root.resolve()
    errors: list[str] = []
    checks: list[str] = []

    for relative in REQUIRED_FILES:
        if not (root / relative).is_file():
            errors.append(f"missing required file: {relative}")
    if errors:
        return report(args.as_json, checks, errors)

    html = (root / "index.html").read_text(encoding="utf-8")
    css = (root / "styles.css").read_text(encoding="utf-8")
    skill_root = root / ".cursor/skills/multiverse-ui"
    skill_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in sorted(skill_root.glob("*.md"))
    )
    project_text = "\n".join((html, css, skill_text))

    for pattern, message in STALE_PATTERNS.items():
        if pattern.lower() in project_text.lower():
            errors.append(message)
    checks.append("stale typography and research-pattern audit")

    live_ui_text = "\n".join((html, css))
    for pattern, message in LIVE_UI_PATTERNS.items():
        if pattern.lower() in live_ui_text.lower():
            errors.append(message)
    checks.append("generated-interface trope audit")

    required_css = (
        'font-family: "IBM Plex Sans"',
        'font-family: "IBM Plex Mono"',
        '--font-ui: "IBM Plex Sans"',
        '--font-mono: "IBM Plex Mono"',
        "--muted: #595a54",
        "--radius-control: 14px",
        "--radius-media: 24px 24px 10px 24px",
        ".research-record",
        ".research-tab-switch button[aria-pressed=\"true\"]",
        ".math-term",
    )
    for token in required_css:
        if token not in css:
            errors.append(f"missing CSS rule or token: {token}")
    checks.append("IBM Plex and identity CSS tokens")

    if html.count('class="research-record surface-card"') != 1:
        errors.append("research must contain exactly one outer research record")
    research_start = html.find('class="research-record surface-card"')
    research_end = html.find("</article>", research_start)
    if research_start >= 0 and research_end >= 0:
        research_markup = html[research_start:research_end]
        if research_markup.count("surface-card") != 1:
            errors.append("research record contains nested surface cards")
    else:
        errors.append("research record closing article was not found")
    for name in ("abstract", "grounding", "benchmarks"):
        if f'data-research-tab="{name}"' not in html:
            errors.append(f"missing research tab: {name}")
        if f'data-research-pane="{name}"' not in html:
            errors.append(f"missing research pane: {name}")
    if html.count('class="math-term"') < 3:
        errors.append("technical formula must be split into at least three responsive terms")
    math_card_rule = re.search(r"\.math-card\s*\{([^}]*)\}", css, re.DOTALL)
    if math_card_rule and "overflow-x" in math_card_rule.group(1):
        errors.append("technical formula field must not use horizontal scrolling")
    checks.append("single-record research structure")

    required_guidance = (
        "Research records, evidence language, metrics, and technical typography",
        "Never invent peer-review status",
        "IBM Plex Mono is reserved",
        "mobile height budget",
        "never require horizontal scrolling at 320px",
        "never use circular presence or status dots",
        "sparkles as shorthand for AI",
        "randomized decorative marks",
        "design-system implementation notes",
        "plain language is the default",
        "define unavoidable technical terms",
        "one main idea per sentence",
    )
    for phrase in required_guidance:
        if phrase.lower() not in skill_text.lower():
            errors.append(f"missing skill guidance: {phrase}")
    checks.append("skill guidance coverage")

    for asset in sorted(local_asset_paths(html, css)):
        if not (root / asset).is_file():
            errors.append(f"missing local asset: {asset}")
    checks.append("local HTML and CSS asset paths")

    for relative, expected_width in CANONICAL_SCREENSHOTS.items():
        path = root / relative
        if not path.is_file():
            errors.append(f"missing canonical screenshot: {relative}")
            continue
        try:
            width, height = png_dimensions(path)
        except ValueError as error:
            errors.append(f"invalid canonical screenshot {relative}: {error}")
            continue
        if width != expected_width:
            errors.append(f"canonical screenshot {relative} is {width}px wide, expected {expected_width}px")
        if height < 900:
            errors.append(f"canonical screenshot {relative} is too short to document the page")
    checks.append("canonical responsive screenshots")

    manifest_path = skill_root / "mascot-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    for asset in manifest["assets"]:
        expected_hash = asset["sha256"]
        production = root / manifest["productionRoot"] / asset["production"]
        source = Path(manifest["sourceRoot"]) / asset["source"]
        for label, path in (("production", production), ("source", source)):
            if not path.is_file():
                errors.append(f"missing mascot {label} asset: {path}")
            elif sha256(path) != expected_hash:
                errors.append(f"mascot checksum mismatch: {path}")
    checks.append("approved mascot source and production checksums")

    return report(args.as_json, checks, errors)


def report(as_json: bool, checks: list[str], errors: list[str]) -> int:
    result = {"ok": not errors, "checks": checks, "errors": errors}
    if as_json:
        print(json.dumps(result, indent=2))
    elif errors:
        print("Multiverse UI validation failed:")
        for error in errors:
            print(f"- {error}")
    else:
        print(f"Multiverse UI validation passed ({len(checks)} checks).")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
