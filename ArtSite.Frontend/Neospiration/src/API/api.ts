import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.resolve(__dirname, '../../../openapi.yaml');
const outputPath = path.resolve(__dirname, './generated');

exec(`npx openapi-typescript-codegen --input ${openapiPath} --output ${outputPath}`, 
  (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Generated API clients: ${stdout}`);
  }
);