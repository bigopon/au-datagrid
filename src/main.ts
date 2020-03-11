import Aurelia from 'aurelia';
import { MyApp } from './my-app';
import {
  ColonPrefixedBindAttributePattern,
  AtPrefixedTriggerAttributePattern
} from '@aurelia/jit';

Aurelia
  .register(ColonPrefixedBindAttributePattern, AtPrefixedTriggerAttributePattern)
  .app(MyApp)
  .start();
