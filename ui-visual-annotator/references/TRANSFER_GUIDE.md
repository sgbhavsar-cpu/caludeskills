# UI Visual Annotator: Multi-Agent & Multi-PC Transfer Guide
## Antigravity • Claude Code • Gemini CLI • Cursor

This guide explains how to install and use the **`ui-visual-annotator`** skill with **Claude Code** and **Antigravity** across Windows, macOS, and Linux.

---

## 1. Skill Directory Compatibility Matrix

Both Antigravity and Claude Code adhere to the open **Agent Skills specification** (`<skill-name>/SKILL.md` with YAML frontmatter):

| Agent Platform | Scope | Operating System | Skill Installation Path |
| :--- | :--- | :--- | :--- |
| **Claude Code** | **Global (All Workspaces)** | **Windows** | `C:\Users\<username>\.claude\skills\ui-visual-annotator\` |
| **Claude Code** | **Global (All Workspaces)** | **macOS / Linux** | `~/.claude/skills/ui-visual-annotator/` |
| **Claude Code** | **Workspace (Repository)** | **Any OS** | `<project-root>/.claude/skills/ui-visual-annotator/` |
| **Antigravity** | **Global (All Workspaces)** | **Windows** | `C:\Users\<username>\.gemini\config\skills\ui-visual-annotator\` |
| **Antigravity** | **Global (All Workspaces)** | **macOS / Linux** | `~/.gemini/config/skills/ui-visual-annotator/` |
| **Antigravity** | **Workspace (Repository)** | **Any OS** | `<project-root>/.gemini/skills/ui-visual-annotator/` |

---

## 2. Installing for Claude Code

### Global Install for Claude Code (Recommended):

#### On Windows (PowerShell):
```powershell
# 1. Create Claude Code skills directory if not present
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills" -Force

# 2. Extract ui-visual-annotator into Claude Code skills
Expand-Archive -Path "C:\path\to\ui-visual-annotator.zip" -DestinationPath "$env:USERPROFILE\.claude\skills" -Force
```

#### On macOS / Linux (Terminal):
```bash
# 1. Create Claude Code skills directory
mkdir -p ~/.claude/skills

# 2. Extract into ~/.claude/skills/
unzip /path/to/ui-visual-annotator.zip -d ~/.claude/skills/
```

### Workspace / Project-Specific Install for Claude Code:
If you want the skill committed to your Git repository:
```bash
mkdir -p .claude/skills
# Extract or copy ui-visual-annotator into .claude/skills/ui-visual-annotator
```

---

## 3. How to Use with Claude Code

### A. Embedding the Overlay into a Project
In your Claude Code terminal session:
> *"Add the visual UI annotator overlay to this project"*

Claude Code reads `SKILL.md` and copies `resources/VisualAnnotator.tsx` (for React/Next.js) or `resources/visual_annotator_vanilla.js` into your application, mounting it in your root layout.

### B. Implementing Visual Changes with Claude Code
1. Open your web app in the browser.
2. Press **`Alt + A`** to toggle annotation mode.
3. Click on any UI element to drop a pin, select category (`UI / Style`, `Bug`, `Feature`, `Content`), and describe what needs to change.
4. Click **"Copy for AI"**.
5. Paste the generated markdown prompt directly into Claude Code:
   ```markdown
   # Requested UI Changes & Visual Annotations

   Please implement the following visual feedback changes into the project code:

   ### Annotation #1: [Feature] ManagerView
   - **Selector**: `h2.text-lg.font-black.text-slate-900`
   - **DOM Hierarchy**: `div.bg-white > div.p-5 > div > div.flex > h2.text-lg`
   - **Context Container**: "Team Rollup Dashboard & Department Oversight"
   - **Target Text**: "Manager Governance Command Center"
   - **Coordinates**: x=426, y=217 (Screen: 1699x794)
   - **Page**: `/manager/dashboard`
   - **Requested Change**: In this table while approving, manager may need to see the tasks and feedback of that week.
   ```
6. **How Claude Code executes it**:
   - Claude Code uses `Target Text` and `Component` (`ManagerView`) to grep and locate the file in seconds.
   - It checks `DOM Hierarchy` to find the exact JSX block.
   - It uses its `Edit` and `Bash` tools to modify the file, re-run builds, and verify.

---

## 4. Optional: Adding Reference to `CLAUDE.md`

You can add this quick reference snippet into your project's `CLAUDE.md` so Claude Code always recognizes the visual annotator pattern:

```markdown
## Visual Annotations & UI Feedback
- When the user pastes prompts starting with `# Requested UI Changes & Visual Annotations`, locate target components using `- **Target Text**` and `- **Component**` as primary anchors, disambiguated by `- **DOM Hierarchy**`.
- The in-app annotator component is located at `src/components/common/VisualAnnotator.tsx` (toggle with `Alt + A`).
```
