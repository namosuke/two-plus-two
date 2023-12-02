import type { Parser, ParserData } from "./types.ts";

type NotFunc = (p: Parser<unknown>) => Parser<null>;
/**
 * パーサ `p` が成功しないものをパース
 * @param p 任意のパーサ
 * @returns null
 */
export const not: NotFunc = (p) => (input) => {
  if (p(input).result === "success") {
    return { result: "fail" };
  } else {
    return { result: "success", data: null, rest: input };
  }
};

// ps = parsers
type OrFunc = <T>(ps: Parser<T>[]) => Parser<T>;
/**
 * パーサ配列 `ps` のうち最初に成功するものをパース
 * @param ps 任意のパーサ配列
 * @returns 最初に成功したパーサの結果
 */
export const or: OrFunc = (ps) => (input) => {
  for (const p of ps) {
    const r = p(input);
    if (r.result === "success") return r;
  }
  return { result: "fail" };
};

type CatFunc = <T extends Parser<unknown>[]>(
  ps: [...T],
) => Parser<
  {
    // KはパーサTのインデックス番号
    [K in keyof T]: ParserData<T[K]>;
  }
>;
/**
 * パーサ配列 `ps` を最後まで順次パース
 * @param ps 任意のパーサ配列
 * @returns パーサの結果の配列
 */
export const cat: CatFunc = (ps) => (input) => {
  const rs = [];
  let i = input;
  for (const p of ps) {
    const r = p(i);
    if (r.result === "fail") return r;
    rs.push(r.data);
    i = r.rest;
  }
  return {
    result: "success",
    data: rs as ParserData<ReturnType<ReturnType<CatFunc>>>,
    rest: i,
  };
};

type RepFunc = <T>(p: Parser<T>, min?: number, max?: number) => Parser<T[]>;
/**
 * パーサ `p` を `min` 以上 `max` 以下の回数だけパース (最長一致)
 * @param p 任意のパーサ
 * @param min 0以上
 * @param max 検証の最大回数
 * @returns 先頭から検証し、min未満なら失敗
 */
export const rep: RepFunc =
  (p, min = 0, max = Number.POSITIVE_INFINITY) => (input) => {
    if (min > max) throw new Error("rep: min > max is not allowed.");
    if (min < 0) throw new Error("rep: negative min is not allowed.");
    if (max < 0) throw new Error("rep: negative max is not allowed.");

    const rs: ParserData<typeof p>[] = [];
    let i = input;
    for (let n = 0; n < max; n++) {
      const r = p(i);
      if (r.result === "fail") break;
      rs.push(r.data);
      i = r.rest;
    }
    if (rs.length < min) return { result: "fail" };
    return {
      result: "success",
      data: rs,
      rest: i,
    };
  };
