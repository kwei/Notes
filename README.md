# Notes
![npm](https://img.shields.io/badge/npm-1.2.0-blue)
> This is the website that I use to try some interesting techniques.

You can clone the project and do any adjustment you want. Just download the repository by 
```bash
git clone https://github.com/kwei/Notes.git
```
And install all the dependencies by
```bash
npm install
```

Then, add the env file `.env` with following values:
```dotenv
NEXTAUTH_URL=<Url>
NEXTAUTH_SECRET=<Random_secret>
NEXT_PUBLIC_DATA_REPO_ID=<Repository_ID_for_using_Giscus>
NEXT_PUBLIC_DATA_CATEGORY_ID=<Category_ID_for_using_Giscus>
LINE_CLIENT_ID=<Line_channel_ID>
LINE_CLIENT_SECRET=<Line_channel_secret>
MONGODB_USERNAME=<Mongodb_username>
MONGODB_PASSWORD=<Mongodb_password>
```
