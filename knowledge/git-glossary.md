# Git Glossary — common terms, in plain English

A personal reference for the git/GitHub vocabulary used to maintain this knowledge base.
Mental model first: **GitHub is the shared library; your local repo is your personal desk.**
You do the real work (edit, run, test, revise) at your desk, then return finished copies to the library.

---

## The core objects

### Repository (repo)
The whole project plus its **entire history** of changes. A *local* repo lives on your machine
(in the hidden `.git/` folder); a *remote* repo lives on a server like GitHub. Each is a full,
self-contained copy — git is **distributed**, so there's no single "real" copy, just one you all
agree to treat as the shared meeting point (see **origin**).

### Working tree (working directory)
The actual files you see and edit on disk *right now* — the current checked-out snapshot.
Edits here are "unsaved" to git until you stage and commit them.

### Commit
A **saved snapshot** of your project at a point in time, with a message describing what changed.
Each commit has a unique ID (a hash like `a1d36e4`) and points back to its parent, forming a chain —
that chain *is* your history. Think of it as a labeled save point you can always return to.

### Staging area (the "index")
A holding zone *between* your edits and a commit. You `git add` the specific changes you want, then
`git commit` packages exactly those into a snapshot. It lets you commit a clean, logical subset of
your edits rather than everything at once.

### Branch
A movable pointer to a line of development — a parallel timeline. `main` is the default branch.
You make a new branch to work on something **without disturbing `main`**, then merge it back when ready.
Cheap and disposable: branch freely, throw branches away.

### HEAD
A pointer to "where you are right now" — usually the tip of your current branch. When `git status`
says you're on `main`, HEAD points at the latest commit of `main`.

### Tag
A fixed, named label pinned to a specific commit — typically for releases (e.g. `v1.0`). Unlike a
branch, a tag doesn't move.

---

## Moving work around

### Remote
A named link to a repo hosted elsewhere (e.g. on GitHub). **origin** is the conventional name for
your main remote — "origin" just means "the place I cloned from / push to."

### Clone
Make a complete local copy of a remote repo — full history included — onto your machine. You do this
once, at the start.

### Fetch
**Download** the remote's latest commits into your local repo *without* changing your working files.
It updates your knowledge of what GitHub has. Safe and non-destructive — run it before checking sync.

### Pull
`fetch` **+ merge** in one step: download the remote's new commits *and* integrate them into your
current branch. Run this to catch up local work with what's on GitHub.

### Push
**Upload** your local commits to the remote so GitHub (and everyone else) gets them. The opposite of
pull. Until you push, your commits live only on your machine.

### Tracking / upstream
The link between your local branch and its remote counterpart (e.g. local `main` ⇄ `origin/main`).
This is what lets `git status` say "up to date" or "ahead 2 / behind 1."

### Ahead / behind
- **Ahead N** — you have N commits locally that GitHub doesn't have yet → `git push`.
- **Behind N** — GitHub has N commits you don't have yet → `git pull`.
- **0 / 0 + clean tree** — fully in sync.

---

## Combining work

### Merge
Combine the history of one branch into another, creating a **merge commit** that ties the two timelines
together. Preserves the full branching history.

### Pull Request (PR)
A **GitHub** feature (not core git): a proposal to merge one branch into another, with a discussion
thread, diff view, review, and checks. It's how a change gets reviewed and accepted into `main`.
Your repo's history (#28–#31) shows every change landing this way. Flow: branch → commit → push →
**open PR** → review → **merge PR** → `git pull` locally to pick up the merge.

### Rebase
An alternative to merge: **replay** your commits on top of another branch's latest, producing a
straight, linear history (no merge commit). Powerful but rewrites commit IDs — avoid on shared branches.

### Conflict (merge conflict)
When two changes touch the same lines and git can't auto-decide which wins. Git marks the spot and
asks **you** to resolve it by hand, then commit the resolution.

### Diff
The line-by-line difference between two states (your edits vs. last commit, or one branch vs. another).
What a PR shows you for review.

---

## Worktree (what you asked about)

### Worktree
Normally one repo = one working directory. A **worktree** lets you check out **multiple branches at
once**, each in its own separate folder, all backed by the *same* `.git` history. So you can have
`main` in one folder and a feature branch in another simultaneously — no stashing, no switching back
and forth, no clobbering uncommitted work.

**Why it's useful:** work on two things in parallel, or let an automated agent edit a branch in an
isolated folder while your main checkout stays untouched. When the worktree's job is done, you remove
it; if nothing changed, it's cleaned up automatically.

> In *this* session, the harness was configured to work **in place** (directly in your main working
> directory) rather than spinning up a throwaway worktree — which is why these glossary edits land
> right in `ai_knowledgecenter/` and not in a separate isolated folder.

---

## Undoing & inspecting

### Status
`git status` — your dashboard: which branch you're on, what's staged/unstaged, and whether you're
ahead/behind the remote. (Run `git fetch` first so it compares against GitHub's *latest*.)

### Log
`git log` — the history of commits, newest first.

### Stash
Temporarily shelve uncommitted edits to get a clean working tree (e.g. to switch branches), then
reapply them later with `git stash pop`.

### Revert
Create a **new** commit that undoes a previous commit — safe, because it doesn't erase history.

### Reset
Move your branch pointer backward, optionally discarding commits or staged changes. More forceful
than revert; `--hard` throws away work, so use with care.

### Checkout / switch
Move HEAD to a different branch or commit (update your working tree to match it). `git switch` is the
newer, friendlier verb for changing branches; `git checkout` also restores files.

### .gitignore
A file listing paths git should **ignore** (build output, secrets, temp files) so they never get
committed.

---

## The everyday rhythm

```bash
git pull                       # 1. start: grab GitHub's latest
# ...edit, run, test...
git add -A                     # 2. stage your changes
git commit -m "docs: ..."      # 3. snapshot them with a message
git push                       # 4. upload to GitHub
# open a PR → review → merge → git pull to sync local main
```

That loop — pull, edit/test locally, commit, push, PR — is the entire workflow. "Syncing" is just
steps 1 and 4: returning finished work to the shared library and picking up what others added.
