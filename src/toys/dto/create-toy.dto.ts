import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Material } from 'generated/prisma/client';

export class CreateToyDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(Material)
    material: Material;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    weight: number;
}
