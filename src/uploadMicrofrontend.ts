import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as fs from 'fs';
import archiver from 'archiver';
import FormData from 'form-data';
import fetch from 'node-fetch';

export async function run() {
    try {
        // Get task inputs
        const apiKey = tl.getInput('apiKey', true)!;
        const microfrontendSlug = tl.getInput('microfrontendSlug', true)!;
        const domain = tl.getInput('domain', false) || "https://console.mfe-orchestrator.dev";
        const filePath = tl.getPathInput('filePath', true)!;
        const version = tl.getInput('version', true)!;

        // Validate file exists
        if (!fs.existsSync(filePath)) {
            tl.setResult(tl.TaskResult.Failed, `File not found: ${filePath}`);
            return;
        }

        // Create a zip file
        const zipFileName = `${microfrontendSlug}-${version}.zip`;
        const output = fs.createWriteStream(zipFileName);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`${archive.pointer()} total bytes`);
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.on('error', (err: Error) => {
            throw err;
        });

        archive.pipe(output);

        // Add file or directory to zip
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            archive.directory(filePath, false);
        } else {
            archive.file(filePath, { name: path.basename(filePath) });
        }

        await archive.finalize();

        // Upload the zip file
        const form = new FormData();
        form.append('file', fs.createReadStream(zipFileName));

        const url = `${domain}/api/microfrontends/by-slug/${microfrontendSlug}/upload/${version}?apiKey=${apiKey}`;
        
        console.log(`Uploading to: ${url}`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                'Accept': 'application/json'
            },
            body: form
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${error}`);
        }

        console.log('Upload completed successfully');
        tl.setResult(tl.TaskResult.Succeeded, 'Microfrontend uploaded successfully');

    } catch (err) {
        const error = err as Error;
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}
