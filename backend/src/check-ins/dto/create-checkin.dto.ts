import { IsString, IsNumber, Min, Max, IsOptional, IsArray } from 'class-validator';

export class CreateCheckInDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsNumber()
  @Min(0)
  @Max(24)
  studyHours: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learnings?: string[];
}
