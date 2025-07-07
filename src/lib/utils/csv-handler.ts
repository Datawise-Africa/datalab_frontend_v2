/**
 * Comprehensive CSV handling utility with parsing, validation, and transformation capabilities.
 * @module csv-handler
 * @description Provides robust CSV processing including URL fetching, parsing, error handling,
 * and data transformation. Built on PapaParse with axios for HTTP requests.
 * @author Felix Orinda
 * @license MIT
 */
import Papa, { type ParseResult, type ParseError } from 'papaparse';
import axios, { type AxiosResponse } from 'axios';

interface CsvParseOptions {
  delimiter?: string;
  header?: boolean;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
  transformValue?: (value: string) => unknown;
  dynamicTyping?: boolean;
  fileName?: string;
  onError?: (error: ParseError) => void;
}

export class CsvHandler {
  /**
   * Parses CSV data from a URL with comprehensive error handling and configurable parsing options
   * @template T - Expected type of parsed data
   * @param {string} url - URL of the CSV resource
   * @param {CsvParseOptions<T>} options - Configuration for parsing
   * @returns {Promise<{data: T[], errors: ParseError[], meta: any, fileName?: string}>}
   * @throws {Error} When network request fails or critical parsing error occurs
   */
  static async parseCsvFromUrl<T = any>(
    url: string,
    options: CsvParseOptions = {},
  ): Promise<{
    data: T[];
    errors: ParseError[];
    meta: any;
    fileName?: string;
  }> {
    try {
      const {
        delimiter = ',',
        header = true,
        skipEmptyLines = true,
        transformHeader = (h: string) => h.trim(),
        transformValue = (v: string) => v.trim(),
        dynamicTyping = true,
        fileName,
        onError,
      } = options;

      const response: AxiosResponse<string> = await axios.get(url, {
        responseType: 'text',
        validateStatus: (status) => status >= 200 && status < 300,
      });

      return new Promise((resolve, reject) => {
        Papa.parse<T>(response.data, {
          header,
          skipEmptyLines,
          delimiter,
          transformHeader,
          transform: transformValue,
          dynamicTyping,
          complete: (results: ParseResult<T>) => {
            if (results.errors.length > 0) {
              results.errors.forEach((error) => onError?.(error));
              console.warn(
                'CSV parsing completed with warnings:',
                results.errors,
              );
            }
            resolve({
              data: results.data,
              errors: results.errors,
              meta: results.meta,
              fileName,
            });
          },
          error: (error: Error) => {
            console.error('CSV parsing failed:', error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error('Failed to process CSV:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Normalizes different error types into a consistent format
   * @private
   * @param {unknown} error - Raw error object
   * @returns {Error} Normalized error instance
   */
  private static normalizeError(error: unknown): Error {
    if (error instanceof Error) return error;
    if (typeof error === 'string') return new Error(error);
    return new Error('Unknown error occurred during CSV processing');
  }

  /**
   * Validates CSV content before parsing
   * @static
   * @param {string} content - Raw CSV content
   * @returns {boolean} Whether the content appears to be valid CSV
   */
  static validateCsvContent(content: string): boolean {
    return content.includes('\n') && content.split('\n')[0].includes(',');
  }

  /**
   * Converts JSON data to CSV format
   * @static
   * @template T - Type of input data
   * @param {T[]} data - Array of objects to convert
   * @param {string[]} fields - Specific fields to include
   * @returns {string} CSV formatted string
   */
  static jsonToCsv<T extends Record<string, any>>(
    data: T[],
    fields?: (keyof T)[],
  ): string {
    const filteredData =
      fields && fields.length > 0
        ? data.map((row) =>
            fields.reduce(
              (acc, field) => {
                acc[field as string] = row[field];
                return acc;
              },
              {} as Record<string, any>,
            ),
          )
        : data;
    return Papa.unparse(filteredData, {
      skipEmptyLines: true,
    });
  }
}
