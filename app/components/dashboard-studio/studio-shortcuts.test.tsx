import { ownsKeyboard } from './studio-shortcuts';

describe('ownsKeyboard', () => {
  it('leaves typing fields and overlays alone', () => {
    document.body.innerHTML = `
      <input id="input" />
      <textarea id="area"></textarea>
      <div role="dialog"><button id="in-dialog">x</button></div>
      <section id="widget" role="button" tabindex="0"></section>
    `;
    const el = (id: string) => document.getElementById(id);
    expect(ownsKeyboard(el('input'))).toBe(true);
    expect(ownsKeyboard(el('area'))).toBe(true);
    expect(ownsKeyboard(el('in-dialog'))).toBe(true);
    expect(ownsKeyboard(el('widget'))).toBe(false);
    expect(ownsKeyboard(document.body)).toBe(false);
    expect(ownsKeyboard(null)).toBe(false);
  });
});
