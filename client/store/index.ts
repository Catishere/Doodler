import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import UsersModule from './users';
import WordsModule from './words';

export function getWordsModule(store: Store<any>): WordsModule {
  return getModule(WordsModule, store);
}

export function getUsersModule(store: Store<any>): UsersModule {
  return getModule(UsersModule, store);
}
