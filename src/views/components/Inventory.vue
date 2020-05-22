<template>
  <section>
    <h1>Inventory</h1>
    <ul>
      <li v-for="item in player.inventory" :key="item.uuid">
        id:{{ item.userData.id }} - {{ item.userData.displayName }}
      </li>
    </ul>
  </section>
</template>
<script>
import { useStore } from '@/utils/effector';
import { $player } from '@/services/player';

export default {
  name: 'Inventory',
  setup() {
    const player = useStore($player);
    return { player };
  },
};
</script>
