# Assignment #5: JavaScript Basics (DOM Manipulation & Events)

**Student:** Ramazanov Maxsutkhan  
**Group:** IT-2506  
**GitHub Profile:** [https://github.com/poroshok13](https://github.com/poroshok13)

---

## Chosen Options
- **Task 1:** Option A (Higher or Lower)
- **Task 2:** Option A (Kanban Board)
- **Task 3:** Option A (Ticket Builder)

---

## Task 1: Higher or Lower (Option A)
- **Logic:** Compares current random number with next random number (1–100).
- **Lives & Streak:** 3 lives, current streak, best streak record.
- **Criteria:**
  - Constants at top: `MIN_VAL`, `MAX_VAL`, `INITIAL_LIVES`.
  - Condition with `&&`, `||`, `===`: `(nextNumber === currentNumber) || (guess === 'higher' && nextNumber > currentNumber) || (guess === 'lower' && nextNumber < currentNumber)`.
  - Invalid moves blocked without modifying game state when game is over.
  - Restart resets variables without window reload.

---

## Task 2: Kanban Board (Option A)
- **Data:** Array of 10 objects with properties: `id` (number), `title` (string), `priority` (number), `isUrgent` (boolean), `tag` (string), `status` (string).
- **Criteria:**
  - HTML has empty containers (`#cards-todo`, `#cards-in-progress`, `#cards-done`).
  - Single `render()` function updates UI after every change.
  - Progress calculated with own `for...of` loop.
  - Action blocked by rule: "In Progress" column holds at most 3 cards.
  - Event delegation: one click listener on `#board`.
  - No `innerHTML` for data (`createElement`, `textContent`).

---

## Task 3: Ticket Builder (Option A)

### Validation Rules Table

| Field | Rule Description | Valid Example | Invalid Example |
| :--- | :--- | :--- | :--- |
| `name` | At least two words (first and last name) with letters only, min 2 chars per word. | `"Maxsutkhan Ramazanov"` | `"Max"`, `"Max123"` |
| `email` | Must match valid email regex pattern. | `"student@astanait.edu.kz"` | `"plaintext"`, `"user@"` |
| `event` | Must select an event from dropdown. | `"AITU Hackathon"` | `""` (unselected) |
| `date` | Must be tomorrow or later, and not in sold-out dates (`2026-11-15`, `2026-12-01`). | `"2026-11-20"` | `"2026-11-15"` (sold-out), yesterday |
| `type` | Must select an available ticket tier. | `"vip"` | `""` (unselected) |
| `quantity` | Integer between 1 and 20, cannot exceed seats left (Standard: 10, VIP: 3, Student: 5). | `2` (for VIP) | `5` (exceeds VIP limit of 3) |

### Features:
- Live preview updates on every input.
- Fields validated on `blur`, then on every `input`.
- On submit: counts errors, focuses first invalid field.
- On success: builds ticket card via DOM, resets form.
- `form.noValidate = true` suppressing browser bubbles.
