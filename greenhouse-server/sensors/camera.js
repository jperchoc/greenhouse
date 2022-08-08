import { exec } from 'child_process';

class Execute {
  static run(fullCmd, options = {}) {
    return new Promise((resolve, reject) => {
      exec(fullCmd, options, (error, stdout, stderr) => {
        if (stderr || error) {
          reject(stderr || error);
        }
        resolve(stdout);
      });
    });
  }

  static cmd(base, params) {
    if (!params && base) {
      return base;
    }
    if (params.constructor !== Array) {
      throw new Error('params must be an Array');
    }
    
    return base + ' ' + params.join(' ');
  }
}

export default class Camera {
    constructor() {
        this.command = process.env.CAMERA_COMMAND || 'raspistill';
        this.image = '';
        this.config = [
            "--width",
            640,
            "--height",
            480,
            "--nopreview",
            "--ISO",
            100000,
            "--exposure",
            "night",
            "--output",
            "-",
            "-q",
            "100",
            "--annotate",
            12,
            "-t",
            1000
          ];
          this.getPhoto();
    }

    async getPhoto(maxBuffer = 1024*1024*10) {
        try {
            const image = await Execute.run(Execute.cmd(this.command, this.config), {encoding: 'binary', maxBuffer: maxBuffer});
            let data = Buffer.from(image, 'binary').toString('base64');
            this.image = 'data:image/jpg;base64,' + data;
            setTimeout(() => this.getPhoto(), 2000);
        } catch(e) {
            console.log(e);
        }
    }
}
