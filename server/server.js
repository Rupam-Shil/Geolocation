if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const cors = require('cors');

const app = express();

// enable cors
app.use(cors());

// routes
app.get('/api/search', (req, res) => {
	res.json({
		success: true,
	});
});

app.listen(process.env.PORT, () => {
	console.log(`Listening on port no ${process.env.PORT}`);
});
