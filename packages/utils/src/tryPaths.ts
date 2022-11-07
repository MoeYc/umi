import { existsSync } from 'fs';
import { basename, dirname } from 'path';
import chalk from '../compiled/chalk';

interface ITryPathsOpts {
  /**
   * allow multiple files exist
   * @default true
   */
  repeat?: boolean;
  /**
   * allow file exts list
   */
  exts?: string[];
}

export function tryPaths(paths: string | string[], opts: ITryPathsOpts = {}) {
  // ensure paths is array
  if (!Array.isArray(paths)) {
    paths = [paths];
  }
  const { repeat = true, exts } = opts;

  // file extensions
  if (Array.isArray(exts)) {
    paths = paths.reduce<string[]>((memo, path) => {
      return [...memo, ...exts.map((ext) => `${path}${ext}`)];
    }, []);
  }

  if (repeat) {
    for (const path of paths) {
      if (existsSync(path)) return path;
    }
  } else {
    const existedFiles = paths.filter((path) => existsSync(path));
    if (existedFiles.length > 1) {
      console.log(
        chalk.yellow(
          `Multiple identical files exist: ${existedFiles
            .map((t) => chalk.red(`${basename(dirname(t))}/${basename(t)}`))
            .join(', ')}, Please specify one of them.`,
        ),
      );
    }
    return existedFiles[0];
  }
}
