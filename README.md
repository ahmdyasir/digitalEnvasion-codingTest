### Quick start
**Make sure you have Node version >= 5.0 and NPM >= 3**

```bash
# create .config.js
copy `.config.js`. 

# edit database configuration
Open `.config.js` file and edit the `database` section 
```json
database: {
    host: 'some_ip',
    database: 'database_name',
    username: 'username',
    password: 'password',
    port: 27017
  }
```
# install the repo with npm
npm install

# start the server
npm start