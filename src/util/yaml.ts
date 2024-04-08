import * as fs from 'fs/promises';
import * as path from 'path';

import * as YAML from 'js-yaml';
import axios from 'axios';

export const openYamlUrlAsObject = async <T>(url: string): Promise<T> => {
  try {
    // Make a GET request to fetch the YAML file from the URL
    const response = await axios.get(url);

    // Extract the YAML content from the response
    const yamlContent = response.data;

    // Parse the YAML content into an object
    const yamlObject = YAML.load(yamlContent);

    return yamlObject as T;
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error('Error fetching or parsing YAML file:', error);
    throw error;
  }
};

/**
 * Reads and parses `yaml` file to object.
 */
export const openYamlFileAsObject = async <T>(filePath: string): Promise<T> => {
  const yamlFileBuffer = await fs.readFile(filePath, 'utf8');

  return YAML.load(yamlFileBuffer) as T;
};

/**
 * Saves given `yaml` dump as a file.
 */
export const saveYamlFileAs = async (object: any, pathToFile: string) => {
  const dirPath = path.dirname(pathToFile);
  await fs.mkdir(dirPath, {recursive: true});
  const yamlString = YAML.dump(object, {noRefs: true});

  return fs.writeFile(pathToFile, yamlString);
};

/**
 * Checks if given `fileName` is yaml.
 */
export const checkIfFileIsYaml = (fileName: string) => {
  const yamlFileTypes = ['yaml', 'yml'];
  const splittedParts = fileName.split('.');
  const lastIndex = splittedParts.length - 1;
  const extension = splittedParts[lastIndex];

  return yamlFileTypes.includes(extension);
};
