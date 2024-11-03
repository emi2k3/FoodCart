import pg from "pg";

export const pool = new pg.Pool();

export const query = async (
  text: string,
  params?: (string | number | string[] | number[] | boolean)[]
) => {
  // const start = Date.now()
  const res = await pool.query(text, params);
  // const duration = Date.now() - starts
  // console.log('executed query', { text, duration, rows: res.rowCount })
  return res;
};
