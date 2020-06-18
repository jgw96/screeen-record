import { LitElement, css, html, customElement, property } from 'lit-element';

import { get, set } from 'idb-keyval';

import '@pwabuilder/pwainstall';

declare var MediaRecorder: any;

@customElement('app-home')
export class AppHome extends LitElement {

  @property({ type: MediaStream }) stream: MediaStream | null = null;
  @property({ type: Boolean }) recording: boolean = false;
  @property() mediaRecorder: any = null;
  @property({ type: Array }) recordedChunks: any[] = [];
  @property({ type: Boolean }) recorded: boolean = false;
  @property({ type: String }) fileName: string = 'recording';

  @property({ type: File }) recordedVideo: File | null = null;

  @property({ type: Array }) videos: any[] | null =  null;

  static get styles() {
    return css`
       #chooseBlock {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 4em;
       }

       #videosBlock {
        z-index: 999;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(356px, 1fr));

        overflow-x: hidden;
        height: 21em;
        overflow-y: scroll;

        background: #1c1c1cc9;
        backdrop-filter: blur(12px);

        padding-top: 1em;
        padding-bottom: 4em;
        grid-gap: 10px;
        padding: 16px;
       }

       #videosBlock .videoCard {
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         background: #1c1b1b;
          padding: 8px;
          border-radius: 8px;
       }

       .videoCard span {
        color: white;
        padding: 6px;
        font-size: 22px;
        font-weight: bold;
        margin-left: 8px;
        text-align: center;
       }

       #videosBlock video {
        height: 100%;
        width: 100%;
        margin: 16px;
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
       }

       #videoBlock video {
         width: 100%;
         z-index: 9;
       }

       #videoActions {
        display: flex;
        width: 50%;
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

       #videoActions #resetBlock #resetButton {
         background: #F44336;
       }

       #videoActions #file {
         display: flex;
         flex-direction: column;
         color: white;
         align-items: center;
         margin-top: 2em;
       }

       #videoActions #file input {
        border-radius: 20px;
        border: var(--app-color-primary) 2px solid;
        padding: 6px;
        font-size: 1em;
        color: var(--app-color-primary);
       }

       #videoActions #recordingBlock {
         display: flex;
         justify-content: flex-end;  
         margin-top: 0.8em;  

          flex-direction: column;
          color: white;
          box-shadow: 0px 0px 8px 4px #191919;
          padding: 1.2em;
          border-radius: 8px;
          width: 22em;

          background: #242424;
       }

       #recordingBlock h2 {
         margin-top: 0;
         font-size: 1.4em;
       }

       #recordingBlock h2 {
         margin-bottom: 1.4em;
       }

       #recordingOptions label {
         font-weight: bold;
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

       #recordActions {
        width: 100%;
        display: flex;
        justify-content: flex-end;
       }

       #recordingOptions {
        display: flex;
        flex-direction: column;
        color: white;
       }

       #resetBlock {
        display: flex;
        bottom: 0;
        margin-top: 8px;
        justify-content: center;
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
          align-items: flex-start;
          padding: 2em;
         }

         #videoActions {
           padding-right: 1em;
         }

         #videosBlock {
          margin: 1em;
          border-radius: 20px;
          box-shadow: 0 0 16px 6px #0b0b0be6;
         }

         #videosBlock::-webkit-scrollbar {
           display: none;
         }

         video {
          box-shadow: 0px 0px 9px 6px #0e0e0e;
         }

         #pipButton, #shareButton {
           margin-left: 1em;
         }

         E
       }

       @media (max-width: 780px) {
         #videoActions {
          justify-content: space-around;
          width: 100%;

          
         }

         #videoActions #recordingBlock {
           justify-content: center;

           position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            padding: 0;
            box-shadow: none;

         }

         #recordActions button {
          width: 100%;
          max-width: none;

          margin-bottom: 16px;
          margin-left: 16px;
          margin-right: 16px;
         }

         #videoActions #pipButton, #saveBlock #shareButton {
           margin-left: 14px;
         }

         #videoActions #file {
           display: none;
         }

         #recordingBlock h2 {
           display: none;
         }
       }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const saved: any[] = await get('videos');

    if (saved) {
      this.videos = saved;
    }
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

  async reset() {
    this.recorded = false;
    this.recordedVideo = null;
    this.stream = null;

    const saved: any[] = await get('videos');

    if (saved) {
      this.videos = saved;
    }
  }

  async save() {
    var blob = new Blob(this.recordedChunks, {
      type: "video/webm"
    });

   /* const module = await import('browser-nativefs');

    await module.fileSave(blob, {
      fileName: 'recording.webm',
    });*/

    const videos: any[] = await get('videos');

    if (videos) {
      videos.push({name: this.fileName, blob: blob});
      await set('videos', videos);

      await this.reset();
    }
    else {
      await set('videos', [{name: this.fileName, blob: blob}]);

      await this.reset();
    }

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

  async share() {
    const blob = new Blob(this.recordedChunks, {
      type: "video/webm"
    });

    let file = new File([blob], 'recording.webm');
    if ((navigator as any).canShare && (navigator as any).canShare({ file: file })) {
      console.log('trying to share  ')
      await (navigator as any).share({
        file: file,
        title: 'recording',
        text: '',
      })
    } else {
      console.log(`Your system doesn't support sharing files.`);
    }
  }

  handleName(event: any) {
    console.log(event.target.value);
    this.fileName = event.target.value;
  }

  render() {
    return html`
      <div id="wrapper">

        ${ !this.stream ? html`
        <div id="chooseBlock">
          <p>Tap the button below to choose a screen to record and get started!</p>
          <button @click=${() => this.chooseScreen()}>Choose Screen</button>
        </div>

        ${
          !this.stream && this.videos ? html`
            <div id="videosBlock">
              ${
                this.videos.map((video) => {
                  return html`
                    <div class="videoCard">
                      <span>${video.name}</span>
                      <video .src="${window.URL.createObjectURL(video.blob)}" controls></video>
                    </div>
                  `
                })
              }
            </div>
          ` : null
        }
        
        ` :
        html`
          <div id="videoBlock">
            ${!this.recorded ? html`<video></video>` : html`<video id="preview" controls autoplay></video>`}
          </div>

          <div id="videoActions">

            ${this.recorded && this.recordedVideo ? html`<div id="file">
              <input type="text" .value="${this.fileName}" @input="${(event: any) => this.handleName(event)}"></h3>
              <p>Size: ${this.formatBytes(this.recordedVideo.size)}</p>
            </div>` : null}

            ${!this.recorded ? html`<div id="recordingBlock">

              <h2>Recording Actions</h2>

              <div id="recordActions">
                ${!this.recorded ? html`${!this.recording ? html`<button @click=${() => this.startRecording()}>Start Recording</button>` : html`<button @click=${() => this.stopRecording()}>Stop Recording</button>`}` : null}
                ${!this.recorded && !this.recording ? html` <div id="recordingOptions">
                </div>` : null}
                ${this.recording ? html`<button id="pipButton" @click=${() => this.startPip()}>Picture in Picture</button>` : null}
              </div>
              
            </div>` : null}

            <div id="saveBlock">
              ${this.recorded ? html`<button @click=${() => this.save()} id="saveButton">Save</button>` : null}
              ${this.recorded ? html`<button @click=${() => this.share()} id="shareButton">Share</button>` : null}
            </div>

            <div id="resetBlock">
              ${this.recorded ? html`<button @click=${() => this.reset()} id="resetButton">Reset</button>` : null}
            </div>
          </div>
        `
      }

        <pwa-install>Install ScreenRecord</pwa-install>
      </div>
    `;
  }
}