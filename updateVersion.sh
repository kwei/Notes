VERSION=$(node read-package-version.js)
sed -i "s|\(https://img.shields.io/badge/npm-\)[^-]*\(-blue\)|\1${VERSION}\2|" README.md
