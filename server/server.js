if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const cors = require('cors');

const app = express();

const searchResult = require('./routes/searchResult');

// enable cors
app.use(cors());

// routes
app.use('/api/search', searchResult);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port no ${process.env.PORT}`);
});
