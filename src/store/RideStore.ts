import { makeAutoObservable } from 'mobx';

class RideStore {
  isRiding = false;
  startTime = 0;
  
  constructor() {
    makeAutoObservable(this);
  }

  startRide() {
    this.isRiding = true;
    this.startTime = Date.now();
  }

  stopRide() {
    this.isRiding = false;
  }
}

export default new RideStore(); 