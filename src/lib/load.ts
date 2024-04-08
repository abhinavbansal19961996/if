import {validateManifest} from '../util/validations';
import {openYamlFileAsObject} from '../util/yaml';
import {openYamlUrlAsObject} from '../util/yaml';
import {readAndParseJson} from '../util/json';

import {PARAMETERS} from '../config';
import {Parameters} from '../types/parameters';

/**
 * Parses manifest file as an object. Checks if parameter file is passed via CLI, then loads it too.
 * Returns context, tree and parameters (either the default one, or from CLI).
 */
export const load = async (inputPath: string, paramPath?: string) => {
  let rawManifest = '';
  if (inputPath.includes('http')) {
    rawManifest = await openYamlUrlAsObject<any>(inputPath);
  } else {
    rawManifest = await openYamlFileAsObject<any>(inputPath);
  }

  const {tree, ...context} = validateManifest(rawManifest);
  const parametersFromCli =
    paramPath &&
    (await readAndParseJson<Parameters>(paramPath)); /** @todo validate json */
  const parameters =
    parametersFromCli ||
    PARAMETERS; /** @todo PARAMETERS should be specified in parameterize only */

  return {
    tree,
    context,
    parameters,
  };
};
