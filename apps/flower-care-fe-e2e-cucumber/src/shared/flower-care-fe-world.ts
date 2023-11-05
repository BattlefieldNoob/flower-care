import { IWorldOptions, World } from '@cucumber/cucumber';
import { TestRunOptions } from '@gnuechtel/nx-cucumber';

// TODO Remove this comment when custom world is useful for this project, otherwise delete the complete file

export class CustomWorld extends World<CustomOptions> {
  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Sets a custom item which is available in this world instance
   * @param key a custom key to retrieve the item
   * @param value a custom value
   */
  public setItem<T>(key: string, value: T): void {
    this._items[key] = value;
  }

  /**
   * Gets a custom item of this world instance which was set before
   * @param key the retrieval key
   * @param defaultValue the default value, if the item does not exist
   * @returns the custom value or the default value
   */
  public getItem<T>(key: string, defaultValue?: T): T {
    return (this._items[key] as T) ?? (defaultValue as T);
  }

  private _items: Record<string, unknown> = {};
}

// TODO Replace this interface by your own or delete it
interface CustomOptions extends TestRunOptions {
  customOption: string;
}
