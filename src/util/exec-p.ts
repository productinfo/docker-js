
import {spawn} from 'child_process';

const {concat} = Buffer;

/**
 * Spawns a child process to run the specified command. When there is a non-zero exit code, and there has been
 * output to `stderr` the resulting promise will throw and must be caught by the caller.
 *
 * @param {string} command
 * @param {string...} params
 * @returns {Promise<string>}
 */
export function execP (command: string, ...params: string[]): Promise<string> {
   return new Promise((ok, fail) => {

      const out: Buffer[] = [];
      const err: Buffer[] = [];
      const spawned = spawn(command, params as ReadonlyArray<string>, {});

      spawned.stdout.on('data', data => out.push(data));
      spawned.stderr.on('data', data => err.push(data));

      spawned.on('error', e => err.push(new Buffer(String(e.stack), 'ascii')));

      spawned.on('exit', (exitCode, exitSignal) => {
         if (exitCode && err.length) {
            return fail(new Error(concat(err).toString('utf-8')));
         }

         ok(concat(out).toString('utf-8'));
      });

   });
}
