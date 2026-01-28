# Push to GitHub

## 1. Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** e.g. `legacyapp` or `legacyapp-main`.
3. **Public**, and **do not** add a README, .gitignore, or license (you already have them).
4. Click **Create repository**.

## 2. Add the remote and push

Run these in your project folder (replace `YOUR_USERNAME` and `YOUR_REPO`):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If you already added `origin` with a placeholder, update it first:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Use your GitHub username and the repo name you chose in step 1.

## 3. If GitHub asks for auth

- **HTTPS:** Use a [Personal Access Token](https://github.com/settings/tokens) as the password when prompted.
- **SSH:** Use `git@github.com:YOUR_USERNAME/YOUR_REPO.git` as the remote URL instead of `https://...`.
