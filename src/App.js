/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-undef */
/* eslint no-unused-expressions: 0 */
import React from "react";

import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";

import {
  stateClassroom,
  createScriptElement,
  bookingClassroomData,
} from "./data";

const startSlide = (presInfo, stateSlider, slideAsset, player) => {
  try {

    PresentationPlayer.start(
      presInfo,
      "content",
      "playerView",
      function onPlayerInit(player) {
        player;
        const preloader = document.getElementById('preloader');
        preloader.parentNode.removeChild(preloader);
      },
      stateSlider,
      slideAsset
    );
  } catch (e) {
    console.log("error startSlide : ", e);
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.isLoadedPlayer = false;
    this.isLoadedMeta = false;
    this.isLoadedBrowser = false;
    this.isLoadedBookingClassroom = false;
    this.slideAsset = null;
    this.meta = null;
  }

  componentDidMount() {
    this.go()
  }

  go = () => {
    if (true) {
      const { learner_next_level } = bookingClassroomData;
      this.slideAsset = `https://cdn.1on1english.vn/lessons/${learner_next_level}/`;
      this.meta = this.slideAsset + "meta.js";  
      this.browsersupport =
        "https://cdn.1on1english.vn/elearning/assets/js/slide/browsersupport.js";

      createScriptElement(this.meta, (this.isLoadedMeta = true));
      createScriptElement(this.browsersupport, (this.isLoadedBrowser = true));

      const srcPlayer =
        "https://cdn.1on1english.vn/elearning/assets/js/slide/player.min.js";
      createScriptElement(srcPlayer, (this.isLoadedPlayer = true));

      this.isLoadedBookingClassroom = true;
    }
    if (
      window.presInfo &&
      this.isLoadedMeta &&
      this.isLoadedBrowser &&
      this.isLoadedPlayer &&
      stateClassroom
    ) {
      // cross browser for firefox and safari: make sure content id alway empty before trigger new slide
      const sliderLayer = document.querySelector("#content");
      sliderLayer.innerHTML = "";

      // fix issue feather api
      const hasSlider =
        isString(stateClassroom.slide) && !isEmpty(stateClassroom.slide)
          ? JSON.parse(stateClassroom.slide)
          : stateClassroom.slide;

      const stateSlideClassroom = stateClassroom ? hasSlider : null;
      const slideToolkit = {
        presInfo,
        dataSlide: this.slideAsset,
        stateSlide: stateSlideClassroom,
      };
      const slideStateData = {
        slide: stateSlideClassroom,
        annotation: "", // set empty temporary
      };
      // save slideToolkit to localstorage and use on case socket : `synch slide`
      localStorage.setItem("slideToolkit", JSON.stringify(slideToolkit));
      localStorage.setItem("slideStateData", JSON.stringify(slideStateData));
      // init slide presentation here
      startSlide(presInfo, stateSlideClassroom, this.slideAsset);
      // purpose : use `startSlide` one times. avoid state changed trigger start slider
      this.isLoadedMeta = false;
      this.isLoadedBrowser = false;
      this.isLoadedPlayer = false;
    }
  };

  render() {
    return (
      <div>
        <button onClick={this.go}>Start</button>
        <div id="preloader" />
        <div id="content"></div>
      </div>
    );
  }
}

export default App;
