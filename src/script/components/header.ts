import { LitElement, css, html, customElement } from 'lit-element';


@customElement('app-header')
export class AppHeader extends LitElement {

  static get styles() {
    return css`
      header {
        background: rgba(36, 36, 36, 0.8);
        color: white;
        font-size: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        backdrop-filter: blur(6px);
        height: 2.4em;
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        font-weight: normal;
        font-size: 20px;
      }

      @media all and (display-mode: standalone) {
        header {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <header>
        <h1>ScreenRecord</h1>
      </header>
    `;
  }
}