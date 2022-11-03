import vm from "vm";
import readlineSync from "readline-sync";
import chalk from "chalk";
import { compile } from "./compile";

const READ = () => readlineSync.question("liszt> ");
const EVAL = (input: string) => vm.runInThisContext(compile(input));
const PRINT = console.log;

export const repl = () => {
  while (true) {
    try {
      let input = READ();

      if (input === "") {
        break;
      }

      PRINT(EVAL(input));
    } catch (e: any) {
      console.log(chalk.redBright(e.message));
    }
  }
};