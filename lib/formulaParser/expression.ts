import { char } from "./char.ts";
import { cat, or, rep } from "./combinators.ts";
import { ParserInput, ParserOutput } from "./types.ts";
import { map } from "./util.ts";
import { number } from "./number.ts";

export function expr(input: ParserInput): ParserOutput<number> {
  return map(
    cat([term, rep(cat([or([char("+"), char("-")]), term]))]),
    // rest: ['+' | '-', number][]
    ([first, rest]) => {
      return rest.reduce((lhs, [op, rhs]) => {
        if (op === "+") return lhs + rhs;
        return lhs - rhs;
      }, first);
    },
  )(input);
}

function term(input: ParserInput): ParserOutput<number> {
  return map(
    cat([factor, rep(cat([or([char("*"), char("/")]), factor]))]),
    ([first, rest]) => {
      return rest.reduce((lhs, [op, rhs]) => {
        if (op === "*") return lhs * rhs;
        return lhs / rhs;
      }, first);
    },
  )(input);
}

function factor(input: ParserInput): ParserOutput<number> {
  return or([number, map(cat([char("("), expr, char(")")]), ([, n]) => n)])(
    input,
  );
}
