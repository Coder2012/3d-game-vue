import { combine } from 'effector';
import { domain } from './domain';

export const collectItem = domain.event();

const $inventory = domain.store([]).on(collectItem, (state, item) => [...state, item]);

export const $player = combine($inventory, inventory => ({ inventory }));
