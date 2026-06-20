import { PascalASTInterpreter } from './src/utils/PascalASTInterpreter.js';

const code = `
program passFail (input, output);
var marks: array [0..1] of Integer;
var i: Integer;
Begin
  marks[0] := 40;
  marks[1] := 30;
  writeln('Mark 0 is ', marks[0]);
  writeln('Mark 1 is ', marks[1]);
  if marks[0] > 35 then
     writeln('Pass 0');
  if marks[1] > 35 then
     writeln('Pass 1')
  else
     writeln('Fail 1');
end.
`;

(async () => {
    const interpreter = new PascalASTInterpreter();
    const trace = await interpreter.runTrace(code, {});
    console.log(JSON.stringify(trace, null, 2));
})();
