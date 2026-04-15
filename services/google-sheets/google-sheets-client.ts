import "server-only";
import { google, sheets_v4 } from "googleapis";
import { getEnv } from "@/lib/env";

type RowMatch = {
  rowNumber: number;
  row: string[];
};

export class GoogleSheetsClient {
  private readonly sheets: sheets_v4.Sheets;
  private readonly spreadsheetId: string;
  private readonly sheetName: string;

  constructor() {
    const env = getEnv();
    const auth = new google.auth.JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    this.sheets = google.sheets({ version: "v4", auth });
    this.spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.sheetName = env.GOOGLE_SHEETS_SHEET_NAME;
  }

  async getDataRows(expectedHeaders: readonly string[]) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A:M`
    });

    const values = (response.data.values ?? []) as string[][];
    const [headerRow = [], ...rows] = values;
    this.ensureHeader(expectedHeaders, headerRow);

    return rows.map((row) => expectedHeaders.map((_, index) => row[index] ?? ""));
  }

  async appendRow(values: string[]) {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A:M`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] }
    });
  }

  async updateRow(rowNumber: number, values: string[]) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A${rowNumber}:M${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] }
    });
  }

  async deleteRow(rowNumber: number) {
    const sheetId = await this.getSheetId();

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }
        ]
      }
    });
  }

  async findRowById(id: string, expectedHeaders: readonly string[]): Promise<RowMatch | null> {
    const rows = await this.getDataRows(expectedHeaders);
    const index = rows.findIndex((row) => row[0] === id);

    if (index === -1) {
      return null;
    }

    return {
      rowNumber: index + 2,
      row: rows[index]
    };
  }

  private ensureHeader(expectedHeaders: readonly string[], actualHeaders: string[]) {
    const normalized = actualHeaders.map((value) => value.trim().toLowerCase());
    const mismatch = expectedHeaders.some((header, index) => normalized[index] !== header);

    if (mismatch) {
      throw new Error(`Cabecalho invalido na aba ${this.sheetName}. Verifique a ordem e os nomes das colunas.`);
    }
  }

  private async getSheetId() {
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId
    });

    const sheet = response.data.sheets?.find((entry) => entry.properties?.title === this.sheetName);

    if (sheet?.properties?.sheetId === undefined) {
      throw new Error(`Aba ${this.sheetName} nao encontrada na planilha.`);
    }

    return sheet.properties.sheetId;
  }
}
