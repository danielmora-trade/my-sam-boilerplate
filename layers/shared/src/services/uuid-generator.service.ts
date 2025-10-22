import { v4 as uuidv4 } from "uuid";
import { IIdGeneratorService } from "../domain/id-generator.service";

export class UuidGeneratorService implements IIdGeneratorService {
  generate(): string {
    return uuidv4();
  }
}