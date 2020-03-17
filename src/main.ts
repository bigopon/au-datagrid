import Aurelia from 'aurelia';
import { register } from '@aurelia/plugin-svg';
import { MyApp } from './my-app';
import {
  ColonPrefixedBindAttributePattern,
  AtPrefixedTriggerAttributePattern
} from '@aurelia/jit';

Aurelia
  .register(
    ColonPrefixedBindAttributePattern,
    AtPrefixedTriggerAttributePattern,
    {register}
  )
  .app(MyApp)
  .start();
