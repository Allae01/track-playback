import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatBasicAudioPlayerComponent} from 'ngx-audio-player';
import {ImageServiceService} from '../shared/image-service.service';
import { NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public nameFile;
  public nameFile2;
  public msbapTitle;
  public msbapTitle2;
  public msbapAudioUrl;
  msbapAudioUrl2;
  msaapDisplayVolumeControls = true;
  msbapDisplayTitle = true;
  msaapDisplayVolumeControls2 = true;
  msbapDisplayTitle2 = true;

  @ViewChild('playback1', {static: false})
  playback1: MatBasicAudioPlayerComponent;

  @ViewChild('playback2', {static: false})
  playback2: MatBasicAudioPlayerComponent;

  @ViewChild('track1', {static: true})
  track1: ElementRef;
  @ViewChild('track2', {static: true})
  track2: ElementRef;

  isTrack1: boolean;
  isTrack2: boolean;
  volume1 = 50;
  volume2 = 50;
  imageSource1;
  imageSource2;
  inloop: boolean;
  inTrack: boolean;
  inPause: boolean;
  rfvalue;
  error = '';
  digitsError = '';

  constructor(private imgService: ImageServiceService) {
    this.isTrack1 = false;
    this.isTrack2 = false;
    this.inloop = false;
    this.inTrack = false;
    this.inPause = false;
    this.imageSource1 = this.imageSource2 = null;
  }


  ngOnInit() {
  }

  onSelectFile(event) {
    if (event.target.files.length > 1) {
      event.target.files.splice(0, 1 );
    }
    this.nameFile = event.target.files[0].name;
    this.msbapTitle = event.target.files[0].name;
    console.log(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = ev => {
      console.log(ev);
      this.msbapAudioUrl = reader.result;
    };
    this.isTrack1 = true;
    this.getImage(event.target.files[0].name.split('.')[0], 1);
  }

  isPlaying() {
    return this.inTrack;
  }

  onSelectFile2(event) {
    if (event.target.files.length > 1) {
      event.target.files.splice(0, 1 );
    }
    this.nameFile2 = event.target.files[0].name;
    this.msbapTitle2 = event.target.files[0].name;
    console.log(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = ev => {
      console.log(ev);
      this.msbapAudioUrl2 = reader.result;
    };
    this.isTrack2 = true;
    this.getImage(event.target.files[0].name.split('.')[0], 2);
  }

  checkIfTwoDisks() {
    if (this.isTrack1 && this.isTrack2) {
      this.error = '';
      return true;
    }
    this.error = 'Select two files';
    return false;
  }

  playBoth() {
    return new Promise((resolve, reject) => {
      this.playback2.player.nativeElement.play();
      this.playback1.player.nativeElement.play();
      this.inTrack = true;
      this.inPause = false;
    });
  }


  forTrack(num) {
    switch (num) {
      case 1: {
        this.track1.nativeElement.click();
        break;
      }
      case 2: {
        this.track2.nativeElement.click();
        break;
      }
    }
  }

  setVolume(num) {
    switch (num) {
      case 1: {
        this.playback1.player.nativeElement.volume = this.volume1 / 100;
        break;
      }
      case 2: {
        this.playback2.player.nativeElement.volume = this.volume2 / 100;
        break;
      }
    }
  }

  mute(num) {
    switch (num) {
      case 1:
        this.playback1.player.nativeElement.volume = this.playback1.player.nativeElement.volume === 0 ? this.volume1 / 100 : 0;
        break;
      case 2:
        this.playback2.player.nativeElement.volume = this.playback2.player.nativeElement.volume === 0 ? this.volume2 / 100 : 0;
        break;
    }
  }

  getImage(topic, cas) {
    let listImage;

    switch (cas) {
      case 1:
        this.imgService.getImage(topic).subscribe(value => {
          listImage = value;
        } , value => { console.log(value); }, () => { console.log('END'); this.imageSource1 = listImage.image_results[0].image; });
        break;
      case 2:
        this.imgService.getImage(topic).subscribe(value => {
          listImage = value;
        } , value => { console.log(value); }, () => { console.log('END'); this.imageSource2 = listImage.image_results[0].image; });
        break;
    }
  }

  makeLoop() {
    this.inloop = !this.inloop;
    this.playback1.player.nativeElement.loop = this.inloop;
    this.playback2.player.nativeElement.loop = this.inloop;
  }

  pauseBoth() {
    return new Promise((resolve, reject) => {
      this.playback2.player.nativeElement.pause();
      this.playback1.player.nativeElement.pause();
      this.inPause = true;
      this.inTrack = false;
    });
  }

  isPaused() {
    return this.inPause;
  }

  isLoop() {
    return this.inloop;
  }


  stopPlaying() {
    this.pauseBoth();
    this.playback2.player.nativeElement.currentTime = 0;
    this.playback1.player.nativeElement.currentTime = 0;
    this.inPause = false;
    this.inTrack = false;
    this.inloop = false;
  }

  fast_rewind() {
    if (/[0-9]/.test(this.rfvalue)) {
      this.playback2.player.nativeElement.currentTime = this.playback2.player.nativeElement.currentTime - parseFloat(this.rfvalue);
      this.playback1.player.nativeElement.currentTime = this.playback2.player.nativeElement.currentTime - parseFloat(this.rfvalue);
    }
  }

  checkValue() {
    /[0-9]/.test(this.rfvalue) !== true ? this.digitsError = 'Please enter Digits' : this.digitsError = '';
  }

  fast_forward() {
    if (/[0-9]/.test(this.rfvalue)) {
      this.playback2.player.nativeElement.currentTime = this.playback2.player.nativeElement.currentTime + parseFloat(this.rfvalue);
      this.playback1.player.nativeElement.currentTime = this.playback2.player.nativeElement.currentTime + parseFloat(this.rfvalue);
    }
  }
}
