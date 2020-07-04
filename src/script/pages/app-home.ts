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

  @property({ type: Array }) videos: any[] | null = null;

  static get styles() {
    return css`
      header {
        background: rgba(36, 36, 36, 0.82);
        color: white;
        font-size: 12px;
        padding: 12px;
        display: flex;
        align-items: center;
        backdrop-filter: blur(6px);
        height: 2.4em;

        position: fixed;
        top: 0;
        left: 0;
        right: 0;

        display: flex;
        justify-content: space-between;
      }

      #videosBlock {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      #videosBlock video {
        width: 60em;
        margin-bottom: 2em;
      }

      #videoBlock {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90vh;
      }

      #videoBlock video {
        width: 70vw;
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        font-weight: normal;
        font-size: 20px;
      }

      #headerActions {
        display: flex;
      }

      #headerActions button {
        background: transparent;
        color: white;
        border: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-size: 1.3em;
        border-radius: 8px;
        padding: 8px;
      }

      #headerActions button:hover {
        background: black;
      }

      #headerActions button ion-icon {
        font-size: 1.2em;
        margin-right: 4px;
      }

       #chooseBlock {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 4em;
          margin-top: 2em;
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

       #wrapper {
        height: auto;
        padding-top: 3.2em;
       }

       @media (min-width: 1000px) {


         #chooseBlock {
           width: 100%;
           margin-top: 0;
           margin-bottom: 4em;
           margin-top: 2em;
         }

         #videoActions {
           padding-right: 1em;
         }

         video {
          box-shadow: 0px 0px 9px 6px #0e0e0e;
         }
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
      videos.push({ name: this.fileName, blob: blob });
      await set('videos', videos);

      await this.reset();
    }
    else {
      await set('videos', [{ name: this.fileName, blob: blob }]);

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
      <header>
        <h1>ScreenRecord</h1>

        <div id="headerActions">
          ${!this.recorded ? html`${!this.recording ? html`<button @click=${() => this.startRecording()}><ion-icon name="play-outline"></ion-icon> Start Recording</button>` : html`<button @click=${() => this.stopRecording()}><ion-icon name="stop-outline"></ion-icon> Stop Recording</button>`}` : null}
          ${this.recording ? html`<button id="pipButton" @click=${() => this.startPip()}><ion-icon name="grid-outline"></ion-icon> Picture in Picture</button>` : null}

          ${this.recorded ? html`<button @click=${() => this.save()} id="saveButton"><ion-icon name="save-outline"></ion-icon> Save</button>` : null}
          ${this.recorded ? html`<button @click=${() => this.share()} id="shareButton"><ion-icon name="share-outline"></ion-icon> Share</button>` : null}
        </div>
      </header>

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
              <video .src="${window.URL.createObjectURL(video.blob)}" controls></video>
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
        `
      }

        <pwa-install>Install ScreenRecord</pwa-install>
      </div>
    `;
  }
}