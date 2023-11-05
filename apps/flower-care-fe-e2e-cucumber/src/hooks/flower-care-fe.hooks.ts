import {
  Before,
  setDefaultTimeout,
  setWorldConstructor,
} from '@cucumber/cucumber';
import { CustomWorld } from '../shared/flower-care-fe-world';

setDefaultTimeout(global.nxCucumber.timeout || 5_000);

// TODO Implement your own hooks here and delete the example code

Before(function (this: CustomWorld) {
  this.parameters.customOption = '42';
});

// TODO Remove this comment when custom world is useful for this project, otherwise remove the following line too
setWorldConstructor(CustomWorld);
