import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

export class ParseIntCustomPipe implements PipeTransform {
  public transform(value: string, metadata: ArgumentMetadata): number {
    let num = parseInt(value, 10); //decimal
    if (isNaN(num)) {
      throw new NotFoundException();
    }
    num = Math.floor(num);
    if (num <= 0) {
      throw new NotFoundException();
    }
    console.log(num);
    return num;
  }
}
