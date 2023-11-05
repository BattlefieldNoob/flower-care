import { Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { CustomWorld } from '../shared/flower-care-fe-world';

// TODO Replace this step implementations by your own

When(
  /the greeter says (.*)$/,
  function (this: CustomWorld, greeterText: string) {
    this.setItem('current-text', greeterText);
  }
);

Then(
  'I should have heard {string}',
  function (this: CustomWorld, expectedResponse: string) {
    const currentText = this.getItem<string>('current-text');
    assert.equal(currentText, expectedResponse);
    assert.equal(this.parameters.customOption, '42');
    assert.equal(
      this.parameters.outputDirectory,
      'dist/cucumber-js/apps/flower-care-fe-e2e-cucumber'
    );
  }
);
