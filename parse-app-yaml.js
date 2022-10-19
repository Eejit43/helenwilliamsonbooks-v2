import fs from 'fs';
import yaml from 'js-yaml';

const data = yaml.load(fs.readFileSync('./app-temp.yaml', 'utf8'));
const env = fs.readFileSync('./.env', 'utf8');

const envParsed = Object.fromEntries(
    env
        .split('\n')
        .filter((line) => line && line.includes('='))
        .map((line) => [line.split('=')[0].trim(), line.split('=')[1].trim()])
);

data.env_variables = envParsed; // eslint-disable-line camelcase

fs.writeFileSync('./app.yaml', yaml.dump(data, { indent: 4 }));
