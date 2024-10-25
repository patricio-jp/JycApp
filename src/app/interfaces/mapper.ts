export abstract class Mapper<S, T> {
  protected abstract map(entity: S): T;

  transform(entity: S): T;
  transform(array: S[]): T[];
  transform(entityOrArray: S | S[]): T | T[] {
    return Array.isArray(entityOrArray)
      ? entityOrArray.map((item: S) => this.map(item))
      : this.map(entityOrArray);
  }
}
