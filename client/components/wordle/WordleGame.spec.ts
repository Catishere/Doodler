import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import WordsModule from '../../store/words';
import { getWordsModule } from '../../store';
import WordleGame from './WordleGame.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('WordleGame.vue', () => {
  let store: Store<WordsModule>;

  beforeEach(() => {
    store = new Store({
      modules: {
        words: WordsModule
      }
    });
  });

  test('dispatches "KeyboardPress" on keyboard click', async () => {
    const wrapper = mount(WordleGame, {
      store,
      localVue,
      attachTo: document.body,
      mocks: {
        showToaster: (_somethigng: any) => {},
        $axios: {
          $post: (uri: any) => {
            switch (uri) {
              case '/api/user/join':
                return {
                  guesses: 0,
                  username: 'test',
                  _id: 'testasdasdasd'
                };
              case '/api/word/guess':
                return {
                  data: ['correct', 'correct', 'correct', 'correct', 'correct']
                };
            }
            return {
              data: {
                word: 'test'
              }
            };
          },
          $get: (_uri: any) => {
            return {
              data: {
                word: 'test'
              }
            };
          }
        }
      }
    });
    const input = wrapper.findAll('.keyboard-key');
    const keyboard = wrapper.findComponent({ name: 'WordleKeyboard' });
    await input.at(12).trigger('click'); // 'С'
    expect(getWordsModule(wrapper.vm.$store).col).toBe(0);
    await input.at(18).trigger('click'); // 'К'
    expect(getWordsModule(wrapper.vm.$store).col).toBe(1);
    await input.at(3).trigger('click'); // 'Р'
    expect(getWordsModule(wrapper.vm.$store).col).toBe(2);
    await input.at(7).trigger('click'); // 'И'
    expect(getWordsModule(wrapper.vm.$store).col).toBe(3);
    await input.at(4).trigger('click'); // 'Т'
    expect(getWordsModule(wrapper.vm.$store).col).toBe(4);
    await input.at(4).trigger('click'); // 'Т'
    await input.at(4).trigger('click'); // 'Т'
    await input.at(4).trigger('click'); // 'Т'
    await input.at(4).trigger('click'); // 'Т'
    await input.at(4).trigger('click'); // 'Т'
    expect(getWordsModule(wrapper.vm.$store).col).toBe(5);
    await input.at(22).trigger('click'); // 'Enter'
    await input.at(22).trigger('click'); // 'Enter'
    await input.at(22).trigger('click'); // 'Enter'
    await input.at(22).trigger('click'); // 'Enter'
    expect(keyboard.emitted('keyboard-press')).toHaveLength(14);
    jest.setTimeout(1000);
    expect(getWordsModule(wrapper.vm.$store).words[0].join('')).toBe('скрит');
    expect(getWordsModule(wrapper.vm.$store).row).toBe(1);
  });

  //   it('does not dispatch "actionInput" when event value is not "input"', () => {
  //     const wrapper = mount(WordleGame, { store, localVue });
  //     const input = wrapper.find('input');
  //     input.element.value = 'not input';
  //     input.trigger('input');
  //     expect(actions.actionInput).not.toHaveBeenCalled();
  //   });

  //   it('calls store action "actionClick" when button is clicked', () => {
  //     const wrapper = mount(WordleGame, { store, localVue });
  //     wrapper.find('button').trigger('click');
  //     expect(actions.actionClick).toHaveBeenCalled();
  //   });
});
