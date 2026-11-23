import * as migration_20261123_062347_initial from './20261123_062347_initial';
import * as migration_20261123_083348_login_with_username from './20261123_083348_login_with_username';

export const migrations = [
  {
    up: migration_20261123_062347_initial.up,
    down: migration_20261123_062347_initial.down,
    name: '20261123_062347_initial',
  },
  {
    up: migration_20261123_083348_login_with_username.up,
    down: migration_20261123_083348_login_with_username.down,
    name: '20261123_083348_login_with_username'
  },
];
