import { ref } from '@vue/composition-api';
export const useStore = store => {
  const state = ref(null);
  store.watch(str => (state.value = str));
  return state;
};
