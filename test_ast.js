import { parser } from './src/utils/pascal_parser.js';
import * as fs from 'fs';

const code = `
program passFail (input, output);
var marks: array [0..1] of Integer;
Begin
  marks[0] := 40;
  writeln(marks[0]);
end.
`;

const ast = parser.parse(code);
fs.writeFileSync('ast_output.json', JSON.stringify(ast, null, 2));
