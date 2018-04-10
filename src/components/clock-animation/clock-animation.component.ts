import { Component, OnInit } from "@angular/core";

@Component({
  selector: "clock-animation",
  templateUrl: "./clock-animation.component.html",
  styleUrls: ["./clock-animation.component.scss"]
})
export class ClockAnimationComponent implements OnInit {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  constructor() {
    this.lottieConfig = {
      path: "assets/img/reloj/reloj.json",
      autoplay: true,
      loop: true
    };
  }

  ngOnInit() {}

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }
}
