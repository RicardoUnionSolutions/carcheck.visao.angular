// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

beforeAll(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    }
  );
});

const originalConfigureTestingModule = TestBed.configureTestingModule;
TestBed.configureTestingModule = (moduleDef: any) => {
  moduleDef = moduleDef || {};
  moduleDef.schemas = moduleDef.schemas || [];
  moduleDef.schemas.push(NO_ERRORS_SCHEMA);
  moduleDef.teardown = moduleDef.teardown || { destroyAfterEach: false };
  return originalConfigureTestingModule.call(TestBed, moduleDef);
};
