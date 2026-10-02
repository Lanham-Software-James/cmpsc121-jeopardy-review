# CMPSC 121 Exam Review

An Angular application for classroom exam reviews. Midterm 1 is the first exam, with the original 30 C++ practice clues organized into six categories. Its design takes inspiration from the [CSSE Open House](https://csse-open-house.jameslanham.net/) and the [Penn State brand palette](https://brand.psu.edu/design-toolkit/design-essentials): Nittany Navy, Beaver Blue, White Out, and Pugh Blue, with locally bundled Roboto.

## Run locally

Requires Node.js 24.15+ (24.x), 22.22.3+ (22.x), or 26+, and npm.

```sh
npm ci
npm start
```

Open http://localhost:4200. The initial route is `/#/reviews/midterm-1`.

```sh
npm test       # Game rules and question-bank checks
npm run build # Production build with strict Angular template/type checks
```

Serve `dist/exam-review/browser/` with any static web server. Hash routing supports direct exam links and refreshes without a server fallback rule. If deploying under a subdirectory, build with `npm run build -- --base-href /your-subdirectory/`. Unlike the original page, the compiled app should be served over HTTP, not opened as a file.

## GitHub Actions and Pages

The Tests workflow runs `npm test` for opened, updated, and reopened pull requests and every push to `main` (including merged pull requests). After tests pass on `main`, it calls the separate Deploy to GitHub Pages workflow to build and publish that same commit. Failed tests prevent deployment; pull requests never deploy.

In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. The build uses the Pages base path automatically, supporting both repository subdirectories and custom domains.

## How to play

Rename the four starting teams; add up to six. Select a clue and the responding team. Correct answers add points and complete the clue; incorrect answers subtract points and leave it open for another attempt. Reveal answers to discuss explanations. Finish an unanswered clue without awarding points, or close it to keep it available.

The 30-second timer starts automatically. It can be paused or restarted after expiry and never automatically scores a response. Undo reverses the last score and reopens a clue if that score completed it. New game resets scores and clues while retaining names. The highest score wins and tied teams share the win. Progress stays in memory and resets when the page is refreshed or closed.

## Project structure

- `src/app/app.routes.ts`: lazy-loaded exam routes.
- `src/app/exams/midterm-one/`: exam-specific component and typed question bank.
- `src/app/core/exam.model.ts`: shared exam, category, clue, and team interfaces.
- `src/app/core/game-state.ts`: framework-independent rules and score history.
- `src/app/shared/game/`: reusable review page and game coordination.
- `src/app/shared/board/`, `scoreboard/`, `clue-dialog/`: standalone UI components.
- `src/styles.css`: brand palette, responsive layout, dialog and shared UI styles.
- `midterm-1/`: preserved original static version, not used in the Angular build.

## Add another exam

1. Create a directory under `src/app/exams/` with a typed question bank and a standalone exam component. Use `MidtermOneComponent` as the example.
2. Supply an `ExamReview` object to `<app-game [exam]="exam" />`. Each game receives independent state. Clue point values are derived from their row: 100, 200, and so on. The board and progress adapt to category/clue counts.
3. Add a lazy `loadComponent` route to `app.routes.ts` and a navigation link in `app.component.ts`. Use `RouterLinkActive`/`ariaCurrentWhenActive` for the new link, as on the existing exam link.

For a review that needs a different activity, create its own standalone component under the exam directory and compose it in that exam's page; the application shell and routing can stay the same.

Edit questions in `src/app/exams/midterm-one/midterm-one.questions.ts`: `q` is the prompt, `code` is optional C++, `a` is the answer, and `why` is the explanation. Clues are original practice questions, not reproduced exam questions. Snippets assume appropriate headers, `using namespace std;`, and default stream formatting unless stated otherwise.
