import { LitElement, css, html, customElement, property } from 'lit-element';

import {
  fileSave,
} from 'browser-nativefs';

import '@pwabuilder/pwainstall';

declare var MediaRecorder: any;

@customElement('app-home')
export class AppHome extends LitElement {

  @property({ type: MediaStream }) stream: MediaStream | null = null;
  @property({ type: Boolean }) recording: boolean = false;
  @property() mediaRecorder: any = null;
  @property({ type: Array }) recordedChunks: any[] = [];
  @property({ type: Boolean }) recorded: boolean = false;

  @property({ type: File }) recordedVideo: File | null = null;

  static get styles() {
    return css`
       #chooseBlock {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 4em;
       }

       #chooseBlock button {
        background: var(--app-color-primary);
        color: white;
        border: none;
        font-weight: normal;
        text-transform: uppercase;
        font-size: 14px;
        border-radius: 4px;
        min-width: 11em;
        cursor: pointer;

        padding: 12px;
        text-transform: uppercase;
       }

       #chooseBlock p {
        font-weight: bold;
        width: 15em;
        text-align: center;
        color: white;
        font-size: 1.4em;
       }

       #videoBlock {
        height: 80vh;
        width: 100%;
        display: flex;
        margin: 0;
        padding: 0;
        justify-content: center;
        background: #3e3e3e;
       }

       #videoBlock video {
         width: 100%;
       }

       #videoActions {
        display: flex;
        width: 100%;
        margin-top: 1em;

        flex-direction: column;
        justify-content: flex-start;
       }

       #videoActions h3 {
         margin-top: 0;
         margin-bottom: 0;
       }

       #videoActions button {
        background: var(--app-color-primary);
        color: white;
        border: none;
        font-weight: normal;
        text-transform: uppercase;
        font-size: 14px;
        border-radius: 4px;
        min-width: 11em;
        cursor: pointer;
        max-width: 14em;

        padding: 12px;
        text-transform: uppercase;
       }

       #videoActions #saveButton {
         background: var(--app-color-secondary);
       }

       #videoActions #pipButton {
         background: var(--app-color-secondary);
       }

       #videoActions #file {
         display: flex;
         flex-direction: column;
         color: white;
         align-items: center;
         margin-top: 2em;
       }

       #videoActions #recordingBlock {
         display: flex;
         justify-content: flex-end;    
       }

       #saveBlock {
        display: flex;
        justify-content: center;
       }

       pwa-install {
        position: fixed;
        bottom: 16px;
        right: 16px;
       }

       pwa-install::part(openButton) {
         background: var(--app-color-primary);
       }

       @media (min-width: 1000px) {
         #wrapper {
          display: flex;
          height: 84vh;
         }

         #chooseBlock {
           width: 100%;
           margin-top: 0;
           margin-bottom: 18em;
         }

         #videoBlock {
          height: 100%;
          background: #242424;
          align-items: flex-start;
          padding: 2em;
         }

         #videoActions {
           padding-right: 1em;
         }

         video {
          box-shadow: 0px 0px 9px 6px #0e0e0e;
         }

         #pipButton, #shareButton {
           margin-left: 1em;
         }
       }

       @media (max-width: 600px) {
         #videoActions {
          justify-content: space-around;
         }

         #videoActions #recordingBlock {
           justify-content: center;
         }

         #videoActions #pipButton, #saveBlock #shareButton {
           margin-left: 14px;
         }

         #videoActions #file {
           display: none;
         }
       }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {

  }

  async chooseScreen() {
    const displayMediaOptions = {
      video: {
        cursor: "always"
      },
      audio: false
    };

    this.stream = await (navigator.mediaDevices as any).getDisplayMedia(displayMediaOptions);


    await this.updateComplete;

    let videoElm = ((this.shadowRoot as any).querySelector('video') as HTMLVideoElement);

    videoElm.srcObject = this.stream;

    videoElm.onloadeddata = () => videoElm.play();
  }

  async startRecording() {
    this.recording = true;

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: "video/webm; codecs=vp9" });

    this.mediaRecorder.ondataavailable = (event: any) => {
      this.recordedChunks.push(event.data);
    }

    await this.mediaRecorder.start(2000);

    /*this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
      console.log(event);

      this.recordedChunks.push(event.data);
      console.log(this.recordedChunks);
    })/*

    await this.mediaRecorder.start();
    this.recording = true;*/
  }



  async stopRecording() {
    await this.mediaRecorder.stop();
    this.recording = false;

    let tracks = this.stream?.getTracks();

    if (tracks) {
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }

    this.recorded = true;

    await this.updateComplete;

    const blob = new Blob(this.recordedChunks);

    this.recordedVideo = new File([blob], "recording.webm");
    console.log(this.recordedVideo);

    console.log(this.recordedChunks);

    const preview = ((this.shadowRoot as any).querySelector('#preview') as HTMLVideoElement);

    preview.src = window.URL.createObjectURL(blob);
  }

  async save() {
    var blob = new Blob(this.recordedChunks, {
      type: "video/webm"
    });

    await fileSave(blob, {
      fileName: 'recording.webm',
    });

  }

  async startPip() {
    let videoElem: any = ((this.shadowRoot as any).querySelector('video') as HTMLVideoElement);
    await videoElem.requestPictureInPicture();
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  share() {

  }

  render() {
    return html`
      <div id="wrapper">

        ${ !this.stream ? html`<div id="chooseBlock">
          <p>Tap the button below to choose a screen to record and get started!</p>
          <button @click=${() => this.chooseScreen()}>Choose Screen</button>
        </div>` :
        html`
          <div id="videoBlock">
            ${!this.recorded ? html`<video></video>` : html`<video id="preview" controls autoplay></video>`}
          </div>

          <div id="videoActions">

            ${this.recorded && this.recordedVideo ? html`<div id="file">
              <h3>${this.recordedVideo.name}</h3>
              <p>Size: ${this.formatBytes(this.recordedVideo.size)}</p>
            </div>` : null}

            <div id="recordingBlock">
              ${!this.recorded ? html`${!this.recording ? html`<button @click=${() => this.startRecording()}>Start Recording</button>` : html`<button @click=${() => this.stopRecording()}>Stop Recording</button>`}` : null}
              ${this.recording ? html`<button id="pipButton" @click=${() => this.startPip()}>Picture in Picture</button>` : null}
            </div>

            <div id="saveBlock">
              ${this.recorded ? html`<button @click=${() => this.save()} id="saveButton">Save</button>` : null}
              ${this.recorded ? html`<button @click=${() => this.share()} id="shareButton">Share</button>` : null}
            </div>
          </div>
        `
      }

        <pwa-install>Install ScreenRecord</pwa-install>
      </div>
    `;
  }
}