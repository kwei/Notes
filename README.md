# Notes
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
NEXT_PUBLIC_DATA_REPO_ID=<Repository_ID_for_using_Giscus>
NEXT_PUBLIC_DATA_CATEGORY_ID=<Category_ID_for_using_Giscus>
NOTION_SECRET=<Notion_Access_Token>
NEXT_PUBLIC_NOTION_TABLE_ID=<Notion_Database_ID>
```
