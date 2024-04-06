import {Peripheral} from "@stoprocent/noble";

declare class MiFloraDevice {
  type: string;
  address: string;

  constructor(peripheral: Peripheral, type: string);

  static normaliseAddress(address: string): string;
  static from(peripheral: Peripheral): MiFloraDevice | null;

}

export = MiFloraDevice;
