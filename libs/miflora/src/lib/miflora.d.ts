declare class MiFlora {
  private _devices: { [key: string]: MiFloraDevice };
  discover(options: { duration?: number, addresses?: string[], ignoreUnknown?: boolean }): Promise<MiFloraDevice[]>;
}

declare const miFloraInstance: MiFlora;

export = miFloraInstance;
