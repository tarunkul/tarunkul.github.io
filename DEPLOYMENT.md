# Step-by-Step GitHub Pages Deployment

## Recommended setup

Keep the existing company website repository unchanged:

```text
tarunkul07/torotensor-website
```

Create the personal portfolio in the `tarunkul` account:

```text
tarunkul/tarunkul.github.io
```

This keeps the company brand and your individual AI/ML profile independent. The two repositories may remain under different GitHub accounts.

## Why the URL is tarunkul.github.io

GitHub user sites use the exact account name. Because the personal account is `tarunkul`, the repository name and default website address are:

```text
tarunkul.github.io
https://tarunkul.github.io/
```

## A. Create the repository

1. Sign in to the GitHub account `tarunkul`.
2. Go to the GitHub dashboard and click the green **New** button.
3. Enter repository name: `tarunkul.github.io`.
4. Select **Public**.
5. Do not add a README, `.gitignore`, or license because these files are already included.
6. Click **Create repository**.

## B. Upload the website

1. Download and extract the portfolio ZIP.
2. Open the extracted `tarunkul.github.io` folder.
3. In the empty GitHub repository, click **uploading an existing file** or **Add file → Upload files**.
4. Drag all files and folders from inside `tarunkul.github.io` into the upload area.
5. Confirm that `index.html`, `styles.css`, `script.js`, and the `assets` folder are visible at the repository root.
6. Enter commit message: `Launch personal portfolio`.
7. Click **Commit changes**.

Correct structure:

```text
tarunkul.github.io/
├── index.html
├── styles.css
├── script.js
├── assets/
└── README.md
```

Do not create this nested structure:

```text
tarunkul.github.io/tarunkul.github.io/index.html
```

## C. Turn on GitHub Pages

1. Open the repository **Settings**.
2. Select **Pages** in the left sidebar.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Branch: `main`.
5. Folder: `/(root)`.
6. Click **Save**.
7. Wait a few minutes.
8. Refresh the Pages screen until the published URL appears.
9. Open `https://tarunkul.github.io/`.

## D. If the website shows 404

Check these points:

- You are signed in to the `tarunkul` account.
- Repository name is exactly `tarunkul.github.io`.
- `index.html` is at the top level, not inside another folder.
- Pages source is `main` and `/(root)`.
- Repository is public.
- The first deployment may take several minutes.

## E. Update the portfolio later

Use **Add file → Upload files** to replace changed files, or use Terminal:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Pages will publish the update automatically after the new commit.

## F. Keep ToroTensor separate

Do not delete or rename the existing `torotensor-website` repository. Its custom domain and company deployment remain independent. Do not add a ToroTensor `CNAME` file to this personal portfolio repository.
