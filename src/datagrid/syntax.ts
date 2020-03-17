import { AttrSyntax, attributePattern } from '@aurelia/jit';

@attributePattern({ pattern: ':PART', symbols: ':' })
export class ColonPrefixedBindAttributePattern {
  public [':PART'](rawName: string, rawValue: string, parts: string[]): AttrSyntax {
    const syntaxParts = this.map(parts[0]);
    return new AttrSyntax(rawName, rawValue, syntaxParts[0], syntaxParts[1]);
  }

  private map(shorthand: string) {
    console.log({shorthand})
    switch (shorthand) {
      case 'for':
        return ['repeat', 'for'];
      default:
        return [shorthand, 'bind'];
    }
  }
}
