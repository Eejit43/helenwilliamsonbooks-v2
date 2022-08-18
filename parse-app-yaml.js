import fs from 'fs';
import yaml from 'js-yaml';

const data = yaml.load(fs.readFileSync('./app-temp.yaml', 'utf8'));
const env = fs.readFileSync('./.env', 'utf8');
const envParsed = env
    .split('\n')
    .filter((line) => line)
    .reduce((acc, line) => {
        const [key, value] = line.split('=');
        acc[key.trim()] = value.trim();
        return acc;
    }, {});

data.env_variables = envParsed; // eslint-disable-line camelcase

fs.writeFileSync('./app.yaml', yaml.dump(data));
