import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import WordsModule from './words';

export function getWordsModule(store: Store<any>): WordsModule {
  return getModule(WordsModule, store);
}
