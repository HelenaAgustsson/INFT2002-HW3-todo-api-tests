# Todo REST API 2.0 with tests

A simple Todo REST API including unit tests.

### Instructions

1. Clone the project:

```
git clone https://gitlab.com/ntnu-dcst2002/todo-api-v2-with-tests.git
```

2. Install dependencies with npm:

```
cd todo-api-v2-with-tests
npm install
```

3. Create a *dev* database configuration file called "config.js" in the root directory with the following declarations:

```javascript
process.env.MYSQL_HOST = '...';
process.env.MYSQL_USER= '...';
process.env.MYSQL_PASSWORD = '...';
process.env.MYSQL_DATABASE = '...';
```

4. Similarly, create a *test* database configuration file called "config.js" in the "test" directory. 

5. Run the API:

```
npm run start
```

6. Execute the unit tests:

```
npm run test
```