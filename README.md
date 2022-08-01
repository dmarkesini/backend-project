# Backend API Project

## Instructions for setting up the project locally:

To run this project locally, you will need to create the following two .env files in the main directory:

1. .env.test
2. .env.development

Inside them you need to add this: <b>PGDATABASE=<database_name_here></b> which will need to include the right database name for that environment. Please check the <b> /db/setup.sql</b> file for the accurate database names.

Lastly, you need to make sure these files are inside the .gitignored file. You can do this with writing <b>.env.\*</b> inside .gitignore and this way both files will be ignored.
