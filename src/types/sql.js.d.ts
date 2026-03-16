declare module 'sql.js' {
  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  interface Database {
    run(sql: string, params?: BindParams): Database;
    exec(sql: string): QueryExecResult[];
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
  }

  interface QueryExecResult {
    columns: string[];
    values: SqlValue[][];
  }

  type SqlValue = number | string | null | Uint8Array;
  type BindParams = SqlValue[] | Record<string, SqlValue> | null;

  function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;

  interface SqlJsConfig {
    locateFile?: (file: string) => string;
  }

  export = initSqlJs;
}
