const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const os = require('os');

const jsonParser = bodyParser.json({limit: '100kb'});
const hostname = os.hostname();

const app = express();
const port = process.env.PORT || 236;
const host = process.env.HOST || "0.0.0.0";

app.post('/rcmd', jsonParser, (req, res) => {
	const cmd = req.body.cmd;
    const child = spawn(cmd, [], {
        windowsHide: true,
        shell: true
    });
	let stdout = "";
	let stderr = "";
	child.stdout.on('data', (data) => {
		stdout += data;
	});
	child.stderr.on('data', (data) => {
		stderr += data;
	});
	child.on('close', (code) => {
		res.json({hostname, cmd, code, stdout, stderr});
	});
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});