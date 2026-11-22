"""Universal FastAPI Feedback & Visual Annotations Router.

Persists visual annotations from the in-app/in-IDE annotator overlay to a local JSON file
and optionally formats/appends them directly into project documentation (e.g. docs/UserInput.md)
for autonomous implementation by AI coding agents.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

# Target storage directories (defaults to project root docs/ or .annotations/)
BASE_DIR = Path.cwd()
DOCS_DIR = BASE_DIR / "docs"
ANNOTATIONS_FILE = DOCS_DIR / "visual_annotations.json"
USER_INPUT_FILE = DOCS_DIR / "UserInput.md"


class VisualAnnotation(BaseModel):
    id: str
    target_selector: str
    target_tag: str
    target_text: Optional[str] = None
    target_component: Optional[str] = None
    dom_hierarchy: Optional[str] = None
    context_title: Optional[str] = None
    category: str = "UI / Style"  # "UI / Style" | "Bug" | "Feature" | "Content"
    comment: str
    page_url: str = ""
    x: float
    y: float
    screen_width: int
    screen_height: int
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


def _read_annotations() -> List[dict]:
    if not ANNOTATIONS_FILE.exists():
        return []
    try:
        with open(ANNOTATIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _save_annotations(items: List[dict]):
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    with open(ANNOTATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)


@router.get("/annotations", response_model=List[VisualAnnotation])
async def get_annotations():
    """Retrieve all stored visual annotations."""
    return _read_annotations()


@router.post("/annotations", response_model=List[VisualAnnotation])
async def save_annotations(
    annotations: List[VisualAnnotation],
    append_to_user_input: bool = False,
):
    """Save or update visual annotations list."""
    items = [ann.model_dump() for ann in annotations]
    _save_annotations(items)

    if append_to_user_input and items:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        append_lines = [f"\n\n## Visual UI Annotations ({now_str})\n\n"]
        for idx, item in enumerate(items, 1):
            comp = item.get("target_component") or item.get("target_tag") or "Element"
            append_lines.append(
                f"### Annotation #{idx}: [{item['category']}] {comp}\n"
                f"- **Selector**: `{item['target_selector']}`\n"
            )
            if item.get("dom_hierarchy"):
                append_lines.append(f"- **DOM Hierarchy**: `{item['dom_hierarchy']}`\n")
            if item.get("context_title"):
                append_lines.append(f"- **Context Container**: \"{item['context_title']}\"\n")
            if item.get("target_text"):
                append_lines.append(f"- **Target Text**: {item['target_text']}\n")
            append_lines.append(
                f"- **Coordinates**: x={item['x']}, y={item['y']} (Screen: {item.get('screen_width', 0)}x{item.get('screen_height', 0)})\n"
                f"- **Page**: `{item.get('page_url', '/')}`\n"
                f"- **Requested Change**: {item['comment']}\n\n"
            )
        try:
            with open(USER_INPUT_FILE, "a", encoding="utf-8") as f:
                f.writelines(append_lines)
        except Exception as e:
            print(f"Failed to append to {USER_INPUT_FILE}: {e}")

    return items


@router.delete("/annotations/{annotation_id}")
async def delete_annotation(annotation_id: str):
    """Delete a single annotation by ID."""
    items = _read_annotations()
    new_items = [item for item in items if item.get("id") != annotation_id]
    if len(new_items) == len(items):
        raise HTTPException(status_code=404, detail="Annotation not found")
    _save_annotations(new_items)
    return {"message": "Annotation deleted successfully", "id": annotation_id}


@router.delete("/annotations")
async def clear_all_annotations():
    """Clear all annotations."""
    _save_annotations([])
    return {"message": "All annotations cleared"}
