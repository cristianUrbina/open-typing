export class CodeCleaner {
  static clean(code: string) {
    return code.replace(/\r/g, '').trim();
  }
}
