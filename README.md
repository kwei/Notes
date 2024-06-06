# Notes
![SDK Version](https://img.shields.io/badge/npm-1.0.0-blue)
> This is me using Notion as a database and integrating it into my own website. Currently, I plan to use Notion to store my research findings on various technologies. Later, I will also write my resume on Notion and integrate it as well.

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
NOTION_NOTE_SECRET=<Notion_access_token>
NEXT_PUBLIC_NOTION_NOTE_TABLE_ID=<Notion_database_note_ID>
NEXT_PUBLIC_NOTION_TASK_TABLE_ID=<Notion_database_task_ID>
LINE_CLIENT_ID=<Line_channel_ID>
LINE_CLIENT_SECRET=<Line_channel_secret>
MONGODB_USERNAME=<Mongodb_username>
MONGODB_PASSWORD=<Mongodb_password>
```
